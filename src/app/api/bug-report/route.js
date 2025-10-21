import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const title = formData.get('title');
    const description = formData.get('description');
    const steps = formData.get('steps');
    const expected = formData.get('expected');
    const actual = formData.get('actual');
    const browser = formData.get('browser');
    const device = formData.get('device');
    const email = formData.get('email');
    const priority = formData.get('priority');
    const timestamp = formData.get('timestamp');
    const userAgent = formData.get('userAgent');
    const url = formData.get('url');

    // Get attachments
    const attachments = [];
    for (const [key, value] of formData.entries()) {
      if (key === 'attachments' && value instanceof File) {
        attachments.push({
          name: value.name,
          type: value.type,
          size: value.size,
          buffer: Buffer.from(await value.arrayBuffer())
        });
      }
    }

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Create email content
    const emailContent = `
# Bug Report: ${title}

## Priority: ${priority.toUpperCase()}

## Description
${description}

## Steps to Reproduce
${steps || 'Not provided'}

## Expected Behavior
${expected || 'Not provided'}

## Actual Behavior
${actual || 'Not provided'}

## Environment
- **Browser**: ${browser || 'Not specified'}
- **Device/OS**: ${device || 'Not specified'}
- **User Agent**: ${userAgent || 'Not available'}
- **URL**: ${url || 'Not available'}
- **Timestamp**: ${timestamp || new Date().toISOString()}

## Reporter Contact
${email ? `Email: ${email}` : 'No contact email provided'}

---
Reported via Portifier Bug Reporter
    `.trim();

    // Configure email transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail', // or your preferred email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.BUG_REPORT_EMAIL || process.env.EMAIL_USER,
      subject: `[BUG REPORT] ${title} - Priority: ${priority.toUpperCase()}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>'),
      attachments: attachments.map(att => ({
        filename: att.name,
        content: att.buffer,
        contentType: att.type
      }))
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Log to console for development
    console.log('Bug Report Received:', {
      title,
      priority,
      email,
      attachments: attachments.length,
      timestamp
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Bug report submitted successfully",
        reportId: `BR-${Date.now()}`
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing bug report:', error);
    
    // Fallback: Log to console if email fails
    console.log('Bug Report (Email Failed):', {
      title: formData.get('title'),
      description: formData.get('description'),
      priority: formData.get('priority'),
      email: formData.get('email'),
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Bug report logged successfully (email service unavailable)",
        reportId: `BR-${Date.now()}`
      },
      { status: 200 }
    );
  }
}
