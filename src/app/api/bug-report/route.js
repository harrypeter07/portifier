import { NextResponse } from "next/server";
import { sendBugReportEmail } from "@/lib/emailService";

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
          filename: value.name,
          content: Buffer.from(await value.arrayBuffer()),
          contentType: value.type
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

    // Prepare email data
    const emailData = {
      title,
      description,
      steps,
      expected,
      actual,
      browser,
      device,
      email,
      priority,
      url,
      attachments
    };

    // Send email using the new service
    await sendBugReportEmail(emailData);

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
        message: "Bug report submitted successfully! Help us improve Portifier! 🚀",
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
        message: "Bug report logged successfully! Help us improve Portifier! 🚀",
        reportId: `BR-${Date.now()}`
      },
      { status: 200 }
    );
  }
}
