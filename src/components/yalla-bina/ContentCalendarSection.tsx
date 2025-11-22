"use client";

import React, { useState } from 'react';
import { Calendar, Loader2, Sparkles, Download, Copy, Check, Lightbulb, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateContentCalendar } from '@/app/actions';

const businessTypes = [
  'مطعم/كافيه',
  'عيادة/مستشفى',
  'متجر ملابس',
  'صالون تجميل',
  'أكاديمية/تعليم',
  'عقارات',
  'شركة خدمات',
  'متجر إلكتروني',
  'آخر',
];

const platforms = [
  { id: 'facebook', label: 'Facebook', emoji: '📘' },
  { id: 'instagram', label: 'Instagram', emoji: '📸' },
  { id: 'tiktok', label: 'TikTok', emoji: '🎵' },
  { id: 'twitter', label: 'Twitter/X', emoji: '🐦' },
  { id: 'linkedin', label: 'LinkedIn', emoji: '💼' },
];

const tones = [
  { id: 'professional', label: 'رسمي واحترافي' },
  { id: 'friendly', label: 'ودود وقريب' },
  { id: 'funny', label: 'فكاهي وخفيف' },
  { id: 'educational', label: 'تعليمي ومفيد' },
];

const months = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

export function ContentCalendarSection() {
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook', 'instagram']);
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [postsPerWeek, setPostsPerWeek] = useState(4);
  const [tone, setTone] = useState('friendly');
  const [specialEvents, setSpecialEvents] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ calendar: string; summary: string; tips: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const currentYear = new Date().getFullYear();

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleGenerate = async () => {
    if (!businessName || !businessType || selectedPlatforms.length === 0) {
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await generateContentCalendar({
        businessName,
        businessType,
        platforms: selectedPlatforms.map(p => platforms.find(pl => pl.id === p)?.label || p),
        month: `${selectedMonth} ${currentYear}`,
        postsPerWeek,
        tone: tones.find(t => t.id === tone)?.label,
        specialEvents: specialEvents || undefined,
      });

      setResult(response);
    } catch (error) {
      console.error('Error generating calendar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result.calendar);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-3 mb-2">
          <Calendar size={28} /> مُولّد خطة المحتوى الشهرية
        </h2>
        <p className="text-white/80">أنشئ خطة محتوى احترافية لشهر كامل في ثوانٍ</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1 bg-white border rounded-xl p-6 space-y-5">
          <h3 className="font-bold text-lg border-b pb-3">معلومات البيزنس</h3>

          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium mb-2">اسم البيزنس *</label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="مثال: كافيه الصباح"
            />
          </div>

          {/* Business Type */}
          <div>
            <label className="block text-sm font-medium mb-2">نوع البيزنس *</label>
            <div className="flex flex-wrap gap-2">
              {businessTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setBusinessType(type)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                    businessType === type
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white hover:border-purple-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div>
            <label className="block text-sm font-medium mb-2">المنصات *</label>
            <div className="flex flex-wrap gap-2">
              {platforms.map(platform => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-all flex items-center gap-1 ${
                    selectedPlatforms.includes(platform.id)
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white hover:border-purple-300'
                  }`}
                >
                  <span>{platform.emoji}</span> {platform.label}
                </button>
              ))}
            </div>
          </div>

          {/* Month */}
          <div>
            <label className="block text-sm font-medium mb-2">الشهر</label>
            <div className="flex flex-wrap gap-1">
              {months.map(month => (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(month)}
                  className={`px-2 py-1 text-[10px] rounded border transition-all ${
                    selectedMonth === month
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white hover:border-purple-300'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>

          {/* Posts per week */}
          <div>
            <label className="block text-sm font-medium mb-2">عدد البوستات/الأسبوع: {postsPerWeek}</label>
            <input
              type="range"
              min="2"
              max="7"
              value={postsPerWeek}
              onChange={(e) => setPostsPerWeek(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>2</span>
              <span>7</span>
            </div>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-sm font-medium mb-2">نبرة المحتوى</label>
            <div className="grid grid-cols-2 gap-2">
              {tones.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                    tone === t.id
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white hover:border-purple-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Special Events */}
          <div>
            <label className="block text-sm font-medium mb-2">مناسبات خاصة (اختياري)</label>
            <Input
              value={specialEvents}
              onChange={(e) => setSpecialEvents(e.target.value)}
              placeholder="مثال: عيد الأم، افتتاح فرع جديد"
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isLoading || !businessName || !businessType || selectedPlatforms.length === 0}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} /> جاري التوليد...
              </>
            ) : (
              <>
                <Sparkles size={18} /> توليد خطة المحتوى
              </>
            )}
          </Button>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {!result && !isLoading && (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
              <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-gray-500 font-medium">خطة المحتوى ستظهر هنا</h3>
              <p className="text-gray-400 text-sm mt-2">املأ البيانات واضغط "توليد"</p>
            </div>
          )}

          {isLoading && (
            <div className="bg-white border rounded-xl p-12 text-center">
              <Loader2 size={48} className="mx-auto text-purple-600 animate-spin mb-4" />
              <h3 className="text-gray-700 font-medium">جاري إنشاء خطة المحتوى...</h3>
              <p className="text-gray-400 text-sm mt-2">قد يستغرق هذا بضع ثوانٍ</p>
            </div>
          )}

          {result && (
            <>
              {/* Summary */}
              {result.summary && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                  <h4 className="font-bold text-purple-800 flex items-center gap-2 mb-3">
                    <FileText size={18} /> ملخص الخطة
                  </h4>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {result.summary}
                  </div>
                </div>
              )}

              {/* Calendar */}
              <div className="bg-white border rounded-xl overflow-hidden">
                <div className="bg-gray-50 border-b p-4 flex justify-between items-center">
                  <h4 className="font-bold flex items-center gap-2">
                    <Calendar size={18} /> خطة المحتوى - {selectedMonth} {currentYear}
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="flex items-center gap-2"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'تم النسخ' : 'نسخ'}
                  </Button>
                </div>
                <div className="p-5 max-h-[500px] overflow-y-auto">
                  <div className="text-sm whitespace-pre-wrap leading-relaxed prose prose-sm max-w-none">
                    {result.calendar}
                  </div>
                </div>
              </div>

              {/* Tips */}
              {result.tips && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                  <h4 className="font-bold text-yellow-800 flex items-center gap-2 mb-3">
                    <Lightbulb size={18} /> نصائح لتحسين الأداء
                  </h4>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {result.tips}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
