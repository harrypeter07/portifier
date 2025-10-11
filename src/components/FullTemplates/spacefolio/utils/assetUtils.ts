// Asset utility functions for Spacefolio template
import { SPACEFOLIO_ASSETS, getRandomProjectImage, getRandomSkillIcon, getRandomVideo } from "../assets";

// Get fallback image for projects with proper cycling
export const getProjectFallbackImage = (index: number): string => {
  return getRandomProjectImage(index % SPACEFOLIO_ASSETS.projects.length);
};

// Get fallback skill icon with proper cycling
export const getSkillFallbackIcon = (index: number): string => {
  return getRandomSkillIcon(index % SPACEFOLIO_ASSETS.skills.length);
};

// Get fallback video with proper cycling
export const getVideoFallback = (index: number): string => {
  return getRandomVideo(index % SPACEFOLIO_ASSETS.videos.length);
};

// Get all available project images for gallery
export const getAllProjectImages = (): string[] => {
  return [...SPACEFOLIO_ASSETS.projects];
};

// Get all available skill icons for selection
export const getAllSkillIcons = (): string[] => {
  return [...SPACEFOLIO_ASSETS.skills];
};

// Get all available videos for backgrounds
export const getAllVideos = (): string[] => {
  return [...SPACEFOLIO_ASSETS.videos];
};

// Get UI elements by category
export const getUIElement = (element: 'logo' | 'hero-bg' | 'lock-main' | 'lock-top'): string => {
  const uiMap = {
    'logo': SPACEFOLIO_ASSETS.ui[1],
    'hero-bg': SPACEFOLIO_ASSETS.ui[0],
    'lock-main': SPACEFOLIO_ASSETS.ui[2],
    'lock-top': SPACEFOLIO_ASSETS.ui[3]
  };
  return uiMap[element];
};

// Create a shuffled array of assets for random display
export const getShuffledAssets = (category: 'projects' | 'skills' | 'videos' | 'ui'): string[] => {
  const assets = SPACEFOLIO_ASSETS[category];
  const shuffled = [...assets];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get asset by name with fallback
export const getAssetByName = (name: string, fallback?: string): string => {
  const allAssets = [
    ...SPACEFOLIO_ASSETS.projects,
    ...SPACEFOLIO_ASSETS.skills,
    ...SPACEFOLIO_ASSETS.videos,
    ...SPACEFOLIO_ASSETS.ui
  ];
  
  const found = allAssets.find(asset => asset.includes(name));
  return found || fallback || SPACEFOLIO_ASSETS.projects[0];
};

// Validate if asset exists
export const assetExists = (path: string): boolean => {
  const allAssets = [
    ...SPACEFOLIO_ASSETS.projects,
    ...SPACEFOLIO_ASSETS.skills,
    ...SPACEFOLIO_ASSETS.videos,
    ...SPACEFOLIO_ASSETS.ui
  ];
  
  return allAssets.includes(path);
};

// Get random asset from any category
export const getRandomAsset = (): string => {
  const allAssets = [
    ...SPACEFOLIO_ASSETS.projects,
    ...SPACEFOLIO_ASSETS.skills,
    ...SPACEFOLIO_ASSETS.videos,
    ...SPACEFOLIO_ASSETS.ui
  ];
  
  const randomIndex = Math.floor(Math.random() * allAssets.length);
  return allAssets[randomIndex];
};

// Get assets by type (image, video, etc.)
export const getAssetsByType = (type: 'image' | 'video'): string[] => {
  if (type === 'video') {
    return SPACEFOLIO_ASSETS.videos;
  }
  
  return [
    ...SPACEFOLIO_ASSETS.projects,
    ...SPACEFOLIO_ASSETS.skills,
    ...SPACEFOLIO_ASSETS.ui
  ];
};
