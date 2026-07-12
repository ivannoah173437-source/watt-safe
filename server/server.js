const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const paymentRoutes = require('./routes/payment');

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques (frontend)
app.use(express.static('../public'));

// Routes
app.use('/api/payment', paymentRoutes);

// Route de test
app.get('/api/health', (req, res) => {
    res.json({ status: '✅ OK', message: 'Serveur WattSafe en ligne' });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur WattSafe lancé sur http://localhost:${PORT}`);
    console.log(`📁 Frontend : http://localhost:${PORT}`);
    console.log(`🔑 Mode : ${process.env.GENIUSPAY_API_KEY ? 'Configuré' : '❌ Clés manquantes'}`);
});