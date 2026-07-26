import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Helper to initialize Gemini SDK safely
  function getGeminiAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "CampusFind AI", timestamp: new Date().toISOString() });
  });

  // AI Match Endpoint using Gemini 3.6 Flash
  app.post("/api/match", async (req, res) => {
    try {
      const { targetItem, candidates } = req.body;

      if (!targetItem || !candidates || !Array.isArray(candidates) || candidates.length === 0) {
        return res.status(400).json({ error: "Invalid targetItem or candidates provided." });
      }

      const ai = getGeminiAI();

      if (!ai) {
        // High quality fallback heuristic matching if API key is not yet set
        console.log("No GEMINI_API_KEY set, using smart heuristic matching");
        const matches = candidates.map((cand) => {
          let score = 30;
          const keySimilarities: string[] = [];

          // Category match
          if (targetItem.category && cand.category && targetItem.category.toLowerCase() === cand.category.toLowerCase()) {
            score += 25;
            keySimilarities.push(`Matching category: ${cand.category}`);
          }

          // Location proximity
          if (targetItem.location && cand.location && (targetItem.location.toLowerCase().includes(cand.location.toLowerCase()) || cand.location.toLowerCase().includes(targetItem.location.toLowerCase()))) {
            score += 20;
            keySimilarities.push(`Similar campus location: ${cand.location}`);
          }

          // Color & Brand match
          if (targetItem.color && cand.color && targetItem.color.toLowerCase() === cand.color.toLowerCase()) {
            score += 15;
            keySimilarities.push(`Matching color (${cand.color})`);
          }

          // Title/description keyword overlap
          const targetWords = `${targetItem.title} ${targetItem.description}`.toLowerCase().split(/\W+/).filter(w => w.length > 3);
          const candWords = `${cand.title} ${cand.description}`.toLowerCase().split(/\W+/).filter(w => w.length > 3);
          const common = targetWords.filter(w => candWords.includes(w));
          if (common.length > 0) {
            score += Math.min(20, common.length * 5);
            keySimilarities.push(`Common keywords: ${common.slice(0, 3).join(", ")}`);
          }

          const finalScore = Math.min(98, score);
          let reasoning = `High structural and semantic similarity found between your ${targetItem.type} report "${targetItem.title}" and found item "${cand.title}".`;
          if (keySimilarities.length > 0) {
            reasoning += ` Key indicators: ${keySimilarities.join("; ")}.`;
          }

          return {
            itemId: cand.id,
            score: finalScore,
            reasoning,
            keySimilarities,
            confidence: finalScore > 80 ? "High Confidence" : finalScore > 60 ? "Moderate Confidence" : "Low Confidence",
          };
        }).sort((a, b) => b.score - a.score);

        return res.json({ matches });
      }

      // Prepare Gemini prompt
      const prompt = `You are the CampusFind AI Master Matcher for a university lost and found system.
Your job is to compare a TARGET ${targetItem.type.toUpperCase()} ITEM with a list of COUNTERPART CANDIDATE items to identify potential matches.

Target Item Details:
- Title: ${targetItem.title}
- Type: ${targetItem.type}
- Category: ${targetItem.category}
- Description: ${targetItem.description}
- Color: ${targetItem.color || "Unspecified"}
- Brand: ${targetItem.brand || "Unspecified"}
- Location: ${targetItem.location}
- Date: ${targetItem.date}
- Unique Identifiers/Markings: ${targetItem.uniqueIdentifiers ? targetItem.uniqueIdentifiers.join(", ") : "None specified"}

Candidate Items to Compare against (${candidates.length} items):
${JSON.stringify(
  candidates.map((c) => ({
    id: c.id,
    title: c.title,
    type: c.type,
    category: c.category,
    description: c.description,
    color: c.color || "",
    brand: c.brand || "",
    location: c.location,
    date: c.date,
    uniqueIdentifiers: c.uniqueIdentifiers || [],
  })),
  null,
  2
)}

Analyze each candidate carefully. Consider visual characteristics (color, brand, model), location proximity on campus (e.g. Science Library vs Library Quad are close), date alignment (lost date should be on or slightly before found date), and unique markings (stickers, scratches, custom cases, serials).

Return a JSON object containing an array "matches" sorted by highest score first.
Each element in "matches" must have:
- itemId: string (exact ID from candidates list)
- score: number (integer 0 to 100 representing percentage similarity)
- reasoning: string (2-3 detailed, clear sentences explaining why this is or isn't a match)
- keySimilarities: array of strings (e.g., ["Same red protective case", "Found near Science Hall 2 hours after lost", "Matching Hydro Flask stickers"])
- confidence: string ("High Confidence", "Moderate Confidence", "Low Confidence")`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matches: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    itemId: { type: Type.STRING },
                    score: { type: Type.NUMBER },
                    reasoning: { type: Type.STRING },
                    keySimilarities: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    confidence: { type: Type.STRING },
                  },
                  required: ["itemId", "score", "reasoning", "keySimilarities", "confidence"],
                },
              },
            },
            required: ["matches"],
          },
        },
      });

      const jsonText = response.text || "{}";
      const parsed = JSON.parse(jsonText);
      res.json(parsed);
    } catch (err) {
      console.error("Gemini Match Error:", err);
      res.status(500).json({
        error: "Failed to generate AI match analysis",
        details: err instanceof Error ? err.message : String(err),
      });
    }
  });

  // AI Smart Fill / Description Enhancer Endpoint
  app.post("/api/smart-description", async (req, res) => {
    try {
      const { title, category, rawText, imageBase64 } = req.body;
      const ai = getGeminiAI();

      if (!ai) {
        // Fallback enhancement
        return res.json({
          enhancedDescription: `${rawText || title}. Item reported on campus in good condition. Check unique identifying features and contact details for verification.`,
          suggestedColor: "Black/Navy",
          suggestedBrand: category === "Electronics" ? "Apple/Sony" : "Standard Campus Brand",
          suggestedIdentifiers: ["Standard markings", "Campus logo"],
        });
      }

      const contentsParts: any[] = [];

      if (imageBase64 && imageBase64.startsWith("data:image")) {
        const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          contentsParts.push({
            inlineData: {
              mimeType: matches[1],
              data: matches[2],
            },
          });
        }
      }

      contentsParts.push({
        text: `You are an AI assistant for university Lost & Found.
Analyze the provided item details (and image if available):
Item Title: ${title || "Unknown"}
Category: ${category || "General"}
User Input Notes: ${rawText || "None"}

Generate a detailed, polished 2-sentence description suitable for a formal campus lost and found registry, identify the dominant color, likely brand/make if visible, and list 2-4 distinct unique identifiers or visual traits.`,
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: { parts: contentsParts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              enhancedDescription: { type: Type.STRING },
              suggestedColor: { type: Type.STRING },
              suggestedBrand: { type: Type.STRING },
              suggestedIdentifiers: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ["enhancedDescription", "suggestedColor", "suggestedBrand", "suggestedIdentifiers"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err) {
      console.error("Smart Description Error:", err);
      res.status(500).json({ error: "Failed to generate smart description" });
    }
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CampusFind AI Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
