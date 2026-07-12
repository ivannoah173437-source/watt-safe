const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

// Récupérer les variables d'environnement
const GENIUSPAY_API_KEY = process.env.GENIUSPAY_API_KEY;
const GENIUSPAY_SECRET = process.env.GENIUSPAY_SECRET;
const GENIUSPAY_URL = process.env.GENIUSPAY_URL;

// Route : Initier un paiement
router.post('/initiate', async (req, res) => {
    try {
        const { amount, phone, description } = req.body;

        if (!amount || !phone) {
            return res.status(400).json({
                status: 'error',
                message: 'Champs manquants : amount, phone'
            });
        }

        // Construction de la payload GeniusPay (checkout mode)
        const payload = {
            amount: parseFloat(amount),
            currency: 'XOF',
            description: description || 'Recharge WattSafe',
            customer: {
                phone: phone
            },
            success_url: `${req.protocol}://${req.get('host')}/confirmation.html`,
            error_url: `${req.protocol}://${req.get('host')}/confirmation.html`,
            metadata: {
                user_phone: phone,
                type: 'watt_safe_recharge'
            }
        };

        console.log('📤 Envoi vers GeniusPay:', payload);

        // Appel à GeniusPay
        const response = await fetch(GENIUSPAY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': GENIUSPAY_API_KEY,
                'X-API-Secret': GENIUSPAY_SECRET
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Erreur GeniusPay:', data);
            return res.status(response.status).json({
                status: 'error',
                message: data.error?.message || 'Erreur GeniusPay'
            });
        }

        console.log('✅ Paiement initié avec succès');

        const redirectUrl = data.data?.checkout_url || data.data?.payment_url;

        res.json({
            status: 'success',
            payment_url: redirectUrl,
            transaction_id: data.data?.reference
        });

    } catch (error) {
        console.error('❌ Erreur serveur:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Erreur interne du serveur'
        });
    }
});

module.exports = router;