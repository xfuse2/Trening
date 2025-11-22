"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Loader2, PlayCircle, Send, Award, RefreshCw, ThumbsUp, ThumbsDown, GraduationCap } from 'lucide-react';
import { interactiveRoleplay, evaluateRoleplayPerformance } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Message = {
  role: 'user' | 'ai';
  text: string;
};

type HistoryItem = {
    role: 'user' | 'ai';
    text: string;
};

export function RoleplayDojo() {
  const [scenarioType, setScenarioType] = useState('angry_client');
  const [isStarted, setIsStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [rating, setRating] = useState<'good' | 'bad' | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scenarios = [
    { id: 'angry_client', label: '😡 عميل غاضب', prompt: 'أنت عميل غاضب جداً بسبب تأخر تسليم التصميمات لمدة يومين. تتحدث بلهجة حادة وغير راضٍ عن الخدمة. ابدأ المحادثة بشكوى.' },
    { id: 'hesitant_lead', label: '🤔 عميل متردد (Lead)', prompt: 'أنت عميل محتمل مهتم بخدمات التسويق ولكنك متردد جداً بشأن السعر وتريد خصم. اسأل أسئلة كثيرة وحاول الضغط لتقليل السعر.' },
    { id: 'vague_brief', label: '📝 عميل غير واضح', prompt: 'أنت عميل يريد تصميم لوجو ولكنك لا تعرف ماذا تريد بالضبط. إجاباتك غامضة وغير مفيدة. هدف الموظف هو استخراج معلومات دقيقة منك.' },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, feedback, evaluation]);

  const handleReset = () => {
    setIsStarted(false);
    setMessages([]);
    setHistory([]);
    setFeedback(null);
    setUserInput('');
    setRating(null);
    setIsFinished(false);
    setEvaluation(null);
  };

  const startSimulation = async () => {
    handleReset();
    setIsStarted(true);
    setIsLoading(true);
    const selectedScenario = scenarios.find(s => s.id === scenarioType)!;

    try {
      const response = await interactiveRoleplay({
        scenario: selectedScenario.prompt,
        history: [],
      });
      setMessages([{ role: 'ai', text: response.aiResponse }]);
      setHistory(response.history);
    } catch (error) {
      console.error("Roleplay Start Error:", error);
      setMessages([{ role: 'ai', text: 'عذراً، حدث خطأ أثناء بدء المحاكاة.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMessageText = userInput;
    setMessages(prev => [...prev, { role: 'user', text: userMessageText }]);
    setUserInput('');
    setIsLoading(true);
    setFeedback(null);
    setRating(null);

    const selectedScenario = scenarios.find(s => s.id === scenarioType)!;
    
    try {
      const response = await interactiveRoleplay({
        scenario: selectedScenario.prompt,
        userMessage: userMessageText,
        history: history,
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.aiResponse }]);
      if (response.feedback) {
        setFeedback(response.feedback);
      }
      setHistory(response.history);
    } catch (error) {
      console.error("Roleplay Message Error:", error);
       setMessages(prev => [...prev, { role: 'ai', text: 'عذراً، حدث خطأ في الرد.' }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRating = (newRating: 'good' | 'bad') => {
    setRating(newRating);
    // Here you would typically send this feedback to your backend/analytics
    console.log(`Feedback rated as: ${newRating}`);
  };

  const handleFinishAndEvaluate = async () => {
    setIsFinished(true);
    setEvaluating(true);
    setFeedback(null);
    const selectedScenario = scenarios.find(s => s.id === scenarioType)!;

    try {
        const result = await evaluateRoleplayPerformance({
            scenario: selectedScenario.prompt,
            history: history,
        });
        setEvaluation(result.evaluation);
    } catch (error) {
        console.error("Evaluation Error:", error);
        setEvaluation("حدث خطأ أثناء تقييم الأداء.");
    } finally {
        setEvaluating(false);
    }
};


  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mt-6">
      <div className="bg-gradient-to-r from-primary to-accent p-4 text-white flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2">
          <Bot size={24} /> محاكي التدريب التفاعلي (Roleplay Dojo)
        </h3>
        {!isStarted && <span className="bg-white/20 text-xs px-2 py-1 rounded-md">Powered by Genkit</span>}
      </div>

      {!isStarted ? (
        <div className="p-8 text-center">
          <p className="text-gray-600 mb-6">اختر سيناريو للتدرب عليه. سيقوم الذكاء الاصطناعي بتمثيل دور العميل، وعليك الرد باحترافية.</p>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {scenarios.map(s => (
              <Button
                key={s.id}
                onClick={() => setScenarioType(s.id)}
                variant="outline"
                className={`p-4 h-auto rounded-xl border-2 transition-all flex flex-col items-start text-right ${
                  scenarioType === s.id ? 'border-primary bg-primary/10 text-primary' : 'border-gray-100 hover:border-primary/50'
                }`}
              >
                <div className="font-bold mb-2 text-base">{s.label}</div>
                <div className="text-xs text-muted-foreground whitespace-normal">تدرب على التعامل مع هذا النوع من العملاء</div>
              </Button>
            ))}
          </div>
          <Button onClick={startSimulation} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <PlayCircle size={20} /> ابدأ المحاكاة
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4" ref={scrollRef}>
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                  m.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                }`}>
                  <span className="block text-xs opacity-70 mb-1 font-bold">{m.role === 'user' ? 'أنت' : 'العميل'}</span>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && !isFinished && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-xl rounded-bl-none shadow-sm flex items-center gap-2 text-gray-500 text-sm">
                  <Loader2 className="animate-spin" size={16} /> جاري الكتابة...
                </div>
              </div>
            )}
            
            {feedback && !isFinished && (
               <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mt-6 animate-fade-in">
                 <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                   <Award size={20} /> تقييم المدرب الذكي
                 </h4>
                 <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                   {feedback}
                 </div>
                 <div className="mt-4 pt-3 border-t border-yellow-200 flex items-center justify-between">
                    <p className="text-xs font-bold text-yellow-900">هل كان هذا التقييم مفيداً؟</p>
                    <div className="flex gap-2">
                        <Button
                            size="icon"
                            variant={rating === 'good' ? 'default' : 'outline'}
                            onClick={() => handleRating('good')}
                            className={`h-8 w-8 transition-all ${rating === 'good' ? 'bg-green-500 hover:bg-green-600' : 'bg-white'}`}
                        >
                            <ThumbsUp size={16} />
                        </Button>
                        <Button
                            size="icon"
                            variant={rating === 'bad' ? 'default' : 'outline'}
                            onClick={() => handleRating('bad')}
                            className={`h-8 w-8 transition-all ${rating === 'bad' ? 'bg-red-500 hover:bg-red-600' : 'bg-white'}`}
                        >
                            <ThumbsDown size={16} />
                        </Button>
                    </div>
                 </div>
                 {rating && <p className="text-center text-xs text-yellow-800 mt-2">شكراً لتقييمك!</p>}
               </div>
            )}

            {evaluating && (
                <div className="flex justify-center items-center flex-col p-8 text-gray-500">
                    <Loader2 className="animate-spin h-10 w-10 text-primary mb-4" />
                    <p className="font-bold">جاري تحليل وتقييم الأداء النهائي...</p>
                </div>
            )}
            {evaluation && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6 animate-fade-in">
                    <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                        <GraduationCap size={20} /> تقييم الأداء النهائي
                    </h4>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed prose prose-sm">
                        {evaluation.split('---').map((part, index) => (
                            <div key={index} className="mb-4">
                                {part.trim().split('\n').map((line, lineIndex) => {
                                    if (line.startsWith('**') && line.endsWith('**')) {
                                        return <strong key={lineIndex} className="block my-2">{line.replaceAll('**', '')}</strong>
                                    }
                                     if (line.startsWith('*')) {
                                        return <li key={lineIndex} className="ms-4">{line.substring(1).trim()}</li>
                                    }
                                    return <p key={lineIndex}>{line}</p>
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>

          {!isFinished ? (
            <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex gap-2">
                <Input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="اكتب ردك هنا..."
                    disabled={isLoading}
                    className="flex-1 border-gray-300 focus:ring-primary"
                />
                <Button onClick={sendMessage} disabled={isLoading || !userInput} className="bg-primary text-primary-foreground hover:bg-primary/90 p-3 h-auto">
                    <Send size={20} />
                </Button>
                <Button onClick={handleFinishAndEvaluate} variant="destructive" className="p-3 h-auto">
                    <GraduationCap size={20} /> إنهاء وتقييم
                </Button>
                </div>
                <div className="text-center mt-2">
                <span className="text-xs text-gray-400">تحدث بمهنية وكأنك في موقف حقيقي. اضغط <RefreshCw className="inline-block h-3 w-3"/> لبدء سيناريو جديد.</span>
                </div>
            </div>
          ) : (
             <div className="p-4 bg-white border-t border-gray-200">
                <Button onClick={handleReset} className="w-full">
                    <RefreshCw size={16} /> ابدأ تدريب جديد
                </Button>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
