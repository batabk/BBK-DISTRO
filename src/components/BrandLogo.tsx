import React from 'react';

export function BrandLogo({ size = 'md', showTagline = false }: { size?: 'sm' | 'md' | 'lg', showTagline?: boolean }) {
  const sizes = {
    sm: { container: 'w-8 h-8', main: 'text-lg', distro: 'text-[6px]', tag: 'text-[4px]' },
    md: { container: 'w-12 h-12', main: 'text-2xl', distro: 'text-[8px]', tag: 'text-[5px]' },
    lg: { container: 'w-24 h-24', main: 'text-5xl', distro: 'text-[12px]', tag: 'text-[8px]' }
  };

  const current = sizes[size];

  return (
    <div className={`flex flex-col items-center justify-center bg-obsidian border border-white/5 rounded-xl ${current.container} shadow-2xl`}>
      <div className="flex items-center leading-none tracking-tighter font-black">
        <span className="text-pure">BB</span>
        <span className="text-gold italic ml-px">K</span>
      </div>
      <div className="flex items-center gap-1 w-full px-1">
        <div className="h-[1px] bg-gold flex-1" />
        <span className={`text-gold font-bold tracking-[0.2em] uppercase ${current.distro}`}>Distro</span>
        <div className="h-[1px] bg-gold flex-1" />
      </div>
      {showTagline && (
        <div className={`mt-1 font-bold uppercase tracking-widest ${current.tag}`}>
          <span className="text-pure opacity-80">Your Very Own</span> <span className="text-gold">Distributor</span>
        </div>
      )}
    </div>
  );
}
