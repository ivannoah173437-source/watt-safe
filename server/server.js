const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques (sans index.html par défaut)
app.use(express.static(path.join(__dirname, '../public'), {
    index: false
}));

// Route principale → splash.html (point d'entrée)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/splash.html'));
});

// Route de test
app.get('/api/health', (req, res) => {
    res.json({ status: '✅ OK', message: 'Serveur WattSafe en ligne' });
});

// Pour toutes les autres routes, renvoyer le fichier demandé
app.get('*', (req, res) => {
    const filePath = path.join(__dirname, '../public', req.path);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('Fichier non trouvé');
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur WattSafe lancé sur http://localhost:${PORT}`);
    console.log(`📁 Frontend : http://localhost:${PORT}`);
    console.log(`🎬 Splashscreen : http://localhost:${PORT}`);
});