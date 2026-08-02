export interface Member {
  id: string;
  name: string;
  position: string;
  batch: string;
  email?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  photo: string;
  order: number;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  coverImage: string;
  images: string[];
  videoUrl?: string;
  location: string;
  details: string;
  order: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  photographer: string;
  date: string;
  description?: string;
  order: number;
}

export interface Alumni {
  id: string;
  name: string;
  batch: string;
  currentPosition: string;
  organization: string;
  photo: string;
  order: number;
}

export interface UpdatePost {
  id: string;
  title: string;
  date: string;
  category: 'Celebration' | 'Announcement' | 'Achievement';
  image: string;
  content: string;
  link?: string;
  order: number;
}

export interface ConvenerInfo {
  name: string;
  designation: string;
  quote: string;
  welcomeMessage: string;
  photo: string;
  email: string;
  phone?: string;
}

export interface WebsiteSettings {
  siteName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  motto: string;
  mottoBgImages: string[];
}

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  username: string;
  role: UserRole;
  token: string;
}
