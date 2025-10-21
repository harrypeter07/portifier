import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/emailService";

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Send email using the new service
    await sendContactEmail(data);

    // Log to console for development
    console.log('Contact Message Received:', {
      name: data.name,
      email: data.email,
      subject: data.subject,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Message sent successfully! We'll get back to you soon. 🚀"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing contact message:', error);
    
    // Fallback: Log to console if email fails
    console.log('Contact Message (Email Failed):', {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Message received! We'll get back to you soon. 🚀"
      },
      { status: 200 }
    );
  }
}
