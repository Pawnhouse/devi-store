const express = require('express');
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
    const { name, email, address, items, total } = req.body;

    try {
        const pool = require('../db');
        const result = await pool.query(
            'INSERT INTO orders (name, email, address, items, total) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, address, JSON.stringify(items), total]
        );

        const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
        const telegramChatId = process.env.TELEGRAM_CHAT_ID;
        const messageText = `New Order Received\nFrom: ${name}\nEmail: ${email}\nAddress: ${address}\nItems: ${JSON.stringify(items, null, 2)}\nTotal: ${total} RUB`;

        const telegramResponse = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: telegramChatId,
                text: messageText,
                parse_mode: 'Markdown',
            }),
        });

        if (!telegramResponse.ok) {
            console.error('Failed to send Telegram notification');
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;