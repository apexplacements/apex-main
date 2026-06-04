const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = null;
let emailConfigured = false;

// Initialize email transporter if credentials are provided
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Verify connection
  transporter.verify((err, success) => {
    if (err) {
      console.error("⚠️  Email service error:", err.message);
      console.error("📧 Email credentials validation failed. Admin credentials will NOT be sent to registered email.");
    } else if (success) {
      emailConfigured = true;
      console.log("✓ Email service connected successfully");
    }
  });
}

const sendAdminCredentials = async (adminEmail, generatedEmail, defaultPassword, adminName) => {
  if (!emailConfigured || !transporter) {
    console.log(`ℹ️  Email service not configured. Credentials not sent to ${adminEmail}`);
    return { success: false, message: "Email service not configured" };
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: "Your VLISOFT Portal Admin Credentials",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">Welcome to VLISOFT Portal</h2>
        <p>Dear ${adminName},</p>
        <p>Your admin account has been created successfully. Please use the following credentials to log in:</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Email:</strong> ${generatedEmail}</p>
          <p><strong>Default Password:</strong> ${defaultPassword}</p>
        </div>
        
        <p style="color: #d9534f;"><strong>Important:</strong> You will be required to change your password on your first login.</p>
        
        <p>Login at: <a href="https://www.apexplacements.in">VLISOFT Portal</a></p>
        
        <p>Best regards,<br/>VLISOFT Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✓ Admin credentials sent to ${adminEmail}`);
    return { success: true, message: "Credentials sent to admin email" };
  } catch (err) {
    console.error("Failed to send admin credentials email:", err.message);
    return { success: false, message: "Failed to send email" };
  }
};

module.exports = {
  transporter,
  sendAdminCredentials,
  isEmailConfigured: () => emailConfigured,
};
