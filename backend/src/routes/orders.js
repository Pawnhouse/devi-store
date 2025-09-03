const express = require('express');
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
    const { name, email, address, phone, items, total, deliveryTypeId } = req.body;

    try {
        const pool = require('../db');
        const result = await pool.query(
            'INSERT INTO orders (name, email, address, phone, items, total, delivery_type_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, email, address, phone, JSON.stringify(items), total, deliveryTypeId]
        );
        const deliveryType = await pool.query('SELECT name FROM delivery_types WHERE id = $1', [deliveryTypeId]);
        const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
        const telegramChatId = process.env.TELEGRAM_CHAT_ID;
        const messageText = `New Order Received\nFrom: ${name}\nEmail: ${email}\nPhone: ${phone}\nAddress: ${address}\nDelivery type: ${deliveryType.rows[0]?.name || ''}\nItems: ${JSON.stringify(items, null, 2)}\nTotal: ${total} RUB`;

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