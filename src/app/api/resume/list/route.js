import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Resume from '@/models/Resume';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const resumes = await Resume.find({ userId: session.user.id })
      .sort({ updatedAt: -1 })
      .select('-filePath -__v');

    return NextResponse.json({
      success: true,
      resumes: resumes.map(resume => ({
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
      }))
    });

  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}
