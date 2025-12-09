// nodemailer
const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send Email Function
const sendEmail = async (to, subject, html) => {
  try {
    await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Failed to send email');
  }
};

// Email Templates
const emailTemplates = {
  userApproval: (name) => `
    <h2>Welcome to Our Platform!</h2>
    <p>Hi ${name},</p>
    <p>Your account has been approved by our admin team. You can now log in and start using all features.</p>
    <p>Thank you for joining us!</p>
  `,
  
  blogApproval: (title) => `
    <h2>Blog Post Approved!</h2>
    <p>Your blog post "<strong>${title}</strong>" has been approved and is now published.</p>
    <p>Thank you for your contribution!</p>
  `,
  
  blogRejection: (title, reason) => `
    <h2>Blog Post Update</h2>
    <p>Your blog post "<strong>${title}</strong>" was not approved.</p>
    <p><strong>Reason:</strong> ${reason}</p>
    <p>Please make the necessary changes and resubmit.</p>
  `,
};