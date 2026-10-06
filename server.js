require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();


// ==================================================
// CONFIGURATION
// ==================================================

const PORT = process.env.PORT || 3000;

const FROM_EMAIL =
  process.env.FROM_EMAIL || "info@tktechdigital.co.uk";

const CONTACT_EMAIL =
  process.env.CONTACT_EMAIL || "tktech.business@outlook.com";


// ==================================================
// CHECK REQUIRED ENVIRONMENT VARIABLES
// ==================================================

if (
  !process.env.BREVO_SMTP_USER ||
  !process.env.BREVO_SMTP_KEY
) {
  console.error(
    "❌ Missing BREVO_SMTP_USER or BREVO_SMTP_KEY."
  );

  process.exit(1);
}


// ==================================================
// MIDDLEWARE
// ==================================================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// ==================================================
// SERVE WEBSITE FILES
// ==================================================

app.use(express.static(path.join(__dirname)));


// ==================================================
// BREVO SMTP
// ==================================================

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY
  }
});


// ==================================================
// VERIFY BREVO CONNECTION
// ==================================================

transporter.verify()
  .then(() => {
    console.log("✅ Connected successfully to Brevo SMTP.");
  })
  .catch((error) => {
    console.error(
      "❌ Brevo SMTP connection failed:",
      error.message
    );
  });


// ==================================================
// ESCAPE HTML
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
// FORMAT SERVICE NAME
// ==================================================

function formatService(service) {
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
// CONTACT FORM
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
    console.log("❌ Missing required fields.");

    return res.status(400).send(
      "Please complete all required fields."
    );
  }


  // ==================================================
  // EMAIL VALIDATION
  // ==================================================

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email.trim())) {
    console.log("❌ Invalid email address.");

    return res.status(400).send(
      "Please enter a valid email address."
    );
  }


  // ==================================================
  // CLEAN FORM VALUES
  // ==================================================

  const customerEmail = email.trim();

  const safeName =
    escapeHtml(name.trim());

  const safeEmail =
    escapeHtml(customerEmail);

  const safeCompany =
    company && company.trim()
      ? escapeHtml(company.trim())
      : "Not provided";

  const safeService =
    escapeHtml(formatService(service));

  const safeMessage =
    escapeHtml(message.trim());


  try {

    // ==================================================
    // EMAIL 1
    // SEND ENQUIRY TO TK TECH
    // ==================================================

    const adminMail =
      await transporter.sendMail({

        from:
          `"TK Tech Digital" <${FROM_EMAIL}>`,

        replyTo:
          customerEmail,

        to:
          CONTACT_EMAIL,

        subject:
          `New TK Tech enquiry: ${safeService} - ${safeName}`,

        html: `
          <div
            style="
              font-family: Arial, sans-serif;
              max-width: 650px;
              margin: 0 auto;
              color: #222;
              line-height: 1.6;
            "
          >

            <h2
              style="
                color: #2563EB;
                margin-bottom: 25px;
              "
            >
              New TK Tech Enquiry
            </h2>

            <p>
              A new enquiry has been submitted
              through the TK Tech website.
            </p>

            <table
              style="
                width: 100%;
                border-collapse: collapse;
                margin-top: 25px;
              "
            >

              <tr>
                <td
                  style="
                    padding: 12px;
                    border-bottom: 1px solid #ddd;
                    font-weight: bold;
                    width: 35%;
                  "
                >
                  Name
                </td>

                <td
                  style="
                    padding: 12px;
                    border-bottom: 1px solid #ddd;
                  "
                >
                  ${safeName}
                </td>
              </tr>

              <tr>
                <td
                  style="
                    padding: 12px;
                    border-bottom: 1px solid #ddd;
                    font-weight: bold;
                  "
                >
                  Email
                </td>

                <td
                  style="
                    padding: 12px;
                    border-bottom: 1px solid #ddd;
                  "
                >
                  ${safeEmail}
                </td>
              </tr>

              <tr>
                <td
                  style="
                    padding: 12px;
                    border-bottom: 1px solid #ddd;
                    font-weight: bold;
                  "
                >
                  Business / Company
                </td>

                <td
                  style="
                    padding: 12px;
                    border-bottom: 1px solid #ddd;
                  "
                >
                  ${safeCompany}
                </td>
              </tr>

              <tr>
                <td
                  style="
                    padding: 12px;
                    border-bottom: 1px solid #ddd;
                    font-weight: bold;
                  "
                >
                  Service
                </td>

                <td
                  style="
                    padding: 12px;
                    border-bottom: 1px solid #ddd;
                  "
                >
                  ${safeService}
                </td>
              </tr>

            </table>

            <h3
              style="
                margin-top: 30px;
                color: #111;
              "
            >
              Message
            </h3>

            <div
              style="
                background: #f5f7fa;
                border-left: 4px solid #2563EB;
                padding: 18px;
                margin-top: 10px;
                white-space: pre-line;
              "
            >${safeMessage}</div>

            <p
              style="
                margin-top: 30px;
                font-size: 13px;
                color: #666;
              "
            >
              This enquiry was submitted through
              the TK Tech Digital website contact form.
            </p>

          </div>
        `
      });


    console.log(
      "✅ TK Tech enquiry accepted by Brevo:",
      adminMail.messageId
    );


    // ==================================================
    // EMAIL 2
    // CUSTOMER CONFIRMATION
    // ==================================================

    const customerMail =
      await transporter.sendMail({

        from:
          `"TK Tech Digital" <${FROM_EMAIL}>`,

        replyTo:
          CONTACT_EMAIL,

        to:
          customerEmail,

        subject:
          "We've received your enquiry | TK Tech Digital",

        html: `
          <div
            style="
              font-family: Arial, sans-serif;
              max-width: 650px;
              margin: 0 auto;
              color: #222;
              line-height: 1.6;
            "
          >

            <h2
              style="
                color: #2563EB;
              "
            >
              Thank you for contacting TK Tech
            </h2>

            <p>
              Hi ${safeName},
            </p>

            <p>
              Thank you for getting in touch
              with TK Tech Digital.
            </p>

            <p>
              We've received your enquiry about
              <strong>${safeService}</strong>
              and will get back to you shortly.
            </p>

            <p>
              <strong>
                Here's a copy of your message:
              </strong>
            </p>

            <div
              style="
                background: #f5f7fa;
                border-left: 4px solid #2563EB;
                padding: 18px;
                margin: 20px 0;
                white-space: pre-line;
              "
            >${safeMessage}</div>

            <p>
              Best regards,
              <br>
              <strong>TK Tech Digital</strong>
            </p>

            <hr
              style="
                border: 0;
                border-top: 1px solid #ddd;
                margin: 30px 0 20px;
              "
            >

            <p
              style="
                font-size: 13px;
                color: #666;
              "
            >
              TK Tech Digital
              <br>
              London, United Kingdom
              <br>
              Helping Businesses Grow Smarter
            </p>

          </div>
        `
      });


    console.log(
      "✅ Customer confirmation accepted by Brevo:",
      customerMail.messageId
    );


    // ==================================================
    // SUCCESS
    // ==================================================

    console.log(
      `✅ Enquiry completed successfully for ${customerEmail}`
    );

    return res.redirect("/message-sent/");
  }

  catch (error) {

    // ==================================================
    // ERROR
    // ==================================================

    console.error(
      "❌ Brevo / email error:",
      error
    );

    return res.status(500).send(`
      <!DOCTYPE html>

      <html lang="en">

      <head>
        <meta charset="UTF-8">

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        >

        <title>
          Message Not Sent | TK Tech
        </title>
      </head>

      <body>

        <h2>
          Something went wrong
        </h2>

        <p>
          We couldn't send your message at this time.
        </p>

        <p>
          Please email TK Tech directly at
          <a href="mailto:${CONTACT_EMAIL}">
            ${CONTACT_EMAIL}
          </a>
        </p>

        <p>
          <a href="/contact/">
            Return to the contact page
          </a>
        </p>

      </body>

      </html>
    `);
  }
});


// ==================================================
// HEALTH CHECK
// ==================================================

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "TK Tech Contact API"
  });
});


// ==================================================
// START SERVER
// ==================================================

app.listen(PORT, () => {
  console.log(
    `✅ TK Tech server running on port ${PORT}`
  );

  console.log(
    `📧 Sender: ${FROM_EMAIL}`
  );

  console.log(
    `📥 Enquiries: ${CONTACT_EMAIL}`
  );
});