import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Resume from '@/models/Resume';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const resume = await Resume.findOne({
      _id: params.id,
      userId: session.user.id
    }).select('-filePath -__v');

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

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
        fileName: resume.fileName,
        fileSize: resume.fileSize,
        fileType: resume.fileType,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt
      }
    });

  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const resumeData = await request.json();

    const resume = await Resume.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      {
        ...resumeData,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-filePath -__v');

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

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
        fileName: resume.fileName,
        fileSize: resume.fileSize,
        fileType: resume.fileType,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating resume:', error);
    return NextResponse.json(
      { error: 'Failed to update resume' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const resume = await Resume.findOneAndDelete({
      _id: params.id,
      userId: session.user.id
    });

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Delete associated file if it exists
    if (resume.filePath) {
      const fs = require('fs');
      try {
        fs.unlinkSync(resume.filePath);
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Resume deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    );
  }
}