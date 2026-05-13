export interface ValidationResult {
  valid: boolean;
  error?: string;
  file?: File;
}

export const validateAudioFile = async (file: File): Promise<ValidationResult> => {
  if (!file.name.toLowerCase().endsWith('.wav') && file.type !== 'audio/wav' && file.type !== 'audio/x-wav') {
    return { valid: false, error: 'File must be a .WAV audio format.' };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const buffer = e.target?.result as ArrayBuffer;
      if (!buffer) return resolve({ valid: false, error: 'Could not read file.' });
      
      const view = new DataView(buffer);
      if (view.byteLength < 44) {
          return resolve({ valid: false, error: 'Invalid WAV file header size.' });
      }

      const r = String.fromCharCode(view.getUint8(0));
      const i = String.fromCharCode(view.getUint8(1));
      const f1 = String.fromCharCode(view.getUint8(2));
      const f2 = String.fromCharCode(view.getUint8(3));
      
      if (r !== 'R' || i !== 'I' || f1 !== 'F' || f2 !== 'F') {
         return resolve({ valid: false, error: 'Invalid WAV file header.' });
      }

      try {
        const sampleRate = view.getUint32(24, true);
        const bitDepth = view.getUint16(34, true);

        if (sampleRate !== 44100) {
           return resolve({ valid: false, error: `Invalid sample rate: ${sampleRate}Hz. Must be exactly 44.1kHz.` });
        }

        if (bitDepth !== 16) {
           return resolve({ valid: false, error: `Invalid bit depth: ${bitDepth}-bit. Must be exactly 16-bit.` });
        }

        resolve({ valid: true, file });
      } catch (err) {
        resolve({ valid: false, error: 'Failed to parse WAV header.' });
      }
    };
    reader.onerror = () => resolve({ valid: false, error: 'Error reading audio file.' });
    
    // Read the first 44 bytes which contain the WAV header
    reader.readAsArrayBuffer(file.slice(0, 44));
  });
};

export const validateImageFile = async (file: File): Promise<ValidationResult> => {
  if (!file.name.toLowerCase().endsWith('.jpg') && !file.name.toLowerCase().endsWith('.jpeg') && file.type !== 'image/jpeg') {
    return { valid: false, error: 'Cover art must be a .JPG image format.' };
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      if (img.width !== 3000 || img.height !== 3000) {
         return resolve({ valid: false, error: `Invalid dimensions: ${img.width}x${img.height}px. Must be exactly 3000x3000px.` });
      }
      resolve({ valid: true, file });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ valid: false, error: 'Could not decode image.' });
    };
    img.src = objectUrl;
  });
};
