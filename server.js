const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const app = express();
const upload = multer(); // handles multipart/form-data (no files)

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Debug middleware
app.use((req, res, next) => {
  if (req.method === "POST") {
    console.log("🧾 Content-Type:", req.headers["content-type"]);
  }
  next();
});

// ✅ Contact Form Endpoint
app.post("/send", upload.none(), async (req, res) => {
  console.log("📥 Incoming form data:", req.body);
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    console.log("❌ Missing form fields.");
    return res.status(400).send("All fields are required.");
  }

  // ✅ Brevo SMTP setup
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: "98be70002@smtp-brevo.com", // your Brevo SMTP login
      pass: "Mv1akj9zZ3mIUn04"          // your Brevo SMTP key
    }
  });

  try {
    // 📩 Send email to you (admin)
    await transporter.sendMail({
      from: `"${name}" <info@tktechdigital.co.uk>`,
      replyTo: email,
      to: "tktech.business@outlook.com",
      subject: `📬 New message from ${name}`,
      html: `
        <h2>New Contact Form Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-line;">${message}</p>
        <hr>
        <p style="font-size:0.9em;color:#666;">
          This message was sent from the <strong>TK Tech Digital</strong> website contact form.
        </p>
      `
    });

    // 🤝 Auto-reply
    if (email && email.includes("@")) {
      await transporter.sendMail({
        from: `"TK Tech Digital" <info@tktechdigital.co.uk>`,
        to: email,
        subject: "✅ We received your message - TK Tech Digital",
        html: `
          <h2>Thank you for contacting TK Tech Digital</h2>
          <p>Hi ${name},</p>
          <p>We’ve received your message and will get back to you shortly.</p>
          <p><strong>Your message:</strong></p>
          <blockquote style="color:#444;border-left:3px solid #2563EB;padding-left:10px;">
            ${message}
          </blockquote>
          <p>Best regards,<br><strong>TK Tech Digital Team</strong></p>
          <hr>
          <p style="font-size:0.85em;color:#666;">
            London, UK | <a href="mailto:info@tktechdigital.co.uk">info@tktechdigital.co.uk</a>
          </p>
        `
      });
    }

    // ✅ Redirect to confirmation page
    res.redirect("/message-sent.html");

  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).send("There was an error sending your message. Please try again later.");
  }
});

// Start server
app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
