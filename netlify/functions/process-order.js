console.log("main.js loaded!");
const axios = require("axios");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "Preflight OK",
    };
  }

  try {
    // Set CORS headers for POST response too
    const headers = {
      "Access-Control-Allow-Origin": "*",
    };

    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      throw new Error("Twilio credentials not configured");
    }

    const orderData = JSON.parse(event.body);

    if (!orderData.customer?.phone) {
      throw new Error("Customer phone number is required");
    }

    const whatsappMsg = `🪴 New Order 🪴
Name: ${orderData.customer.name}
Phone: ${orderData.customer.phone}
Address: ${orderData.customer.address || "Not provided"}

Items:
${orderData.items
  .map(
    (item) =>
      `- ${item.name} (ID: ${item.id}, Qty: ${item.quantity}, ₹${item.price})`
  )
  .join("\n")}

Total: ₹${orderData.total}`;

    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      new URLSearchParams({
        Body: whatsappMsg,
        From: "whatsapp:+14155238886",
        To: `whatsapp:${orderData.customer.phone}`,
      }),
      {
        auth: {
          username: process.env.TWILIO_ACCOUNT_SID,
          password: process.env.TWILIO_AUTH_TOKEN,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Order processed",
        twilio_sid: response.data.sid,
      }),
    };
  } catch (error) {
    console.error("Full error:", error);
    return {
      statusCode: error.response?.status || 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: error.message,
        twilio_error: error.response?.data,
      }),
    };
  }
};
