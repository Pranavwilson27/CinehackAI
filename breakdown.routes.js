import express from 'express';
import { handleScriptUpload, handleCsvDownload } from '../controllers/breakdown.controller.js';

const router = express.Router();

// The upload route now simply accepts JSON, no file middleware needed.
router.post('/upload', handleScriptUpload);
router.post('/download-csv', handleCsvDownload);

export default router;