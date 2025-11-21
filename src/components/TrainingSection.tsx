"use client";

import React, { useState } from 'react';
import { Rocket, BookOpen, PlayCircle, Users, GraduationCap } from 'lucide-react';
import { rolesData } from '@/lib/data';
import { RoleplayDojo } from './RoleplayDojo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function TrainingSection() {
  const [activePhase, setActivePhase] = useState('launch'); // launch, zero, start

  const phases = [
    { id: 'launch', label: '1️⃣ مرحلة الانطلاقة', icon: Rocket, desc: 'التعريف بالشركة، النظام، والتواصل (أول 3 أيام)' },
    { id: 'zero', label: '2️⃣ مرحلة الصفر', icon: BookOpen, desc: 'التأسيس النظري والمهارات الأساسية لكل دور (أول أسبوع)' },
    { id: 'start', label: '3️⃣ مرحلة البدء', icon: PlayCircle, desc: 'التطبيق العملي، المحاكاة، وبداية الشغل الحقيقي (أول شهر)' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {phases.map(phase => {
          const Icon = phase.icon;
          return (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className={cn(
                "p-4 rounded-xl border text-right relative overflow-hidden transition-all duration-300",
                activePhase === phase.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]'
                  : 'bg-card text-card-foreground border-border hover:border-primary/50 hover:bg-muted'
              )}
            >
              <div className="flex items-center gap-3 mb-2 relative z-10">
                <Icon size={24} className={activePhase === phase.id ? 'text-primary-foreground' : 'text-primary'} />
                <span className="font-bold text-lg">{phase.label}</span>
              </div>
              <p className={cn("text-xs relative z-10", activePhase === phase.id ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                {phase.desc}
              </p>
              {activePhase === phase.id && (
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-6">
        {activePhase === 'launch' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users size={24} className="text-blue-500" /> التدريب المشترك (الأساسي للجميع)
            </h3>
            <div className="space-y-4">
               <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                 <h4 className="font-bold text-blue-800 mb-2">اليوم 1-2: التعريف والنظام</h4>
                 <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                   <li>ما هي XFuse + الخدمات التي نقدمها.</li>
                   <li>تعريف بالبراندات والعملاء الحاليين.</li>
                   <li>شرح الداشبورد (SOP + التقييم + KPIs).</li>
                 </ul>
               </div>
               <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                 <h4 className="font-bold text-blue-800 mb-2">اليوم 3: طريقة الشغل والتواصل</h4>
                 <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                   <li>قواعد التواصل الداخلي (واتساب / سلاك / CRM).</li>
                   <li>كيفية كتابة التقرير اليومي (Daily Report).</li>
                   <li>سلسلة التواصل (Chain of communication).</li>
                 </ul>
               </div>
            </div>
          </div>
        )}

        {activePhase === 'zero' && (
           <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-fade-in mb-6">
             <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
               <GraduationCap size={24} className="text-primary" /> أساسيات التسويق (مشترك)
             </h3>
             <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <h4 className="font-bold text-primary mb-2">Level 0: قبل التخصص</h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>Funnel بسيط: Awareness → Consideration → Conversion → Retention.</li>
                  <li>الفرق بين: بوست عضوي – إعلان ممول – رسالة واتساب – إيميل.</li>
                  <li>ما معنى KPI ولماذا هو مهم؟</li>
                </ul>
             </div>
           </div>
        )}

        {(activePhase === 'zero' || activePhase === 'start') && (
          <div className="grid gap-4 md:grid-cols-2 animate-fade-in">
            {rolesData.map((role) => {
              const trainingList = activePhase === 'zero' ? role.training?.zero : role.training?.start;
              if (!trainingList) return null;

              return (
                <div key={role.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
                    <div className={`p-2 rounded-lg ${role.color}`}>
                       {React.createElement(role.icon, { size: 18 })}
                    </div>
                    <h4 className="font-bold text-gray-800">{role.title}</h4>
                  </div>
                  <ul className="space-y-2">
                    {trainingList.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className={cn('mt-1.5 w-2 h-2 rounded-full flex-shrink-0', activePhase === 'zero' ? 'bg-primary/70' : 'bg-green-400')}></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        {activePhase === 'start' && <RoleplayDojo />}
      </div>
    </div>
  );
}
