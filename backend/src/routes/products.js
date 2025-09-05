const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*, 
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

router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*, 
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
            WHERE p.id = $1
            GROUP BY p.id
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;