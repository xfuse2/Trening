'use server';

/**
 * @fileOverview An AI agent for market and competitor analysis.
 *
 * - analyzeMarket - A function that performs market analysis based on the provided input.
 */

import {ai} from '@/ai/genkit';
import {
  MarketAnalyzerInputSchema,
  MarketAnalyzerOutputSchema,
  type MarketAnalyzerInput,
  type MarketAnalyzerOutput,
  CompetitorAnalysisInputSchema,
  ContentIdeaInputSchema,
  CompetitorAnalysisOutputSchema,
  ContentIdeaOutputSchema
} from './market-analyzer-flow.types';


export async function analyzeMarket(input: MarketAnalyzerInput): Promise<MarketAnalyzerOutput> {
  return marketAnalyzerFlow(input);
}


const competitorAnalysisPrompt = ai.definePrompt({
    name: 'competitorAnalysisPrompt',
    input: { schema: CompetitorAnalysisInputSchema },
    output: { schema: CompetitorAnalysisOutputSchema },
    prompt: `You are a senior marketing analyst at XFuse. Your task is to analyze a competitor based on their online presence.
Your analysis must be in professional Egyptian Arabic.

Analyze the content from this URL: {{{url}}}

Provide the following:
1.  **Tone of Voice:** Describe their communication style (e.g., formal, friendly, humorous).
2.  **Content Pillars:** Identify the main recurring topics or themes in their content.
3.  **SWOT Analysis:** Briefly identify one key strength and one key weakness based on their public content.
`,
});

const contentIdeaPrompt = ai.definePrompt({
    name: 'contentIdeaPrompt',
    input: { schema: ContentIdeaInputSchema },
    output: { schema: ContentIdeaOutputSchema },
    prompt: `You are a creative strategist at XFuse. Your task is to generate content ideas for a client.
Your ideas must be in professional Egyptian Arabic.

Client's Field: "{{{field}}}"
Marketing Goal: "{{{goal}}}"

Generate 3-5 creative and practical content ideas (for posts or Reels) that fit the client's field and help achieve their marketing goal. For each idea, provide a catchy title and a brief description.
`,
});


const marketAnalyzerFlow = ai.defineFlow(
  {
    name: 'marketAnalyzerFlow',
    inputSchema: MarketAnalyzerInputSchema,
    outputSchema: MarketAnalyzerOutputSchema,
  },
  async (input) => {
    if (input.type === 'competitor') {
      const { output } = await competitorAnalysisPrompt(input);
      if (!output) throw new Error('Failed to get competitor analysis.');
      return output;
    } else if (input.type === 'content_ideas') {
      const { output } = await contentIdeaPrompt(input);
      if (!output) throw new Error('Failed to get content ideas.');
      return output;
    }
    throw new Error('Invalid input type for market analyzer flow.');
  }
);
