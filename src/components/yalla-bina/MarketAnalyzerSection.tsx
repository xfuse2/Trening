"use client";

import React, { useState } from 'react';
import { Sparkles, Search, Lightbulb, Loader2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { analyzeMarket } from '@/app/actions';
import type { MarketAnalyzerOutput } from '@/ai/flows/market-analyzer-flow.types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type AnalysisMode = 'competitor' | 'content_ideas';

export function MarketAnalyzerSection() {
  const [mode, setMode] = useState<AnalysisMode>('competitor');
  const [url, setUrl] = useState('');
  const [field, setField] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MarketAnalyzerOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      if (mode === 'competitor' && url) {
        const response = await analyzeMarket({ type: 'competitor', url });
        setResult(response);
      } else if (mode === 'content_ideas' && field && goal) {
        const response = await analyzeMarket({ type: 'content_ideas', field, goal });
        setResult(response);
      }
    } catch (e) {
      console.error("Market Analysis Error:", e);
      setError("حدث خطأ أثناء التحليل. يرجى التأكد من أن الرابط صحيح أو حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 text-gray-500">
          <Loader2 className="animate-spin h-10 w-10 text-primary mb-4" />
          <p className="font-bold">جاري التحليل...</p>
          <p className="text-sm">يقوم الذكاء الاصطناعي الآن بزيارة الرابط وتكوين رؤى تسويقية...</p>
        </div>
      );
    }

    if (error) {
        return <div className="text-center p-8 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    }

    if (!result) {
      return (
         <div className="text-center p-8 text-gray-400 border-2 border-dashed rounded-lg">
            <Bot size={40} className="mx-auto mb-2" />
            <p>نتائج التحليل ستظهر هنا</p>
         </div>
      );
    }

    if ('toneOfVoice' in result) { // Competitor Analysis Result
      return (
        <div className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold text-primary">نبرة الصوت (Tone of Voice)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{result.toneOfVoice}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold text-primary">أعمدة المحتوى (Content Pillars)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {result.contentPillars.map((pillar, i) => <li key={i}>{pillar}</li>)}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold text-primary">تحليل SWOT مبدئي</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-green-600">نقاط القوة</h4>
                <p>{result.swotAnalysis.strengths}</p>
              </div>
              <div>
                <h4 className="font-semibold text-red-600">نقاط الضعف</h4>
                <p>{result.swotAnalysis.weaknesses}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if ('ideas' in result) { // Content Ideas Result
        return (
            <div className="space-y-3 animate-fade-in">
                {result.ideas.map((idea, i) => (
                    <Card key={i}>
                        <CardHeader className="p-4">
                            <CardTitle className="text-base font-bold text-primary flex items-center gap-2">
                                <Lightbulb size={16} /> {idea.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-sm">{idea.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Sparkles size={18} className="text-primary" /> محلل السوق والمنافسين الذكي
        </h3>
      </div>
      <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 p-6">
        {/* Left Side: Inputs */}
        <div className="space-y-4">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setMode('competitor')}
              className={cn('flex-1 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2', mode === 'competitor' ? 'bg-primary text-primary-foreground shadow' : 'text-gray-600')}
            >
              <Search size={16} /> تحليل منافس
            </button>
            <button
              onClick={() => setMode('content_ideas')}
              className={cn('flex-1 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2', mode === 'content_ideas' ? 'bg-primary text-primary-foreground shadow' : 'text-gray-600')}
            >
              <Lightbulb size={16} /> توليد أفكار محتوى
            </button>
          </div>

          {mode === 'competitor' ? (
            <div className="animate-fade-in">
              <label className="text-sm font-bold text-gray-700">رابط المنافس</label>
              <p className="text-xs text-gray-500 mb-2">أدخل رابط الموقع أو صفحة السوشيال ميديا للمنافس.</p>
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.example.com"
              />
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
                <div>
                    <label className="text-sm font-bold text-gray-700">مجال العميل</label>
                    <p className="text-xs text-gray-500 mb-2">مثال: عيادة تجميل، مطعم، متجر ملابس.</p>
                    <Input
                        type="text"
                        value={field}
                        onChange={(e) => setField(e.target.value)}
                        placeholder="عيادة تجميل"
                    />
                </div>
                 <div>
                    <label className="text-sm font-bold text-gray-700">الهدف التسويقي</label>
                    <p className="text-xs text-gray-500 mb-2">مثال: زيادة الثقة، جذب عملاء جدد، زيادة المبيعات.</p>
                    <Input
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="بناء الثقة مع الجمهور"
                    />
                </div>
            </div>
          )}
          
          <Button onClick={handleAnalyze} disabled={loading} className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold">
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {loading ? 'جاري التحليل...' : 'تحليل'}
          </Button>
        </div>

        {/* Right Side: Results */}
        <div className="bg-gray-50 rounded-xl border p-4 min-h-[300px]">
            {renderResult()}
        </div>
      </div>
    </div>
  );
}
