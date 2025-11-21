"use client";

import React, { useState } from 'react';
import { Heart, Sparkles, Loader2, Bot } from 'lucide-react';
import { clientsData } from '@/lib/data';
import { getHealthColor, getHealthLabel } from '@/lib/helpers';
import { analyzeClientHealth } from '@/app/actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function ClientHealthSection() {
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);
  const [analysisResult, setAnalysisResult] = useState<Record<number, string>>({});

  const analyzeClient = async (client: typeof clientsData[0]) => {
    setAnalyzingId(client.id);
    try {
      const result = await analyzeClientHealth({
        name: client.name,
        package: client.package,
        health: client.health,
        feedback: client.feedback,
      });
      setAnalysisResult(prev => ({ ...prev, [client.id]: result.analysis }));
    } catch (error) {
      console.error("Client Health Analysis Error:", error);
      setAnalysisResult(prev => ({ ...prev, [client.id]: "حدث خطأ أثناء التحليل." }));
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 flex items-center gap-2"><Heart size={18} /> صحة العملاء (AI Powered)</h3>
        <Button variant="destructive" size="sm" className="text-xs h-auto py-1">عرض العملاء في خطر فقط</Button>
      </div>
      <div>
        <Table className="w-full text-sm text-right">
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">العميل</TableHead>
              <TableHead className="font-medium">الباكدج</TableHead>
              <TableHead className="font-medium">آخر Feedback</TableHead>
              <TableHead className="font-medium">Health</TableHead>
              <TableHead className="font-medium">تحليل AI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientsData.map(client => (
              <React.Fragment key={client.id}>
                <TableRow className="hover:bg-gray-50">
                  <TableCell className="font-bold text-gray-800">{client.name}</TableCell>
                  <TableCell>{client.package}</TableCell>
                  <TableCell className="text-gray-500 italic">"{client.feedback}"</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`font-bold ${getHealthColor(client.health)}`}>
                      {client.health}/10 - {getHealthLabel(client.health)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => analyzeClient(client)}
                      disabled={analyzingId === client.id}
                      variant="outline"
                      size="sm"
                      className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
                    >
                      {analyzingId === client.id ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                      {analyzingId === client.id ? 'جاري...' : 'تحليل'}
                    </Button>
                  </TableCell>
                </TableRow>
                {analysisResult[client.id] && (
                  <TableRow className="bg-primary/5 animate-fade-in">
                    <TableCell colSpan={5} className="p-4">
                      <div className="bg-white border border-primary/20 rounded-lg p-4 shadow-sm relative">
                        <Badge className="absolute -top-2 right-4 bg-primary/10 text-primary">AI Insight</Badge>
                        <div className="flex items-start gap-3">
                           <Bot size={18} className="text-primary mt-1 flex-shrink-0" />
                           <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                             {analysisResult[client.id]}
                           </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
