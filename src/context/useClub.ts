import { createContext, useContext } from 'react';
import { Member, Event, GalleryItem, Alumni, UpdatePost, ConvenerInfo, WebsiteSettings, User } from '../types';

export interface ClubContextType {
  members: Member[];
  events: Event[];
  gallery: GalleryItem[];
  alumni: Alumni[];
  updates: UpdatePost[];
  convener: ConvenerInfo;
  settings: WebsiteSettings;
  user: User | null;
  
  // Members Operations
  addMember: (member: Omit<Member, 'id' | 'order'>) => void;
  editMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  reorderMembers: (startIndex: number, endIndex: number) => void;
  
  // Events Operations
  addEvent: (event: Omit<Event, 'id' | 'order'>) => void;
  editEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  reorderEvents: (startIndex: number, endIndex: number) => void;
  
  // Gallery Operations
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'order'>) => void;
  editGalleryItem: (id: string, item: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;
  reorderGallery: (startIndex: number, endIndex: number) => void;
  
  // Alumni Operations
  addAlumni: (alumni: Omit<Alumni, 'id' | 'order'>) => void;
  editAlumni: (id: string, alumni: Partial<Alumni>) => void;
  deleteAlumni: (id: string) => void;
  reorderAlumni: (startIndex: number, endIndex: number) => void;

  // Updates Operations
  addUpdatePost: (post: Omit<UpdatePost, 'id' | 'order'>) => void;
  editUpdatePost: (id: string, post: Partial<UpdatePost>) => void;
  deleteUpdatePost: (id: string) => void;
  reorderUpdates: (startIndex: number, endIndex: number) => void;
  
  // Convener Operations
  updateConvener: (info: Partial<ConvenerInfo>) => void;
  
  // Settings Operations
  updateSettings: (settings: Partial<WebsiteSettings>) => void;
  
  // Auth Operations
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const ClubContext = createContext<ClubContextType | undefined>(undefined);

export const useClub = () => {
  const context = useContext(ClubContext);
  if (context === undefined) {
    throw new Error('useClub must be used within a ClubProvider');
  }
  return context;
};
