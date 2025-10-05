import { getAiBreakdown } from '../services/groq.service.js';

import { Parser } from 'json2csv';

export async function handleScriptUpload(req, res) {
  try {
    // Get the script text from the JSON request body
    const { scriptText } = req.body;

    if (!scriptText) {
      return res.status(400).json({ error: 'No script text provided.' });
    }

    // Send the text directly to the AI service
    const breakdownJson = await getAiBreakdown(scriptText);

    return res.status(200).json(breakdownJson);

  } catch (error) {
    console.error('File Upload Pipeline Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}

// The handleCsvDownload function remains the same
export async function handleCsvDownload(req, res) {
    // ... (existing code for this function is correct) ...
}
