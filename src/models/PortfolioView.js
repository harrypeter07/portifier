import mongoose from "mongoose";

const portfolioViewSchema = new mongoose.Schema({
  portfolioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Visitor tracking
  sessionId: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  // Geographic data
  country: String,
  city: String,
  region: String,
  // Referrer tracking
  referrer: String,
  referrerDomain: String,
  // Device and browser info
  deviceType: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet'],
    default: 'desktop'
  },
  browser: String,
  os: String,
  // Engagement metrics
  timeOnPage: {
    type: Number, // in seconds
    default: 0
  },
  pagesViewed: {
    type: Number,
    default: 1
  },
  isBounce: {
    type: Boolean,
    default: true
  },
  // Timestamps
  firstVisit: {
    type: Date,
    default: Date.now
  },
  lastVisit: {
    type: Date,
    default: Date.now
  },
  // Additional tracking
  utmSource: String,
  utmMedium: String,
  utmCampaign: String,
  utmTerm: String,
  utmContent: String
}, {
  timestamps: true
});

// Indexes for efficient querying
portfolioViewSchema.index({ portfolioId: 1, createdAt: -1 });
portfolioViewSchema.index({ portfolioId: 1, sessionId: 1 });
portfolioViewSchema.index({ portfolioId: 1, ipAddress: 1, createdAt: -1 });

// Virtual for unique visitors (based on IP + User Agent combination)
portfolioViewSchema.virtual('visitorId').get(function() {
  return `${this.ipAddress}-${this.userAgent}`;
});

const PortfolioView = mongoose.models.PortfolioView || mongoose.model('PortfolioView', portfolioViewSchema);

export default PortfolioView;
