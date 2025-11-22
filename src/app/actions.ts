
'use server';

import {
  generateTemplate as runGenerateTemplate,
  type GenerateTemplateInput,
  type GenerateTemplateOutput,
} from '@/ai/flows/ai-template-generator';
import {
  analyzeClientHealth as runAnalyzeClientHealth,
  type ClientHealthInput,
  type ClientHealthOutput,
} from '@/ai/flows/client-health-analysis';
import {
  aiRoleAssistant as runAiRoleAssistant,
  type AiRoleAssistantInput,
  type AiRoleAssistantOutput,
} from '@/ai/flows/ai-role-assistant';
import {
  generateAiReport as runGenerateAiReport,
  type GenerateAiReportInput,
  type GenerateAiReportOutput,
} from '@/ai/flows/performance-evaluation-ai-report';
import {
  interactiveRoleplay as runInteractiveRoleplay,
  type InteractiveRoleplayInput,
  type InteractiveRoleplayOutput,
} from '@/ai/flows/interactive-roleplay-flow';
import {
  analyzeMarket as runAnalyzeMarket
} from '@/ai/flows/market-analyzer-flow';
import type { MarketAnalyzerInput, MarketAnalyzerOutput } from '@/ai/flows/market-analyzer-flow.types';
import {
  suggestPackage as runSuggestPackage,
} from '@/ai/flows/package-suggestion-flow';
import type { PackageSuggestionInput, PackageSuggestionOutput } from '@/ai/flows/package-suggestion-flow.types';
import {
  evaluateRoleplayPerformance as runEvaluateRoleplayPerformance,
} from '@/ai/flows/roleplay-evaluation-flow';
import type { RoleplayEvaluationInput, RoleplayEvaluationOutput } from '@/ai/flows/roleplay-evaluation-flow.types';
import {
  generateContentCalendar as runGenerateContentCalendar,
  type ContentCalendarInput,
  type ContentCalendarOutput,
} from '@/ai/flows/content-calendar-flow';


export async function generateTemplate(
  input: GenerateTemplateInput
): Promise<GenerateTemplateOutput> {
  return await runGenerateTemplate(input);
}

export async function analyzeClientHealth(
  input: ClientHealthInput
): Promise<ClientHealthOutput> {
  return await runAnalyzeClientHealth(input);
}

export async function aiRoleAssistant(
  input: AiRoleAssistantInput
): Promise<AiRoleAssistantOutput> {
  return await runAiRoleAssistant(input);
}

export async function generateAiReport(
  input: GenerateAiReportInput
): Promise<GenerateAiReportOutput> {
  const result = await runGenerateAiReport(input);
  const [aiReport = '', smartGoals = ''] = result.aiReport.split('---');
  return { ...result, aiReport, smartGoals };
}

export async function interactiveRoleplay(
  input: InteractiveRoleplayInput
): Promise<InteractiveRoleplayOutput> {
    const response = await runInteractiveRoleplay(input);

    // The genkit flow is designed to give feedback on every user turn.
    // If there is no user message, it's the start of the conversation, so there's no feedback.
    if (!input.userMessage) {
        return {
            ...response,
            feedback: undefined,
        };
    }
    
    return response;
}

export async function analyzeMarket(
  input: MarketAnalyzerInput
): Promise<MarketAnalyzerOutput> {
  return await runAnalyzeMarket(input);
}

export async function suggestPackage(
  input: PackageSuggestionInput
): Promise<PackageSuggestionOutput> {
  return await runSuggestPackage(input);
}

export async function evaluateRoleplayPerformance(
  input: RoleplayEvaluationInput
): Promise<RoleplayEvaluationOutput> {
  return await runEvaluateRoleplayPerformance(input);
}

export async function generateContentCalendar(
  input: ContentCalendarInput
): Promise<ContentCalendarOutput> {
  return await runGenerateContentCalendar(input);
}
