require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('MP Voice Alert REAL MODE');
});

app.post('/webhook', async (req, res) => {
    try {
        const { type, data } = req.body;

        console.log("📩 Webhook recibido:", req.body);

        if (type === 'payment') {

            const paymentId = data.id;

            // 🔥 LLAMADA REAL A MERCADO PAGO
            const response = await axios.get(
                `https://api.mercadopago.com/v1/payments/${paymentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
                    }
                }
            );

            const payment = response.data;

            const amount = payment.transaction_amount;
            const payer = payment.payer?.first_name || "alguien";

            const message = `Has recibido ${amount} pesos de ${payer}`;

            console.log("🔊", message);

            // enviar a tu PC
            await axios.post("https://181f-181-168-118-185.ngrok-free.app/speak", {
                text: message
            });
        }

        res.json({ status: "ok" });

    } catch (error) {
        console.error("❌ ERROR:", error.message);
        res.status(500).json({ status: "error" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});