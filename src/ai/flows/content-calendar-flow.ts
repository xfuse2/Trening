'use server';

/**
 * @fileOverview Generates a monthly content calendar for social media.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentCalendarInputSchema = z.object({
  businessType: z.string().describe('نوع البيزنس (مطعم، عيادة، متجر، إلخ)'),
  businessName: z.string().describe('اسم البيزنس'),
  platforms: z.array(z.string()).describe('المنصات المستهدفة (Facebook, Instagram, TikTok)'),
  month: z.string().describe('الشهر المطلوب (مثال: يناير 2025)'),
  postsPerWeek: z.number().describe('عدد البوستات في الأسبوع'),
  tone: z.string().optional().describe('نبرة المحتوى (رسمي، ودود، فكاهي)'),
  specialEvents: z.string().optional().describe('مناسبات خاصة في الشهر (عروض، أعياد، إلخ)'),
});
export type ContentCalendarInput = z.infer<typeof ContentCalendarInputSchema>;

const ContentCalendarOutputSchema = z.object({
  calendar: z.string().describe('خطة المحتوى الشهرية'),
  summary: z.string().describe('ملخص الخطة'),
  tips: z.string().describe('نصائح لتحسين الأداء'),
});
export type ContentCalendarOutput = z.infer<typeof ContentCalendarOutputSchema>;

// Helper function to call Gemini directly
async function callGemini(prompt: string): Promise<string> {
  try {
    const response = await ai.generate({
      prompt,
      config: {
        temperature: 0.8,
        maxOutputTokens: 4096,
      },
    });
    return response.text || '';
  } catch (error) {
    console.error('Gemini API Error:', error);
    return '';
  }
}

export async function generateContentCalendar(
  input: ContentCalendarInput
): Promise<ContentCalendarOutput> {
  const { businessType, businessName, platforms, month, postsPerWeek, tone, specialEvents } = input;

  const prompt = `أنت خبير محتوى سوشيال ميديا لشركة XFuse في مصر. مطلوب منك إنشاء خطة محتوى شهرية احترافية.

معلومات البيزنس:
- الاسم: ${businessName}
- النوع: ${businessType}
- المنصات: ${platforms.join('، ')}
- الشهر: ${month}
- عدد البوستات أسبوعياً: ${postsPerWeek}
${tone ? `- نبرة المحتوى: ${tone}` : ''}
${specialEvents ? `- مناسبات خاصة: ${specialEvents}` : ''}

المطلوب:
1. أنشئ جدول محتوى شهري مفصل يتضمن:
   - التاريخ
   - نوع المحتوى (بوست ثابت، ريلز، ستوري، كاروسيل)
   - الموضوع/الفكرة
   - الهدف (تفاعل، مبيعات، وعي، إلخ)
   - أفضل وقت للنشر

2. راعي التنوع في المحتوى:
   - محتوى تعليمي (30%)
   - محتوى ترفيهي/تفاعلي (25%)
   - محتوى ترويجي (25%)
   - محتوى خلف الكواليس/إنساني (20%)

3. اقترح هاشتاجات مناسبة لكل أسبوع

4. أضف أفكار للـ Reels والـ Stories

رد بالتنسيق التالي:
---CALENDAR---
[الجدول التفصيلي هنا]

---SUMMARY---
[ملخص الخطة في 3-4 نقاط]

---TIPS---
[3-5 نصائح لتحسين الأداء]`;

  const result = await callGemini(prompt);

  if (!result) {
    return {
      calendar: 'عذراً، حدث خطأ في توليد خطة المحتوى. يرجى المحاولة مرة أخرى.',
      summary: '',
      tips: '',
    };
  }

  // Parse the response
  const calendarMatch = result.match(/---CALENDAR---([\s\S]*?)(?=---SUMMARY---|$)/);
  const summaryMatch = result.match(/---SUMMARY---([\s\S]*?)(?=---TIPS---|$)/);
  const tipsMatch = result.match(/---TIPS---([\s\S]*?)$/);

  return {
    calendar: calendarMatch?.[1]?.trim() || result,
    summary: summaryMatch?.[1]?.trim() || '',
    tips: tipsMatch?.[1]?.trim() || '',
  };
}
