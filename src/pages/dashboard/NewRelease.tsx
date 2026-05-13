import React, { useState, useEffect } from 'react';
import { ReleaseDropZone } from '../../components/ReleaseDropZone';
import { AntiGravityWaveform } from '../../components/AntiGravityWaveform';
import { Upload, CheckCircle2, ChevronRight, Loader2, Clock, Globe, AlertTriangle, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

type TrackStatus = 'Uploaded' | 'Processing' | 'Delivered' | 'Failed';

interface TrackSubmission {
  id: string;
  name: string;
  status: TrackStatus;
}

export function NewRelease() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [artFile, setArtFile] = useState<File | null>(null);

  const [title, setTitle] = useState('CYBERPUNK DREAMS');
  const [genre, setGenre] = useState('Electronic');
  const [releaseDate, setReleaseDate] = useState('2026-06-01');

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackSubmissions, setTrackSubmissions] = useState<TrackSubmission[]>([]);
  const [deletingTrackId, setDeletingTrackId] = useState<string | null>(null);

  const confirmDeleteTrack = (id: string) => {
    setDeletingTrackId(id);
  };

  const deleteTrack = () => {
    if (deletingTrackId) {
      setTrackSubmissions(prev => prev.filter(t => t.id !== deletingTrackId));
      setDeletingTrackId(null);
    }
  };

  useEffect(() => {
    if (isSuccess && trackSubmissions.length > 0) {
      // Simulate status updates for each track
      const interval = setInterval(() => {
        setTrackSubmissions(prev => prev.map(track => {
          if (track.status === 'Uploaded') return { ...track, status: 'Processing' };
          if (track.status === 'Processing') {
            // 90% chance to move to Delivered, 10% to Failed for simulation
            const nextStatus: TrackStatus = Math.random() > 0.1 ? 'Delivered' : 'Failed';
            return { ...track, status: nextStatus };
          }
          return track;
        }));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isSuccess, trackSubmissions.length]);

  useEffect(() => {
    if (isUploadingFiles) {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploadingFiles(false);
            return 100;
          }
          return prev + Math.floor(Math.random() * 15) + 5;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isUploadingFiles]);

  const handleFilesAccepted = (audio: File | null, art: File | null) => {
    setAudioFile(audio);
    setArtFile(art);
    if (audio && art) {
      setUploadProgress(0);
      setIsUploadingFiles(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Initialize track submissions
    const newSubmissions: TrackSubmission[] = [
      { id: '1', name: title, status: 'Uploaded' }
    ];
    
    // If we're implying multiple tracks, we can add more mock ones
    if (title.toLowerCase().includes('ep') || title.toLowerCase().includes('album')) {
        newSubmissions.push({ id: '2', name: `${title} (Remix)`, status: 'Uploaded' });
        newSubmissions.push({ id: '3', name: `${title} (Instrumental)`, status: 'Uploaded' });
    }

    setTrackSubmissions(newSubmissions);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  const getStatusIcon = (status: TrackStatus) => {
    switch (status) {
      case 'Uploaded': return <CheckCircle2 className="w-4 h-4 text-neon" />;
      case 'Processing': return <Loader2 className="w-4 h-4 text-chrome animate-spin" />;
      case 'Delivered': return <Globe className="w-4 h-4 text-neon" />;
      case 'Failed': return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: TrackStatus) => {
    switch (status) {
      case 'Uploaded': return 'text-neon';
      case 'Processing': return 'text-chrome';
      case 'Delivered': return 'text-neon';
      case 'Failed': return 'text-red-500';
    }
  };

  const PipelineProgressBar = ({ tracks }: { tracks: TrackSubmission[] }) => {
    if (tracks.length === 0) return null;

    const getStatusWeight = (status: TrackStatus) => {
      switch (status) {
        case 'Delivered': return 100;
        case 'Processing': return 66;
        case 'Uploaded': return 33;
        default: return 0;
      }
    };

    const totalProgress = Math.round(
      tracks.reduce((acc, t) => acc + getStatusWeight(t.status), 0) / (tracks.length || 1)
    );

    return (
      <div className="w-full space-y-4 mb-10">
        <div className="flex justify-between items-end mb-2">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-chrome">Global Status</span>
            <span className="text-2xl font-black italic text-pure tracking-tighter tabular-nums">
              {totalProgress}% <span className="text-[10px] not-italic text-chrome">Deployed</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-neon rounded-full" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-chrome">Online</span>
            </div>
            <div className={`flex items-center gap-1.5 ${totalProgress < 100 ? 'animate-pulse' : ''}`}>
              <div className="w-2 h-2 bg-chrome rounded-full" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-chrome">Syncing</span>
            </div>
          </div>
        </div>

        <div className="h-2 w-full bg-chrome/5 border border-chrome/10 flex overflow-hidden rounded-full">
          {tracks.map((track) => {
            let colorClass = 'bg-chrome/20';
            if (track.status === 'Delivered') colorClass = 'bg-neon shadow-[0_0_15px_rgba(229,255,0,0.4)]';
            if (track.status === 'Processing') colorClass = 'bg-chrome shadow-[0_0_15px_rgba(163,163,163,0.2)] animate-pulse';
            if (track.status === 'Uploaded') colorClass = 'bg-neon/30';
            if (track.status === 'Failed') colorClass = 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]';

            return (
              <motion.div
                key={track.id}
                initial={{ width: 0 }}
                animate={{ width: `${100 / tracks.length}%` }}
                className={`h-full border-r border-obsidian/50 last:border-0 transition-all duration-500 ${colorClass}`}
                title={`${track.name}: ${track.status}`}
              />
            );
          })}
        </div>
        
        <div className="flex justify-between max-w-sm">
           {['Uploaded', 'Processing', 'Delivered', 'Failed'].map((status) => (
             <div key={status} className="flex items-center gap-2">
                <div className={`w-1 h-3 ${
                  status === 'Uploaded' ? 'bg-neon/30' : 
                  status === 'Processing' ? 'bg-chrome' : 
                  status === 'Delivered' ? 'bg-neon' : 'bg-red-500'
                }`} />
                <span className="text-[8px] font-black uppercase tracking-widest text-chrome/60">{status}</span>
             </div>
           ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="h-20 border-b border-chrome/10 bg-obsidian/80 backdrop-blur-md flex items-center justify-between px-10 sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">Dashboard // New Release</h2>
        </div>
      </header>
      
      <div className="p-10 max-w-4xl space-y-12">
         <AnimatePresence>
           {deletingTrackId && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-obsidian/90 backdrop-blur-sm">
               <motion.div 
                 initial={{ scale: 0.9, opacity: 0, y: 20 }}
                 animate={{ scale: 1, opacity: 1, y: 0 }}
                 exit={{ scale: 0.9, opacity: 0, y: 20 }}
                 className="glass-card max-w-md w-full p-8 border-red-500/30 relative overflow-hidden"
               >
                 <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
                 <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                     <AlertTriangle className="w-6 h-6 text-red-500" />
                   </div>
                   <button onClick={() => setDeletingTrackId(null)} className="text-chrome hover:text-pure transition-colors">
                     <X className="w-6 h-6" />
                   </button>
                 </div>
                 <h4 className="text-xl font-black uppercase tracking-tighter mb-2">Authorize Deletion?</h4>
                 <p className="text-chrome text-sm mb-8 leading-relaxed">
                   This will permanently terminate the distribution pipeline for this track. This action is irreversible once confirmed.
                 </p>
                 <div className="flex gap-4">
                   <button 
                     onClick={() => setDeletingTrackId(null)}
                     className="flex-1 py-3 border border-chrome/30 text-chrome font-bold uppercase tracking-widest text-[10px] hover:border-pure hover:text-pure transition-all"
                   >
                     Abort Signal
                   </button>
                   <button 
                     onClick={deleteTrack}
                     className="flex-1 py-3 bg-red-500 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                   >
                     Confirm Deletion
                   </button>
                 </div>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

         {isSuccess ? (
             <div className="glass-card p-12 text-center space-y-6 border-neon">
                 <div className="flex justify-center mb-6">
                     <CheckCircle2 className="w-24 h-24 text-neon" />
                 </div>
                 <h3 className="text-4xl font-display font-black uppercase tracking-tighter text-pure">Drop Confirmed</h3>
                 <p className="text-chrome font-sans leading-relaxed max-w-2xl mx-auto">
                     Your release "{title}" has been successfully transmitted to our distribution network. 
                     It is currently undergoing final processing and will be deployed to all major DSPs on {releaseDate}.
                 </p>

                 <div className="max-w-2xl mx-auto mt-12 bg-obsidian/40 border border-chrome/10 p-8 text-left text-pure">
                      <PipelineProgressBar tracks={trackSubmissions} />
                     <div className="flex items-center gap-2 mb-6 border-b border-chrome/10 pb-4">
                         <Clock className="w-5 h-5 text-chrome" />
                         <h4 className="text-sm font-black uppercase tracking-widest text-pure">Submission Pipeline Status</h4>
                     </div>
                     
                     <div className="space-y-4">
                         {trackSubmissions.map((track) => (
                             <div key={track.id} className="flex items-center justify-between group bg-black/10 p-3 border border-transparent hover:border-chrome/20 transition-all">
                                 <div className="flex items-center gap-4">
                                     <div className="w-8 h-8 bg-chrome/5 flex items-center justify-center border border-chrome/20">
                                         <span className="text-[10px] font-mono text-chrome">{track.id.padStart(2, '0')}</span>
                                     </div>
                                     <span className="text-sm font-bold tracking-tight text-chrome group-hover:text-pure transition-colors">
                                         {track.name}
                                     </span>
                                 </div>
                                 <div className="flex items-center gap-4">
                                     <div className={`flex items-center gap-2 px-3 py-1 border border-chrome/10 bg-black/20 ${getStatusColor(track.status)}`}>
                                         {getStatusIcon(track.status)}
                                         <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                             {track.status}
                                         </span>
                                     </div>
                                     <button 
                                        onClick={() => confirmDeleteTrack(track.id)}
                                        className="p-2 text-chrome hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Delete submission"
                                     >
                                         <Trash2 className="w-4 h-4" />
                                     </button>
                                 </div>
                             </div>
                         ))}
                         {trackSubmissions.length === 0 && (
                             <div className="py-8 text-center border border-dashed border-chrome/20 bg-black/5">
                                 <p className="text-xs text-chrome uppercase tracking-widest font-bold">No active submissions</p>
                             </div>
                         )}
                     </div>
                 </div>

                 <div className="pt-8">
                     <Link to="/dashboard" className="inline-flex bg-pure text-obsidian font-black px-8 py-4 uppercase tracking-tighter hover:bg-neon transition-all items-center gap-2">
                         Return to Dashboard <ChevronRight className="w-5 h-5" />
                     </Link>
                 </div>
             </div>
         ) : (
             <>
                 <div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">Initialize Upload Sequence</h3>
                    <p className="text-chrome font-sans text-sm mb-8">Drop your lossless audio and high-resolution cover art below to begin the distribution pipeline.</p>
                    
                    <ReleaseDropZone 
                        onFilesAccepted={handleFilesAccepted} 
                        isUploading={isUploadingFiles}
                        uploadProgress={uploadProgress}
                    />
                 </div>

                 {audioFile && artFile && !isUploadingFiles && uploadProgress >= 100 && (
                     <form onSubmit={handleSubmit} className="glass-card p-10 font-sans space-y-8 animate-fade-in border-neon relative">
                         <div className="border-b border-chrome/10 pb-6 mb-6 flex justify-between items-end">
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter text-neon mb-1">Metadata Configuration</h3>
                                <p className="text-chrome text-sm uppercase tracking-widest font-bold">Assets securely stored. Configure release details.</p>
                            </div>
                            <div className="flex items-center gap-2 text-neon text-sm font-bold uppercase tracking-widest bg-neon/10 px-3 py-1 border border-neon/30">
                                <CheckCircle2 className="w-4 h-4" /> Files Verified
                            </div>
                         </div>

                         <div className="mb-6 bg-obsidian border border-chrome/20 p-4">
                             <AntiGravityWaveform file={audioFile} barsCount={60} isPlaying={true} />
                         </div>
                         
                         <div className="space-y-6 relative z-10">
                             <div>
                                <label className="block text-chrome text-xs font-bold uppercase tracking-widest mb-2">Track Title</label>
                                <input 
                                   type="text" 
                                   value={title}
                                   onChange={(e) => setTitle(e.target.value)}
                                   required
                                   className="w-full bg-obsidian/50 border border-chrome/30 text-pure px-4 py-3 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors" 
                                   placeholder="e.g. NEON TEARS" 
                                />
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div>
                                     <label className="block text-chrome text-xs font-bold uppercase tracking-widest mb-2">Primary Genre</label>
                                     <select 
                                        value={genre}
                                        onChange={(e) => setGenre(e.target.value)}
                                        required
                                        className="w-full bg-obsidian border border-chrome/30 text-pure px-4 py-3 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors appearance-none"
                                     >
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
                                     <label className="block text-chrome text-xs font-bold uppercase tracking-widest mb-2">Release Date</label>
                                     <input 
                                         type="date" 
                                         value={releaseDate}
                                         onChange={(e) => setReleaseDate(e.target.value)}
                                         required
                                         className="w-full bg-obsidian/50 border border-chrome/30 text-pure px-4 py-3 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors" 
                                     />
                                 </div>
                             </div>
                         </div>

                         <div className="pt-6 border-t border-chrome/10 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="bg-neon text-obsidian font-black px-8 py-4 uppercase tracking-tighter hover:bg-pure transition-all flex items-center gap-2 relative z-10 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Finalizing Metadata...' : 'Submit to DSPs'} 
                                {!isSubmitting && <Upload className="w-5 h-5" />}
                            </button>
                         </div>
                     </form>
                 )}
             </>
         )}
      </div>
    </>
  );
}
