import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Music, Wallet, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { updateProfile } from '../../lib/profile';
import { supabase } from '../../lib/supabase';
import { BrandLogo } from '../../components/BrandLogo';

export function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    stageName: '',
    realName: '',
    bio: '',
    spotifyUri: '',
    instagram: '',
  });

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const completeOnboarding = async () => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await updateProfile(user.id, {
        stage_name: formData.stageName,
        real_name: formData.realName,
        bio: formData.bio,
        spotify_uri: formData.spotifyUri,
        instagram: formData.instagram,
      });

      // Simulate network delay for effect
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Failed to save profile during onboarding:', error);
      setIsSubmitting(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen bg-obsidian text-pure font-sans flex flex-col justify-center items-center p-6 grid-lines">
      <div className="w-full max-w-2xl">
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BrandLogo size="md" />
            <h1 className="text-3xl font-display font-black tracking-tighter uppercase">
              Artist Configuration
            </h1>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`h-2 w-12 transition-all duration-500 ${step >= i ? 'bg-neon shadow-[0_0_10px_rgba(229,255,0,0.5)]' : 'bg-chrome/20'}`} 
              />
            ))}
          </div>
        </div>

        <div className="glass-card p-8 md:p-12 relative overflow-hidden min-h-[480px] flex flex-col">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex-1 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black uppercase text-neon tracking-tighter flex items-center gap-3 mb-2">
                      <Music className="w-6 h-6" /> Identify
                    </h2>
                    <p className="text-chrome text-sm font-sans">Establish your primary broadcast frequency.</p>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-chrome text-xs font-bold uppercase tracking-widest mb-2">Stage Name / Project Name</label>
                      <input 
                        type="text" 
                        value={formData.stageName}
                        onChange={(e) => updateForm('stageName', e.target.value)}
                        className="w-full bg-obsidian/50 border border-chrome/30 text-pure font-sans px-4 py-3 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
                        placeholder="e.g. DATA_GHOST"
                      />
                    </div>
                    <div>
                      <label className="block text-chrome text-xs font-bold uppercase tracking-widest mb-2">Legal Real Name (For Payouts)</label>
                      <input 
                        type="text" 
                        value={formData.realName}
                        onChange={(e) => updateForm('realName', e.target.value)}
                        className="w-full bg-obsidian/50 border border-chrome/30 text-pure font-sans px-4 py-3 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-10">
                  <button onClick={handleNext} className="bg-pure text-obsidian font-black px-8 py-3 uppercase tracking-tighter hover:bg-neon transition-all flex items-center gap-2">
                    Next Phase <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex-1 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black uppercase text-neon tracking-tighter flex items-center gap-3 mb-2">
                      <ShieldCheck className="w-6 h-6" /> Connections
                    </h2>
                    <p className="text-chrome text-sm font-sans">Link your existing network to prevent imposter collisions.</p>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-chrome text-xs font-bold uppercase tracking-widest mb-2">Spotify Artist URI</label>
                      <input 
                        type="text" 
                        value={formData.spotifyUri}
                        onChange={(e) => updateForm('spotifyUri', e.target.value)}
                        className="w-full bg-obsidian/50 border border-chrome/30 text-pure font-sans px-4 py-3 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
                        placeholder="spotify:artist:123456..."
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
                          className="w-full bg-obsidian/50 border border-chrome/30 text-pure font-sans px-4 py-3 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
                          placeholder="bbk_distro"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-10">
                  <button onClick={handleBack} className="border border-chrome text-chrome font-black px-8 py-3 uppercase tracking-tighter hover:border-pure hover:text-pure transition-colors flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Reverse
                  </button>
                  <button onClick={handleNext} className="bg-pure text-obsidian font-black px-8 py-3 uppercase tracking-tighter hover:bg-neon transition-all flex items-center gap-2">
                    Next Phase <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex-1 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black uppercase text-neon tracking-tighter flex items-center gap-3 mb-2">
                      <Wallet className="w-6 h-6" /> The Wallet
                    </h2>
                    <p className="text-chrome text-sm font-sans">You keep 100%. We need to know where to send it.</p>
                  </div>
                  
                  <div className="border border-neon bg-neon/5 p-6 space-y-4">
                    <h3 className="font-bold text-pure uppercase tracking-widest text-sm flex items-center justify-between">
                      Stripe Connect <span className="text-[10px] bg-neon text-obsidian px-2 py-1 rounded">INSTANT PAYOUTS</span>
                    </h3>
                    <p className="text-chrome text-sm leading-relaxed">
                      To receive your royalties seamlessly, you must connect a bank account via Stripe. BBK DISTRO does not store your banking details.
                    </p>
                    <button 
                      onClick={completeOnboarding}
                      disabled={isSubmitting}
                      className="w-full bg-[#635BFF] hover:bg-white hover:text-[#635BFF] text-white font-black px-6 py-4 uppercase tracking-tighter transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Finalizing Profile...
                        </>
                      ) : (
                        'Connect with Stripe'
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-start mt-10">
                  <button onClick={handleBack} className="border border-chrome text-chrome font-black px-8 py-3 uppercase tracking-tighter hover:border-pure hover:text-pure transition-colors flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Reverse
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
