import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import breakdownRoutes from './routes/breakdown.routes.js';

// --- Basic Setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());

// allow larger JSON payloads (up to ~10 MB)
app.use(express.json({ limit: '10mb' }));

// if you later upload files, increase urlencoded too
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// This line makes all files in the 'public' folder available to the browser
app.use(express.static(path.join(__dirname, '../public')));

// --- Routes ---

// Main route to serve your index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

// API routes for the breakdown functionality
app.use('/api/breakdown', breakdownRoutes);

// --- Start Server ---
// 🔧 Ensures server always returns JSON for errors
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`✅ Server is listening on http://127.0.0.1:${PORT}`);
});