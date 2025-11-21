"use client";

import React, { useState } from 'react';
import { Package, CheckCircle, Sparkles, Loader2, Bot } from 'lucide-react';
import { packagesData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { suggestPackage } from '@/app/actions';
import type { PackageSuggestionOutput } from '@/ai/flows/package-suggestion-flow';

function PackageCard({ pkg }: { pkg: typeof packagesData[0] }) {
  return (
     <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
          <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">{pkg.name}</h3>
            <Package size={18} className="text-primary" />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <div className="text-2xl font-bold text-primary mb-1">{pkg.price}</div>
            <div className="text-sm text-gray-500 mb-4">المدة: {pkg.duration}</div>
            <ul className="space-y-2 mb-6 flex-1">
              {pkg.includes.map((item, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500" /> {item}
                </li>
              ))}
            </ul>
            <div className="border-t pt-3 mt-auto">
              <span className="text-xs text-gray-400 block mb-2">الفريق المشارك:</span>
              <div className="flex flex-wrap gap-1">
                {pkg.team.map((t, i) => (
                  <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
  )
}

function AIPackageBuilder() {
  const [industry, setIndustry] = useState('');
  const [budget, setBudget] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PackageSuggestionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSuggest = async () => {
    if (!industry || !budget || !goal) {
      setError("الرجاء ملء جميع الحقول.");
      return;
    }
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await suggestPackage({
        clientIndustry: industry,
        budget: budget,
        mainGoal: goal,
      });
      setResult(response);
    } catch (e) {
      console.error("Package Suggestion Error:", e);
      setError("حدث خطأ أثناء إنشاء الاقتراح. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-2 border-dashed border-primary/50 rounded-xl p-6 lg:col-span-3">
      <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2"><Sparkles /> مساعد إنشاء الباكدجات الذكي</h3>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-700">مجال العميل</label>
            <Input value={industry} onChange={e => setIndustry(e.target.value)} placeholder="مثال: مطعم وجبات سريعة" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700">الميزانية الشهرية التقريبية</label>
            <Input value={budget} onChange={e => setBudget(e.target.value)} placeholder="مثال: 5000 - 7000 جنيه" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700">الهدف الرئيسي للعميل</label>
            <Input value={goal} onChange={e => setGoal(e.target.value)} placeholder="مثال: زيادة الطلبات الأونلاين" />
          </div>
          <Button onClick={handleSuggest} disabled={loading} className="w-full">
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={16} />}
            {loading ? 'جاري التفكير...' : 'اقترح باكدج'}
          </Button>
        </div>

        {/* Results */}
        <div className="bg-gray-50 rounded-lg border p-4 min-h-[250px] flex flex-col">
          {loading && 
            <div className="m-auto text-center text-gray-500">
              <Loader2 className="animate-spin h-8 w-8 mx-auto mb-2" />
              <p>يقوم الذكاء الاصطناعي بتصميم الباكدج...</p>
            </div>
          }
          {error && <div className="m-auto text-center text-red-500">{error}</div>}
          {!loading && !error && result &&
            <div className="animate-fade-in">
              <h4 className="font-bold text-primary flex items-center gap-2"><Bot /> باكدج مقترحة</h4>
              <div className="bg-primary/10 text-primary p-3 my-3 rounded-lg border border-primary/20">
                <p className="font-bold">{result.packageName}</p>
                <p className="text-lg font-black">{result.suggestedPrice}</p>
              </div>
              <ul className="space-y-1 text-sm list-disc list-inside mb-3">
                {result.services.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
              <p className="text-xs bg-yellow-50 text-yellow-800 p-2 rounded-md border border-yellow-100">{result.marketingNote}</p>
            </div>
          }
          {!loading && !error && !result &&
             <div className="m-auto text-center text-gray-400">
                <p>ستظهر الباكدج المقترحة هنا.</p>
             </div>
          }
        </div>
      </div>
    </div>
  )
}


export function PackagesSection() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AIPackageBuilder />
      {packagesData.map(pkg => (
        <PackageCard key={pkg.id} pkg={pkg} />
      ))}
    </div>
  );
}
