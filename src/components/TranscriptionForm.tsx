import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Headphones, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadAudio, transcribeAudio, TranscriptionResult } from '../services/api';

export default function TranscriptionForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(null);

  const handleTranscription = async (file: File) => {
    try {
      setIsLoading(true);
      const audioUrl = await uploadAudio(file);
      const result = await transcribeAudio(audioUrl);
      setTranscription(result);
      toast.success('Transcription completed successfully!');
    } catch (error) {
      console.error('Transcription error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to transcribe audio');
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    await handleTranscription(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.wav', '.mp3', '.m4a']
    },
    maxFiles: 1,
    disabled: isLoading
  });

  return (
    <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-t-4 border-[#fff685]">
      <div className="p-12">
        <h3 className="text-3xl font-bold text-[#0049B7] mb-8">Try It Now</h3>
        <div className="space-y-8">
          <div
            {...getRootProps()}
            className={`border-3 border-dashed border-[#f75990] rounded-2xl p-12 text-center 
              ${isDragActive ? 'bg-white/80' : 'bg-white/50'} 
              hover:bg-white/80 transition-colors duration-300 cursor-pointer group
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <Headphones className="w-16 h-16 text-[#ff1d58] mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
            {isLoading ? (
              <div className="flex items-center justify-center space-x-3">
                <Loader2 className="w-6 h-6 animate-spin text-[#0049B7]" />
                <p className="text-lg text-[#0049B7] font-medium">Processing your audio...</p>
              </div>
            ) : (
              <>
                <p className="text-lg text-[#0049B7] font-medium">
                  {isDragActive
                    ? "Drop your audio file here..."
                    : "Drag and drop your audio file here, or click to browse"}
                </p>
                <p className="text-[#f75990] mt-3">
                  Supports WAV, MP3, and M4A formats
                </p>
              </>
            )}
          </div>

          {transcription && (
            <div className="mt-8 space-y-6">
              <div className="bg-white/80 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-[#0049B7] mb-4">Transcription Result</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{transcription.text}</p>
              </div>
              
              {transcription.speakers && transcription.speakers.length > 0 && (
                <div className="bg-white/80 rounded-xl p-6">
                  <h4 className="text-xl font-semibold text-[#0049B7] mb-4">Speaker Detection</h4>
                  <div className="space-y-2">
                    {transcription.speakers.map((speaker, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="font-medium text-[#f75990]">Speaker {speaker.speaker}:</span>
                        <span className="text-gray-700">{speaker.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  const blob = new Blob([transcription.text], { type: 'text/plain' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'transcription.txt';
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
                className="w-full bg-gradient-to-r from-[#ff1d58] to-[#f75990] text-white py-4 rounded-xl font-semibold hover:from-[#0049B7] hover:to-[#00DDFF] transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
              >
                Download Transcription
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}