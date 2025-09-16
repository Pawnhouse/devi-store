const express = require('express');
const axios = require('axios');

require('dotenv').config();

const router = express.Router();

async function getAuthToken() {
    try {
        const response = await axios.post(`${process.env.CDEK_API_URL}/oauth/token?grant_type=client_credentials`, null, {
            params: {
                client_id: process.env.CDEK_ACCOUNT,
                client_secret: process.env.CDEK_PASSWORD,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data.access_token;
    } catch (error) {
        throw new Error('Failed to get auth token: ' + error.message);
    }
}

router.all('/', async (req, res) => {
    const requestData = { ...req.query, ...req.body };

    if (!requestData.action) {
        return res.status(400).json({ error: 'Action is required' });
    }

    try {
        const authToken = await getAuthToken();

        switch (requestData.action) {
            case 'offices': {
                const officesResponse = await axios.get(`${process.env.CDEK_API_URL}/deliverypoints`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        Accept: 'application/json',
                        'X-App-Name': 'widget_pvz',
                        'X-App-Version': '3.11.1',
                    },
                    params: requestData,
                });
                res.set({
                    'Content-Type': 'application/json',
                    'X-Service-Version': '3.11.1',
                });
                res.json(officesResponse.data);
                break;
            }
            case 'calculate': {
                const calculateResponse = await axios.post(`${process.env.CDEK_API_URL}/calculator/tariff`, requestData, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-App-Name': 'widget_pvz',
                        'X-App-Version': '3.11.1',
                    },
                });
                res.set({
                    'Content-Type': 'application/json',
                    'X-Service-Version': '3.11.1',
                });
                res.json(calculateResponse.data);
                break;
            }
            default:
                res.status(400).json({ error: 'Unknown action' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

module.exports = router;