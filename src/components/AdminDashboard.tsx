import React, { useState, useRef } from 'react';
import { useClub } from '../context/useClub';
import { optimizeImage, stockTemplates } from '../lib/imageOptimizer';
import { 
  Lock, LogOut, Settings, Users, Calendar, Image as ImageIcon, 
  Award, ArrowUp, ArrowDown, Plus, Trash2, Edit2, X, 
  Upload, Sparkles, AlertCircle, Shield, Eye, Megaphone
} from 'lucide-react';
import { Member, Event, GalleryItem, Alumni, UpdatePost } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    members, events, gallery, alumni, updates, convener, settings, user,
    addMember, editMember, deleteMember, reorderMembers,
    addEvent, editEvent, deleteEvent, reorderEvents,
    addGalleryItem, editGalleryItem, deleteGalleryItem, reorderGallery,
    addAlumni, editAlumni, deleteAlumni, reorderAlumni,
    addUpdatePost, editUpdatePost, deleteUpdatePost, reorderUpdates,
    updateConvener, updateSettings, login, logout
  } = useClub();

  // Navigation State
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'events' | 'gallery' | 'alumni' | 'updates'>('overview');

  // Auth Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Editing States
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states
  const [memberForm, setMemberForm] = useState<Omit<Member, 'id' | 'order'>>({
    name: '', position: '', batch: '', email: '', facebook: '', linkedin: '', instagram: '', photo: '', quote: '', bio: ''
  });
  const [eventForm, setEventForm] = useState<Omit<Event, 'id' | 'order'>>({
    title: '', date: '', description: '', coverImage: '', images: [], videoUrl: '', location: '', details: ''
  });
  const [galleryForm, setGalleryForm] = useState<Omit<GalleryItem, 'id' | 'order'>>({
    title: '', category: 'Landscape', image: '', photographer: '', date: '', description: ''
  });
  const [alumniForm, setAlumniForm] = useState<Omit<Alumni, 'id' | 'order'>>({
    name: '', batch: '', currentPosition: '', organization: '', photo: ''
  });
  const [updateForm, setUpdateForm] = useState<Omit<UpdatePost, 'id' | 'order'>>({
    title: '', date: '', category: 'Announcement', image: '', content: ''
  });
  const [convenerForm, setConvenerForm] = useState(convener);
  const [settingsForm, setSettingsForm] = useState(settings);

  // File Upload State
  const [showStockLibrary, setShowStockLibrary] = useState(false);
  const [activeUploadField, setActiveUploadField] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');

  // Edit States
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);

  // Drag and Drop Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const closeForms = () => {
    setIsAddingNew(false);
    setEditingMemberId(null);
    setEditingGalleryId(null);
  };

  const startEditMember = (member: Member) => {
    if (isViewer) return;
    setEditingMemberId(member.id);
    setEditingGalleryId(null);
    setMemberForm({
      name: member.name,
      position: member.position,
      batch: member.batch,
      email: member.email || '',
      facebook: member.facebook || '',
      linkedin: member.linkedin || '',
      instagram: member.instagram || '',
      photo: member.photo,
      quote: member.quote || '',
      bio: member.bio || ''
    });
    setIsAddingNew(true);
  };

  const startEditGallery = (item: GalleryItem) => {
    if (isViewer) return;
    setEditingGalleryId(item.id);
    setEditingMemberId(null);
    setGalleryForm({
      title: item.title,
      category: item.category,
      image: item.image,
      photographer: item.photographer,
      date: item.date,
      description: item.description || ''
    });
    setIsAddingNew(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (!success) {
      setAuthError('Invalid credentials. Hint: admin/Fpc@admin2026, editor/Fpc@editor2026');
    } else {
      setAuthError('');
      setConvenerForm(convener);
      setSettingsForm(settings);
    }
  };

  const canEdit = user?.role === 'admin' || user?.role === 'editor';
  const canDelete = user?.role === 'admin';
  const isViewer = user?.role === 'viewer';

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isViewer) {
      alert('Viewer role has read-only access.');
      return;
    }

    // Reset the input so selecting the same file again still triggers a change.
    e.target.value = '';

    try {
      const base64 = await optimizeImage(file, 800, 800, 0.55);
      updateFormImage(targetField, base64);
      setUploadError('');
    } catch (err) {
      console.error(err);
      setUploadError('Image upload failed. Please try another file.');
    }
  };

  const selectStockImage = (url: string) => {
    if (activeUploadField) {
      updateFormImage(activeUploadField, url);
    }
    setShowStockLibrary(false);
    setActiveUploadField(null);
  };

  const updateFormImage = (field: string, value: string) => {
    if (field === 'member') setMemberForm(prev => ({ ...prev, photo: value }));
    else if (field === 'eventCover') setEventForm(prev => ({ ...prev, coverImage: value }));
    else if (field === 'gallery') setGalleryForm(prev => ({ ...prev, image: value }));
    else if (field === 'alumni') setAlumniForm(prev => ({ ...prev, photo: value }));
    else if (field === 'update') setUpdateForm(prev => ({ ...prev, image: value }));
    else if (field === 'convener') setConvenerForm(prev => ({ ...prev, photo: value }));
  };

  // Submit Handlers
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    if (editingMemberId) {
      editMember(editingMemberId, memberForm);
      setEditingMemberId(null);
    } else {
      addMember(memberForm);
    }
    setMemberForm({ name: '', position: '', batch: '', email: '', facebook: '', linkedin: '', instagram: '', photo: '', quote: '', bio: '' });
    setIsAddingNew(false);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    addEvent(eventForm);
    setEventForm({ title: '', date: '', description: '', coverImage: '', images: [], videoUrl: '', location: '', details: '' });
    setIsAddingNew(false);
  };

  const handleAddGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    if (editingGalleryId) {
      editGalleryItem(editingGalleryId, galleryForm);
      setEditingGalleryId(null);
    } else {
      addGalleryItem(galleryForm);
    }
    setGalleryForm({ title: '', category: 'Landscape', image: '', photographer: '', date: '', description: '' });
    setIsAddingNew(false);
  };

  const handleAddAlumni = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    addAlumni(alumniForm);
    setAlumniForm({ name: '', batch: '', currentPosition: '', organization: '', photo: '' });
    setIsAddingNew(false);
  };

  const handleAddUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    addUpdatePost(updateForm);
    setUpdateForm({ title: '', date: '', category: 'Announcement', image: '', content: '' });
    setIsAddingNew(false);
  };

  const handleSaveConvener = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    updateConvener(convenerForm);
    alert('Convener information updated successfully!');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.role !== 'admin') {
      alert('Only Administrators can edit Website Settings.');
      return;
    }
    updateSettings(settingsForm);
    alert('Website settings updated successfully!');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none"></div>
        <div className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] bg-burgundy/10 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px]"></div>

        <div className="bg-charcoal-dark border border-white/10 rounded-3xl p-8 md:p-10 w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 rounded-2xl bg-burgundy/20 border border-gold/30 text-gold mb-4">
              <Lock size={28} />
            </div>
            <h1 className="text-2xl md:text-3xl font-playfair font-bold text-white tracking-wide text-center">
              FPC Admin Portal
            </h1>
            <p className="text-xs font-mono text-white/40 uppercase tracking-widest mt-2">
              CSE-UAP Film & Photography Club
            </p>
          </div>

          {authError && (
            <div className="bg-burgundy/20 border border-burgundy/40 text-gold text-xs rounded-xl p-4 mb-6 flex items-start gap-2.5 leading-relaxed">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g., admin, editor, viewer"
                className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-burgundy hover:bg-burgundy-light text-gold border border-gold/30 font-mono text-xs uppercase tracking-widest font-bold py-3.5 rounded-xl transition-[transform,background-color] hover:scale-[1.02] cursor-pointer"
            >
              Authenticate
            </button>
          </form>

          <div className="mt-8 border-t border-white/5 pt-6 text-center">
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest block">
              Demo Credentials:
            </span>
            <div className="grid grid-cols-2 gap-2 mt-3 text-[9px] font-mono text-white/40">
              <div className="bg-white/5 p-2 rounded border border-white/5">
                <span className="text-gold font-bold block">ADMIN</span>
                admin / Fpc@admin2026
              </div>
              <div className="bg-white/5 p-2 rounded border border-white/5">
                <span className="text-gold font-bold block">EDITOR</span>
                editor / Fpc@editor2026
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal text-white flex flex-col md:flex-row relative">
      {showStockLibrary && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-charcoal-dark border border-white/10 rounded-3xl p-6 w-full max-w-xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-playfair font-bold text-gold flex items-center gap-2">
                <Sparkles size={18} />
                Select Premium Stock Asset
              </h3>
              <button 
                onClick={() => { setShowStockLibrary(false); setActiveUploadField(null); }}
                className="p-1.5 rounded-full bg-white/5 text-white/60 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stockTemplates.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => selectStockImage(item.url)}
                  className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer border border-white/5 hover:border-gold/50 transition-colors"
                >
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
                  <span className="absolute bottom-3 left-3 text-xs font-mono text-white font-semibold drop-shadow-md">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={(e) => {
          if (activeUploadField) {
            handleImageUpload(e, activeUploadField);
          }
        }}
        className="hidden"
      />

      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-charcoal-dark border-r border-white/10 p-6 flex flex-col justify-between flex-shrink-0">
        <div>
          <div className="mb-10">
            <span className="text-gold font-mono text-[9px] uppercase tracking-widest block mb-1">
              CONTROL PANEL
            </span>
            <h2 className="text-lg font-playfair font-bold text-white tracking-wide">
              FPC CSE-UAP
            </h2>
            <div className="flex items-center gap-1.5 mt-3 bg-white/5 px-2.5 py-1 rounded-full border border-white/5 w-max">
              <Shield size={10} className="text-gold" />
              <span className="text-[9px] font-mono uppercase tracking-widest text-gold font-bold">
                {user.role} Mode
              </span>
              {isViewer && <Eye size={10} className="text-white/40" />}
            </div>
          </div>

          <nav className="space-y-1 text-sm font-mono uppercase tracking-wider text-xs">
            <button
              onClick={() => { setActiveTab('overview'); closeForms(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === 'overview' ? 'bg-burgundy text-gold border border-gold/20' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Settings size={16} />
              <span>Overview & Settings</span>
            </button>

            <button
              onClick={() => { setActiveTab('members'); closeForms(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === 'members' ? 'bg-burgundy text-gold border border-gold/20' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users size={16} />
              <span>Executives ({members.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('events'); closeForms(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === 'events' ? 'bg-burgundy text-gold border border-gold/20' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Calendar size={16} />
              <span>Timeline ({events.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('updates'); closeForms(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === 'updates' ? 'bg-burgundy text-gold border border-gold/20' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Megaphone size={16} />
              <span>Bulletins ({updates.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('gallery'); closeForms(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === 'gallery' ? 'bg-burgundy text-gold border border-gold/20' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <ImageIcon size={16} />
              <span>Gallery ({gallery.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('alumni'); closeForms(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === 'alumni' ? 'bg-burgundy text-gold border border-gold/20' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Award size={16} />
              <span>Alumni ({alumni.length})</span>
            </button>
          </nav>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 flex flex-col gap-3">
          <div className="text-[10px] font-mono text-white/40">
            Authenticated as: <span className="text-white font-bold">{user.username}</span>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-white/60 hover:bg-burgundy hover:text-gold hover:border-gold/30 text-xs font-mono uppercase tracking-widest font-bold transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen">
        {isViewer && (
          <div className="mb-6 bg-white/5 border border-white/10 text-white/60 rounded-2xl p-4 flex items-center gap-3 text-xs font-mono leading-relaxed">
            <Eye size={16} className="text-gold" />
            <span>You are logged in as a <strong>Viewer</strong>. You can browse and review all configurations, but changes and uploads are disabled.</span>
          </div>
        )}

        {uploadError && (
          <div className="mb-6 bg-burgundy/20 border border-burgundy/40 text-gold text-xs rounded-xl p-4 flex items-center gap-2.5 leading-relaxed">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* OVERVIEW & SETTINGS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 max-w-4xl">
            <div>
              <h2 className="text-3xl font-playfair font-bold text-white mb-2">Website Overview</h2>
              <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Global Configurations & Convener Information</p>
            </div>

            <div className="bg-charcoal-dark border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-playfair font-bold text-gold mb-6 border-b border-white/5 pb-3">Convener Showcase</h3>
              <form onSubmit={handleSaveConvener} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Convener Name</label>
                  <input
                    type="text"
                    required
                    value={convenerForm.name}
                    onChange={e => setConvenerForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Designation</label>
                  <input
                    type="text"
                    required
                    value={convenerForm.designation}
                    onChange={e => setConvenerForm(prev => ({ ...prev, designation: e.target.value }))}
                    className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Animated Quote</label>
                  <textarea
                    required
                    rows={2}
                    value={convenerForm.quote}
                    onChange={e => setConvenerForm(prev => ({ ...prev, quote: e.target.value }))}
                    className="w-full bg-charcoal border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Welcome Message</label>
                  <textarea
                    required
                    rows={4}
                    value={convenerForm.welcomeMessage}
                    onChange={e => setConvenerForm(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                    className="w-full bg-charcoal border border-white/10 rounded-xl p-4 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={convenerForm.email}
                    onChange={e => setConvenerForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={convenerForm.phone || ''}
                    onChange={e => setConvenerForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Convener Portrait Photo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-20 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-charcoal">
                      {convenerForm.photo ? (
                        <img src={convenerForm.photo} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20"><ImageIcon size={20} /></div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (isViewer) return;
                          setActiveUploadField('convener');
                          fileInputRef.current?.click();
                        }}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono flex items-center gap-2"
                      >
                        <Upload size={12} />
                        Upload Custom File
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (isViewer) return;
                          setActiveUploadField('convener');
                          setShowStockLibrary(true);
                        }}
                        className="px-4 py-2 bg-burgundy/20 hover:bg-burgundy/30 border border-gold/20 text-gold rounded-xl text-xs font-mono flex items-center gap-2"
                      >
                        <Sparkles size={12} />
                        Select Template
                      </button>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isViewer}
                    className="bg-burgundy hover:bg-burgundy-light text-gold border border-gold/30 px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-widest font-bold transition-transform hover:scale-105 cursor-pointer disabled:opacity-50"
                  >
                    Save Convener Details
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-charcoal-dark border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-playfair font-bold text-gold mb-6 border-b border-white/5 pb-3">Website Settings</h3>
              <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Club Name</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.siteName}
                    onChange={e => setSettingsForm(prev => ({ ...prev, siteName: e.target.value }))}
                    className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Tagline</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.tagline}
                    onChange={e => setSettingsForm(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Hero Title</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.heroTitle}
                    onChange={e => setSettingsForm(prev => ({ ...prev, heroTitle: e.target.value }))}
                    className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Hero Subtitle</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.heroSubtitle}
                    onChange={e => setSettingsForm(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                    className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Club Motto</label>
                  <textarea
                    required
                    rows={3}
                    value={settingsForm.motto}
                    onChange={e => setSettingsForm(prev => ({ ...prev, motto: e.target.value }))}
                    className="w-full bg-charcoal border border-white/10 rounded-xl p-4 text-sm focus:outline-none"
                  />
                </div>
                <h4 className="md:col-span-2 text-xs font-mono text-gold uppercase tracking-widest border-b border-white/5 pb-2 mt-4">Contact Info</h4>
                <div>
                  <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={settingsForm.contactEmail}
                    onChange={e => setSettingsForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                    className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.contactPhone}
                    onChange={e => setSettingsForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                    className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Campus Location Address</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.address}
                    onChange={e => setSettingsForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={user.role !== 'admin'}
                    className="bg-burgundy hover:bg-burgundy-light text-gold border border-gold/30 px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-widest font-bold transition-transform hover:scale-105 cursor-pointer disabled:opacity-50"
                  >
                    Save Website Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MEMBERS */}
        {activeTab === 'members' && (
          <div className="space-y-8 max-w-4xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-playfair font-bold text-white mb-2">Executive Members</h2>
                <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Manage executive committee roster and display order</p>
              </div>
              {!isAddingNew && (
                <button
                  onClick={() => setIsAddingNew(true)}
                  disabled={isViewer}
                  className="bg-burgundy hover:bg-burgundy-light text-gold border border-gold/30 px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Plus size={14} />
                  Add New Executive
                </button>
              )}
            </div>

            {isAddingNew && (
              <div className="bg-charcoal-dark border border-gold/20 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3">
                  <h3 className="text-lg font-playfair font-bold text-gold">{editingMemberId ? 'Edit Executive Form' : 'New Executive Form'}</h3>
                  <button onClick={closeForms} className="text-white/60 hover:text-white"><X size={18} /></button>
                </div>
                <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={memberForm.name}
                      onChange={e => setMemberForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Position</label>
                    <input
                      type="text"
                      required
                      value={memberForm.position}
                      onChange={e => setMemberForm(prev => ({ ...prev, position: e.target.value }))}
                      placeholder="e.g., President, Vice President"
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Batch</label>
                    <input
                      type="text"
                      required
                      value={memberForm.batch}
                      onChange={e => setMemberForm(prev => ({ ...prev, batch: e.target.value }))}
                      placeholder="e.g., Batch 52"
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      value={memberForm.email}
                      onChange={e => setMemberForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 flex-shrink-0 bg-charcoal">
                        {memberForm.photo ? (
                          <img src={memberForm.photo} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20"><ImageIcon size={18} /></div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={isViewer}
                          onClick={() => {
                            if (isViewer) return;
                            setActiveUploadField('member');
                            fileInputRef.current?.click();
                          }}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono flex items-center gap-2 disabled:opacity-40"
                        >
                          <Upload size={12} />
                          Upload Custom File
                        </button>
                        <button
                          type="button"
                          disabled={isViewer}
                          onClick={() => {
                            if (isViewer) return;
                            setActiveUploadField('member');
                            setShowStockLibrary(true);
                          }}
                          className="px-4 py-2 bg-burgundy/20 hover:bg-burgundy/30 border border-gold/20 text-gold rounded-xl text-xs font-mono flex items-center gap-2 disabled:opacity-40"
                        >
                          <Sparkles size={12} />
                          Select Template
                        </button>
                        {memberForm.photo && (
                          <button
                            type="button"
                            disabled={isViewer}
                            onClick={() => setMemberForm(prev => ({ ...prev, photo: '' }))}
                            className="px-4 py-2 bg-burgundy/10 hover:bg-burgundy/30 border border-burgundy/30 text-gold rounded-xl text-xs font-mono flex items-center gap-2 disabled:opacity-40"
                          >
                            <X size={12} />
                            Remove Photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Short Quote / Message</label>
                    <textarea
                      rows={2}
                      value={memberForm.quote}
                      onChange={e => setMemberForm(prev => ({ ...prev, quote: e.target.value }))}
                      placeholder="One-line quote shown in the editorial profile card"
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Short Bio</label>
                    <textarea
                      rows={3}
                      value={memberForm.bio}
                      onChange={e => setMemberForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="2-3 sentence biography shown below the quote"
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeForms}
                      className="px-4 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 font-mono text-xs uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-burgundy hover:bg-burgundy-light text-gold border border-gold/30 px-6 py-2.5 rounded-xl font-mono text-xs uppercase tracking-widest font-bold"
                    >
                      {editingMemberId ? 'Save Changes' : 'Add Executive'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-charcoal-dark border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/2 font-mono text-xs uppercase tracking-wider text-white/50">
                    <th className="p-4">Order</th>
                    <th className="p-4">Profile</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Position</th>
                    <th className="p-4">Batch</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {members.map((member, index) => (
                    <tr key={member.id} className="hover:bg-white/2 group">
                      <td className="p-4 font-mono font-bold text-gold">
                        <div className="flex items-center gap-1.5">
                          <span>{index + 1}</span>
                          <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              disabled={index === 0 || isViewer}
                              onClick={() => reorderMembers(index, index - 1)}
                              className="p-0.5 hover:text-white disabled:opacity-30"
                            >
                              <ArrowUp size={10} />
                            </button>
                            <button
                              disabled={index === members.length - 1 || isViewer}
                              onClick={() => reorderMembers(index, index + 1)}
                              className="p-0.5 hover:text-white disabled:opacity-30"
                            >
                              <ArrowDown size={10} />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-charcoal">
                          <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4 font-playfair font-bold text-white">{member.name}</td>
                      <td className="p-4 font-mono text-xs uppercase text-gold">{member.position}</td>
                      <td className="p-4 font-mono text-xs text-white/60">{member.batch}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            disabled={isViewer}
                            onClick={() => startEditMember(member)}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 hover:text-gold transition-colors disabled:opacity-50"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            disabled={!canDelete}
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${member.name}?`)) {
                                deleteMember(member.id);
                              }
                            }}
                            className="p-2 bg-burgundy/10 hover:bg-burgundy/30 text-gold hover:text-white rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EVENTS */}
        {activeTab === 'events' && (
          <div className="space-y-8 max-w-4xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-playfair font-bold text-white mb-2">Cinematic Timeline Events</h2>
                <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Add, edit, delete, and reorder past events on the movie-poster timeline</p>
              </div>
              {!isAddingNew && (
                <button
                  onClick={() => setIsAddingNew(true)}
                  disabled={isViewer}
                  className="bg-burgundy hover:bg-burgundy-light text-gold border border-gold/30 px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Plus size={14} />
                  Add New Event
                </button>
              )}
            </div>

            {isAddingNew && (
              <div className="bg-charcoal-dark border border-gold/20 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3">
                  <h3 className="text-lg font-playfair font-bold text-gold">New Event Form</h3>
                  <button onClick={() => setIsAddingNew(false)} className="text-white/60 hover:text-white"><X size={18} /></button>
                </div>
                <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Event Title</label>
                    <input
                      type="text"
                      required
                      value={eventForm.title}
                      onChange={e => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Date</label>
                    <input
                      type="text"
                      required
                      value={eventForm.date}
                      onChange={e => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                      placeholder="e.g., February 15, 2024"
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Location</label>
                    <input
                      type="text"
                      required
                      value={eventForm.location}
                      onChange={e => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., UAP Plaza & Auditorium"
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Tagline / Short Description</label>
                    <input
                      type="text"
                      required
                      value={eventForm.description}
                      onChange={e => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Detailed Description</label>
                    <textarea
                      required
                      rows={4}
                      value={eventForm.details}
                      onChange={e => setEventForm(prev => ({ ...prev, details: e.target.value }))}
                      className="w-full bg-charcoal border border-white/10 rounded-xl p-4 text-sm focus:outline-none"
                    />
                  </div>
                  {/* Cover Image upload */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Cover Image</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-20 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-charcoal">
                        {eventForm.coverImage ? (
                          <img src={eventForm.coverImage} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20"><ImageIcon size={18} /></div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveUploadField('eventCover');
                            fileInputRef.current?.click();
                          }}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono flex items-center gap-2"
                        >
                          <Upload size={12} />
                          Upload Custom File
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveUploadField('eventCover');
                            setShowStockLibrary(true);
                          }}
                          className="px-4 py-2 bg-burgundy/20 hover:bg-burgundy/30 border border-gold/20 text-gold rounded-xl text-xs font-mono flex items-center gap-2"
                        >
                          <Sparkles size={12} />
                          Select Template
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="px-4 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 font-mono text-xs uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-burgundy hover:bg-burgundy-light text-gold border border-gold/30 px-6 py-2.5 rounded-xl font-mono text-xs uppercase tracking-widest font-bold"
                    >
                      Add Event
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-charcoal-dark border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/2 font-mono text-xs uppercase tracking-wider text-white/50">
                    <th className="p-4">Order</th>
                    <th className="p-4">Cover</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Location</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {events.map((event, index) => (
                    <tr key={event.id} className="hover:bg-white/2 group">
                      <td className="p-4 font-mono font-bold text-gold">
                        <div className="flex items-center gap-1.5">
                          <span>{index + 1}</span>
                          <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              disabled={index === 0 || isViewer}
                              onClick={() => reorderEvents(index, index - 1)}
                              className="p-0.5 hover:text-white disabled:opacity-30"
                            >
                              <ArrowUp size={10} />
                            </button>
                            <button
                              disabled={index === events.length - 1 || isViewer}
                              onClick={() => reorderEvents(index, index + 1)}
                              className="p-0.5 hover:text-white disabled:opacity-30"
                            >
                              <ArrowDown size={10} />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="w-10 h-14 rounded overflow-hidden border border-white/10 bg-charcoal">
                          <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4 font-playfair font-bold text-white">{event.title}</td>
                      <td className="p-4 font-mono text-xs text-gold">{event.date}</td>
                      <td className="p-4 font-mono text-xs text-white/60 truncate max-w-[150px]">{event.location}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            disabled={isViewer}
                            onClick={() => {
                              if (isViewer) return;
                              const newTitle = prompt('Edit Title:', event.title);
                              const newDate = prompt('Edit Date:', event.date);
                              if (newTitle && newDate) {
                                editEvent(event.id, { title: newTitle, date: newDate });
                              }
                            }}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 hover:text-gold transition-colors disabled:opacity-50"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            disabled={!canDelete}
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${event.title}?`)) {
                                deleteEvent(event.id);
                              }
                            }}
                            className="p-2 bg-burgundy/10 hover:bg-burgundy/30 text-gold hover:text-white rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* UPDATES / BULLETINS */}
        {activeTab === 'updates' && (
          <div className="space-y-8 max-w-4xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-playfair font-bold text-white mb-2">Bulletins & Updates</h2>
                <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Manage community updates, achievements, and announcements</p>
              </div>
              {!isAddingNew && (
                <button
                  onClick={() => setIsAddingNew(true)}
                  disabled={isViewer}
                  className="bg-burgundy hover:bg-burgundy-light text-gold border border-gold/30 px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Plus size={14} />
                  Add New Update
                </button>
              )}
            </div>

            {isAddingNew && (
              <div className="bg-charcoal-dark border border-gold/20 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3">
                  <h3 className="text-lg font-playfair font-bold text-gold">New Update Form</h3>
                  <button onClick={() => setIsAddingNew(false)} className="text-white/60 hover:text-white"><X size={18} /></button>
                </div>
                <form onSubmit={handleAddUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Update Title</label>
                    <input
                      type="text"
                      required
                      value={updateForm.title}
                      onChange={e => setUpdateForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Date</label>
                    <input
                      type="text"
                      required
                      value={updateForm.date}
                      onChange={e => setUpdateForm(prev => ({ ...prev, date: e.target.value }))}
                      placeholder="e.g., March 10, 2024"
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Category</label>
                    <select
                      value={updateForm.category}
                      onChange={e => setUpdateForm(prev => ({ ...prev, category: e.target.value as UpdatePost['category'] }))}
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    >
                      <option value="Announcement">Announcement</option>
                      <option value="Achievement">Achievement</option>
                      <option value="Celebration">Celebration</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Bulletin Content</label>
                    <textarea
                      required
                      rows={4}
                      value={updateForm.content}
                      onChange={e => setUpdateForm(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full bg-charcoal border border-white/10 rounded-xl p-4 text-sm focus:outline-none"
                    />
                  </div>

                  {/* Image upload */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Featured Image</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-10 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-charcoal">
                        {updateForm.image ? (
                          <img src={updateForm.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20"><ImageIcon size={18} /></div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveUploadField('update');
                            fileInputRef.current?.click();
                          }}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono flex items-center gap-2"
                        >
                          <Upload size={12} />
                          Upload Custom File
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveUploadField('update');
                            setShowStockLibrary(true);
                          }}
                          className="px-4 py-2 bg-burgundy/20 hover:bg-burgundy/30 border border-gold/20 text-gold rounded-xl text-xs font-mono flex items-center gap-2"
                        >
                          <Sparkles size={12} />
                          Select Template
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeForms}
                      className="px-4 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 font-mono text-xs uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-burgundy hover:bg-burgundy-light text-gold border border-gold/30 px-6 py-2.5 rounded-xl font-mono text-xs uppercase tracking-widest font-bold"
                    >
                      Add Update
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-charcoal-dark border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/2 font-mono text-xs uppercase tracking-wider text-white/50">
                    <th className="p-4">Order</th>
                    <th className="p-4">Image</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Category</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {updates.map((post, index) => (
                    <tr key={post.id} className="hover:bg-white/2 group">
                      <td className="p-4 font-mono font-bold text-gold">
                        <div className="flex items-center gap-1.5">
                          <span>{index + 1}</span>
                          <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              disabled={index === 0 || isViewer}
                              onClick={() => reorderUpdates(index, index - 1)}
                              className="p-0.5 hover:text-white disabled:opacity-30"
                            >
                              <ArrowUp size={10} />
                            </button>
                            <button
                              disabled={index === updates.length - 1 || isViewer}
                              onClick={() => reorderUpdates(index, index + 1)}
                              className="p-0.5 hover:text-white disabled:opacity-30"
                            >
                              <ArrowDown size={10} />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="w-14 h-10 rounded overflow-hidden border border-white/10 bg-charcoal">
                          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4 font-playfair font-bold text-white max-w-[200px] truncate">{post.title}</td>
                      <td className="p-4 font-mono text-xs text-gold">{post.date}</td>
                      <td className="p-4 font-mono text-xs text-white/60">{post.category}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            disabled={isViewer}
                            onClick={() => {
                              if (isViewer) return;
                              const newTitle = prompt('Edit Title:', post.title);
                              if (newTitle) {
                                editUpdatePost(post.id, { title: newTitle });
                              }
                            }}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 hover:text-gold transition-colors disabled:opacity-50"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            disabled={!canDelete}
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete this update?`)) {
                                deleteUpdatePost(post.id);
                              }
                            }}
                            className="p-2 bg-burgundy/10 hover:bg-burgundy/30 text-gold hover:text-white rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* GALLERY */}
        {activeTab === 'gallery' && (
          <div className="space-y-8 max-w-4xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-playfair font-bold text-white mb-2">The Digital Gallery</h2>
                <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Manage curated exhibition photos displayed in the horizontal pinned gallery</p>
              </div>
              {!isAddingNew && (
                <button
                  onClick={() => setIsAddingNew(true)}
                  disabled={isViewer}
                  className="bg-burgundy hover:bg-burgundy-light text-gold border border-gold/30 px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Plus size={14} />
                  Add New Photo
                </button>
              )}
            </div>

            {isAddingNew && (
              <div className="bg-charcoal-dark border border-gold/20 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3">
                  <h3 className="text-lg font-playfair font-bold text-gold">{editingGalleryId ? 'Edit Gallery Photo Form' : 'New Gallery Photo Form'}</h3>
                  <button onClick={closeForms} className="text-white/60 hover:text-white"><X size={18} /></button>
                </div>
                <form onSubmit={handleAddGallery} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Photo Title</label>
                    <input
                      type="text"
                      required
                      value={galleryForm.title}
                      onChange={e => setGalleryForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Category</label>
                    <select
                      value={galleryForm.category}
                      onChange={e => setGalleryForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    >
                      <option value="Landscape">Landscape</option>
                      <option value="Architecture">Architecture</option>
                      <option value="Portrait">Portrait</option>
                      <option value="Nature">Nature</option>
                      <option value="Street">Street</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Photographer Name</label>
                    <input
                      type="text"
                      required
                      value={galleryForm.photographer}
                      onChange={e => setGalleryForm(prev => ({ ...prev, photographer: e.target.value }))}
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Capture Date</label>
                    <input
                      type="text"
                      required
                      value={galleryForm.date}
                      onChange={e => setGalleryForm(prev => ({ ...prev, date: e.target.value }))}
                      placeholder="e.g., January 2024"
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Short Description (Optional)</label>
                    <input
                      type="text"
                      value={galleryForm.description || ''}
                      onChange={e => setGalleryForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Exhibition Image</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-charcoal">
                        {galleryForm.image ? (
                          <img src={galleryForm.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20"><ImageIcon size={18} /></div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={isViewer}
                          onClick={() => {
                            if (isViewer) return;
                            setActiveUploadField('gallery');
                            fileInputRef.current?.click();
                          }}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono flex items-center gap-2 disabled:opacity-40"
                        >
                          <Upload size={12} />
                          Upload Custom File
                        </button>
                        <button
                          type="button"
                          disabled={isViewer}
                          onClick={() => {
                            if (isViewer) return;
                            setActiveUploadField('gallery');
                            setShowStockLibrary(true);
                          }}
                          className="px-4 py-2 bg-burgundy/20 hover:bg-burgundy/30 border border-gold/20 text-gold rounded-xl text-xs font-mono flex items-center gap-2 disabled:opacity-40"
                        >
                          <Sparkles size={12} />
                          Select Template
                        </button>
                        {galleryForm.image && (
                          <button
                            type="button"
                            disabled={isViewer}
                            onClick={() => setGalleryForm(prev => ({ ...prev, image: '' }))}
                            className="px-4 py-2 bg-burgundy/10 hover:bg-burgundy/30 border border-burgundy/30 text-gold rounded-xl text-xs font-mono flex items-center gap-2 disabled:opacity-40"
                          >
                            <X size={12} />
                            Remove Image
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeForms}
                      className="px-4 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 font-mono text-xs uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-burgundy hover:bg-burgundy-light text-gold border border-gold/30 px-6 py-2.5 rounded-xl font-mono text-xs uppercase tracking-widest font-bold"
                    >
                      {editingGalleryId ? 'Save Changes' : 'Add Photo'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-charcoal-dark border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/2 font-mono text-xs uppercase tracking-wider text-white/50">
                    <th className="p-4">Order</th>
                    <th className="p-4">Photo</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Photographer</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {gallery.map((item, index) => (
                    <tr key={item.id} className="hover:bg-white/2 group">
                      <td className="p-4 font-mono font-bold text-gold">
                        <div className="flex items-center gap-1.5">
                          <span>{index + 1}</span>
                          <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              disabled={index === 0 || isViewer}
                              onClick={() => reorderGallery(index, index - 1)}
                              className="p-0.5 hover:text-white disabled:opacity-30"
                            >
                              <ArrowUp size={10} />
                            </button>
                            <button
                              disabled={index === gallery.length - 1 || isViewer}
                              onClick={() => reorderGallery(index, index + 1)}
                              className="p-0.5 hover:text-white disabled:opacity-30"
                            >
                              <ArrowDown size={10} />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="w-14 h-10 rounded overflow-hidden border border-white/10 bg-charcoal">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4 font-playfair font-bold text-white">{item.title}</td>
                      <td className="p-4 font-mono text-xs text-gold">{item.category}</td>
                      <td className="p-4 font-mono text-xs text-white/60">{item.photographer}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            disabled={isViewer}
                            onClick={() => startEditGallery(item)}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 hover:text-gold transition-colors disabled:opacity-50"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            disabled={!canDelete}
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${item.title}?`)) {
                                deleteGalleryItem(item.id);
                              }
                            }}
                            className="p-2 bg-burgundy/10 hover:bg-burgundy/30 text-gold hover:text-white rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ALUMNI */}
        {activeTab === 'alumni' && (
          <div className="space-y-8 max-w-4xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-playfair font-bold text-white mb-2">Alumni Showcase</h2>
                <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Manage notable alumni and their current organizations</p>
              </div>
              {!isAddingNew && (
                <button
                  onClick={() => setIsAddingNew(true)}
                  disabled={isViewer}
                  className="bg-burgundy hover:bg-burgundy-light text-gold border border-gold/30 px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Plus size={14} />
                  Add New Alumni
                </button>
              )}
            </div>

            {isAddingNew && (
              <div className="bg-charcoal-dark border border-gold/20 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3">
                  <h3 className="text-lg font-playfair font-bold text-gold">New Alumni Form</h3>
                  <button onClick={() => setIsAddingNew(false)} className="text-white/60 hover:text-white"><X size={18} /></button>
                </div>
                <form onSubmit={handleAddAlumni} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={alumniForm.name}
                      onChange={e => setAlumniForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Graduating Batch</label>
                    <input
                      type="text"
                      required
                      value={alumniForm.batch}
                      onChange={e => setAlumniForm(prev => ({ ...prev, batch: e.target.value }))}
                      placeholder="e.g., Batch 45"
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Current Position</label>
                    <input
                      type="text"
                      required
                      value={alumniForm.currentPosition}
                      onChange={e => setAlumniForm(prev => ({ ...prev, currentPosition: e.target.value }))}
                      placeholder="e.g., Senior Cinematographer, Software Engineer"
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Organization</label>
                    <input
                      type="text"
                      required
                      value={alumniForm.organization}
                      onChange={e => setAlumniForm(prev => ({ ...prev, organization: e.target.value }))}
                      placeholder="e.g., Red Dot Productions, Google"
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">Alumni Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-charcoal">
                        {alumniForm.photo ? (
                          <img src={alumniForm.photo} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20"><ImageIcon size={18} /></div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveUploadField('alumni');
                            fileInputRef.current?.click();
                          }}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono flex items-center gap-2"
                        >
                          <Upload size={12} />
                          Upload Custom File
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveUploadField('alumni');
                            setShowStockLibrary(true);
                          }}
                          className="px-4 py-2 bg-burgundy/20 hover:bg-burgundy/30 border border-gold/20 text-gold rounded-xl text-xs font-mono flex items-center gap-2"
                        >
                          <Sparkles size={12} />
                          Select Template
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="px-4 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 font-mono text-xs uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-burgundy hover:bg-burgundy-light text-gold border border-gold/30 px-6 py-2.5 rounded-xl font-mono text-xs uppercase tracking-widest font-bold"
                    >
                      Add Alumni
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-charcoal-dark border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/2 font-mono text-xs uppercase tracking-wider text-white/50">
                    <th className="p-4">Order</th>
                    <th className="p-4">Photo</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Batch</th>
                    <th className="p-4">Position / Company</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {alumni.map((item, index) => (
                    <tr key={item.id} className="hover:bg-white/2 group">
                      <td className="p-4 font-mono font-bold text-gold">
                        <div className="flex items-center gap-1.5">
                          <span>{index + 1}</span>
                          <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              disabled={index === 0 || isViewer}
                              onClick={() => reorderAlumni(index, index - 1)}
                              className="p-0.5 hover:text-white disabled:opacity-30"
                            >
                              <ArrowUp size={10} />
                            </button>
                            <button
                              disabled={index === alumni.length - 1 || isViewer}
                              onClick={() => reorderAlumni(index, index + 1)}
                              className="p-0.5 hover:text-white disabled:opacity-30"
                            >
                              <ArrowDown size={10} />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-charcoal">
                          <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4 font-playfair font-bold text-white">{item.name}</td>
                      <td className="p-4 font-mono text-xs text-gold">{item.batch}</td>
                      <td className="p-4 font-mono text-xs text-white/60">
                        <div>{item.currentPosition}</div>
                        <div className="text-white/40 italic">{item.organization}</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            disabled={isViewer}
                            onClick={() => {
                              if (isViewer) return;
                              const newName = prompt('Edit Name:', item.name);
                              const newOrg = prompt('Edit Organization:', item.organization);
                              if (newName && newOrg) {
                                editAlumni(item.id, { name: newName, organization: newOrg });
                              }
                            }}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 hover:text-gold transition-colors disabled:opacity-50"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            disabled={!canDelete}
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${item.name}?`)) {
                                deleteAlumni(item.id);
                              }
                            }}
                            className="p-2 bg-burgundy/10 hover:bg-burgundy/30 text-gold hover:text-white rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
