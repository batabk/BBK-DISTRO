import React, { useState, useEffect } from 'react';
import { BarChart3, Activity, Users, Globe, TrendingUp } from 'lucide-react';

export function Analytics() {
  const [stats, setStats] = useState([
    { label: 'Total Streams', rawValue: 42800000, value: '42.8M', icon: Activity, trend: '+12.5%' },
    { label: 'Unique Listeners', rawValue: 1200000, value: '1.2M', icon: Users, trend: '+8.2%' },
    { label: 'Global Reach', rawValue: 142, value: '142', icon: Globe, trend: '+3.1%' },
    { label: 'Growth Factor', rawValue: 1.4, value: '1.4x', icon: TrendingUp, trend: '+0.4x' },
  ]);

  const [nodes, setNodes] = useState(14.2);

  const formatValue = (label: string, value: number) => {
    if (label === 'Total Streams') return (value / 1000000).toFixed(1) + 'M';
    if (label === 'Unique Listeners') return (value / 1000000).toFixed(1) + 'M';
    if (label === 'Global Reach') return Math.floor(value).toString();
    if (label === 'Growth Factor') return value.toFixed(1) + 'x';
    return value.toString();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => prevStats.map(stat => {
        let increment = 0;
        if (stat.label === 'Total Streams') increment = Math.floor(Math.random() * 5000) + 1000;
        if (stat.label === 'Unique Listeners') increment = Math.floor(Math.random() * 500) + 100;
        if (stat.label === 'Global Reach') increment = Math.random() > 0.95 ? 1 : 0;
        if (stat.label === 'Growth Factor') increment = (Math.random() - 0.4) * 0.01;

        const newRawValue = Math.max(0, stat.rawValue + increment);
        return {
          ...stat,
          rawValue: newRawValue,
          value: formatValue(stat.label, newRawValue)
        };
      }));

      setNodes(prev => prev + (Math.random() - 0.5) * 0.1);
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-10 space-y-8 max-w-6xl">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-chrome/10 pb-8">
        <div>
          <h2 className="text-5xl font-black uppercase tracking-tighter mb-2">Analytics</h2>
          <p className="text-chrome font-sans">Real-time performance metrics and distribution intelligence.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-obsidian border border-chrome/20 px-4 py-2 flex flex-col">
            <span className="text-[10px] text-chrome uppercase font-bold tracking-widest">Active Nodes</span>
            <span className="text-neon font-mono">{nodes.toFixed(1)}k</span>
          </div>
          <div className="bg-obsidian border border-chrome/20 px-4 py-2 flex flex-col">
            <span className="text-[10px] text-chrome uppercase font-bold tracking-widest">Sync Status</span>
            <span className="text-neon font-mono">OPT_ALPHA</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => ( stat &&
          <div key={stat.label} className="glass-card p-6 border-chrome/10 hover:border-neon transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <stat.icon className="w-5 h-5 text-chrome group-hover:text-neon transition-colors" />
              <span className="text-[10px] text-neon font-mono">{stat.trend}</span>
            </div>
            <p className="text-[10px] text-chrome uppercase font-bold tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-pure">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-12 border-chrome/10 bg-obsidian/30 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 bg-neon/10 rounded-full flex items-center justify-center">
          <BarChart3 className="w-10 h-10 text-neon animate-pulse" />
        </div>
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Intelligence Core Offline</h3>
          <p className="text-chrome font-sans max-w-md mx-auto">
            The analytics processing engine is currently undergoing a structural update. 
            Detailed listening data and revenue projections will be available in the next transmission.
          </p>
        </div>
        <div className="pt-4">
          <div className="inline-block border border-chrome/30 px-6 py-2 text-xs font-bold uppercase tracking-widest text-chrome">
            Status: Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
}
