const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
    const { name, email, address, items, total } = req.body;

    try {
        // Save order to database
        const pool = require('../db');
        const result = await pool.query(
            'INSERT INTO orders (name, email, address, items, total) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, address, JSON.stringify(items), total]
        );

        // Send email notification to manager
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.MANAGER_EMAIL,
            subject: 'New Order Received',
            text: `Order from ${name}\nEmail: ${email}\nAddress: ${address}\nItems: ${JSON.stringify(
                items,
                null,
                2
            )}\nTotal: $${total}`,
        };

        await transporter.sendMail(mailOptions);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;