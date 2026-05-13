import { motion } from "motion/react";
import React from "react";
import { Music, Mic2, Tv, Radio } from "lucide-react";

export function DSPTicker() {
  const dspLogos = [
    { name: "Spotify", icon: Music },
    { name: "Apple Music", icon: Radio },
    { name: "TikTok", icon: Tv },
    { name: "Tidal", icon: Mic2 },
  ];

  const items = [...dspLogos, ...dspLogos, ...dspLogos, ...dspLogos]; // Repeat for seamless effect

  return (
    <div className="w-full overflow-hidden bg-obsidian py-8 border-y border-chrome/20">
      <div className="relative flex w-full">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }} // Move halfway to repeat seamlessly
          transition={{
            ease: "linear",
            duration: 20,
            repeat: Infinity,
          }}
        >
          {items.map((dsp, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 px-12 text-chrome opacity-50 hover:opacity-100 hover:text-neon hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(229,255,0,0.5)] transition-all duration-300 cursor-default"
            >
              <dsp.icon className="w-8 h-8" />
              <span className="text-3xl font-display font-black tracking-tighter uppercase">
                {dsp.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
