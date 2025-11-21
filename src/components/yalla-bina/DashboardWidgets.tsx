import { ArrowRight } from 'lucide-react';
import { hallOfFame, caseStudiesData } from '@/lib/data';

export function DashboardWidgets() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-indigo-900 text-white rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
        <h3 className="text-xl font-bold mb-2 relative z-10">قاعة المشاهير (Hall of Fame) 🏆</h3>
        <div className="space-y-3 relative z-10 mt-4">
          {hallOfFame.map((h, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <span className="text-2xl">{h.title.split(' ')[0]}</span>
              <div>
                <div className="font-bold text-sm">{h.winner}</div>
                <div className="text-xs text-indigo-200">{h.title} - {h.month}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">نتائج عملائنا (Case Studies) 📈</h3>
        <div className="space-y-4">
          {caseStudiesData.map((cs, i) => (
            <div key={i} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
              <h4 className="font-bold text-sm text-primary">{cs.title}</h4>
              <p className="text-xs text-gray-500 mb-2">المشكلة: {cs.issue}</p>
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md text-xs">
                <span>{cs.before}</span>
                <ArrowRight size={14} className="text-gray-400" />
                <span className="font-bold text-green-600">{cs.after}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
