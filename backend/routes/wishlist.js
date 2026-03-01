// =============================================
// Wishlist Routes
// =============================================
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET /api/wishlist/:userId — Get user's wishlist
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await pool.query(
      `SELECT wi.id as wishlist_item_id, wi.added_at,
              p.id, p.name, p.price, p.original_price, p.category,
              p.badge, p.badge_color, p.rating, p.reviews,
              p.emoji, p.gradient, p.is_new, p.image_url
       FROM wishlist_items wi
       JOIN products p ON wi.product_id = p.id
       WHERE wi.user_id = ? AND p.is_active = TRUE
       ORDER BY wi.added_at DESC`,
      [userId]
    );

    const items = rows.map(row => ({
      wishlistItemId: row.wishlist_item_id,
      addedAt: row.added_at,
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
    }));

    res.json({ success: true, count: items.length, items });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// POST /api/wishlist — Add to wishlist (toggle)
router.post('/', async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: 'userId and productId are required' });
    }

    // Check if already in wishlist
    const [existing] = await pool.query(
      'SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existing.length > 0) {
      // Remove from wishlist (toggle off)
      await pool.query('DELETE FROM wishlist_items WHERE id = ?', [existing[0].id]);
      return res.json({ success: true, action: 'removed', message: 'Removed from wishlist' });
    }

    // Add to wishlist
    await pool.query(
      'INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?)',
      [userId, productId]
    );

    res.json({ success: true, action: 'added', message: 'Added to wishlist' });
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    res.status(500).json({ error: 'Failed to update wishlist' });
  }
});

// DELETE /api/wishlist/:id — Remove from wishlist
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM wishlist_items WHERE id = ?', [id]);
    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

module.exports = router;
