"use client";

import { Users, CheckCircle, AlertTriangle, Activity } from 'lucide-react';
import { clientsData, leadsData } from '@/lib/data';

export function PulseDashboard() {
  const redClients = clientsData.filter(c => c.health < 6).length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users size={24} /></div>
        <div>
          <p className="text-sm text-gray-500">Leads هذا الأسبوع</p>
          <h3 className="text-2xl font-bold text-gray-800">{leadsData.length} <span className="text-xs text-green-500 font-normal">↑ 12%</span></h3>
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-green-100 text-green-600 rounded-lg"><CheckCircle size={24} /></div>
        <div>
          <p className="text-sm text-gray-500">Deals Closed</p>
          <h3 className="text-2xl font-bold text-gray-800">8 <span className="text-xs text-gray-400 font-normal">عملاء</span></h3>
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-red-100 text-red-600 rounded-lg"><AlertTriangle size={24} /></div>
        <div>
          <p className="text-sm text-gray-500">Problem Clients</p>
          <h3 className="text-2xl font-bold text-gray-800">{redClients} <span className="text-xs text-red-500 font-normal">انتبه!</span></h3>
        </div>
      </div>
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Activity size={24} /></div>
        <div>
          <p className="text-sm text-gray-500">Top Campaign</p>
          <h3 className="text-lg font-bold text-gray-800">Brand X <span className="block text-xs text-gray-400 font-normal">CTR 3.2%</span></h3>
        </div>
      </div>
    </div>
  );
};
