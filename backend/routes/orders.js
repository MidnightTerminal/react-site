// =============================================
// Order Routes — Checkout + Order Management
// =============================================
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Helper: Generate order number
function generateOrderNumber() {
  const prefix = 'SV';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// =============================================
// POST /api/orders — Create order (checkout)
// =============================================
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      userId,
      items, // Array of { productId, quantity }
      shipping, // { firstName, lastName, address, city, state, zip, phone }
      email,
      paymentMethod = 'card',
      cardLastFour,
      couponCode,
      notes,
    } = req.body;

    if (!userId || !items || items.length === 0 || !shipping || !email) {
      return res.status(400).json({ error: 'Missing required checkout fields' });
    }

    // 1. Fetch all product details and compute prices
    const productIds = items.map(i => i.productId);
    const [products] = await connection.query(
      'SELECT id, name, price, original_price, emoji, stock FROM products WHERE id IN (?) AND is_active = TRUE',
      [productIds]
    );

    if (products.length !== items.length) {
      await connection.rollback();
      return res.status(400).json({ error: 'One or more products are unavailable' });
    }

    // 2. Validate stock and compute subtotal
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        await connection.rollback();
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        await connection.rollback();
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }

      const itemSubtotal = parseFloat(product.price) * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productEmoji: product.emoji,
        price: parseFloat(product.price),
        originalPrice: product.original_price ? parseFloat(product.original_price) : null,
        quantity: item.quantity,
        subtotal: Math.round(itemSubtotal * 100) / 100,
      });
    }

    // 3. Compute shipping, tax, discount, total
    const shippingCost = subtotal >= 50 ? 0 : 5.99;
    const taxRate = 0.08; // 8%
    const tax = Math.round(subtotal * taxRate * 100) / 100;
    let discount = 0;

    // Apply coupon if provided
    if (couponCode) {
      const [coupons] = await connection.query(
        `SELECT * FROM coupons WHERE code = ? AND is_active = TRUE 
         AND (expires_at IS NULL OR expires_at > NOW())
         AND (max_uses IS NULL OR used_count < max_uses)`,
        [couponCode]
      );

      if (coupons.length > 0) {
        const coupon = coupons[0];
        if (subtotal >= parseFloat(coupon.min_order_amount)) {
          if (coupon.type === 'percentage') {
            discount = Math.round(subtotal * (parseFloat(coupon.value) / 100) * 100) / 100;
          } else {
            discount = parseFloat(coupon.value);
          }
          // Update coupon used count
          await connection.query('UPDATE coupons SET used_count = used_count + 1 WHERE id = ?', [coupon.id]);
        }
      }
    }

    const total = Math.round((subtotal + shippingCost + tax - discount) * 100) / 100;
    const orderNumber = generateOrderNumber();

    // 4. Insert order
    const [orderResult] = await connection.query(
      `INSERT INTO orders (
        user_id, order_number, status, subtotal, shipping_cost, tax, discount, total,
        coupon_code, shipping_first_name, shipping_last_name, shipping_address,
        shipping_city, shipping_state, shipping_zip, shipping_phone,
        payment_method, card_last_four, email, notes
      ) VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, orderNumber, subtotal, shippingCost, tax, discount, total,
        couponCode || null,
        shipping.firstName, shipping.lastName, shipping.address,
        shipping.city, shipping.state, shipping.zip, shipping.phone || null,
        paymentMethod, cardLastFour || null, email, notes || null,
      ]
    );

    const orderId = orderResult.insertId;

    // 5. Insert order items
    for (const item of orderItems) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_emoji, price, original_price, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.productId, item.productName, item.productEmoji, item.price, item.originalPrice, item.quantity, item.subtotal]
      );
    }

    // 6. Reduce stock for each product
    for (const item of items) {
      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }

    // 7. Clear the user's cart
    await connection.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    await connection.commit();

    res.status(201).json({
      success: true,
      order: {
        id: orderId,
        orderNumber,
        status: 'pending',
        subtotal,
        shippingCost,
        tax,
        discount,
        total,
        items: orderItems,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    connection.release();
  }
});

// =============================================
// GET /api/orders/:userId — Get user's orders
// =============================================
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [orders] = await pool.query(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// =============================================
// GET /api/orders/detail/:orderId — Get order details with items
// =============================================
router.get('/detail/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const [items] = await pool.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );

    res.json({
      success: true,
      order: {
        ...orders[0],
        items,
      },
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

// =============================================
// PUT /api/orders/:id/status — Update order status (admin)
// =============================================
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const [result] = await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // If order is cancelled, restore stock
    if (status === 'cancelled') {
      const [items] = await pool.query('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [id]);
      for (const item of items) {
        await pool.query('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.product_id]);
      }
    }

    res.json({ success: true, message: `Order status updated to ${status}` });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
