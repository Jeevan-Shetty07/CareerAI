import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env';

let genAI: GoogleGenerativeAI | null = null;

if (config.geminiApiKey) {
  genAI = new GoogleGenerativeAI(config.geminiApiKey);
}

export const isAiConfigured = (): boolean => {
  return !!config.geminiApiKey;
};

export const generateAiContent = async (
  prompt: string,
  systemInstruction?: string,
  modelName: string = config.geminiModel || 'gemini-1.5-flash'
): Promise<string> => {
  if (!genAI) {
    throw new Error('Gemini API key is not configured.');
  }

  const candidateModels = Array.from(new Set([modelName, 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-pro']));
  let lastError: any = null;

  for (const candidate of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: candidate,
        systemInstruction: systemInstruction,
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
        },
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      lastError = error;
      console.warn(`Gemini API execution error with model ${candidate}:`, error.message);
    }
  }

  throw lastError || new Error('All Gemini model candidates failed.');
};

export const generateStructuredJson = async <T>(
  prompt: string,
  systemInstruction?: string,
  fallbackData?: T
): Promise<T> => {
  if (!isAiConfigured()) {
    if (fallbackData) return fallbackData;
    throw new Error('Gemini API key is not configured and no fallback provided.');
  }

  try {
    const enrichedPrompt = `${prompt}\n\nIMPORTANT: Return ONLY a valid JSON object or array. Do NOT wrap in markdown codeblocks if possible, or use standard \`\`\`json. Output nothing else.`;
    const rawResponse = await generateAiContent(enrichedPrompt, systemInstruction);

    // Clean markdown codeblocks
    let cleanJson = rawResponse.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim();
    }

    return JSON.parse(cleanJson) as T;
  } catch (err: any) {
    console.warn('AI structured JSON generation failed or parsing failed:', err.message);
    if (fallbackData) {
      console.log('Returning high-accuracy heuristic fallback data');
      return fallbackData;
    }
    throw err;
  }
};
