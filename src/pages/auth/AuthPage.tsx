import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Zap } from 'lucide-react';

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // On success, redirect to onboarding
        navigate('/onboarding');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-pure font-sans flex items-center justify-center p-6 grid-lines selection:bg-neon selection:text-obsidian">
      <div className="w-full max-w-md relative">
        {/* Glow effect behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-neon/10 blur-[100px] pointer-events-none rounded-full" />
        
        <motion.div 
          className="glass-card p-10 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 justify-center mb-10">
            <div className="w-8 h-8 bg-neon flex items-center justify-center font-black text-obsidian">B</div>
            <span className="font-bold tracking-tighter text-2xl italic">BBK DISTRO</span>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-display font-black tracking-tighter uppercase mb-2 text-center">
              {isSignUp ? 'Initiate Link' : 'System Login'}
            </h1>
            <p className="text-chrome text-center text-sm uppercase tracking-widest">
              {isSignUp ? 'Create your artist account' : 'Access your dashboard'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 mb-6 text-sm font-bold uppercase tracking-wider text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-chrome text-xs font-bold uppercase tracking-widest mb-2">Secure Comms (Email)</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-obsidian/50 border border-chrome/30 text-pure font-sans px-4 py-3 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
                placeholder="artist@undeground.com"
              />
            </div>
            
            <div>
              <label className="block text-chrome text-xs font-bold uppercase tracking-widest mb-2">Access Key (Password)</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-obsidian/50 border border-chrome/30 text-pure font-sans px-4 py-3 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-neon text-obsidian font-black px-10 py-4 text-xl uppercase tracking-tighter hover:bg-pure transition-all flex justify-center items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (isSignUp ? 'Initialize Pipeline' : 'Enter Network')}
              {!loading && <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-sans">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-chrome hover:text-neon transition-colors uppercase tracking-widest text-xs font-bold"
            >
              {isSignUp ? 'Already have access?' : 'Request network access'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
