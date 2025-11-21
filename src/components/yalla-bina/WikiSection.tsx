import { Book } from 'lucide-react';
import { wikiData } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

export function WikiSection() {
  return (
    <div className="space-y-4">
      {wikiData.map((w, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Book size={18} className="text-primary" />
            <Badge variant="secondary" className="bg-primary/10 text-primary">{w.section}</Badge>
            <h3 className="font-bold text-gray-800">{w.title}</h3>
          </div>
          <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed ps-6 border-s-2 border-gray-100 me-1 pe-3">
            {w.content}
          </p>
        </div>
      ))}
    </div>
  );
}
