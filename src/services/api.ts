import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 300000 // 5 minutes timeout for long-running transcriptions
});

export interface TranscriptionResult {
  text: string;
  confidence: number;
  words: any[];
  speakers?: any[];
  chapters?: any[];
  entities?: any[];
  highlights?: any[];
  status: string;
}

export const uploadAudio = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (!response.data.upload_url) {
      throw new Error('Upload failed: No URL received');
    }
    
    return response.data.upload_url;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Upload failed');
    }
    throw error;
  }
};

export const transcribeAudio = async (url: string): Promise<TranscriptionResult> => {
  try {
    const response = await api.post('/transcribe', { url });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Transcription failed');
    }
    throw error;
  }
};