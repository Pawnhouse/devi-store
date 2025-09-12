const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*,
                   p.price::float,
                   COALESCE(p.images, '{}') AS images,
                   COALESCE(
                       ARRAY_AGG(
                           JSONB_BUILD_OBJECT(
                               'id', s.id,
                               'abbrev', s.abbrev,
                               'name', s.name
                           )
                       ) FILTER (WHERE s.id IS NOT NULL), '{}'
                   ) AS sizes
            FROM products p
            LEFT JOIN product_sizes ps ON p.id = ps.product_id
            LEFT JOIN sizes s ON ps.size_id = s.id
            GROUP BY p.id, p.display_order
            ORDER BY p.display_order, p.id
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;