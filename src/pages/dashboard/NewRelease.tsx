import React, { useState, useEffect } from 'react';
import { ReleaseDropZone } from '../../components/ReleaseDropZone';
import { AntiGravityWaveform } from '../../components/AntiGravityWaveform';
import { Upload, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <>
      <header className="h-20 border-b border-chrome/10 bg-obsidian/80 backdrop-blur-md flex items-center justify-between px-10 sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">Dashboard // New Release</h2>
        </div>
      </header>
      
      <div className="p-10 max-w-4xl space-y-12">
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
