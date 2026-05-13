import React, { useState } from 'react';
import { Music, Zap, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardHome() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [payoutStatus, setPayoutStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInstantPayout = async () => {
    setIsProcessing(true);
    setPayoutStatus('idle');
    setErrorMessage('');

    try {
      // In a real application, you would fetch the user's connectedAccountId from Supabase.
      // Here we assume it's available via a custom hook or context, e.g., useUserProfile().
      const connectedAccountId = 'acct_1234dummy5678'; 
      
      const response = await fetch('/api/payouts/instant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connectedAccountId,
          amount: 5000, // $50.00
          currency: 'usd'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process payout');
      }

      setPayoutStatus('success');
    } catch (err: any) {
      console.error(err);
      setPayoutStatus('error');
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
      
      // Reset status after a few seconds
      setTimeout(() => {
        if (payoutStatus !== 'error') {
           setPayoutStatus('idle');
        }
      }, 5000);
    }
  };

  return (
    <>
      {/* Top Navbar */}
      <header className="h-20 border-b border-chrome/10 bg-obsidian/80 backdrop-blur-md flex items-center justify-between px-10 sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">Dashboard // Overview</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] text-chrome uppercase tracking-widest font-bold">Unwithdrawn Balance</p>
            <p className="text-2xl font-black text-neon">$4,204.99</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="border border-neon text-neon px-6 py-2 rounded-none hover:bg-neon hover:text-obsidian transition-colors font-black uppercase tracking-tighter">
              Withdraw
            </button>
            <button 
              onClick={handleInstantPayout}
              disabled={isProcessing}
              className="bg-neon text-obsidian px-6 py-2 flex items-center gap-2 hover:bg-pure transition-colors font-black uppercase tracking-tighter disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />} 
              Instant Payout
            </button>
          </div>
        </div>
      </header>

      {payoutStatus === 'success' && (
        <div className="bg-neon/10 border-b border-neon text-neon px-10 py-3 flex items-center gap-3 text-sm font-bold uppercase tracking-widest animate-fade-in z-20 sticky top-20">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Instant Payout successful. Funds will appear in your connected account shortly.</span>
        </div>
      )}

      {payoutStatus === 'error' && (
        <div className="bg-red-500/10 border-b border-red-500 text-red-500 px-10 py-3 flex items-center gap-3 text-sm font-bold uppercase tracking-widest animate-fade-in z-20 sticky top-20">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>Error: {errorMessage}</span>
        </div>
      )}

      <div className="p-10 space-y-8 max-w-6xl">
        <div className="glass-card p-8 border-neon relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-8xl font-black text-white/[0.02] -z-10 select-none">PRO</div>
          <h3 className="text-xl font-black uppercase tracking-tighter text-neon mb-2">Welcome to the Network</h3>
          <p className="text-chrome font-sans max-w-xl">
            Your onboarding is complete. You are now authorized to upload and distribute lossless tracks directly to 150+ DSPs globally. Ensure your files meet the strictly required 16-bit/44.1kHz standard.
          </p>
          <Link to="/dashboard/releases/new" className="mt-6 inline-flex bg-pure text-obsidian font-black px-8 py-3 uppercase tracking-tighter hover:bg-neon transition-all items-center gap-2">
            <Music className="w-5 h-5" /> Initialize Release Dropper
          </Link>
        </div>
      </div>
    </>
  );
}
