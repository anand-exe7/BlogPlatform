/**
 * SMTP Email Test Script
 * Tests real email sending functionality
 * 
 * Prerequisites:
 * 1. Valid Gmail credentials in .env
 * 2. App Password generated for Gmail account
 * 3. EMAIL_DISABLE=false in .env (or remove it)
 * 
 * Usage: node test-email.js
 */

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEmailConfiguration() {
  log('\n🧪 SMTP Email Configuration Test', 'cyan');
  log('='.repeat(60), 'cyan');

  // Step 1: Check Environment Variables
  log('\n📋 Step 1: Checking Environment Variables', 'blue');
  log('-'.repeat(60));

  const requiredVars = {
    'EMAIL_HOST': process.env.EMAIL_HOST,
    'EMAIL_PORT': process.env.EMAIL_PORT,
    'EMAIL_USER': process.env.EMAIL_USER,
    'EMAIL_PASS': process.env.EMAIL_PASS,
    'EMAIL_DISABLE': process.env.EMAIL_DISABLE
  };

  let configValid = true;

  for (const [key, value] of Object.entries(requiredVars)) {
    if (!value || value === 'undefined') {
      log(`  ❌ ${key}: NOT SET`, 'red');
      configValid = false;
    } else {
      // Mask sensitive data
      const displayValue = key === 'EMAIL_PASS' 
        ? '*'.repeat(value.length) 
        : value;
      log(`  ✅ ${key}: ${displayValue}`, 'green');
    }
  }

  // Check EMAIL_DISABLE
  if (process.env.EMAIL_DISABLE === 'true') {
    log('\n  ⚠️  WARNING: EMAIL_DISABLE=true', 'yellow');
    log('  Emails will not be sent. Set EMAIL_DISABLE=false to test real emails.', 'yellow');
    configValid = false;
  }

  // Validate EMAIL_HOST
  if (process.env.EMAIL_HOST && !process.env.EMAIL_HOST.includes('smtp')) {
    log(`\n  ❌ ERROR: EMAIL_HOST appears incorrect: ${process.env.EMAIL_HOST}`, 'red');
    log('  Should be: smtp.gmail.com (not your email address)', 'yellow');
    log('  Current .env has: EMAIL_HOST=anandsiva0317@gmail.com', 'red');
    log('  Should be: EMAIL_HOST=smtp.gmail.com', 'green');
    configValid = false;
  }

  if (!configValid) {
    log('\n❌ Configuration check failed. Please fix the issues above.', 'red');
    return false;
  }

  log('\n✅ All environment variables configured correctly', 'green');

  // Step 2: Create Email Transporter
  log('\n📋 Step 2: Creating Email Transporter', 'blue');
  log('-'.repeat(60));

  let transporter;
  try {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug: true, // Enable debug output
      logger: true  // Log to console
    });

    log('✅ Email transporter created', 'green');
    log(`   Host: ${process.env.EMAIL_HOST}`, 'cyan');
    log(`   Port: ${process.env.EMAIL_PORT}`, 'cyan');
    log(`   User: ${process.env.EMAIL_USER}`, 'cyan');
  } catch (error) {
    log(`❌ Failed to create transporter: ${error.message}`, 'red');
    return false;
  }

  // Step 3: Verify SMTP Connection
  log('\n📋 Step 3: Verifying SMTP Connection', 'blue');
  log('-'.repeat(60));
  log('Connecting to Gmail SMTP server...', 'cyan');

  try {
    await transporter.verify();
    log('✅ SMTP connection verified successfully!', 'green');
    log('   Server is ready to send emails', 'cyan');
  } catch (error) {
    log(`❌ SMTP connection failed: ${error.message}`, 'red');
    
    // Common error explanations
    if (error.message.includes('Invalid login')) {
      log('\n💡 Troubleshooting:', 'yellow');
      log('  1. Make sure you\'re using an App Password, not your Gmail password', 'yellow');
      log('  2. Generate App Password: https://myaccount.google.com/apppasswords', 'yellow');
      log('  3. Enable 2-Step Verification first if not enabled', 'yellow');
    } else if (error.message.includes('ECONNREFUSED')) {
      log('\n💡 Troubleshooting:', 'yellow');
      log('  1. Check your internet connection', 'yellow');
      log('  2. Verify EMAIL_HOST is correct (should be smtp.gmail.com)', 'yellow');
      log('  3. Check if firewall is blocking port 587', 'yellow');
    }
    
    return false;
  }

  // Step 4: Send Test Email
  log('\n📋 Step 4: Sending Test Email', 'blue');
  log('-'.repeat(60));

  const testEmail = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Send to self for testing
    subject: '✅ SMTP Test Email - Success!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #4CAF50; border-radius: 10px;">
        <h1 style="color: #4CAF50; text-align: center;">🎉 Email Test Successful!</h1>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Test Details:</h3>
          <ul>
            <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
            <li><strong>SMTP Host:</strong> ${process.env.EMAIL_HOST}</li>
            <li><strong>Port:</strong> ${process.env.EMAIL_PORT}</li>
            <li><strong>From:</strong> ${process.env.EMAIL_USER}</li>
          </ul>
        </div>

        <div style="background-color: #E8F5E9; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
          <p><strong>✅ Your SMTP configuration is working correctly!</strong></p>
          <p>Your application can now send emails for:</p>
          <ul>
            <li>User registration notifications</li>
            <li>Password reset emails</li>
            <li>Account approval notifications</li>
            <li>Blog approval/rejection notifications</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            This is an automated test email from your Blog Platform application
          </p>
        </div>
      </div>
    `,
    text: `
SMTP Test Email - Success!

Your SMTP configuration is working correctly!

Test Details:
- Time: ${new Date().toLocaleString()}
- SMTP Host: ${process.env.EMAIL_HOST}
- Port: ${process.env.EMAIL_PORT}
- From: ${process.env.EMAIL_USER}

Your application can now send emails for user notifications.
    `
  };

  log(`Sending test email to: ${testEmail.to}`, 'cyan');

  try {
    const info = await transporter.sendMail(testEmail);
    
    log('\n✅ Test email sent successfully!', 'green');
    log(`   Message ID: ${info.messageId}`, 'cyan');
    log(`   Response: ${info.response}`, 'cyan');
    log(`\n📧 Check your inbox at: ${testEmail.to}`, 'magenta');
    log('   (It may take a few seconds to arrive)', 'magenta');
    
    return true;
  } catch (error) {
    log(`\n❌ Failed to send email: ${error.message}`, 'red');
    
    if (error.message.includes('Invalid login')) {
      log('\n💡 This usually means:', 'yellow');
      log('  1. You\'re not using an App Password', 'yellow');
      log('  2. The App Password is incorrect', 'yellow');
      log('  3. 2-Step Verification is not enabled', 'yellow');
    }
    
    return false;
  }
}

// Step 5: Test Email Templates
async function testEmailTemplates() {
  log('\n📋 Step 5: Testing Email Templates', 'blue');
  log('-'.repeat(60));

  const templates = {
    'User Approval': (name) => `
      <h2>Welcome to Our Platform!</h2>
      <p>Hi ${name},</p>
      <p>Your account has been approved by our admin team. You can now log in and start using all features.</p>
      <p>Thank you for joining us!</p>
    `,
    'Blog Approval': (title) => `
      <h2>Blog Post Approved!</h2>
      <p>Your blog post "<strong>${title}</strong>" has been approved and is now published.</p>
      <p>Thank you for your contribution!</p>
    `,
    'Blog Rejection': (title, reason) => `
      <h2>Blog Post Update</h2>
      <p>Your blog post "<strong>${title}</strong>" was not approved.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>Please make the necessary changes and resubmit.</p>
    `
  };

  log('Available email templates:', 'green');
  for (const [name, template] of Object.entries(templates)) {
    log(`  ✅ ${name}`, 'cyan');
  }

  return true;
}

// Main test function
async function runEmailTests() {
  log('\n🚀 Starting SMTP Email Test Suite', 'magenta');
  log('='.repeat(60), 'magenta');

  try {
    const configSuccess = await testEmailConfiguration();
    
    if (configSuccess) {
      await testEmailTemplates();
      
      log('\n' + '='.repeat(60), 'green');
      log('🎉 ALL TESTS PASSED!', 'green');
      log('='.repeat(60), 'green');
      log('\n✅ Your email system is fully configured and working!', 'green');
      log('   You can now enable email notifications in your application.\n', 'green');
    } else {
      log('\n' + '='.repeat(60), 'red');
      log('❌ TESTS FAILED', 'red');
      log('='.repeat(60), 'red');
      log('\n⚠️  Please fix the issues above and run the test again.\n', 'yellow');
    }

    // Configuration reminder
    log('='.repeat(60), 'cyan');
    log('📝 CONFIGURATION REMINDER', 'cyan');
    log('='.repeat(60), 'cyan');
    log('\nYour .env should have:', 'yellow');
    log('  EMAIL_HOST=smtp.gmail.com', 'cyan');
    log('  EMAIL_PORT=587', 'cyan');
    log('  EMAIL_USER=your-email@gmail.com', 'cyan');
    log('  EMAIL_PASS=your-app-password (16 characters, no spaces)', 'cyan');
    log('  EMAIL_DISABLE=false (or remove this line)', 'cyan');
    log('\n📌 How to get Gmail App Password:', 'yellow');
    log('  1. Go to: https://myaccount.google.com/apppasswords', 'cyan');
    log('  2. Enable 2-Step Verification if not enabled', 'cyan');
    log('  3. Generate App Password for "Mail"', 'cyan');
    log('  4. Copy the 16-character password (no spaces)', 'cyan');
    log('  5. Paste it in EMAIL_PASS in your .env file\n', 'cyan');

  } catch (error) {
    log(`\n❌ Unexpected error: ${error.message}`, 'red');
    console.error(error);
  }
}

// Run the tests
runEmailTests();