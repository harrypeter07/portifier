import fs from 'fs';
import path from 'path';

// Types for our data structure
export interface SliceData {
  slice_type: string;
  slice_label: string | null;
  variation: string;
  version: string;
  primary: Record<string, any>;
  items: any[];
}

export interface PageData {
  uid?: string;
  meta_title: string;
  meta_description: string;
  slices: SliceData[];
}

export interface BlogPostData extends PageData {
  uid: string;
  title: string;
  date: string;
  tags: string[];
}

export interface ProjectData extends PageData {
  uid: string;
}

export interface SettingsData {
  name: string;
  nav_item: Array<{
    link: {
      link_type: string;
      url: string;
    };
    label: string;
  }>;
  cta_link: {
    link_type: string;
    url: string;
  };
  cta_label: string;
  github_link: {
    link_type: string;
    url: string;
  };
  twitter_link: {
    link_type: string;
    url: string;
  };
  linkdin_link: {
    link_type: string;
    url: string;
  };
  intagram_link: {
    link_type: string;
    url: string;
  };
}

// Data loading functions
export async function getHomepageData(): Promise<PageData> {
  const dataPath = path.join(process.cwd(), 'src/data/homepage.json');
  const jsonData = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(jsonData);
}

export async function getPagesData(): Promise<PageData[]> {
  const dataPath = path.join(process.cwd(), 'src/data/pages.json');
  const jsonData = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(jsonData);
}

export async function getPageByUID(uid: string): Promise<PageData | null> {
  const pages = await getPagesData();
  return pages.find(page => page.uid === uid) || null;
}

export async function getProjectsData(): Promise<ProjectData[]> {
  const dataPath = path.join(process.cwd(), 'src/data/projects.json');
  const jsonData = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(jsonData);
}

export async function getProjectByUID(uid: string): Promise<ProjectData | null> {
  const projects = await getProjectsData();
  return projects.find(project => project.uid === uid) || null;
}

export async function getBlogPostsData(): Promise<BlogPostData[]> {
  const dataPath = path.join(process.cwd(), 'src/data/blog-posts.json');
  const jsonData = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(jsonData);
}

export async function getBlogPostByUID(uid: string): Promise<BlogPostData | null> {
  const posts = await getBlogPostsData();
  return posts.find(post => post.uid === uid) || null;
}

export async function getSettingsData(): Promise<SettingsData> {
  const dataPath = path.join(process.cwd(), 'src/data/settings.json');
  const jsonData = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(jsonData);
}

// Helper function to format dates (similar to the original blog post component)
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", dateOptions).format(date);
}
