import { Package, CheckCircle } from 'lucide-react';
import { packagesData } from '@/lib/data';

export function PackagesSection() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packagesData.map(pkg => (
        <div key={pkg.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
          <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">{pkg.name}</h3>
            <Package size={18} className="text-primary" />
          </div>
          <div className="p-5">
            <div className="text-2xl font-bold text-primary mb-1">{pkg.price}</div>
            <div className="text-sm text-gray-500 mb-4">المدة: {pkg.duration}</div>
            <ul className="space-y-2 mb-6">
              {pkg.includes.map((item, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500" /> {item}
                </li>
              ))}
            </ul>
            <div className="border-t pt-3">
              <span className="text-xs text-gray-400 block mb-2">الفريق المشارك:</span>
              <div className="flex flex-wrap gap-1">
                {pkg.team.map((t, i) => (
                  <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
