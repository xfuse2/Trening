"use client";

import React, { useState } from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Award,
  Rocket,
  BrainCircuit,
} from 'lucide-react';
import { SOPCard } from '@/components/SOPCard';
import { TrainingSection } from '@/components/TrainingSection';
import { EvaluationCalculator } from '@/components/EvaluationCalculator';
import { YallaBinaSection } from '@/components/YallaBinaSection';
import { ModeratorTraining } from '@/components/ModeratorTraining';
import { Logo } from '@/components/Logo';
import { rolesData } from '@/lib/data';
import { cn } from '@/lib/utils';

type ActiveTab = 'sop' | 'training' | 'eval' | 'yalla_bina' | 'moderator_training';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('yalla_bina');

  const navItems = [
    { id: 'sop', label: 'SOP', icon: LayoutDashboard },
    { id: 'training', label: 'التدريب', icon: GraduationCap },
    { id: 'moderator_training', label: 'تدريب المودريتور', icon: BrainCircuit },
    { id: 'eval', label: 'التقييم', icon: Award },
    { id: 'yalla_bina', label: 'يلا بينا', icon: Rocket },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'sop':
        return (
          <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">إجراءات العمل القياسية</h2>
              <p className="text-gray-500">الدليل المرجعي للمهام والمسؤوليات اليومية لقسم التسويق</p>
            </div>
            <div className="grid gap-4">
              {rolesData.map((role) => <SOPCard key={role.id} role={role} />)}
            </div>
          </div>
        );
      case 'training':
        return (
          <div className="animate-fade-in">
             <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">مركز التدريب والتطوير</h2>
              <p className="text-gray-500">رحلة التعلم من الانطلاقة حتى الاحتراف</p>
            </div>
            <TrainingSection />
           </div>
        );
      case 'moderator_training':
        return <ModeratorTraining />;
      case 'eval':
        return (
          <div className="max-w-6xl mx-auto animate-fade-in">
             <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">نظام تقييم الأداء</h2>
              <p className="text-gray-500">حاسبة النقاط الشهرية بناءً على مؤشرات الأداء الرئيسية</p>
            </div>
            <EvaluationCalculator />
          </div>
        );
      case 'yalla_bina':
        return <YallaBinaSection />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-body">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Logo />
          
          <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
             {navItems.map(item => {
                 const isActive = activeTab === item.id;
                 return (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as ActiveTab)}
                        className={cn(
                            'px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap',
                            isActive ? 
                                (item.id === 'yalla_bina' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-white text-primary shadow-sm') 
                                : 'text-gray-500 hover:text-gray-700'
                        )}
                    >
                        <item.icon size={16} />
                        {item.label}
                    </button>
                 );
             })}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2024 XFuse Marketing Department. All rights reserved.</p>
          <p className="mt-2">Internal System v2.1 • Powered by Genkit & Gemini AI ✨</p>
        </div>
      </footer>
    </div>
  );
};
