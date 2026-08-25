import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  screenResumeWithGemini,
  generateJobSpecWithGemini,
  recruiterCopilotChat,
  isGeminiConfigured,
} from './src/server/geminiService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Endpoints
app.get('/api/gemini/status', (req, res) => {
  res.json({
    configured: isGeminiConfigured(),
    model: 'gemini-3.7-flash',
  });
});

app.post('/api/gemini/screen-resume', async (req, res) => {
  try {
    const result = await screenResumeWithGemini(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    const rawMsg = String(error?.message || 'Failed to screen resume with Gemini');
    const is503 = rawMsg.includes('503') || rawMsg.toLowerCase().includes('temporarily unavailable') || rawMsg.toLowerCase().includes('overloaded');
    console.error('Error in /api/gemini/screen-resume:', rawMsg);
    res.status(is503 ? 503 : 500).json({
      success: false,
      error: is503 ? 'AI screening service is temporarily unavailable. Please retry.' : rawMsg,
      isRetryable: is503,
    });
  }
});

app.post('/api/gemini/generate-job-spec', async (req, res) => {
  try {
    const result = await generateJobSpecWithGemini(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in /api/gemini/generate-job-spec:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate job spec with Gemini',
    });
  }
});

app.post('/api/gemini/copilot-chat', async (req, res) => {
  try {
    const result = await recruiterCopilotChat(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in /api/gemini/copilot-chat:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate copilot response',
    });
  }
});

// Serve static assets in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`TalentLens AI Server listening on port ${PORT}`);
});
