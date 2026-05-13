import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { AntiGravityWaveform } from "../../components/AntiGravityWaveform";
import { DSPTicker } from "../../components/DSPTicker";
import { ChevronRight, Zap, Globe, ShieldCheck } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-obsidian text-pure font-sans selection:bg-neon selection:text-obsidian">
      {/* Navigation Layer */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-obsidian/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neon flex items-center justify-center font-black text-obsidian">B</div>
            <span className="font-bold tracking-tighter text-2xl italic">BBK DISTRO</span>
          </div>
          <div className="hidden md:flex gap-8 items-center text-xs font-semibold tracking-widest uppercase">
            <a href="#features" className="hover:text-neon transition">Releases</a>
            <a href="#features" className="hover:text-neon transition">Analytics</a>
            <a href="#pricing" className="text-neon hover:text-pure transition">BBK PRO</a>
            <Link to="/auth" className="border border-neon text-neon px-6 py-2 rounded-full hover:bg-neon hover:text-obsidian transition-colors">Sign In</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="relative pt-40 pb-20 px-6 min-h-screen flex items-center overflow-hidden grid-lines">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-neon/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <p className="text-neon font-mono text-sm mb-4 tracking-[0.3em] uppercase">ANTI-GRAVITY V3.1 // MISSION CRITICAL</p>
                <h1 className="text-6xl md:text-8xl font-display font-black leading-[0.85] tracking-tighter uppercase mb-6">
                  DROP TRACKS,<br />NOT <span className="text-neon italic">PERCENTAGES.</span>
                </h1>
              </motion.div>
              
              <motion.p 
                className="text-xl md:text-2xl text-chrome max-w-xl leading-relaxed font-sans"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                The hyper-modern distribution pipeline for independent creators. High fidelity uploads. Zero commission. 100% Artist owned. Forever.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row items-center gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Link to="/auth" className="w-full sm:w-auto bg-neon text-obsidian font-black px-10 py-5 text-xl uppercase tracking-tighter hover:bg-pure transition-all text-center">
                  Distribute Now
                </Link>
                <button className="w-full sm:w-auto border border-pure text-pure font-black px-10 py-5 text-xl uppercase tracking-tighter hover:bg-pure hover:text-obsidian transition-all">
                  Calculate Royalties
                </button>
              </motion.div>
            </div>

            <div className="h-full flex items-center justify-center lg:justify-end">
              <AntiGravityWaveform />
            </div>
          </div>
        </section>

        <DSPTicker />

        {/* The Pipeline Section */}
        <section id="features" className="py-32 px-6 border-b border-chrome/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter uppercase">THE PIPELINE</h2>
              <p className="text-chrome text-lg max-w-2xl mx-auto uppercase tracking-widest text-[10px]">Upload once. Deploy globally. Secure the bag instantly.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Upload", icon: Zap, desc: "Drag, drop, and validate your lossless .WAVs in seconds with our Anti-Gravity architecture." },
                { step: "02", title: "Pitch", icon: Globe, desc: "Direct pipes to Spotify, Apple Music, and 150+ DSPs globally. Built-in playlist pitching." },
                { step: "03", title: "Get Paid", icon: ShieldCheck, desc: "Instant Stripe Connect payouts. No 30-day holds. Royalties hit your wallet immediately." }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  className="glass-card p-8 hover:border-neon/50 transition-colors group relative overflow-hidden"
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute top-0 right-0 p-8 text-8xl font-black text-white/[0.02] -z-10 select-none group-hover:text-neon/[0.05] transition-colors">{feature.step}</div>
                  <feature.icon className="w-12 h-12 text-neon mb-6" />
                  <h3 className="text-2xl font-black tracking-tighter uppercase mb-4">{feature.title}</h3>
                  <p className="text-chrome text-sm leading-relaxed font-sans">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section id="pricing" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
             <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter uppercase">PRICING</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="p-10 glass-card flex flex-col">
                <div className="mb-8">
                  <h3 className="text-3xl font-black tracking-tighter uppercase mb-2">BBK FREE</h3>
                  <div className="text-6xl font-black tracking-tighter mb-4">$0<span className="text-xl text-chrome font-normal tracking-normal">/yr</span></div>
                  <p className="text-chrome font-sans text-sm">Basic distribution. You keep 85%.</p>
                </div>
                <div className="flex-grow space-y-4 mb-8 font-sans">
                  <div className="flex items-center text-sm"><ChevronRight className="w-4 h-4 text-chrome mr-2"/> Default Delivery (5 Days)</div>
                  <div className="flex items-center text-sm"><ChevronRight className="w-4 h-4 text-chrome mr-2"/> 150+ DSPs</div>
                  <div className="flex items-center text-sm"><ChevronRight className="w-4 h-4 text-chrome mr-2"/> Standard Support</div>
                </div>
                <button className="w-full py-5 border border-pure text-pure font-black uppercase tracking-tighter hover:bg-pure hover:text-obsidian transition-colors">Start Free</button>
              </div>

              <div className="p-10 glass-card border-neon bg-neon/10 flex flex-col relative transform md:-translate-y-4">
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-neon text-obsidian px-4 py-1 text-xs font-black uppercase tracking-widest">Recommended</div>
                <div className="mb-8">
                  <h3 className="text-3xl font-black tracking-tighter uppercase mb-2 text-neon">BBK PRO</h3>
                  <div className="text-6xl font-black tracking-tighter mb-4">$19.99<span className="text-xl text-chrome font-normal tracking-normal">/yr</span></div>
                  <p className="text-chrome font-sans text-sm">Zero commission. Pro tools.</p>
                </div>
                <div className="flex-grow space-y-4 mb-8 font-sans">
                  <div className="flex items-center text-sm"><ChevronRight className="w-4 h-4 text-neon mr-2"/> You keep <strong className="text-pure ml-1">100% Royalties</strong></div>
                  <div className="flex items-center text-sm"><ChevronRight className="w-4 h-4 text-neon mr-2"/> <strong className="text-pure mr-1">Fast-Lane</strong> Delivery (24H)</div>
                  <div className="flex items-center text-sm"><ChevronRight className="w-4 h-4 text-neon mr-2"/> Playlist Pitching Access</div>
                  <div className="flex items-center text-sm"><ChevronRight className="w-4 h-4 text-neon mr-2"/> Instant Stripe Payouts</div>
                </div>
                <button className="w-full py-5 bg-neon text-obsidian font-black uppercase tracking-tighter hover:bg-pure transition-all">Go Pro</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-chrome/10 py-12 text-center text-chrome/60 text-sm">
        <div className="mb-4 space-x-6">
          <a href="#" className="hover:text-pure transition">Terms</a>
          <a href="#" className="hover:text-pure transition">Privacy</a>
          <a href="#" className="hover:text-pure transition">Help Center</a>
        </div>
        <p>&copy; {new Date().getFullYear()} BBK DISTRO. All rights reserved.</p>
      </footer>
    </div>
  );
}
