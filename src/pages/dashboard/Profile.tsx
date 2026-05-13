import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, UserCircle } from 'lucide-react';

export function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    stage_name: '',
    real_name: '',
    bio: '',
    spotify_uri: '',
    instagram: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setFormData({
          stage_name: data.stage_name || '',
          real_name: data.real_name || '',
          bio: data.bio || '',
          spotify_uri: data.spotify_uri || '',
          instagram: data.instagram || '',
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const updates = {
        id: user.id,
        ...formData,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;

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
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-chrome/10">
            <UserCircle className="w-16 h-16 text-neon" />
            <div>
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
            <form onSubmit={handleSave} className="space-y-8 font-sans">
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

              <div className="pt-6 border-t border-chrome/10">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="bg-neon text-obsidian font-black px-8 py-4 uppercase tracking-tighter hover:bg-pure transition-all flex items-center gap-2 disabled:opacity-50"
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
