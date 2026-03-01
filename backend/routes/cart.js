// =============================================
// Cart Routes
// =============================================
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET /api/cart/:userId — Get user's cart with product details
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await pool.query(
      `SELECT ci.id as cart_item_id, ci.quantity, ci.added_at,
              p.id, p.name, p.price, p.original_price, p.category,
              p.badge, p.badge_color, p.rating, p.reviews,
              p.emoji, p.gradient, p.is_new, p.image_url, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ? AND p.is_active = TRUE
       ORDER BY ci.added_at DESC`,
      [userId]
    );

    const items = rows.map(row => ({
      cartItemId: row.cart_item_id,
      quantity: row.quantity,
      addedAt: row.added_at,
      product: {
        id: row.id,
        name: row.name,
        price: parseFloat(row.price),
        originalPrice: row.original_price ? parseFloat(row.original_price) : undefined,
        category: row.category,
        badge: row.badge,
        badgeColor: row.badge_color,
        rating: parseFloat(row.rating),
        reviews: row.reviews,
        emoji: row.emoji,
        gradient: row.gradient,
        isNew: !!row.is_new,
        image: row.image_url,
        stock: row.stock,
      },
    }));

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    res.json({ success: true, items, totalItems, totalPrice: Math.round(totalPrice * 100) / 100 });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/cart — Add item to cart
router.post('/', async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: 'userId and productId are required' });
    }

    // Check if product exists and has stock
    const [product] = await pool.query('SELECT stock FROM products WHERE id = ? AND is_active = TRUE', [productId]);
    if (product.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Use INSERT ... ON DUPLICATE KEY UPDATE to handle upsert
    await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
      [userId, productId, quantity, quantity]
    );

    res.json({ success: true, message: 'Item added to cart' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// PUT /api/cart/:id — Update cart item quantity
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      await pool.query('DELETE FROM cart_items WHERE id = ?', [id]);
      return res.json({ success: true, message: 'Item removed from cart' });
    }

    await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, id]);
    res.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// DELETE /api/cart/:id — Remove single item from cart
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM cart_items WHERE id = ?', [id]);
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
});

// DELETE /api/cart/clear/:userId — Clear entire cart
router.delete('/clear/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await pool.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;
