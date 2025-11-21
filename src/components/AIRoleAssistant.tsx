"use client";

import React, { useState } from 'react';
import { Sparkles, Loader2, Bot } from 'lucide-react';
import type { Role } from '@/lib/data';
import { aiRoleAssistant } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function AIRoleAssistant({ role }: { role: Role }) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse('');
    
    try {
      const result = await aiRoleAssistant({
        roleTitle: role.title,
        roleGoal: role.goal,
        query: query,
      });
      setResponse(result.response);
    } catch (error) {
      console.error("AI Role Assistant Error:", error);
      setResponse("حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-4">
      <h4 className="font-bold text-primary flex items-center gap-2 mb-3">
        <Sparkles size={18} /> مساعد {role.title} الذكي
      </h4>
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`اطلب مساعدة في مهام ${role.title}...`}
          className="flex-1 bg-white focus:ring-primary/50"
        />
        <Button
          onClick={handleAsk}
          disabled={loading || !query}
          className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
          {loading ? 'جاري التوليد...' : 'اسأل'}
        </Button>
      </div>

      {response && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap shadow-sm">
          <div className="flex items-start gap-2">
            <Bot size={18} className="text-primary mt-1 flex-shrink-0" />
            <p className="flex-1">{response}</p>
          </div>
        </div>
      )}
    </div>
  );
}
