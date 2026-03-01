// =============================================
// Product Routes — CRUD + Search + Filter
// =============================================
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Helper: compute badge from DB row
function computeBadge(product) {
  if (product.original_price && product.original_price > product.price) {
    const percent = Math.round(
      ((product.original_price - product.price) / product.original_price) * 100
    );
    return {
      ...product,
      badge: `${percent}% OFF`,
      badgeColor: 'bg-red-500',
    };
  }
  if (product.is_new) {
    return {
      ...product,
      badge: 'New',
      badgeColor: 'bg-brand-600',
    };
  }
  return {
    ...product,
    badgeColor: product.badge_color || product.badgeColor,
  };
}

// Helper: format DB row to frontend format
function formatProduct(row) {
  const product = {
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
    description: row.description,
    stock: row.stock,
    isFeatured: !!row.is_featured,
    createdAt: row.created_at,
  };
  return computeBadge(product);
}

// =============================================
// GET /api/products — Get all products
// Query params: ?category=Handbags&sort=price_asc&minPrice=10&maxPrice=100&rating=4&search=leather
// =============================================
router.get('/', async (req, res) => {
  try {
    const { category, sort, minPrice, maxPrice, rating, search, featured, isNew, limit, offset } = req.query;

    let query = 'SELECT * FROM products WHERE is_active = TRUE';
    const params = [];

    // Filter by category
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    // Filter by price range
    if (minPrice) {
      query += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }

    // Filter by minimum rating
    if (rating) {
      query += ' AND rating >= ?';
      params.push(parseFloat(rating));
    }

    // Filter by featured
    if (featured === 'true') {
      query += ' AND is_featured = TRUE';
    }

    // Filter by new
    if (isNew === 'true') {
      query += ' AND is_new = TRUE';
    }

    // Full-text search
    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ? OR category LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        query += ' ORDER BY price ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY price DESC';
        break;
      case 'rating':
        query += ' ORDER BY rating DESC';
        break;
      case 'newest':
        query += ' ORDER BY created_at DESC';
        break;
      case 'popular':
        query += ' ORDER BY reviews DESC';
        break;
      case 'name_asc':
        query += ' ORDER BY name ASC';
        break;
      case 'name_desc':
        query += ' ORDER BY name DESC';
        break;
      default:
        query += ' ORDER BY is_featured DESC, created_at DESC';
    }

    // Pagination
    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
      if (offset) {
        query += ' OFFSET ?';
        params.push(parseInt(offset));
      }
    }

    const [rows] = await pool.query(query, params);
    const products = rows.map(formatProduct);

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// =============================================
// GET /api/products/search?q=keyword
// =============================================
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json({ success: true, count: 0, products: [] });
    }

    const searchTerm = `%${q.trim()}%`;
    const [rows] = await pool.query(
      `SELECT * FROM products 
       WHERE is_active = TRUE 
       AND (name LIKE ? OR description LIKE ? OR category LIKE ?)
       ORDER BY 
         CASE WHEN name LIKE ? THEN 1 ELSE 2 END,
         rating DESC
       LIMIT 20`,
      [searchTerm, searchTerm, searchTerm, searchTerm]
    );

    const products = rows.map(formatProduct);
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// =============================================
// GET /api/products/category/:category
// =============================================
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { sort } = req.query;

    let orderClause = 'ORDER BY is_featured DESC, created_at DESC';
    switch (sort) {
      case 'price_asc': orderClause = 'ORDER BY price ASC'; break;
      case 'price_desc': orderClause = 'ORDER BY price DESC'; break;
      case 'rating': orderClause = 'ORDER BY rating DESC'; break;
      case 'newest': orderClause = 'ORDER BY created_at DESC'; break;
      case 'popular': orderClause = 'ORDER BY reviews DESC'; break;
    }

    const [rows] = await pool.query(
      `SELECT * FROM products WHERE is_active = TRUE AND category = ? ${orderClause}`,
      [category]
    );

    const products = rows.map(formatProduct);
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error('Error fetching category products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// =============================================
// GET /api/products/:id — Get single product
// =============================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = formatProduct(rows[0]);

    // Also get related products (same category, exclude current)
    const [relatedRows] = await pool.query(
      'SELECT * FROM products WHERE category = ? AND id != ? AND is_active = TRUE ORDER BY rating DESC LIMIT 4',
      [rows[0].category, id]
    );
    const relatedProducts = relatedRows.map(formatProduct);

    res.json({ success: true, product, relatedProducts });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// =============================================
// POST /api/products — Create product (admin)
// =============================================
router.post('/', async (req, res) => {
  try {
    const {
      name, price, original_price, category, badge, badge_color,
      rating, reviews, emoji, gradient, is_new, image_url,
      description, stock, is_featured,
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'name, price, and category are required' });
    }

    const [result] = await pool.query(
      `INSERT INTO products (name, price, original_price, category, badge, badge_color,
        rating, reviews, emoji, gradient, is_new, image_url, description, stock, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, price, original_price || null, category,
        badge || null, badge_color || null,
        rating || 0, reviews || 0,
        emoji || '📦', gradient || 'from-gray-100 to-slate-100',
        is_new || false, image_url || null,
        description || null, stock || 0, is_featured || false,
      ]
    );

    const [newProduct] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, product: formatProduct(newProduct[0]) });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// =============================================
// PUT /api/products/:id — Update product (admin)
// =============================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    // Build dynamic SET clause
    const setClauses = [];
    const values = [];

    const allowedFields = [
      'name', 'price', 'original_price', 'category', 'badge', 'badge_color',
      'rating', 'reviews', 'emoji', 'gradient', 'is_new', 'image_url',
      'description', 'stock', 'is_featured', 'is_active',
    ];

    for (const field of allowedFields) {
      if (fields[field] !== undefined) {
        setClauses.push(`${field} = ?`);
        values.push(fields[field]);
      }
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    await pool.query(
      `UPDATE products SET ${setClauses.join(', ')} WHERE id = ?`,
      values
    );

    const [updated] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (updated.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true, product: formatProduct(updated[0]) });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// =============================================
// DELETE /api/products/:id — Soft delete (admin)
// =============================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      'UPDATE products SET is_active = FALSE WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
