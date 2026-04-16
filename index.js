require('dotenv').config();
const express = require('express');
const say = require('say');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

/**
 * Health check
 */
app.get('/', (req, res) => {
    res.send('MP Voice Alert server running ✅ (MOCK MODE)');
});

/**
 * Webhook endpoint
 */
app.post('/webhook', async (req, res) => {
    try {
        const { type, data } = req.body;

        console.log('📩 Webhook recibido:', req.body);

        if (type === 'payment') {

            // 🔥 MOCK MODE: no consultamos Mercado Pago API
            const mockAmount = 100; // podés cambiarlo manualmente
            const mockPayer = "cliente de prueba";

            const message = `Has recibido una transferencia de ${mockAmount} pesos de ${mockPayer}`;

            console.log('🔊', message);

            // ⚠️ Solo funciona si hay audio disponible en el entorno
            await fetch("http://https://181f-181-168-118-185.ngrok-free.app/speak", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: message })
            });
        }

        res.status(200).send({ status: 'ok' });

    } catch (error) {
        console.error('❌ Error en webhook:', error.message);
        res.status(500).send({ status: 'error' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});