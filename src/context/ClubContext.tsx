import React, { useState } from 'react';
import { Member, Event, GalleryItem, Alumni, UpdatePost, ConvenerInfo, WebsiteSettings, User, UserRole } from '../types';
import { ClubContext } from './useClub';
import {
  defaultMembers,
  defaultEvents,
  defaultGallery,
  defaultAlumni,
  defaultUpdates,
  defaultConvener,
  defaultSettings
} from '../data/mockData';

const loadArray = <T,>(key: string, fallback: T[]): T[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const loadConvener = (): ConvenerInfo => {
  try {
    const raw = localStorage.getItem('fpc_convener');
    if (!raw) return defaultConvener;
    const parsed = JSON.parse(raw);
    return parsed && parsed.name ? parsed : defaultConvener;
  } catch {
    return defaultConvener;
  }
};

const loadSettings = (): WebsiteSettings => {
  try {
    const raw = localStorage.getItem('fpc_settings');
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw);
    return parsed && parsed.siteName ? parsed : defaultSettings;
  } catch {
    return defaultSettings;
  }
};

const loadUser = (): User | null => {
  try {
    const raw = localStorage.getItem('fpc_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Quota-aware localStorage writer. Returns false instead of throwing when the
 * browser storage is full (e.g. after uploading many base64 images), so the
 * admin panel never crashes with an uncaught QuotaExceededError.
 */
const safeSetItem = (key: string, value: unknown): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[FPC] Failed to save "${key}" to browser storage.`, err);
    return false;
  }
};

const notifySaveFailure = (label: string) => {
  window.alert(
    `Your change to ${label} could not be saved to this browser because its storage is full. ` +
      'Please delete some images from the gallery/members, or upload smaller files.'
  );
};

export const ClubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>(() => loadArray('fpc_members', defaultMembers));
  const [events, setEvents] = useState<Event[]>(() => loadArray('fpc_events', defaultEvents));
  const [gallery, setGallery] = useState<GalleryItem[]>(() => loadArray('fpc_gallery', defaultGallery));
  const [alumni, setAlumni] = useState<Alumni[]>(() => loadArray('fpc_alumni', defaultAlumni));
  const [updates, setUpdates] = useState<UpdatePost[]>(() => loadArray('fpc_updates', defaultUpdates));
  const [convener, setConvener] = useState<ConvenerInfo>(loadConvener);
  const [settings, setSettings] = useState<WebsiteSettings>(loadSettings);
  const [user, setUser] = useState<User | null>(loadUser);

  // Save helpers
  const saveMembers = (data: Member[]) => {
    const sorted = [...data].sort((a, b) => a.order - b.order);
    setMembers(sorted);
    if (!safeSetItem('fpc_members', sorted)) notifySaveFailure('executive members');
  };

  const saveEvents = (data: Event[]) => {
    const sorted = [...data].sort((a, b) => a.order - b.order);
    setEvents(sorted);
    if (!safeSetItem('fpc_events', sorted)) notifySaveFailure('timeline events');
  };

  const saveGallery = (data: GalleryItem[]) => {
    const sorted = [...data].sort((a, b) => a.order - b.order);
    setGallery(sorted);
    if (!safeSetItem('fpc_gallery', sorted)) notifySaveFailure('the gallery');
  };

  const saveAlumni = (data: Alumni[]) => {
    const sorted = [...data].sort((a, b) => a.order - b.order);
    setAlumni(sorted);
    if (!safeSetItem('fpc_alumni', sorted)) notifySaveFailure('alumni');
  };

  const saveUpdates = (data: UpdatePost[]) => {
    const sorted = [...data].sort((a, b) => a.order - b.order);
    setUpdates(sorted);
    if (!safeSetItem('fpc_updates', sorted)) notifySaveFailure('bulletins');
  };

  // Members Operations
  const addMember = (member: Omit<Member, 'id' | 'order'>) => {
    const newOrder = members.length > 0 ? Math.max(...members.map(m => m.order)) + 1 : 1;
    const newMember: Member = {
      ...member,
      id: `m_${Date.now()}`,
      order: newOrder
    };
    saveMembers([...members, newMember]);
  };

  const editMember = (id: string, updated: Partial<Member>) => {
    saveMembers(members.map(m => m.id === id ? { ...m, ...updated } : m));
  };

  const deleteMember = (id: string) => {
    saveMembers(members.filter(m => m.id !== id));
  };

  const reorderMembers = (startIndex: number, endIndex: number) => {
    const result = Array.from(members);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    const updated = result.map((m, idx) => ({ ...m, order: idx + 1 }));
    saveMembers(updated);
  };

  // Events Operations
  const addEvent = (event: Omit<Event, 'id' | 'order'>) => {
    const newOrder = events.length > 0 ? Math.max(...events.map(e => e.order)) + 1 : 1;
    const newEvent: Event = {
      ...event,
      id: `e_${Date.now()}`,
      order: newOrder
    };
    saveEvents([...events, newEvent]);
  };

  const editEvent = (id: string, updated: Partial<Event>) => {
    saveEvents(events.map(e => e.id === id ? { ...e, ...updated } : e));
  };

  const deleteEvent = (id: string) => {
    saveEvents(events.filter(e => e.id !== id));
  };

  const reorderEvents = (startIndex: number, endIndex: number) => {
    const result = Array.from(events);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    const updated = result.map((e, idx) => ({ ...e, order: idx + 1 }));
    saveEvents(updated);
  };

  // Gallery Operations
  const addGalleryItem = (item: Omit<GalleryItem, 'id' | 'order'>) => {
    const newOrder = gallery.length > 0 ? Math.max(...gallery.map(g => g.order)) + 1 : 1;
    const newItem: GalleryItem = {
      ...item,
      id: `g_${Date.now()}`,
      order: newOrder
    };
    saveGallery([...gallery, newItem]);
  };

  const editGalleryItem = (id: string, updated: Partial<GalleryItem>) => {
    saveGallery(gallery.map(g => g.id === id ? { ...g, ...updated } : g));
  };

  const deleteGalleryItem = (id: string) => {
    saveGallery(gallery.filter(g => g.id !== id));
  };

  const reorderGallery = (startIndex: number, endIndex: number) => {
    const result = Array.from(gallery);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    const updated = result.map((g, idx) => ({ ...g, order: idx + 1 }));
    saveGallery(updated);
  };

  // Alumni Operations
  const addAlumni = (alumniItem: Omit<Alumni, 'id' | 'order'>) => {
    const newOrder = alumni.length > 0 ? Math.max(...alumni.map(a => a.order)) + 1 : 1;
    const newAlumni: Alumni = {
      ...alumniItem,
      id: `a_${Date.now()}`,
      order: newOrder
    };
    saveAlumni([...alumni, newAlumni]);
  };

  const editAlumni = (id: string, updated: Partial<Alumni>) => {
    saveAlumni(alumni.map(a => a.id === id ? { ...a, ...updated } : a));
  };

  const deleteAlumni = (id: string) => {
    saveAlumni(alumni.filter(a => a.id !== id));
  };

  const reorderAlumni = (startIndex: number, endIndex: number) => {
    const result = Array.from(alumni);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    const updated = result.map((a, idx) => ({ ...a, order: idx + 1 }));
    saveAlumni(updated);
  };

  // Updates Operations
  const addUpdatePost = (post: Omit<UpdatePost, 'id' | 'order'>) => {
    const newOrder = updates.length > 0 ? Math.max(...updates.map(u => u.order)) + 1 : 1;
    const newPost: UpdatePost = {
      ...post,
      id: `u_${Date.now()}`,
      order: newOrder
    };
    saveUpdates([...updates, newPost]);
  };

  const editUpdatePost = (id: string, updated: Partial<UpdatePost>) => {
    saveUpdates(updates.map(u => u.id === id ? { ...u, ...updated } : u));
  };

  const deleteUpdatePost = (id: string) => {
    saveUpdates(updates.filter(u => u.id !== id));
  };

  const reorderUpdates = (startIndex: number, endIndex: number) => {
    const result = Array.from(updates);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    const updated = result.map((u, idx) => ({ ...u, order: idx + 1 }));
    saveUpdates(updated);
  };

  // Convener Operations
  const updateConvener = (updated: Partial<ConvenerInfo>) => {
    const newConvener = { ...convener, ...updated };
    setConvener(newConvener);
    if (!safeSetItem('fpc_convener', newConvener)) notifySaveFailure('the convener information');
  };

  // Settings Operations
  const updateSettings = (updated: Partial<WebsiteSettings>) => {
    const newSettings = { ...settings, ...updated };
    setSettings(newSettings);
    if (!safeSetItem('fpc_settings', newSettings)) notifySaveFailure('the website settings');
  };

  // Auth Operations
  const login = (username: string, password: string): boolean => {
    let role: UserRole | null = null;
    if (username === 'admin' && password === 'admin123') {
      role = 'admin';
    } else if (username === 'editor' && password === 'editor123') {
      role = 'editor';
    } else if (username === 'viewer' && password === 'viewer123') {
      role = 'viewer';
    }

    if (role) {
      const loggedInUser: User = { username, role, token: `tok_${Date.now()}` };
      setUser(loggedInUser);
      safeSetItem('fpc_user', loggedInUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fpc_user');
  };

  return (
    <ClubContext.Provider value={{
      members,
      events,
      gallery,
      alumni,
      updates,
      convener,
      settings,
      user,
      addMember,
      editMember,
      deleteMember,
      reorderMembers,
      addEvent,
      editEvent,
      deleteEvent,
      reorderEvents,
      addGalleryItem,
      editGalleryItem,
      deleteGalleryItem,
      reorderGallery,
      addAlumni,
      editAlumni,
      deleteAlumni,
      reorderAlumni,
      addUpdatePost,
      editUpdatePost,
      deleteUpdatePost,
      reorderUpdates,
      updateConvener,
      updateSettings,
      login,
      logout
    }}>
      {children}
    </ClubContext.Provider>
  );
};
