import React, { useState, useEffect, useRef } from 'react';
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
import { apiGet, apiPost, apiPut, apiDelete, getToken, setToken, clearToken, ApiError } from '../lib/api';

const sortByOrder = <T extends { order: number }>(data: T[]): T[] => [...data].sort((a, b) => a.order - b.order);

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

// Image files that were deleted from the site. Stored (localStorage) data that
// still references them is dropped (gallery) or remapped (events/settings) so
// no broken images are shown after the files were removed.
const REMOVED_IMAGES = new Set([
  '/images/gallery1.jpg',
  '/images/gallery2.jpg',
  '/images/gallery3.jpg',
  '/images/gallery4.jpg',
  '/images/event1.jpg',
  '/images/event2.jpg',
  '/images/event3.jpg',
]);

const REMOVED_IMAGE_FALLBACKS: Record<string, string> = {
  '/images/gallery1.jpg': '/images/contest-1st-namira-islam.jpg',
  '/images/gallery2.jpg': '/images/contest-2nd-tahmid-jashim.jpg',
  '/images/gallery3.jpg': '/images/contest-cat2-jannatul-shormi.jpg',
  '/images/gallery4.jpg': '/images/contest-cat1-mehedi-munna.jpg',
  '/images/event1.jpg': '/images/contest-cat1-faisal-hossain.jpg',
  '/images/event2.jpg': '/images/contest-cat3-kayes-biplob.jpg',
  '/images/event3.jpg': '/images/contest-cat3-nazmul-nadim.jpg',
};

// Deep-swaps any string that equals a removed image path with a fallback.
const remapRemovedImages = (value: unknown): unknown => {
  if (typeof value === 'string') return REMOVED_IMAGE_FALLBACKS[value] ?? value;
  if (Array.isArray(value)) return value.map(remapRemovedImages);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value)) out[key] = remapRemovedImages((value as Record<string, unknown>)[key]);
    return out;
  }
  return value;
};

// Gallery loader: drops saved items pointing at removed files, then merges in
// any missing defaults. Only used as the offline fallback; the backend is the
// source of truth whenever it is reachable.
const loadMergedGallery = (): GalleryItem[] => {
  const stored = loadArray('fpc_gallery', defaultGallery).filter((g) => !(g && typeof g.image === 'string' && REMOVED_IMAGES.has(g.image)));
  const ids = new Set(stored.map((s) => s.id));
  const missing = defaultGallery.filter((f) => !ids.has(f.id));
  return missing.length > 0 ? [...stored, ...missing] : stored;
};

// Events loader: remaps removed cover/image paths to fallbacks, then merges in
// any missing defaults. Only used as the offline fallback.
const loadMergedEvents = (): Event[] => {
  const stored = remapRemovedImages(loadArray('fpc_events', defaultEvents)) as Event[];
  const ids = new Set(stored.map((s) => s.id));
  const missing = defaultEvents.filter((f) => !ids.has(f.id));
  return missing.length > 0 ? [...stored, ...missing] : stored;
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
    return parsed && parsed.siteName ? (remapRemovedImages(parsed) as WebsiteSettings) : defaultSettings;
  } catch {
    return defaultSettings;
  }
};

const loadUser = (): User | null => {
  try {
    // A session is only valid when a real backend token exists. Stale
    // pre-backend logins (fake "tok_..." tokens, no fpc_token key) are ignored.
    if (!localStorage.getItem('fpc_token')) return null;
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
    `Your change to ${label} could not be saved to the server or this browser. ` +
      'Please check that the backend is running.'
  );
};

export const ClubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>(() => loadArray('fpc_members', defaultMembers));
  const [events, setEvents] = useState<Event[]>(() => loadMergedEvents());
  const [gallery, setGallery] = useState<GalleryItem[]>(() => loadMergedGallery());
  const [alumni, setAlumni] = useState<Alumni[]>(() => loadArray('fpc_alumni', defaultAlumni));
  const [updates, setUpdates] = useState<UpdatePost[]>(() => loadArray('fpc_updates', defaultUpdates));
  const [convener, setConvener] = useState<ConvenerInfo>(loadConvener);
  const [settings, setSettings] = useState<WebsiteSettings>(loadSettings);
  const [user, setUser] = useState<User | null>(loadUser);

  // Full-collection save: replaces the server collection; falls back to
  // browser storage only when the backend is unreachable.
  // Saves are chained FIFO so rapid edits apply in order (no lost updates).
  const persistQueueRef = useRef<Promise<void>>(Promise.resolve());

  const enqueuePersist = (task: () => Promise<void>) => {
    persistQueueRef.current = persistQueueRef.current
      .then(() => task())
      .catch((err) => {
        console.error('[FPC] Persist queue error:', err);
      });
  };

  const persistCollection = (endpoint: string, items: unknown[], lsKey: string, label: string) => {
    enqueuePersist(async () => {
      try {
        await apiPost(endpoint, { items });
      } catch (err) {
        console.error(`[FPC] Backend save failed for ${label}; using browser storage.`, err);
        if (!safeSetItem(lsKey, items)) notifySaveFailure(label);
      }
    });
  };

  // Singleton save (convener / settings).
  const persistSingleton = (endpoint: string, value: unknown, lsKey: string, label: string) => {
    enqueuePersist(async () => {
      try {
        await apiPut(endpoint, value);
      } catch (err) {
        console.error(`[FPC] Backend save failed for ${label}; using browser storage.`, err);
        if (!safeSetItem(lsKey, value)) notifySaveFailure(label);
      }
    });
  };

  // Pull the canonical server state on first mount. The backend is the source
  // of truth; any browser-storage data is only a bootstrap for offline use.
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      if (!getToken()) return;
      try {
        const me = await apiGet<{ username: string; role: UserRole }>('/auth/me/');
        if (!cancelled) {
          const restored: User = { username: me.username, role: me.role, token: getToken() ?? '' };
          setUser(restored);
          safeSetItem('fpc_user', restored);
        }
      } catch (err) {
        if (!cancelled && err instanceof ApiError && err.status === 401) {
          clearToken();
          setUser(null);
          localStorage.removeItem('fpc_user');
        }
      }
    };

    const syncFromServer = async () => {
      const results = await Promise.allSettled([
        apiGet<Member[]>('/members/'),
        apiGet<Event[]>('/events/'),
        apiGet<GalleryItem[]>('/gallery/'),
        apiGet<Alumni[]>('/alumni/'),
        apiGet<UpdatePost[]>('/updates/'),
        apiGet<ConvenerInfo>('/convener/'),
        apiGet<WebsiteSettings>('/settings/'),
      ]);
      if (cancelled) return;
      const [membersRes, eventsRes, galleryRes, alumniRes, updatesRes, convenerRes, settingsRes] = results;
      if (membersRes.status === 'fulfilled') setMembers(sortByOrder(membersRes.value));
      if (eventsRes.status === 'fulfilled') setEvents(sortByOrder(eventsRes.value));
      if (galleryRes.status === 'fulfilled') setGallery(sortByOrder(galleryRes.value));
      if (alumniRes.status === 'fulfilled') setAlumni(sortByOrder(alumniRes.value));
      if (updatesRes.status === 'fulfilled') setUpdates(sortByOrder(updatesRes.value));
      if (convenerRes.status === 'fulfilled') setConvener(convenerRes.value);
      if (settingsRes.status === 'fulfilled') setSettings(settingsRes.value);
    };

    restoreSession();
    syncFromServer();

    return () => {
      cancelled = true;
    };
  }, []);

  // Save helpers
  const saveMembers = (data: Member[]) => {
    const sorted = sortByOrder(data);
    setMembers(sorted);
    persistCollection('/members/', sorted, 'fpc_members', 'executive members');
  };

  const saveEvents = (data: Event[]) => {
    const sorted = sortByOrder(data);
    setEvents(sorted);
    persistCollection('/events/', sorted, 'fpc_events', 'timeline events');
  };

  const saveGallery = (data: GalleryItem[]) => {
    const sorted = sortByOrder(data);
    setGallery(sorted);
    persistCollection('/gallery/', sorted, 'fpc_gallery', 'the gallery');
  };

  const saveAlumni = (data: Alumni[]) => {
    const sorted = sortByOrder(data);
    setAlumni(sorted);
    persistCollection('/alumni/', sorted, 'fpc_alumni', 'alumni');
  };

  const saveUpdates = (data: UpdatePost[]) => {
    const sorted = sortByOrder(data);
    setUpdates(sorted);
    persistCollection('/updates/', sorted, 'fpc_updates', 'bulletins');
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
    persistSingleton('/convener/', newConvener, 'fpc_convener', 'the convener information');
  };

  // Settings Operations
  const updateSettings = (updated: Partial<WebsiteSettings>) => {
    const newSettings = { ...settings, ...updated };
    setSettings(newSettings);
    persistSingleton('/settings/', newSettings, 'fpc_settings', 'the website settings');
  };

  // Auth Operations
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await apiPost<{ token: string; username: string; role: UserRole }>('/auth/login/', { username, password });
      setToken(res.token);
      const loggedInUser: User = { username: res.username, role: res.role, token: res.token };
      setUser(loggedInUser);
      safeSetItem('fpc_user', loggedInUser);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    apiDelete('/auth/logout/').catch(() => undefined);
    clearToken();
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
