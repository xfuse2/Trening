"use client";

import React, { useState, useMemo } from 'react';
import { Users, Star, FileText, Sparkles, Loader2, Bot, Zap } from 'lucide-react';
import { rolesData, criteria } from '@/lib/data';
import type { Role } from '@/lib/data';
import { generateAiReport } from '@/app/actions';
import { Button } from './ui/button';

export function EvaluationCalculator() {
  const [selectedRoleId, setSelectedRoleId] = useState(rolesData[0].id);
  const [scores, setScores] = useState({ attendance: 3, quality: 3, speed: 3, teamwork: 3, growth: 3, goals: 3 });
  const [aiReport, setAiReport] = useState('');
  const [smartGoals, setSmartGoals] = useState('');
  const [loadingReport, setLoadingReport] = useState(false);
  
  const selectedRole = useMemo(() => rolesData.find(r => r.id === selectedRoleId)!, [selectedRoleId]);

  const handleScoreChange = (id: string, value: string) => {
    setScores(prev => ({ ...prev, [id]: parseInt(value) }));
    if (aiReport) setAiReport('');
    if (smartGoals) setSmartGoals('');
  };

  const finalScore = useMemo(() => {
    let total = 0;
    criteria.forEach(c => {
      total += scores[c.id] * c.weight;
    });
    return total.toFixed(2);
  }, [scores]);

  const generateAIReport = async () => {
    setLoadingReport(true);
    setAiReport('');
    setSmartGoals('');
    const scoresDetails = criteria.map(c => `${c.label}: ${scores[c.id]}/5`).join(', ');
    
    try {
      const result = await generateAiReport({
        roleTitle: selectedRole.title,
        finalScore: parseFloat(finalScore),
        scoresDetails: scoresDetails,
      });
      setAiReport(result.aiReport);
      setSmartGoals(result.smartGoals);
    } catch (error) {
      console.error("AI Report Generation Error:", error);
      setAiReport("حدث خطأ أثناء توليد التقرير. يرجى المحاولة لاحقاً.");
    } finally {
      setLoadingReport(false);
    }
  };

  const getRatingColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 3.5) return 'text-blue-600 bg-blue-100 border-blue-200';
    if (score >= 2.5) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };
  
  const getRatingLabel = (score: number) => {
    if (score >= 4.5) return 'ممتاز';
    if (score >= 3.5) return 'جيد جداً';
    if (score >= 2.5) return 'جيد';
    if (score >= 1.5) return 'مقبول';
    return 'ضعيف';
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
            <Users size={20} /> اختر الموظف/الدور
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {rolesData.map(role => (
              <button
                key={role.id}
                onClick={() => { setSelectedRoleId(role.id); setAiReport(''); setSmartGoals(''); }}
                className={`p-3 rounded-lg text-sm font-medium transition-all text-right border ${selectedRoleId === role.id ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
              >
                {role.title}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg mb-6 text-gray-800 flex items-center gap-2"><Star size={20} /> التقييم الشهري</h3>
          <div className="space-y-6">
            {criteria.map((c) => (
              <div key={c.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <label className="font-bold text-gray-700">{c.label}</label>
                  <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-md">الوزن: {c.weight * 100}%</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{c.desc}</p>
                {c.id === 'goals' && (
                   <div className="mb-4 p-3 bg-white border border-primary/20 rounded text-sm text-gray-600">
                     <p className="font-semibold text-primary mb-1">KPIs {selectedRole.title}:</p>
                     <ul className="list-disc list-inside space-y-1">{selectedRole.kpis.map((k, i) => <li key={i}>{k}</li>)}</ul>
                   </div>
                )}
                <div className="flex items-center gap-4">
                  <input type="range" min="1" max="5" step="1" value={scores[c.id]} onChange={(e) => handleScoreChange(c.id, e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                  <div className="w-12 h-12 flex items-center justify-center bg-white border-2 border-primary/20 rounded-full font-bold text-primary text-lg shadow-sm">{scores[c.id]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-6 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-primary/20 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-pink-500"></div>
            <div className="mb-4">
               <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-3 ${selectedRole.color}`}>{React.createElement(selectedRole.icon, { size: 32 })}</div>
               <h2 className="text-xl font-bold text-gray-800">{selectedRole.title}</h2>
               <p className="text-sm text-gray-500">{selectedRole.names}</p>
            </div>
            <div className="py-6 border-t border-b border-gray-100 my-4">
              <span className="block text-gray-500 text-sm mb-2">النتيجة النهائية</span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-5xl font-black text-gray-900">{finalScore}</span>
                <span className="text-xl text-gray-400 font-medium">/ 5</span>
              </div>
              <div className={`mt-3 inline-block px-4 py-1 rounded-full text-sm font-bold border ${getRatingColor(parseFloat(finalScore))}`}>
                {getRatingLabel(parseFloat(finalScore))}
              </div>
            </div>
            <div className="grid gap-2 mt-6">
              <Button onClick={generateAIReport} disabled={loadingReport} className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-md">
                {loadingReport ? <Loader2 className="animate-spin" /> : <Sparkles />} {loadingReport ? 'جاري التحليل...' : 'تقرير الذكاء الاصطناعي'}
              </Button>
              <Button onClick={() => window.print()} variant="outline" className="w-full bg-gray-800 hover:bg-gray-900 text-white">
                <FileText /> طباعة التقرير
              </Button>
            </div>
          </div>
          {aiReport && (
            <div className="bg-white p-5 rounded-xl shadow-lg border border-accent/20 animate-fade-in relative">
              <div className="absolute top-0 right-0 bg-accent/10 text-accent text-xs px-2 py-1 rounded-bl-lg font-bold">AI Report</div>
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Bot size={20} className="text-accent" /> ملخص الأداء</h4>
              <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{aiReport}</div>
            </div>
          )}
          {smartGoals && (
            <div className="bg-green-50 p-5 rounded-xl shadow-lg border border-green-100 animate-fade-in relative">
              <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2"><Zap size={20} className="text-green-600" /> أهداف مقترحة (SMART Goals)</h4>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{smartGoals}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
