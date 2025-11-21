import { Filter } from 'lucide-react';
import { leadsData } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

export function LeadsAutomationSection() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 flex items-center gap-2"><Filter size={18} /> تتبع الـ Leads (Automation)</h3>
        <Badge variant="secondary" className="bg-primary/10 text-primary">Live Sync</Badge>
      </div>
      <div className="overflow-x-auto">
        <Table className="w-full text-sm text-right">
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">الاسم</TableHead>
              <TableHead className="font-medium">المصدر</TableHead>
              <TableHead className="font-medium">الخدمة</TableHead>
              <TableHead className="font-medium">الوقت</TableHead>
              <TableHead className="font-medium">الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leadsData.map(lead => (
              <TableRow key={lead.id} className="hover:bg-gray-50">
                <TableCell className="font-bold text-gray-800">{lead.name}<br/><span className="text-xs text-gray-400 font-normal">{lead.phone}</span></TableCell>
                <TableCell>{lead.source}</TableCell>
                <TableCell>{lead.service}</TableCell>
                <TableCell className="text-gray-500">{lead.time}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`font-bold ${
                    lead.status === 'New' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                    lead.status === 'Converted' ? 'bg-green-100 text-green-700 border-green-200' :
                    lead.status === 'Lost' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                  }`}>
                    {lead.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
