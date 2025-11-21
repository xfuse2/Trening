"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Target, Clock, Calendar } from 'lucide-react';
import type { Role } from '@/lib/data';
import { AIRoleAssistant } from './AIRoleAssistant';

export function SOPCard({ role }: { role: Role }) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = role.icon;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 cursor-pointer flex items-center justify-between bg-gradient-to-r from-white to-gray-50"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${role.color}`}>
            <Icon size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">{role.title}</h3>
            <span className="text-sm text-gray-500 font-medium">{role.names}</span>
          </div>
        </div>
        {isOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
      </div>

      {isOpen && (
        <div className="p-5 border-t border-gray-100 bg-white animate-fade-in">
          <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
            <h4 className="font-bold text-blue-800 text-sm mb-1 flex items-center gap-2">
              <Target size={16} /> هدف الوظيفة
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">{role.goal}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Clock size={16} className="text-orange-500" /> المسؤوليات اليومية
              </h4>
              <ul className="space-y-2">
                {role.daily.map((task, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-orange-300 rounded-full flex-shrink-0"></span>
                    {task}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Calendar size={16} className="text-purple-500" /> المسؤوليات الأسبوعية
              </h4>
              <ul className="space-y-2">
                {role.weekly.map((task, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-purple-300 rounded-full flex-shrink-0"></span>
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <AIRoleAssistant role={role} />
        </div>
      )}
    </div>
  );
}
