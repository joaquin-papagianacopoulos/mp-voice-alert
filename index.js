require('dotenv').config();
const express = require('express');
const axios = require('axios');
const say = require('say');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Endpoint webhook
app.post('/webhook', async (req, res) => {
    try {
        const { type, data } = req.body;

        if (type === 'payment') {
            const paymentId = data.id;

            // Obtener info del pago
            const response = await axios.get(
                `https://api.mercadopago.com/v1/payments/${paymentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
                    }
                }
            );

            const payment = response.data;

            if (payment.status === 'approved') {
                const amount = payment.transaction_amount;
                const payer = payment.payer?.first_name || "alguien";

                const message = `Has recibido una transferencia de ${amount} pesos de ${payer}`;

                console.log(message);

                // Voz
                say.speak(message);
            }
        }

        res.sendStatus(200);
    } catch (error) {
        console.error(error.message);
        res.sendStatus(500);
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});