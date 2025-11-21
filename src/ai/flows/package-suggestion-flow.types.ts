import {z} from 'genkit';

export const PackageSuggestionInputSchema = z.object({
  clientIndustry: z.string().describe("The client's industry (e.g., restaurant, beauty clinic)."),
  budget: z.string().describe("The client's approximate monthly budget (e.g., 5000-7000 EGP)."),
  mainGoal: z.string().describe("The client's main business goal (e.g., increase online orders, build brand awareness)."),
});
export type PackageSuggestionInput = z.infer<typeof PackageSuggestionInputSchema>;

export const PackageSuggestionOutputSchema = z.object({
  packageName: z.string().describe("A creative and suitable name for the suggested package."),
  services: z.array(z.string()).describe("A list of recommended services for this package."),
  suggestedPrice: z.string().describe("A suggested monthly price in EGP."),
  marketingNote: z.string().describe("A short marketing note explaining why this package is suitable for the client."),
});
export type PackageSuggestionOutput = z.infer<typeof PackageSuggestionOutputSchema>;
