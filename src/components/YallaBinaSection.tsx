"use client";

import React, { useState } from 'react';
import { 
  Rocket, 
  LayoutDashboard, 
  Package, 
  Filter, 
  Heart, 
  Copy, 
  Book
} from 'lucide-react';
import { PulseDashboard } from './yalla-bina/PulseDashboard';
import { DashboardWidgets } from './yalla-bina/DashboardWidgets';
import { PackagesSection } from './yalla-bina/PackagesSection';
import { LeadsAutomationSection } from './yalla-bina/LeadsAutomationSection';
import { ClientHealthSection } from './yalla-bina/ClientHealthSection';
import { TemplateLibrarySection } from './yalla-bina/TemplateLibrarySection';
import { WikiSection } from './yalla-bina/WikiSection';
import { cn } from '@/lib/utils';

type Module = 'dashboard' | 'packages' | 'leads' | 'clients' | 'library' | 'wiki';

export function YallaBinaSection() {
  const [activeModule, setActiveModule] = useState<Module>('dashboard');

  const navigationItems = [
    { id: 'dashboard', label: 'نبض التسويق', icon: LayoutDashboard },
    { id: 'packages', label: 'الباكدجات', icon: Package },
    { id: 'leads', label: 'أوتوميشن Leads', icon: Filter },
    { id: 'clients', label: 'صحة العملاء', icon: Heart },
    { id: 'library', label: 'مكتبة النماذج', icon: Copy },
    { id: 'wiki', label: 'الويكي (Wiki)', icon: Book },
  ];

  const renderModule = () => {
    switch(activeModule) {
      case 'dashboard': return (
        <div className="space-y-6">
          <PulseDashboard />
          <DashboardWidgets />
        </div>
      );
      case 'packages': return <PackagesSection />;
      case 'leads': return <LeadsAutomationSection />;
      case 'clients': return <ClientHealthSection />;
      case 'library': return <TemplateLibrarySection />;
      case 'wiki': return <WikiSection />;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 text-center">
         <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
           <Rocket className="text-primary" /> نظام التشغيل: يلا بينا
         </h2>
         <p className="text-gray-500">المركز الموحد لإدارة العمليات، المبيعات، والجودة</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-64 flex-shrink-0">
            <nav className="space-y-1 sticky top-20">
            {navigationItems.map(item => (
                <button 
                    key={item.id}
                    onClick={() => setActiveModule(item.id as Module)} 
                    className={cn(
                        'w-full text-right px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-all',
                        activeModule === item.id 
                            ? 'bg-primary text-primary-foreground shadow-md' 
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                    )}
                >
                    <item.icon size={18} /> {item.label}
                </button>
            ))}
            </nav>
        </aside>

        <main className="flex-1 animate-fade-in">
           {renderModule()}
        </main>
      </div>
    </div>
  );
};
