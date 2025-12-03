"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Loader2, PlayCircle, Send, Award, RefreshCw, ThumbsUp, ThumbsDown, GraduationCap } from 'lucide-react';
import { followupRoleplay, evaluateFollowupPerformance } from '@/app/actions';
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

export function FollowupDojo() {
  const [scenarioType, setScenarioType] = useState('new_lead');
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
    // السيناريوهات الأساسية
    { id: 'new_lead', label: '🆕 عميل جديد', description: 'Lead من المودريتر', difficulty: 'سهل', prompt: 'أنت عميل جديد تم تحويلك من قسم المودريتر. أنت مهتم بخدمات التسويق الرقمي ولديك شركة صغيرة. تريد معرفة المزيد عن الخدمات والأسعار. كن لطيفاً وفضولياً وأسأل أسئلة عن الخدمات والمواعيد.' },
    { id: 'demanding_client', label: '😠 عميل متطلب', description: 'عميل يريد الكمال', difficulty: 'متوسط', prompt: 'أنت عميل حالي متطلب جداً. لديك توقعات عالية جداً وتريد أعلى جودة. تشكو من أن الكمية المسلمة بطيئة وتريد معرفة لماذا. كن حازماً وحذراً في الوعود.' },
    { id: 'confused_brief', label: '❓ عميل محتار بالبريف', description: 'لم يوضح احتياجاته', difficulty: 'متوسط', prompt: 'أنت عميل لديك فكرة غامضة لحملة تسويقية ولكنك لا تعرف بالضبط ماذا تريد. إجاباتك غامضة والهدف من الموظف هو استخراج معلومات واضحة ودقيقة منك.' },

    // السيناريوهات المتقدمة
    { id: 'budget_issue', label: '💵 مشكلة في الميزانية', description: 'ميزانيته انتهت بسرعة', difficulty: 'صعب', prompt: 'أنت عميل بدأت الحملة ولكن الميزانية انتهت أسرع من المتوقع والنتائج ليست جيدة بما يكفي. تريد تقليل الإنفاق أو الحصول على استرجاع جزئي. كن قلقاً وتساءل عن سبب عدم نجاح الحملة.' },
    { id: 'project_delay', label: '⏳ تأخر في المشروع', description: 'الأعمال متأخرة', difficulty: 'صعب', prompt: 'أنت عميل كان لديك موعد نهائي مهم جداً لكن الأعمال تأخرت بسبب بعض التعقيدات. أنت غاضب وتشعر بخيبة أمل. تسأل عن سبب التأخير والحل والتعويض الممكن.' },
    { id: 'retention_opportunity', label: '🔄 فرصة الاحتفاظ بالعميل', description: 'عميل يريد إنهاء التعاقد', difficulty: 'صعب', prompt: 'أنت عميل انتهت فترة التعاقد وتفكر في عدم التجديد. تشعر أن الخدمات غالية الثمن أو أن شركة أخرى تقدم أفضل. هدف الموظف هو إقناعك بالبقاء بتقديم قيمة إضافية.' },
    { id: 'expansion_upsell', label: '📈 توسع الخدمات', description: 'عميل سعيد يريد المزيد', difficulty: 'متوسط', prompt: 'أنت عميل حالي سعيد جداً بخدمات السوشيال ميديا. لكنك تريد الآن توسيع الخدمات لتشمل إعلانات مدفوعة والتصوير. أنت مهتم لكن تريد فهم الرسوم الإضافية والعائد على الاستثمار.' },
    { id: 'scope_creep', label: '🔄 طلبات إضافية', description: 'يزيد المتطلبات', difficulty: 'صعب', prompt: 'أنت عميل بدأت تطلب إضافات كثيرة من غير ما تدفع زيادة. "ممكن تضيفوا ستوري أيضاً؟"، "وفيديو قصير؟"، "وتقارير شهرية؟". كل طلب بتقول عليه "بسيط" و"مش هياخد وقت كتير".' },
    { id: 'result_questions', label: '📊 أسئلة عن النتائج', description: 'يسأل عن الـ ROI', difficulty: 'متوسط', prompt: 'أنت عميل بتسأل أسئلة تفصيلية عن النتائج والـ ROI. "إيه الـ conversion rate؟"، "إيه عدد الـ leads اللي حصلنا عليها؟"، "إيه التوقعات للشهر القادم؟". عايز أرقام وتحليلات واضحة وليس وعود عامة.' },
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
      const response = await followupRoleplay({
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
      const response = await followupRoleplay({
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
    console.log(`Feedback rated as: ${newRating}`);
  };

  const handleFinishAndEvaluate = async () => {
    setIsFinished(true);
    setEvaluating(true);
    setFeedback(null);
    const selectedScenario = scenarios.find(s => s.id === scenarioType)!;

    try {
        const result = await evaluateFollowupPerformance({
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-4 text-white flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2">
          <Bot size={24} /> محاكي قسم المتابعة (Follow-up Dojo)
        </h3>
        {!isStarted && <span className="bg-white/20 text-xs px-2 py-1 rounded-md">Powered by Genkit</span>}
      </div>

      {!isStarted ? (
        <div className="p-6">
          <p className="text-gray-600 mb-6 text-center">اختر سيناريو للتدرب عليه. سيقوم الذكاء الاصطناعي بتمثيل دور العميل، وعليك التعامل معه باحترافية كمسؤول متابعة.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {scenarios.map(s => (
              <button
                key={s.id}
                onClick={() => setScenarioType(s.id)}
                className={`p-4 rounded-xl border-2 transition-all text-right ${
                  scenarioType === s.id
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-100 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                <div className="font-bold mb-1 text-sm">{s.label}</div>
                <div className="text-xs text-muted-foreground mb-2">{s.description}</div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  s.difficulty === 'سهل' ? 'bg-green-100 text-green-700' :
                  s.difficulty === 'متوسط' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {s.difficulty}
                </span>
              </button>
            ))}
          </div>
          <div className="text-center">
            <Button onClick={startSimulation} size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
              <PlayCircle size={20} /> ابدأ المحاكاة
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4" ref={scrollRef}>
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                  m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
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
                    <Loader2 className="animate-spin h-10 w-10 text-blue-600 mb-4" />
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
                    className="flex-1 border-gray-300 focus:ring-blue-600"
                />
                <Button onClick={sendMessage} disabled={isLoading || !userInput} className="bg-blue-600 text-white hover:bg-blue-700 p-3 h-auto">
                    <Send size={20} />
                </Button>
                <Button onClick={handleFinishAndEvaluate} variant="destructive" className="p-3 h-auto">
                    <GraduationCap size={20} /> إنهاء وتقييم
                </Button>
                </div>
                <div className="text-center mt-2">
                <span className="text-xs text-gray-400">تعامل مع العميل باحترافية وفهم احتياجاته. اضغط <RefreshCw className="inline-block h-3 w-3"/> لبدء سيناريو جديد.</span>
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
