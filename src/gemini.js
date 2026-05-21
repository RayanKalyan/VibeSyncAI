import { GoogleGenAI } from '@google/genai';

// 1. Pull the API key securely out of our .env.local vault
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// 2. Initialize the official Google Gen AI SDK container
const ai = new GoogleGenAI({ apiKey: apiKey });

/**
 * Translates an abstract user mood string into strict mathematical audio attributes.
 * @param {string} userVibe - The raw text entered by the user.
 * @returns {Promise<Object>} Clean JSON configuration for the Spotify API.
 */
export const translateVibeToAudioFeatures = async (userVibe) => {
  
  // High-Level prompt instructions forcing the model to strictly act as an encoder engine
  const systemInstruction = `
    You are an automated music recommendation engine. Your sole job is to translate a user's mood or setting into mathematical Spotify audio features.
    
    You must output ONLY a raw JSON object matching the exact keys below. Do not include any introductory text, markdown brackets like \`\`\`json, or concluding prose.
    
    Valid configuration parameters:
    - seed_genres: Choose an array of EXACTLY 1 to 2 relevant genres from this list: [acoustic, ambient, blues, classical, dance, electronic, hip-hop, indie, jazz, pop, rock, techno].
    - min_energy: Float between 0.0 and 1.0 (intensity/loudness).
    - max_energy: Float between 0.0 and 1.0.
    - target_valence: Float between 0.0 and 1.0 (0.0 is sad/dark, 1.0 is happy/cheerful).
    - min_tempo: Integer representing target BPM.
    - max_tempo: Integer representing target BPM.
  `;

  try {
    // We utilize gemini-2.5-flash as it features sub-second token generation latency
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `User current vibe specification: "${userVibe}"`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3, // Lower temperature makes the model deterministic and adhere strictly to specifications
      }
    });

    // The raw string response back from the AI
    const rawText = response.text.trim();
    
    // Convert the raw string text into a native executable JavaScript Object array
    const parsedAudioFeatures = JSON.parse(rawText);
    return parsedAudioFeatures;

  } catch (error) {
    console.error("Gemini Parsing Engine Interruption:", error);
    throw error;
  }
};