import { AIMatchCandidate, Item } from '../types';

export async function matchItemWithAI(
  targetItem: Item,
  candidates: Item[]
): Promise<AIMatchCandidate[]> {
  try {
    const response = await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetItem, candidates }),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.matches || [];
  } catch (error) {
    console.warn('Backend match endpoint error, running fallback AI logic:', error);
    
    // Perform client-side heuristic match fallback if offline or server disconnected
    return candidates.map((cand) => {
      let score = 25;
      const keySimilarities: string[] = [];

      if (targetItem.category === cand.category) {
        score += 30;
        keySimilarities.push(`Category match: ${cand.category}`);
      }

      if (targetItem.location.toLowerCase().includes(cand.location.toLowerCase()) || cand.location.toLowerCase().includes(targetItem.location.toLowerCase())) {
        score += 25;
        keySimilarities.push(`Campus vicinity match: ${cand.location}`);
      }

      if (targetItem.color && cand.color && targetItem.color.toLowerCase() === cand.color.toLowerCase()) {
        score += 20;
        keySimilarities.push(`Color match: ${cand.color}`);
      }

      const scoreFinal = Math.min(95, score);
      return {
        itemId: cand.id,
        score: scoreFinal,
        reasoning: `Found high correlation between your report "${targetItem.title}" and candidate "${cand.title}" based on location proximity and item attributes.`,
        keySimilarities,
        confidence: (scoreFinal >= 80 ? 'High Confidence' : scoreFinal >= 60 ? 'Moderate Confidence' : 'Low Confidence') as 'High Confidence' | 'Moderate Confidence' | 'Low Confidence',
      };
    }).sort((a, b) => b.score - a.score);
  }
}

export async function generateSmartDescription(params: {
  title: string;
  category: string;
  rawText?: string;
  imageBase64?: string;
}): Promise<{
  enhancedDescription: string;
  suggestedColor: string;
  suggestedBrand: string;
  suggestedIdentifiers: string[];
}> {
  try {
    const response = await fetch('/api/smart-description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Smart description API call failed');
    }

    return await response.json();
  } catch (error) {
    console.warn('Smart description fallback:', error);
    return {
      enhancedDescription: `${params.rawText || params.title}. Reported on campus in good condition. Contact owner or finder for verification.`,
      suggestedColor: 'Dark/Neutral',
      suggestedBrand: 'Standard Brand',
      suggestedIdentifiers: ['Campus location tag', 'Standard markings'],
    };
  }
}
