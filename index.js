require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
    res.send("MP Voice Alert RUNNING");
});

/* =========================
   WEBHOOK
========================= */
app.post("/webhook", async (req, res) => {
    try {
        console.log("📩 Webhook recibido:", req.body);

        const type = req.body?.type;
        const data = req.body?.data;

        const paymentId = data?.id;

        if (!paymentId) {
            return res.json({ status: "no payment id" });
        }

        const isPayment =
            type === "payment" ||
            req.body?.action?.includes?.("payment");

        if (!isPayment) {
            return res.json({ status: "ignored event" });
        }

        /* =========================
           CONSULTA A MERCADO PAGO
        ========================= */
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
        const payer =
            payment.payer?.first_name ||
            payment.payer?.email ||
            "alguien";

        const message = `Has recibido ${amount} pesos de ${payer}`;

        console.log("🔊", message);

        /* =========================
           ENVIAR A TU PC (TTS)
        ========================= */
        await axios.post(
            "https://181f-181-168-118-185.ngrok-free.app/speak",
            {
                text: message
            }
        ).catch(err => {
            console.error("❌ Error enviando a PC:", err.message);
        });

        res.json({ status: "ok" });

    } catch (error) {
        console.error("❌ ERROR WEBHOOK:", error.response?.data || error.message);
        res.status(500).json({ status: "error" });
    }
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});