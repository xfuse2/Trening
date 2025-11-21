import {z} from 'genkit';

export const CompetitorAnalysisInputSchema = z.object({
  type: z.literal('competitor'),
  url: z.string().url().describe('The URL of the competitor\'s website or social media page.'),
});

export const ContentIdeaInputSchema = z.object({
  type: z.literal('content_ideas'),
  field: z.string().describe('The client\'s industry or field (e.g., beauty clinic, restaurant).'),
  goal: z.string().describe('The marketing goal for the content (e.g., build trust, increase sales).'),
});

export const MarketAnalyzerInputSchema = z.union([
  CompetitorAnalysisInputSchema,
  ContentIdeaInputSchema,
]);
export type MarketAnalyzerInput = z.infer<typeof MarketAnalyzerInputSchema>;


export const CompetitorAnalysisOutputSchema = z.object({
    toneOfVoice: z.string().describe("Analysis of the competitor's tone of voice."),
    contentPillars: z.array(z.string()).describe('The main content pillars or themes the competitor focuses on.'),
    swotAnalysis: z.object({
      strengths: z.string().describe("The competitor's perceived strengths."),
      weaknesses: z.string().describe("The competitor's perceived weaknesses."),
    }).describe('A brief SWOT analysis based on the public content.'),
});


export const ContentIdeaOutputSchema = z.object({
  ideas: z.array(z.object({
    title: z.string().describe('The suggested title for the content piece.'),
    description: z.string().describe('A brief description of the content idea.'),
  })).describe('A list of 3-5 content ideas.'),
});

export const MarketAnalyzerOutputSchema = z.union([
  CompetitorAnalysisOutputSchema,
  ContentIdeaOutputSchema,
]);
export type MarketAnalyzerOutput = z.infer<typeof MarketAnalyzerOutputSchema>;
