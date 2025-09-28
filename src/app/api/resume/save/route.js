import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Resume from '@/models/Resume';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const formData = await request.formData();
    const file = formData.get('file');
    const resumeData = JSON.parse(formData.get('resumeData') || '{}');

    // Create resume document
    const resume = new Resume({
      userId: session.user.id,
      title: resumeData.title,
      name: resumeData.name,
      email: resumeData.email,
      phone: resumeData.phone,
      location: resumeData.location,
      summary: resumeData.summary,
      experience: resumeData.experience || [],
      education: resumeData.education || [],
      skills: resumeData.skills || [],
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Save file to uploads directory if provided
    if (file) {
      const fs = require('fs');
      const path = require('path');
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'resumes');
      
      // Ensure uploads directory exists
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const fileName = `${resume._id}_${file.name}`;
      const filePath = path.join(uploadsDir, fileName);
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      fs.writeFileSync(filePath, buffer);
      
      resume.filePath = filePath;
      resume.fileName = fileName;
    }

    await resume.save();

    return NextResponse.json({
      success: true,
      resume: {
        id: resume._id,
        title: resume.title,
        name: resume.name,
        email: resume.email,
        phone: resume.phone,
        location: resume.location,
        summary: resume.summary,
        experience: resume.experience,
        education: resume.education,
        skills: resume.skills,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt
      }
    });

  } catch (error) {
    console.error('Error saving resume:', error);
    return NextResponse.json(
      { error: 'Failed to save resume' },
      { status: 500 }
    );
  }
}
