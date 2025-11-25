import { GoogleGenAI } from "@google/genai";
import { TouristResource, Coordinates } from "../types";

// Helper to safely get the API key
const getApiKey = (): string => {
  const key = process.env.API_KEY || "gemini_api_key";
  if (!key) {
    console.error("API_KEY not found in environment variables.");
    return "";
  }
  return key;
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

const languageNames: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese"
};

export const searchPlacesWithGemini = async (
  query: string,
  location: string,
  lang: string = 'en',
  coords?: Coordinates
): Promise<TouristResource[]> => {
  if (!getApiKey()) return [];

  // If coordinates are provided, we use a more specific prompt to ground the search location
  let locationPrompt = `in or near "${location}"`;
  if (coords && (location === "Current Location" || location === "My Location")) {
    locationPrompt = `near the user's current location (Latitude: ${coords.latitude}, Longitude: ${coords.longitude})`;
  }

  const targetLanguage = languageNames[lang] || "English";

  const prompt = `
    Find top 6 tourist resources for: "${query}" ${locationPrompt}.
    Rank them by positive user sentiment from sources like Google Reviews and TripAdvisor.
    
    You MUST return the result as a valid JSON array. Do not wrap it in markdown code blocks.
    
    The JSON objects in the array must strictly follow this structure:
    {
      "name": "string",
      "category": "string",
      "description": "string",
      "rating": number,
      "reviewSummary": "string",
      "budget": "string",
      "openingHours": "string",
      "address": "string",
      "latitude": number,
      "longitude": number,
      "imageUrl": "string"
    }

    IMPORTANT TRANSLATION RULES: 
    1. Provide the value content (descriptions, category names, budget info, review summaries) in ${targetLanguage}. 
    2. Keep the JSON property keys (name, category, description, rating, reviewSummary, budget, openingHours, address, latitude, longitude, imageUrl) exactly as defined above (in English).
    
    For each place, provide:
    1. Name
    2. Category (e.g., Restaurant, Museum, Park) - Translated
    3. A short, engaging description - Translated
    4. An estimated rating (1-5) based on aggregated reviews.
    5. A "reviewSummary" that specifically mentions pros and cons found in user reviews - Translated.
    6. Estimated budget/price range - Translated (use local currency format if applicable).
    7. Opening hours summary - Translated.
    8. Address.
    9. Latitude and Longitude (number format).
    10. A real, publicly accessible HTTP URL for an image of this specific place. Try to find a direct link to a JPG/PNG from Wikimedia Commons or a similar public domain source. If you cannot find a guaranteed working link, leave this field empty.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        // Enable both Maps (for location data/reviews) and Search (for images/web info)
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
        toolConfig: coords ? {
          retrievalConfig: {
            latLng: {
              latitude: coords.latitude,
              longitude: coords.longitude
            }
          }
        } : undefined,
        // responseMimeType and responseSchema are removed because they are not supported with googleMaps tool
      },
    });

    let text = response.text;
    if (!text) return [];

    // Clean up any potential markdown formatting that might slip through
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    let parsedData: any[] = [];
    try {
      parsedData = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON response", e);
      // Try to extract array if it's buried in text
      const arrayMatch = text.match(/\[.*\]/s);
      if (arrayMatch) {
        try {
          parsedData = JSON.parse(arrayMatch[0]);
        } catch (e2) {
          return [];
        }
      } else {
        return [];
      }
    }

    if (!Array.isArray(parsedData)) {
      return [];
    }

    // Extract grounding chunks to get real map links
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Map data to our type
    const mappedResults: TouristResource[] = parsedData.map((item, index) => {
      
      let mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + " " + location)}`;
      let sourceLinks: { title: string; url: string }[] = [];

      // Attempt to find relevant grounding info
      const relevantChunk = groundingChunks.find(c => 
        c.web?.title?.toLowerCase().includes(item.name.toLowerCase()) || 
        c.web?.uri?.includes(encodeURIComponent(item.name))
      );

      if (relevantChunk?.web?.uri) {
         sourceLinks.push({ title: "Source", url: relevantChunk.web.uri });
      }

      // Determine Image URL
      // Priority 1: Image URL returned by model (if valid)
      // Priority 2: Fallback to Picsum seed
      let imageUrl = item.imageUrl;
      if (!imageUrl || !imageUrl.startsWith('http')) {
        imageUrl = `https://picsum.photos/seed/${encodeURIComponent(item.name)}/600/400`;
      }

      return {
        id: `gemini-${index}-${Date.now()}`,
        name: item.name || "Unknown",
        category: item.category || "General",
        description: item.description || "",
        rating: typeof item.rating === 'number' ? item.rating : 0,
        reviewSummary: item.reviewSummary || "",
        budget: item.budget || "",
        openingHours: item.openingHours || "Check online",
        address: item.address || "",
        latitude: typeof item.latitude === 'number' ? item.latitude : undefined,
        longitude: typeof item.longitude === 'number' ? item.longitude : undefined,
        imageUrl: imageUrl,
        mapLink: mapLink,
        sourceLinks
      };
    });

    return mappedResults;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
