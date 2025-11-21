'use server';

/**
 * @fileOverview An AI agent to generate custom marketing templates.
 *
 * - generateTemplate - A function that generates marketing templates based on context.
 * - GenerateTemplateInput - The input type for the generateTemplate function.
 * - GenerateTemplateOutput - The return type for the generateTemplate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTemplateInputSchema = z.object({
  templateType: z
    .string()
    .describe(
      'The type of template to generate (e.g., Reply, Brief, Content, Ad Copy).'
    ),
  context: z.string().describe('The specific context or situation for the template.'),
});
export type GenerateTemplateInput = z.infer<typeof GenerateTemplateInputSchema>;

const GenerateTemplateOutputSchema = z.object({
  templateContent: z
    .string()
    .describe('The generated marketing template content.'),
});
export type GenerateTemplateOutput = z.infer<typeof GenerateTemplateOutputSchema>;

export async function generateTemplate(
  input: GenerateTemplateInput
): Promise<GenerateTemplateOutput> {
  return generateTemplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTemplatePrompt',
  input: {schema: GenerateTemplateInputSchema},
  output: {schema: GenerateTemplateOutputSchema},
  prompt: `You are a marketing expert at XFuse agency.

You will generate a marketing template of type {{templateType}} based on the following context: {{context}}.

The template should be ready to copy and use immediately. It should be professional, empathetic, and solution-oriented.
Use professional Arabic language.
`,
});

const generateTemplateFlow = ai.defineFlow(
  {
    name: 'generateTemplateFlow',
    inputSchema: GenerateTemplateInputSchema,
    outputSchema: GenerateTemplateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {templateContent: output!.templateContent};
  }
);
