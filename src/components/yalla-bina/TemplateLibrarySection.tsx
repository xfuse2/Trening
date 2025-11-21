"use client";

import React, { useState } from 'react';
import { Sparkles, Copy, Loader2 } from 'lucide-react';
import { templatesData } from '@/lib/data';
import { generateTemplate } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function TemplateLibrarySection() {
  const [mode, setMode] = useState('browse'); // 'browse' or 'generate'
  const [genType, setGenType] = useState('Reply');
  const [genContext, setGenContext] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ بنجاح!",
      description: "النص جاهز للصق.",
    });
  };

  const handleGenerate = async () => {
    if (!genContext.trim()) return;
    setLoading(true);
    setGeneratedContent('');
    try {
      const result = await generateTemplate({
        templateType: genType,
        context: genContext,
      });
      setGeneratedContent(result.templateContent);
    } catch (error) {
      console.error("Template Generation Error:", error);
      setGeneratedContent("حدث خطأ أثناء توليد النموذج.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex bg-white rounded-lg border border-gray-200 p-1 mb-6 w-fit">
        <button
          onClick={() => setMode('browse')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'browse' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          تصفح المكتبة
        </button>
        <button
          onClick={() => setMode('generate')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mode === 'generate' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Sparkles size={14} /> المولد الذكي (AI)
        </button>
      </div>

      {mode === 'browse' ? (
        <div className="grid md:grid-cols-2 gap-4 animate-fade-in">
          {templatesData.map((tpl, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md mb-1 inline-block">{tpl.category}</span>
                  <h4 className="font-bold text-gray-800">{tpl.title}</h4>
                </div>
                <Button onClick={() => copyToClipboard(tpl.content)} variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-primary">
                  <Copy size={18} />
                </Button>
              </div>
              <div className="bg-gray-50 p-3 rounded text-sm text-gray-600 whitespace-pre-wrap border border-gray-100 h-32 overflow-y-auto">
                {tpl.content}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-fade-in">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">نوع النموذج</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Reply (رد عملاء)', 'Brief (بريف)', 'Content (بوست)', 'Ad Copy (إعلان)'].map(t => (
                    <Button
                      key={t}
                      onClick={() => setGenType(t.split(' ')[0])}
                      variant={genType === t.split(' ')[0] ? 'default' : 'outline'}
                      className="text-xs h-auto py-2"
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">وصف الموقف / السياق</label>
                <Textarea
                  value={genContext}
                  onChange={(e) => setGenContext(e.target.value)}
                  placeholder="مثال: عميل بيشتكي إن الإعلانات مش بتجيب نتيجة، محتاج رد يهديه ويقترح حل..."
                  className="w-full h-32 focus:ring-primary"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading || !genContext}
                className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                {loading ? 'جاري التوليد...' : 'توليد النموذج'}
              </Button>
            </div>

            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-xs font-bold text-gray-500">النتيجة</span>
                 {generatedContent && (
                   <Button onClick={() => copyToClipboard(generatedContent)} variant="link" className="text-primary text-xs h-auto p-0">
                     <Copy size={14} /> نسخ النص
                   </Button>
                 )}
              </div>
              <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap overflow-y-auto h-64">
                {generatedContent ? generatedContent : <div className="text-gray-400 flex items-center justify-center h-full">النتيجة ستظهر هنا...</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
