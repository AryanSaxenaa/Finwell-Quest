// aiService.js
// Service to interact with Google AI (Gemini or Dialogflow) using the provided API key


import axios from 'axios';
// Use process.env or hardcode the key for now (since import from .env doesn't work in JS runtime)
const GOOGLE_API = process.env.GOOGLE_API || 'AIzaSyDFOYqeXedxoZKJMVJ1PMoeFeeLFPylyo8';

// Use the Gemini 2.0 Flash model and v1beta endpoint as per latest documentation
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// If 404 persists, try the v1 endpoint (not v1beta) and/or model name 'models/gemini-pro-vision' for text+image, or 'models/gemini-pro' for text only.
// Example:
// const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

export async function getAIResponse(messages, contextData = {}) {
  try {
    // Compose the prompt with user messages and context
    const prompt = composePrompt(messages, contextData);
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GOOGLE_API}`,
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    // Remove generic mode-preface responses if present
    let aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';
    aiText = aiText.replace(/^Okay,? since you are in (advisor|hype|roast) mode[.,!\s]*/i, '');
    aiText = aiText.replace(/^Since you are in (advisor|hype|roast) mode[.,!\s]*/i, '');
    aiText = aiText.replace(/^You are in (advisor|hype|roast) mode[.,!\s]*/i, '');
    return aiText.trim();
  } catch (error) {
    console.error('AI API error:', error?.response?.data || error);
    return 'Sorry, I could not process your request.';
  }
}

function composePrompt(messages, contextData) {
  // Add system instructions for the AI to act as part of the app
  const systemInstructions = `You are an in-app AI assistant for a personal finance and gamified learning app. Respond concisely, helpfully, and in the selected mode (advisor, hype, roast), but do not preface your answer with statements like 'Okay, since you are in roast mode...' or similar. Do not mention your mode explicitly. Stay in character as a helpful, witty, or motivational financial coach, depending on the mode.`;
  let context = '';
  if (contextData && Object.keys(contextData).length > 0) {
    context = `\nContext:\n${JSON.stringify(contextData, null, 2)}`;
  }
  const chat = messages.map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.text}`).join('\n');
  return `${systemInstructions}\n${chat}${context}`;
}
