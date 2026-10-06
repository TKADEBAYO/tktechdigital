// ==================================================
// TK TECH CONTACT FORM SERVER
// ==================================================

// Load environment variables from .env
require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();


// ==================================================
// SERVER CONFIGURATION
// ==================================================

const PORT = process.env.PORT || 3000;


// Serve website files
app.use(express.static(__dirname));


// Parse standard HTML form submissions
app.use(express.urlencoded({ extended: true }));


// Parse JSON requests
app.use(express.json());


// ==================================================
// BREVO SMTP CONFIGURATION
// ==================================================

const transporter = nodemailer.createTransport({

  host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",

  port: Number(process.env.BREVO_SMTP_PORT) || 587,

  secure: false,

  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY
  }

});


// ==================================================
// HELPER: ESCAPE USER INPUT
// Prevents HTML entered into the form being inserted
// directly into the emails.
// ==================================================

function escapeHtml(value = "") {

  return String(value)

    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");

}


// ==================================================
// HELPER: SERVICE NAMES
// Converts form values into readable names
// ==================================================

function getServiceName(service) {

  const services = {

    "website-design": "Website Design",

    "ai-chatbots": "AI Chatbots",

    "business-automation": "Business Automation",

    "social-media": "Social Media Services",

    "ai-governance": "AI Governance",

    "other": "Something Else / Not Sure"

  };

  return services[service] || "Not specified";

}


// ==================================================
// HEALTH CHECK
// Useful when we deploy the backend later
// ==================================================

app.get("/health", (req, res) => {

  res.status(200).json({
    status: "ok",
    service: "TK Tech Contact API"
  });

});


// ==================================================
// CONTACT FORM ENDPOINT
// ==================================================

app.post("/send", async (req, res) => {

  console.log("📥 Contact form received");

  const {
    name,
    email,
    company,
    service,
    message
  } = req.body;


  // ==================================================
  // VALIDATION
  // ==================================================

  if (!name || !email || !service || !message) {

    console.log("❌ Missing required form fields.");

    return res
      .status(400)
      .send("Please complete all required fields.");

  }


  // Basic email validation

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {

    console.log("❌ Invalid email address.");

    return res
      .status(400)
      .send("Please enter a valid email address.");

  }


  // ==================================================
  // SANITISE VALUES FOR HTML EMAIL
  // ==================================================

  const safeName = escapeHtml(name);

  const safeEmail = escapeHtml(email);

  const safeCompany = escapeHtml(
    company || "Not provided"
  );

  const safeService = escapeHtml(
    getServiceName(service)
  );

  const safeMessage = escapeHtml(message);


  // ==================================================
  // CHECK SMTP CONFIGURATION
  // ==================================================

  if (
    !process.env.BREVO_SMTP_USER ||
    !process.env.BREVO_SMTP_KEY
  ) {

    console.error(
      "❌ Brevo SMTP environment variables are missing."
    );

    return res
      .status(500)
      .send(
        "The contact service is temporarily unavailable."
      );

  }


  try {

    // ==================================================
    // EMAIL 1
    // SEND ENQUIRY TO TK TECH
    // ==================================================

    await transporter.sendMail({

      from:
        `"TK Tech Website" <${process.env.FROM_EMAIL || "info@tktechdigital.co.uk"}>`,

      replyTo: email,

      to:
        process.env.CONTACT_EMAIL ||
        "tktech.business@outlook.com",

      subject:
        `New TK Tech enquiry: ${getServiceName(service)} - ${name}`,

      html: `

        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 650px;
            margin: 0 auto;
            color: #222;
          "
        >

          <h2>
            New TK Tech Website Enquiry
          </h2>

          <p>
            A new enquiry has been submitted
            through the TK Tech website.
          </p>

          <hr>

          <p>
            <strong>Name:</strong>
            ${safeName}
          </p>

          <p>
            <strong>Email:</strong>
            ${safeEmail}
          </p>

          <p>
            <strong>Business / Company:</strong>
            ${safeCompany}
          </p>

          <p>
            <strong>Service:</strong>
            ${safeService}
          </p>

          <p>
            <strong>Message:</strong>
          </p>

          <div
            style="
              background: #f5f7fa;
              padding: 16px;
              border-radius: 8px;
              white-space: pre-line;
            "
          >${safeMessage}</div>

          <hr>

          <p
            style="
              font-size: 13px;
              color: #666;
            "
          >
            This enquiry was submitted through
            the TK Tech website contact form.
          </p>

          <p>
            You can reply directly to this email
            to respond to ${safeName}.
          </p>

        </div>

      `

    });


    console.log(
      "✅ TK Tech enquiry email sent successfully."
    );


    // ==================================================
    // EMAIL 2
    // CUSTOMER AUTO-REPLY
    // ==================================================

    await transporter.sendMail({

      from:
        `"TK Tech" <${process.env.FROM_EMAIL || "info@tktechdigital.co.uk"}>`,

      to: email,

      replyTo:
        process.env.CONTACT_EMAIL ||
        "tktech.business@outlook.com",

      subject:
        "We've received your enquiry | TK Tech",

      html: `

        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 650px;
            margin: 0 auto;
            color: #222;
          "
        >

          <h2>
            Thank you for contacting TK Tech
          </h2>

          <p>
            Hi ${safeName},
          </p>

          <p>
            Thank you for getting in touch.
          </p>

          <p>
            We've received your enquiry regarding
            <strong>${safeService}</strong>
            and will review the information you've
            provided.
          </p>

          <p>
            We'll be in touch shortly to discuss
            how TK Tech may be able to help.
          </p>

          <h3>
            Your enquiry
          </h3>

          <div
            style="
              background: #f5f7fa;
              padding: 16px;
              border-radius: 8px;
              white-space: pre-line;
            "
          >${safeMessage}</div>

          <p style="margin-top: 25px;">
            Best regards,
            <br>
            <strong>TK Tech</strong>
          </p>

          <hr>

          <p
            style="
              font-size: 13px;
              color: #666;
            "
          >
            London, United Kingdom
            <br>
            tktech.business@outlook.com
            <br>
            07401 563425
          </p>

        </div>

      `

    });


    console.log(
      "✅ Customer confirmation email sent successfully."
    );


    // ==================================================
    // REDIRECT TO MESSAGE SENT PAGE
    // ==================================================

    res.redirect("/message-sent/");


  } catch (error) {

    console.error(
      "❌ Error sending contact form email:",
      error
    );

    res
      .status(500)
      .send(
        "There was an error sending your message. Please try again later."
      );

  }

});


// ==================================================
// START SERVER
// ==================================================

app.listen(PORT, () => {

  console.log(
    `✅ TK Tech server running on http://localhost:${PORT}`
  );

  console.log(
    "🔐 Brevo SMTP key loaded:",
    Boolean(process.env.BREVO_SMTP_KEY)
  );

});