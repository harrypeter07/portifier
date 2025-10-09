export const personalInfo = {
  name: "Hassan Mansuri",
  portfolioTagline: "Fullstack Developer Portfolio",
  headlinePrefix: "Providing",
  headlineHighlight: "the best",
  headlineSuffix: "project experience.",
  bio:
    "I'm a Full Stack Software Engineer with experience in Website, Mobile, and Software development. Check out my projects and skills.",
  ctaLabel: "Learn more",
  authorUrl: "https://github.com/your-username",
} as const;

export const siteMeta = {
  title: `${personalInfo.name} | Space Portfolio`,
  description: `Welcome to ${personalInfo.name}'s full stack Next.js 14 space portfolio.`,
  authors: {
    name: personalInfo.name,
    url: personalInfo.authorUrl,
  },
} as const;


