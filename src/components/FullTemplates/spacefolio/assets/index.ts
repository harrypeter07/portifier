// Spacefolio Assets Mapping
// This file contains all available assets from the public folder

export const SPACEFOLIO_ASSETS = {
  // Project Images
  projects: [
    "/projects/project-1.png",
    "/projects/project-2.png", 
    "/projects/project-3.png"
  ],
  
  // Skill Icons
  skills: [
    "/skills/css.png",
    "/skills/docker.png",
    "/skills/express.png",
    "/skills/figma.png",
    "/skills/firebase.png",
    "/skills/framer.png",
    "/skills/go.png",
    "/skills/graphql.png",
    "/skills/html.png",
    "/skills/js.png",
    "/skills/mongodb.png",
    "/skills/mui.png",
    "/skills/mysql.png",
    "/skills/next.png",
    "/skills/node.png",
    "/skills/postgresql.png",
    "/skills/prisma.png",
    "/skills/react.png",
    "/skills/reactnative.png",
    "/skills/reactquery.png",
    "/skills/redux.png",
    "/skills/stripe.png",
    "/skills/tailwind.png",
    "/skills/tauri.png",
    "/skills/ts.png"
  ],
  
  // Videos
  videos: [
    "/videos/blackhole.webm",
    "/videos/encryption-bg.webm",
    "/videos/skills-bg.webm"
  ],
  
  // UI Elements
  ui: [
    "/hero-bg.svg",
    "/logo.png",
    "/lock-main.png",
    "/lock-top.png"
  ]
} as const;

// Helper functions to get random assets
export const getRandomProjectImage = (index?: number): string => {
  if (index !== undefined && index < SPACEFOLIO_ASSETS.projects.length) {
    return SPACEFOLIO_ASSETS.projects[index];
  }
  const randomIndex = Math.floor(Math.random() * SPACEFOLIO_ASSETS.projects.length);
  return SPACEFOLIO_ASSETS.projects[randomIndex];
};

export const getRandomSkillIcon = (index?: number): string => {
  if (index !== undefined && index < SPACEFOLIO_ASSETS.skills.length) {
    return SPACEFOLIO_ASSETS.skills[index];
  }
  const randomIndex = Math.floor(Math.random() * SPACEFOLIO_ASSETS.skills.length);
  return SPACEFOLIO_ASSETS.skills[randomIndex];
};

export const getRandomVideo = (index?: number): string => {
  if (index !== undefined && index < SPACEFOLIO_ASSETS.videos.length) {
    return SPACEFOLIO_ASSETS.videos[index];
  }
  const randomIndex = Math.floor(Math.random() * SPACEFOLIO_ASSETS.videos.length);
  return SPACEFOLIO_ASSETS.videos[randomIndex];
};

// Get specific assets by name
export const getAssetByName = (name: string): string | null => {
  const allAssets = [
    ...SPACEFOLIO_ASSETS.projects,
    ...SPACEFOLIO_ASSETS.skills,
    ...SPACEFOLIO_ASSETS.videos,
    ...SPACEFOLIO_ASSETS.ui
  ];
  
  return allAssets.find(asset => asset.includes(name)) || null;
};

// Get all available assets
export const getAllAssets = (): string[] => {
  return [
    ...SPACEFOLIO_ASSETS.projects,
    ...SPACEFOLIO_ASSETS.skills,
    ...SPACEFOLIO_ASSETS.videos,
    ...SPACEFOLIO_ASSETS.ui
  ];
};

// Asset categories for different use cases
export const ASSET_CATEGORIES = {
  BACKGROUNDS: SPACEFOLIO_ASSETS.videos,
  ICONS: SPACEFOLIO_ASSETS.skills,
  PROJECTS: SPACEFOLIO_ASSETS.projects,
  UI_ELEMENTS: SPACEFOLIO_ASSETS.ui
} as const;
