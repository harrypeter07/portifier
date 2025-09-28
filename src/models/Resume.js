import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  description: { type: String },
  current: { type: Boolean, default: false }
});

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  location: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  gpa: { type: String },
  description: { type: String }
});

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  }
});

const resumeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  location: { type: String },
  summary: { type: String },
  experience: [experienceSchema],
  education: [educationSchema],
  skills: [skillSchema],
  
  // File information
  fileName: { type: String },
  fileSize: { type: Number },
  fileType: { type: String },
  filePath: { type: String },
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
resumeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for better query performance
resumeSchema.index({ userId: 1, updatedAt: -1 });
resumeSchema.index({ userId: 1, title: 1 });

const Resume = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);

export default Resume;