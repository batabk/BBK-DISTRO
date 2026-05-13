import { motion } from "motion/react";
import React, { useState, useRef } from "react";
import { UploadCloud, FileAudio, Image as ImageIcon, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { validateAudioFile, validateImageFile } from "../utils/audioValidation";

export function ReleaseDropZone({ 
  onFilesAccepted,
  isUploading = false,
  uploadProgress = 0
}: { 
  onFilesAccepted?: (audio: File | null, art: File | null) => void;
  isUploading?: boolean;
  uploadProgress?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [artFile, setArtFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUploaded = !!(audioFile || artFile);

  const processFiles = async (files: FileList | File[]) => {
    setError(null);
    let newAudio: File | null = audioFile;
    let newArt: File | null = artFile;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('audio') || file.name.toLowerCase().endsWith('.wav')) {
            const result = await validateAudioFile(file);
            if (!result.valid) {
                 setError(result.error || 'Invalid audio file.');
                 return;
            }
            newAudio = result.file || null;
        } else if (file.type.startsWith('image') || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')) {
            const result = await validateImageFile(file);
            if (!result.valid) {
                 setError(result.error || 'Invalid image file.');
                 return;
            }
            newArt = result.file || null;
        } else {
            setError(`Unsupported file type: ${file.name}`);
            return;
        }
    }
    
    setAudioFile(newAudio);
    setArtFile(newArt);
    if (onFilesAccepted) onFilesAccepted(newAudio, newArt);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovered(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        await processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        await processFiles(e.target.files);
    }
  };

  return (
    <motion.div
      className={cn(
        "relative w-full max-w-2xl mx-auto p-12 glass-card transition-all duration-300 border",
        isHovered
          ? "border-neon neon-glow bg-obsidian/80"
          : isUploading
          ? "border-neon shadow-[0_0_30px_rgba(229,255,0,0.15)] bg-obsidian/60"
          : isUploaded && !error
          ? "border-neon bg-neon/10"
          : "border-chrome/50 hover:border-chrome bg-obsidian/50"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsHovered(true);
      }}
      onDragLeave={() => setIsHovered(false)}
      onDrop={handleDrop}
      whileHover={!error && !isUploading ? { scale: 1.02 } : undefined}
      whileTap={!error && !isUploading ? { scale: 0.98 } : undefined}
    >
      <input 
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept=".wav,.jpg,.jpeg,audio/wav,image/jpeg"
          onChange={handleChange}
      />
      <div className="flex flex-col items-center justify-center space-y-6 text-center w-full min-h-[160px]">
        {isUploading ? (
          <div className="w-full space-y-4 max-w-md mx-auto text-left py-4">
             <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-black uppercase tracking-tighter text-pure flex items-center gap-3">
                    <Loader2 className="w-6 h-6 text-neon animate-spin" />
                    Transmitting to AWS S3...
                </h3>
                <span className="text-neon font-mono font-bold">{Math.min(uploadProgress, 100)}%</span>
             </div>
             <div className="w-full bg-obsidian border border-chrome/20 h-4 overflow-hidden rounded-sm">
                 <div 
                    className="h-full bg-neon transition-all duration-300 ease-out"
                    style={{ width: `${Math.min(uploadProgress, 100)}%` }}
                 />
             </div>
             <div className="text-chrome text-xs font-mono uppercase tracking-widest flex justify-between">
                <span>Processing Assets...</span>
                <span>{Math.min(uploadProgress * 1.5, 150).toFixed(1)} MB/s</span>
             </div>
          </div>
        ) : (
          <>
        <div className="relative">
          <motion.div
            animate={{
              y: isHovered ? -10 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {isUploaded && !error ? (
              <div className="flex space-x-4">
                <FileAudio className={cn("w-16 h-16 transition-colors", audioFile ? 'text-neon' : 'text-chrome/30')} />
                <ImageIcon className={cn("w-16 h-16 transition-colors", artFile ? 'text-neon' : 'text-chrome/30')} />
              </div>
            ) : (
              <UploadCloud
                className={cn(
                  "w-20 h-20 transition-colors",
                  isHovered ? "text-neon" : error ? "text-red-500" : "text-chrome"
                )}
              />
            )}
          </motion.div>
        </div>

        <div>
          <h3 className="text-3xl font-display font-black tracking-tighter uppercase text-pure mb-2">
            {error ? "Transmission Failed" : isUploaded ? "Files Ready for Orbit" : "Drop Audio & Cover Art"}
          </h3>
          {error ? (
              <div className="flex items-center justify-center space-x-2 text-red-500 font-sans text-sm">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{error}</span>
              </div>
          ) : (
              <p className="text-chrome font-sans max-w-sm mx-auto text-sm">
                {isUploaded
                  ? "Your assets look phenomenal. Proceed to configure metadata."
                  : "Strictly 16-bit/44.1kHz .WAV files and 3000x3000px .JPG cover art only."}
              </p>
          )}
        </div>

        {!isUploaded && !error && (
          <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-10 py-4 bg-transparent border border-pure hover:bg-pure hover:text-obsidian transition-colors text-pure font-black tracking-tighter uppercase text-lg"
          >
            Browse Files
          </button>
        )}

        {error && (
          <button 
              onClick={() => setError(null)}
              className="px-8 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-obsidian transition-colors font-bold uppercase tracking-widest text-xs border border-red-500"
          >
             Clear Error & Retry
          </button>
        )}
          </>
        )}
      </div>
    </motion.div>
  );
}
