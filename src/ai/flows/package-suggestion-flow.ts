'use server';

/**
 * @fileOverview An AI agent to suggest custom marketing packages for clients.
 *
 * - suggestPackage - A function that suggests a package based on client details.
 */

import {ai} from '@/ai/genkit';
import {
  PackageSuggestionInputSchema,
  PackageSuggestionOutputSchema,
  type PackageSuggestionInput,
  type PackageSuggestionOutput,
} from './package-suggestion-flow.types';

export async function suggestPackage(input: PackageSuggestionInput): Promise<PackageSuggestionOutput> {
  return packageSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'packageSuggestionPrompt',
  input: {schema: PackageSuggestionInputSchema},
  output: {schema: PackageSuggestionOutputSchema},
  prompt: `You are a senior Account Manager at XFuse, a digital solutions agency in Egypt. Your task is to create a custom package proposal for a new potential client.
You must respond in professional Egyptian Arabic dialect.

XFuse has three main packages as a base:
- Social Media Basic (5,000 EGP): 12 posts, 8 stories, 4 Reels, 2 platforms.
- Ads Pro Performance (8,000 EGP + Spend): Ad management up to 50k spend, 5 campaigns, weekly reports.
- Launch Brand (15,000 EGP): Full branding, video, 10 posts, launch ad campaign.

Client Information:
- Industry: "{{clientIndustry}}"
- Budget: "{{budget}}"
- Main Goal: "{{mainGoal}}"

Based on this information, create a tailored package. You can mix and match services from the base packages or add new ones. The price should be logical and within or slightly above the client's budget if justified.

Your response must be a JSON object with the following structure:
- packageName: A creative name for the package.
- services: A list of services.
- suggestedPrice: The suggested price.
- marketingNote: A brief explanation of why this package is a good fit.
`,
});

const packageSuggestionFlow = ai.defineFlow(
  {
    name: 'packageSuggestionFlow',
    inputSchema: PackageSuggestionInputSchema,
    outputSchema: PackageSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
