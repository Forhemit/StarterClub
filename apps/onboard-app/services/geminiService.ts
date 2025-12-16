import { GoogleGenAI, Type } from "@google/genai";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is missing. AI features will be disabled or mocked.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Categorizes a free-text work description into standard business categories for reporting.
 */
export const categorizeWorkActivity = async (description: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Uncategorized";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Categorize the following work activity into one of these buckets: [Sales, Marketing, Product Development, Admin/Finance, Creative, Networking, Learning]. 
      
      Activity: "${description}"`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING }
          }
        }
      }
    });
    
    const text = response.text;
    if (!text) return "Uncategorized";
    const json = JSON.parse(text);
    return json.category || "Other";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Uncategorized";
  }
};

/**
 * Analyzes an address to see if it *might* be in a CRA target area (Simulated logic + AI extraction).
 */
export const analyzeAddressCompliance = async (address: string): Promise<{ isTargetArea: boolean, reason: string }> => {
  const ai = getAiClient();
  if (!ai) return { isTargetArea: false, reason: "AI Unavailable" };

  try {
    // Note: In a real app, this would query a Geocoding API + FFIEC database.
    // Here we use Gemini to extract the Zip and simulate a "knowledge" check or just format the address.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this address: "${address}". 
      1. Extract the Zip Code.
      2. Based on general knowledge, is this typically a dense urban or mixed-income area? (This is a simulation for a demo).
      Return JSON.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            zipCode: { type: Type.STRING },
            isUrbanOrMixed: { type: Type.BOOLEAN },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return { isTargetArea: false, reason: "Unknown" };
    const json = JSON.parse(text);
    return {
      isTargetArea: json.isUrbanOrMixed,
      reason: json.reasoning
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { isTargetArea: false, reason: "Error analyzing" };
  }
};

/**
 * Generates a warm welcome script.
 */
export const generateWelcomeScript = async (name: string, intent: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return `Welcome back, ${name}. Let's get you set up for ${intent}.`;
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a short (1 sentence), warm, professional welcome message for a receptionist to say to a club member named ${name} who is here to "${intent}".`,
      });
      return response.text || `Welcome back, ${name}.`;
    } catch (e) {
      return `Welcome back, ${name}.`;
    }
}