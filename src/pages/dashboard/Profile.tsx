import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { getProfile, updateProfile, ProfileData } from '../../lib/profile';
import { Save, UserCircle, Upload } from 'lucide-react';

export function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState<ProfileData>({
    stage_name: '',
    real_name: '',
    bio: '',
    spotify_uri: '',
    instagram: '',
    genre: '',
    gender: '',
    avatar_url: '',
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const data = await getProfile(user.id);

      if (data) {
        setFormData({
          stage_name: data.stage_name || '',
          real_name: data.real_name || '',
          bio: data.bio || '',
          spotify_uri: data.spotify_uri || '',
          instagram: data.instagram || '',
          genre: data.genre || '',
          gender: data.gender || '',
          avatar_url: data.avatar_url || '',
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (key: keyof ProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await updateProfile(user.id, formData);

      setMessage({ type: 'success', text: 'Profile configuration updated successfully.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Data transmission failed.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Top Navbar */}
      <header className="h-20 border-b border-chrome/10 bg-obsidian/80 backdrop-blur-md flex items-center justify-between px-10 sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">Dashboard // Profile</h2>
        </div>
      </header>

      <div className="p-10 max-w-4xl">
        <div className="glass-card p-10">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-chrome/10">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-chrome/30 group-hover:border-neon transition-colors">
                {formData.avatar_url ? (
                  <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-obsidian flex items-center justify-center">
                    <UserCircle className="w-12 h-12 text-chrome" />
                  </div>
                )}
              </div>
              <div className="md:absolute -bottom-2 -right-2 bg-neon text-obsidian p-2 rounded-full hidden md:block">
                <Upload className="w-3 h-3" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-black uppercase tracking-tighter">Artist Configuration</h3>
              <p className="text-chrome font-sans text-sm">Update your public identity and network connections.</p>
            </div>
          </div>

          {message.text && (
            <div className={`mb-8 p-4 text-sm font-bold tracking-widest uppercase border ${message.type === 'success' ? 'bg-neon/10 border-neon text-neon' : 'bg-red-500/10 border-red-500 text-red-500'}`}>
              {message.text}
            </div>
          )}

          {loading ? (
            <div className="text-chrome animate-pulse font-sans">Decrypting profile data...</div>
          ) : (
            <form onSubmit={handleSave} className="font-sans">
              <div className="space-y-12">
                {/* Section 1: Core Identity */}
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="w-1 h-6 bg-neon"></span>
                    <h4 className="text-sm font-black uppercase tracking-widest text-pure">Core Identity</h4>
                  </div>
                  <div className="space-y-8">
                    <div>
                      <label className="block text-chrome text-xs font-bold uppercase tracking-widest mb-2">Avatar URL</label>
                      <input 
                        type="text" 
                        value={formData.avatar_url}
                        onChange={(e) => updateForm('avatar_url', e.target.value)}
                        className="w-full bg-obsidian/50 border border-chrome/30 text-pure px-4 py-3 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-chrome text-xs font-bold uppercase tracking-widest mb-2">Stage Name</label>
                        <input 
                          type="text" 
                          value={formData.stage_name}
                          onChange={(e) => updateForm('stage_name', e.target.value)}
                          className="w-full bg-obsidian/50 border border-chrome/30 text-pure px-4 py-3 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-chrome text-xs font-bold uppercase tracking-widest mb-2">Legal Real Name</label>
                        <input 
                          type="text" 
                          value={formData.real_name}
                          onChange={(e) => updateForm('real_name', e.target.value)}
                          className="w-full bg-obsidian/50 border border-chrome/30 text-pure px-4 py-3 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-chrome text-xs font-bold uppercase tracking-widest mb-2">Artist Bio</label>
                      <textarea 
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => updateForm('bio', e.target.value)}
                        className="w-full bg-obsidian/50 border border-chrome/30 text-pure px-4 py-3 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors resize-none"
                        placeholder="Drop a transmission about your sound..."
                      />
                    </div>
                  </div>
                </section>

                {/* Section 2: Connectivity */}
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="w-1 h-6 bg-chrome"></span>
                    <h4 className="text-sm font-black uppercase tracking-widest text-pure">Connectivity</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-chrome text-xs font-bold uppercase tracking-widest mb-2">Spotify Artist URI</label>
                      <input 
                        type="text" 
                        value={formData.spotify_uri}
                        onChange={(e) => updateForm('spotify_uri', e.target.value)}
                        className="w-full bg-obsidian/50 border border-chrome/30 text-pure px-4 py-3 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
                        placeholder="spotify:artist:..."
                      />
                    </div>
                    <div>
                      <label className="block text-chrome text-xs font-bold uppercase tracking-widest mb-2">Instagram Handle</label>
                      <div className="flex">
                        <span className="flex items-center justify-center px-4 border border-r-0 border-chrome/30 bg-chrome/10 text-chrome font-bold">@</span>
                        <input 
                          type="text" 
                          value={formData.instagram}
                          onChange={(e) => updateForm('instagram', e.target.value)}
                          className="w-full bg-obsidian/50 border border-chrome/30 text-pure px-4 py-3 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 3: Metadata */}
                <section className="pb-12">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="w-1 h-6 bg-pure/20"></span>
                    <h4 className="text-sm font-black uppercase tracking-widest text-pure">Metadata</h4>
                  </div>
                  <div className="space-y-8">
                    <div>
                      <label className="block text-chrome text-xs font-bold uppercase tracking-widest mb-2">Primary Music Genre</label>
                      <select 
                        value={formData.genre}
                        onChange={(e) => updateForm('genre', e.target.value)}
                        className="w-full bg-obsidian/50 border border-chrome/30 text-pure px-4 py-3 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors appearance-none"
                      >
                        <option value="">Select Primary Genre</option>
                        <option value="Electronic">Electronic</option>
                        <option value="Hip Hop">Hip Hop</option>
                        <option value="Alternative">Alternative</option>
                        <option value="Pop">Pop</option>
                        <option value="Rock">Rock</option>
                        <option value="Jazz">Jazz</option>
                        <option value="RnB">RnB</option>
                        <option value="Classical">Classical</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-chrome text-xs font-bold uppercase tracking-widest mb-2">Artist Gender Identity (Optional)</label>
                      <select 
                        value={formData.gender}
                        onChange={(e) => updateForm('gender', e.target.value)}
                        className="w-full bg-obsidian/50 border border-chrome/30 text-pure px-4 py-3 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors appearance-none"
                      >
                        <option value="">Select Gender Identity</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-Binary">Non-Binary</option>
                        <option value="Agender">Agender</option>
                        <option value="Genderfluid">Genderfluid</option>
                        <option value="Prefer Not to Say">Prefer Not to Say</option>
                      </select>
                      <p className="text-[10px] text-chrome/50 mt-1 uppercase tracking-widest">This information helps us with diversity reporting and curated playlist opportunities.</p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Sticky footer for actions */}
              <div className="sticky bottom-0 -mx-10 px-10 py-6 bg-obsidian/80 backdrop-blur-md border-t border-chrome/10 flex justify-end mt-8">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="bg-neon text-obsidian font-black px-10 py-4 uppercase tracking-tighter hover:bg-pure transition-all flex items-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(57,255,20,0.2)]"
                >
                  {saving ? 'Transmitting...' : 'Save Changes'}
                  {!saving && <Save className="w-5 h-5" />}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
