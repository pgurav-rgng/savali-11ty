const axios = require("axios");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
exports.handler = async (event) => {
  try {
    // 1. Validate environment variables
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      throw new Error("Twilio credentials not configured");
    }

    const orderData = JSON.parse(event.body);

    // 2. Validate required fields
    if (!orderData.customer?.phone) {
      throw new Error("Customer phone number is required");
    }

    // 3. Format WhatsApp message
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

    // 4. Send WhatsApp
    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      new URLSearchParams({
        Body: whatsappMsg,
        From: "whatsapp:+14155238886", // Twilio sandbox number
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
      body: JSON.stringify({
        message: "Order processed",
        twilio_sid: response.data.sid,
      }),
    };
  } catch (error) {
    console.error("Full error:", error);
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: error.message,
        twilio_error: error.response?.data,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      }),
    };
  }
};
