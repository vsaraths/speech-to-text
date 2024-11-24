import express from 'express';
import cors from 'cors';
import multer from 'multer';
import axios from 'axios';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = 3000;

const ASSEMBLY_AI_API_KEY = 'add3e12d2ea34be18cd45eecd7644fa4';
const ASSEMBLY_AI_BASE_URL = 'https://api.assemblyai.com/v2';

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const response = await axios.post(
      `${ASSEMBLY_AI_BASE_URL}/upload`,
      req.file.buffer,
      {
        headers: {
          'authorization': ASSEMBLY_AI_API_KEY,
          'Transfer-Encoding': 'chunked'
        }
      }
    );

    res.json({ upload_url: response.data.upload_url });
  } catch (error) {
    console.error('Upload error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.post('/transcribe', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'No audio URL provided' });
    }

    const transcriptResponse = await axios.post(
      `${ASSEMBLY_AI_BASE_URL}/transcript`,
      {
        audio_url: url,
        speaker_labels: true,
        auto_chapters: true,
        entity_detection: true,
        auto_highlights: true
      },
      {
        headers: {
          'authorization': ASSEMBLY_AI_API_KEY,
          'content-type': 'application/json'
        }
      }
    );

    const transcriptId = transcriptResponse.data.id;
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      const pollingResponse = await axios.get(
        `${ASSEMBLY_AI_BASE_URL}/transcript/${transcriptId}`,
        {
          headers: { 'authorization': ASSEMBLY_AI_API_KEY }
        }
      );

      const result = pollingResponse.data;

      if (result.status === 'completed') {
        return res.json({
          text: result.text,
          confidence: result.confidence,
          words: result.words,
          speakers: result.speaker_labels,
          chapters: result.chapters,
          entities: result.entities,
          highlights: result.auto_highlights_result,
          status: 'completed'
        });
      } else if (result.status === 'error') {
        return res.status(500).json({ error: 'Transcription failed' });
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    res.status(504).json({ error: 'Transcription timeout' });
  } catch (error) {
    console.error('Transcription error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Transcription failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});