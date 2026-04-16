const axios = require("axios");
require("dotenv").config();

async function createPreference() {
    try {
        const preference = {
            items: [
                {
                    title: "Producto de prueba",
                    quantity: 1,
                    unit_price: 100
                }
            ],
            notification_url: "https://mp-voice-alert.onrender.com/webhook"
        };

        const response = await axios.post(
            "https://api.mercadopago.com/checkout/preferences",
            preference,
            {
                headers: {
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
                }
            }
        );

        console.log("🔗 Checkout URL:");
        console.log(response.data.init_point);

    } catch (err) {
        console.error("❌ Error:", err.response?.data || err.message);
    }
}

createPreference();