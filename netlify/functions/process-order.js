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

    // In process-order.js, replace the message sending code with this:

    const whatsappMsg = `🪴 New Order 🪴
    Name: ${orderData.customer.name}
    Phone: ${orderData.customer.formattedPhone || orderData.customer.phone}
    Address: ${orderData.customer.address || "Not provided"}

    Items:
    ${orderData.items
      .map(
        (item) =>
          `- ${item.name} (ID: ${item.id}, Qty: ${item.quantity}, ₹${item.price})`
      )
      .join("\n")}

    Total: ₹${orderData.total}`;

    try {
      // Send to both numbers simultaneously
      const [customerResponse, businessResponse] = await Promise.all([
        // Customer message
        axios.post(
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
        ),
        // Business message
        axios.post(
          `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
          new URLSearchParams({
            Body: whatsappMsg,
            From: "whatsapp:+14155238886",
            To: "whatsapp:+919371205858",
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
        ),
      ]);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: "Order processed and both messages sent",
          customer_sid: customerResponse.data.sid,
          business_sid: businessResponse.data.sid,
        }),
      };
    } catch (error) {
      console.error("Error sending messages:", error);

      // Check if it's a partial success (one message sent)
      const isPartialSuccess =
        error?.response?.config?.url.includes("Messages.json");

      return {
        statusCode: isPartialSuccess ? 207 : 500, // 207 for partial success
        headers,
        body: JSON.stringify({
          error: isPartialSuccess
            ? "Order processed but some messages may not have been delivered"
            : "Order processing failed",
          details: error.message,
          partial_success: isPartialSuccess,
        }),
      };
    }
    // In process-order.js, replace the whatsapp message sending code (around line 30) with this:
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
