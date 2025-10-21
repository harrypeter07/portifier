import nodemailer from 'nodemailer';

// Email configuration
const createTransporter = () => {
  // Prefer Gmail service by default; can be extended to host/port later
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Beautiful HTML email templates
export const emailTemplates = {
  contact: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Message - Portifier</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 30px; }
        .field { margin-bottom: 20px; }
        .field-label { font-weight: bold; color: #374151; margin-bottom: 5px; }
        .field-value { color: #6b7280; line-height: 1.6; }
        .message-box { background-color: #f9fafb; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        .badge { display: inline-block; background-color: #667eea; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-left: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 New Contact Message</h1>
          <p>Someone reached out through Portifier</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="field-label">👤 Name</div>
            <div class="field-value">${data.name || 'Not provided'}</div>
          </div>
          <div class="field">
            <div class="field-label">📧 Email</div>
            <div class="field-value">${data.email || 'Not provided'}</div>
          </div>
          <div class="field">
            <div class="field-label">📱 Phone</div>
            <div class="field-value">${data.phone || 'Not provided'}</div>
          </div>
          <div class="field">
            <div class="field-label">🎯 Subject</div>
            <div class="field-value">${data.subject || 'General Inquiry'}</div>
          </div>
          <div class="message-box">
            <div class="field-label">💬 Message</div>
            <div class="field-value">${data.message}</div>
          </div>
          <div class="field">
            <div class="field-label">🕒 Received</div>
            <div class="field-value">${new Date().toLocaleString()}</div>
          </div>
        </div>
        <div class="footer">
          <p>This message was sent through Portifier's contact form.</p>
          <p>Help us improve by contributing to our project! 🚀</p>
        </div>
      </div>
    </body>
    </html>
  `,

  bugReport: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bug Report - Portifier</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 700px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .priority-high { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
        .priority-medium { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
        .priority-low { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
        .content { padding: 30px; }
        .field { margin-bottom: 20px; }
        .field-label { font-weight: bold; color: #374151; margin-bottom: 5px; }
        .field-value { color: #6b7280; line-height: 1.6; }
        .priority-badge { display: inline-block; color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; margin-left: 10px; }
        .steps-box { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .environment-box { background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        .contribution-cta { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🐛 Bug Report</h1>
          <p>Help us improve Portifier!</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="field-label">📝 Bug Title</div>
            <div class="field-value">${data.title} <span class="priority-badge priority-${data.priority}">${data.priority.toUpperCase()}</span></div>
          </div>
          <div class="field">
            <div class="field-label">📧 Reporter</div>
            <div class="field-value">${data.email || 'Anonymous'}</div>
          </div>
          <div class="field">
            <div class="field-label">📋 Description</div>
            <div class="field-value">${data.description}</div>
          </div>
          ${data.steps ? `
          <div class="steps-box">
            <div class="field-label">🔄 Steps to Reproduce</div>
            <div class="field-value">${data.steps}</div>
          </div>
          ` : ''}
          ${data.expected || data.actual ? `
          <div class="field">
            <div class="field-label">✅ Expected vs ❌ Actual</div>
            <div class="field-value">
              <strong>Expected:</strong> ${data.expected || 'Not provided'}<br>
              <strong>Actual:</strong> ${data.actual || 'Not provided'}
            </div>
          </div>
          ` : ''}
          <div class="environment-box">
            <div class="field-label">🖥️ Environment</div>
            <div class="field-value">
              <strong>Browser:</strong> ${data.browser || 'Not specified'}<br>
              <strong>Device:</strong> ${data.device || 'Not specified'}<br>
              <strong>URL:</strong> ${data.url || 'Not available'}<br>
              <strong>Timestamp:</strong> ${new Date().toLocaleString()}
            </div>
          </div>
          ${data.attachments && data.attachments.length > 0 ? `
          <div class="field">
            <div class="field-label">📎 Attachments</div>
            <div class="field-value">${data.attachments.length} file(s) attached</div>
          </div>
          ` : ''}
          <div class="contribution-cta">
            <h3 style="margin: 0 0 10px 0;">🚀 Help Us Improve!</h3>
            <p style="margin: 0;">Thank you for reporting this bug. Your feedback helps us make Portifier better for everyone!</p>
          </div>
        </div>
        <div class="footer">
          <p>This bug report was submitted through Portifier's bug reporting system.</p>
          <p>Consider contributing to our open-source project! 🌟</p>
        </div>
      </div>
    </body>
    </html>
  `,

  welcome: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Portifier!</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; }
        .header h1 { margin: 0; font-size: 32px; font-weight: bold; }
        .content { padding: 40px; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .feature-list { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background-color: #f8fafc; padding: 30px; text-align: center; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to Portifier!</h1>
          <p>Your AI-powered portfolio builder</p>
        </div>
        <div class="content">
          <h2>Hello ${data.name || 'there'}!</h2>
          <p>Welcome to Portifier - the easiest way to create stunning, professional portfolios with AI-powered automation.</p>
          
          <div class="feature-list">
            <h3>✨ What you can do:</h3>
            <ul>
              <li>Upload your resume and let AI extract all the details</li>
              <li>Choose from beautiful, professional templates</li>
              <li>Customize colors, layouts, and content</li>
              <li>Get your unique portfolio URL</li>
              <li>Track visitor analytics</li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" class="cta-button">Start Building Your Portfolio</a>
          </div>
          
          <h3>🚀 Coming Soon!</h3>
          <p>We're working on amazing new features:</p>
          <ul>
            <li>More beautiful templates with specific themes</li>
            <li>Advanced customization options</li>
            <li>Team collaboration features</li>
            <li>Export to multiple formats</li>
          </ul>
          
          <h3>🤝 Contribute to Our Project</h3>
          <p>Portifier is open-source! Help us improve by:</p>
          <ul>
            <li>Reporting bugs and suggesting features</li>
            <li>Contributing code on GitHub</li>
            <li>Creating new templates</li>
            <li>Sharing feedback</li>
          </ul>
        </div>
        <div class="footer">
          <p>Happy portfolio building! 🎨</p>
          <p>The Portifier Team</p>
        </div>
      </div>
    </body>
    </html>
  `
};

// Email sending functions
export const sendContactEmail = async (data) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
    subject: `[CONTACT] ${data.subject || 'New Contact Message'} - ${data.name || 'Anonymous'}`,
    replyTo: data.email || undefined,
    html: emailTemplates.contact(data),
    text: `
New Contact Message from Portifier

Name: ${data.name || 'Not provided'}
Email: ${data.email || 'Not provided'}
Phone: ${data.phone || 'Not provided'}
Subject: ${data.subject || 'General Inquiry'}

Message:
${data.message}

Received: ${new Date().toLocaleString()}
    `.trim()
  };

  return await transporter.sendMail(mailOptions);
};

export const sendBugReportEmail = async (data) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.BUG_REPORT_EMAIL || process.env.EMAIL_USER,
    subject: `[BUG REPORT] ${data.title} - Priority: ${(data.priority || 'medium').toString().toUpperCase()}`,
    replyTo: data.email || undefined,
    html: emailTemplates.bugReport(data),
    text: `
Bug Report: ${data.title}
Priority: ${(data.priority || 'medium').toString().toUpperCase()}

Description:
${data.description}

Steps to Reproduce:
${data.steps || 'Not provided'}

Expected: ${data.expected || 'Not provided'}
Actual: ${data.actual || 'Not provided'}

Environment:
Browser: ${data.browser || 'Not specified'}
Device: ${data.device || 'Not specified'}
URL: ${data.url || 'Not available'}

Reporter: ${data.email || 'Anonymous'}
Timestamp: ${new Date().toLocaleString()}
    `.trim(),
    attachments: data.attachments || []
  };

  return await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (data) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: 'Welcome to Portifier! 🎉',
    html: emailTemplates.welcome(data),
    text: `
Welcome to Portifier!

Hello ${data.name || 'there'}!

Welcome to Portifier - the easiest way to create stunning, professional portfolios with AI-powered automation.

What you can do:
- Upload your resume and let AI extract all the details
- Choose from beautiful, professional templates
- Customize colors, layouts, and content
- Get your unique portfolio URL
- Track visitor analytics

Start building: ${process.env.NEXT_PUBLIC_BASE_URL}/dashboard

Coming Soon:
- More beautiful templates with specific themes
- Advanced customization options
- Team collaboration features
- Export to multiple formats

Contribute to Our Project:
Portifier is open-source! Help us improve by reporting bugs, contributing code, creating templates, and sharing feedback.

Happy portfolio building! 🎨

The Portifier Team
    `.trim()
  };

  return await transporter.sendMail(mailOptions);
};
