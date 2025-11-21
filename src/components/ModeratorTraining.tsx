"use client";

import React, { useState, useRef } from 'react';
import { MessageSquare, CheckCircle, XCircle, AlertTriangle, User, Send, RotateCcw, Award, BarChart2, BookOpen, Sparkles, Loader2, BrainCircuit, ShieldAlert, Gavel, PenTool, Star, Wand2, FileText, Volume2, Scale } from 'lucide-react';

export const ModeratorTraining = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  // حالة التطبيق: 'welcome', 'quiz', 'results'
  const [appState, setAppState] = useState('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // حالات الذكاء الاصطناعي
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [generatedScenarios, setGeneratedScenarios] = useState([]);

  // حالات الميزات الجديدة (TTS & Policy)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [policyAdvice, setPolicyAdvice] = useState('');
  const [isLoadingPolicy, setIsLoadingPolicy] = useState(false);

  // حالات "مختبر الردود" والمساعد السحري
  const [userDraft, setUserDraft] = useState('');
  const [draftAnalysis, setDraftAnalysis] = useState(null);
  const [isAnalyzingDraft, setIsAnalyzingDraft] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // حالات التقرير النهائي
  const [finalReport, setFinalReport] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // قاعدة بيانات السيناريوهات
  const initialScenarios = [
    {
      id: 1,
      level: 1,
      type: 'inquiry',
      platform: 'Instagram',
      customerName: 'سارة علي',
      message: 'ممكن السعر؟ وهل فيه شحن للإسكندرية؟',
      difficulty: 'مبتدئ (Level 1)',
      options: [
        { id: 'a', text: 'تم الرد خاص.', isCorrect: false, feedback: 'ضعيف: إخفاء السعر يقلل التفاعل.' },
        { id: 'b', text: 'أهلاً سارة 🌸 السعر 250 جنيه، ومتاح شحن للإسكندرية خلال يومين. تحبي نبعتلك الألوان المتاحة؟', isCorrect: true, feedback: 'ممتاز: رد ودود ويشجع على الشراء.' },
        { id: 'c', text: 'السعر في البايو.', isCorrect: false, feedback: 'سيء: لا تجبر العميل على البحث.' }
      ]
    },
    {
      id: 3,
      level: 3,
      type: 'angry',
      platform: 'Facebook',
      customerName: 'أحمد محمد',
      message: 'طلبي اتأخر بقاله أسبوع ومحدش بيرد عليا! دي قلة ذوق وخدمة سيئة جداً، أنا هلغي الأوردر.',
      difficulty: 'متوسط (Level 3)',
      options: [
        { id: 'a', text: 'يا فندم شركة الشحن هي السبب مش احنا.', isCorrect: false, feedback: 'دفاعي: لوم طرف ثالث لا يحل المشكلة.' },
        { id: 'b', text: 'حقك علينا جداً يا أستاذ أحمد. بنعتذر عن التأخير الغير مقصود. تم تصعيد الشكوى للإدارة وهنتواصل معاك حالاً للتعويض. ممكن رقم الطلب؟', isCorrect: true, feedback: 'رائع: اعتذار + حل + تعويض.' },
        { id: 'c', text: 'تمام يا فندم، براحتك.', isCorrect: false, feedback: 'كارثي: عدم اكتراث بخسارة العميل.' }
      ]
    },
    {
      id: 7,
      level: 7,
      type: 'crisis',
      platform: 'Instagram Comments',
      customerName: 'Ramy Gamal',
      message: 'يا نصابين!! حولت الفلوس بقالي 3 أيام ومحدش بيرد عليا ولا بعتولي رقم التتبع! حسبي الله ونعم الوكيل.',
      difficulty: 'صعب جداً (Level 7)',
      options: [
        { id: 'a', text: 'يا فندم عيب الكلام ده، احنا شركة محترمة.', isCorrect: false, feedback: 'دفاعي وغير مفيد.' },
        { id: 'b', text: 'أهلاً رامي، تم التواصل معك خاص.', isCorrect: false, feedback: 'غير كافٍ: يجب الرد علناً لطمأنة الآخرين.' },
        { id: 'c', text: 'أستاذ رامي، حقك تقلق وأنا موجود هنا عشان أحل المشكلة بنفسي. الفلوس وصلت والطلب قيد التجهيز، التأخير كان في السيستم فقط. هبعتلك رقم الشحنة حالاُ. اطمن حقك محفوظ.', isCorrect: true, feedback: 'قائد: احتواء وطمأنة علنية.' }
      ]
    }
  ];

  const scenarios = [...initialScenarios, ...generatedScenarios];

  // --- Helper Functions ---
  // تحويل PCM إلى WAV لتشغيله في المتصفح
  const pcmToWav = (pcmData, sampleRate = 24000) => {
    const byteLength = pcmData.length;
    const buffer = new ArrayBuffer(44 + byteLength);
    const view = new DataView(buffer);

    const writeString = (view, offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + byteLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, byteLength, true);

    const pcmBytes = new Uint8Array(pcmData);
    new Uint8Array(buffer, 44).set(pcmBytes);

    return buffer;
  };

  // --- وظائف الذكاء الاصطناعي ---

  // 1. توليد سيناريو
  const generateNewScenario = async () => {
    if (!apiKey) {
        alert('مفتاح Gemini API غير موجود.');
        return;
    }
    setIsGenerating(true);
    try {
      const prompt = `
        Generate a single unique training scenario for a customer support moderator in valid JSON format.
        Scenario should be Arabic, challenging, and modern.
        Do not include markdown formatting.
        Structure: { "id": number, "level": number, "type": "string", "platform": "string", "customerName": "string", "message": "string", "difficulty": "string", "options": [{ "id": "string", "text": "string", "isCorrect": boolean, "feedback": "string" }] }
      `;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const newScenario = JSON.parse(text);
      setGeneratedScenarios([newScenario]);
      setScore(0);
      setCurrentQuestion(initialScenarios.length);
      setAppState('quiz');
      resetQuestionState();
    } catch (error) {
      console.error("Error", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. Text-to-Speech (صوت العميل)
  const playCustomerVoice = async (text, type) => {
    if (!apiKey) {
        alert('مفتاح Gemini API غير موجود.');
        return;
    }
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    
    try {
      // توجيه النبرة بناءً على نوع السيناريو
      let emotionalPrompt = text;
      if (type === 'angry' || type === 'crisis') emotionalPrompt = `Say angrily: ${text}`;
      else if (type === 'troll') emotionalPrompt = `Say sarcastically: ${text}`;
      else emotionalPrompt = `Say politely: ${text}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-to-speech:generateText?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "audioConfig": {
                "audioEncoding": "LINEAR16",
                "pitch": 0,
                "speakingRate": 1,
                "volumeGainDb": 0,
                "sampleRateHertz": 24000
            },
            "input": {
                "text": emotionalPrompt
            },
            "voice": {
                "languageCode": "ar-XA",
                "name": "ar-XA-Standard-A"
            }
        })
      });

      const data = await response.json();
      const base64Audio = data.audioContent;
      
      if (base64Audio) {
        // تحويل Base64 إلى Binary
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // تحويل PCM إلى WAV
        const wavBuffer = pcmToWav(bytes);
        const blob = new Blob([wavBuffer], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        
        const audio = new Audio(url);
        audio.onended = () => setIsPlayingAudio(false);
        audio.play();
      } else {
        setIsPlayingAudio(false);
      }
    } catch (error) {
      console.error("TTS Error", error);
      setIsPlayingAudio(false);
      alert("عذراً، خدمة الصوت غير متاحة حالياً.");
    }
  };

  // 3. مستشار السياسات (Policy Advisor)
  const getPolicyAdvice = async (scenarioType, message) => {
    if (!apiKey) return;
    setIsLoadingPolicy(true);
    setPolicyAdvice('');
    try {
      const prompt = `
        As a Corporate Policy Advisor, define the standard operating procedure (SOP) for this customer situation in Arabic.
        Situation: "${message}" (Type: ${scenarioType}).
        Output format: 
        🛡️ *المادة:* [Policy Name]
        📋 *الإجراء:* [Action Step]
        Keep it formal and brief.
      `;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      setPolicyAdvice(data.candidates?.[0]?.content?.parts?.[0]?.text);
    } catch (error) {
      setPolicyAdvice("تعذر استدعاء السياسات.");
    } finally {
      setIsLoadingPolicy(false);
    }
  };

  // 4. تحليل الموقف (Insight)
  const analyzeCurrentSituation = async (message) => {
    if (!apiKey) return;
    setIsLoadingInsight(true);
    setAiInsight('');
    try {
      const prompt = `Analyze this Arabic customer message: "${message}". Give 1 short pro tip on handling this emotion. Start with "💡 نصيحة:"`;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      setAiInsight(data.candidates?.[0]?.content?.parts?.[0]?.text);
    } catch (error) {
      setAiInsight("تعذر التحليل.");
    } finally {
      setIsLoadingInsight(false);
    }
  };

  // 5. تحليل مسودة المستخدم
  const analyzeUserDraft = async (message) => {
    if (!apiKey) return;
    if (!userDraft.trim()) return;
    setIsAnalyzingDraft(true);
    try {
      const prompt = `
        Evaluate this customer support reply in Arabic: "${userDraft}" for the customer message: "${message}".
        Return JSON: { "score": number (0-100), "feedback": "Short constructive feedback in Arabic" }
      `;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const result = JSON.parse(text);
      setDraftAnalysis(result);
      setShowOptions(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzingDraft(false);
    }
  };

  // 6. إعادة الصياغة السحرية
  const rewriteDraft = async (style) => {
    if (!apiKey) return;
    if (!userDraft.trim()) return;
    setIsRewriting(true);
    try {
      const prompt = `
        Rewrite this customer support response in Arabic to be ${style}:
        "${userDraft}"
        Output only the rewritten text.
      `;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setUserDraft(text.trim());
    } catch (error) {
      console.error(error);
    } finally {
      setIsRewriting(false);
    }
  };

  // 7. توليد التقرير النهائي
  const generateReport = async () => {
    if (!apiKey) return;
    setIsGeneratingReport(true);
    try {
      const prompt = `
        Generate a personal performance report for a moderator student in Arabic.
        Total Score: ${score} out of ${scenarios.length * 10}.
        Provide:
        1. Overall assessment.
        2. Top 2 strengths.
        3. Top 2 areas for improvement.
        4. A short motivational quote.
        Format as plain text with emojis.
      `;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      setFinalReport(data.candidates?.[0]?.content?.parts?.[0]?.text);
    } catch (error) {
      setFinalReport("تعذر توليد التقرير.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleOptionSelect = (option) => {
    if (selectedOption) return;
    setSelectedOption(option);
    setShowFeedback(true);
    if (option.isCorrect) {
      setScore(score + 10);
    }
  };

  const resetQuestionState = () => {
    setAiInsight('');
    setPolicyAdvice(''); // Reset policy
    setUserDraft('');
    setDraftAnalysis(null);
    setShowOptions(false);
    setSelectedOption(null);
    setShowFeedback(false);
    setIsPlayingAudio(false); // Stop any playing audio
  };

  const handleNext = () => {
    resetQuestionState();
    if (currentQuestion < scenarios.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setAppState('results');
      generateReport();
    }
  };

  const restartGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setFinalReport('');
    resetQuestionState();
    setAppState('welcome');
  };

  // --- Screens ---

  const WelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-6 text-center" dir="rtl">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-100">
        <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <BrainCircuit className="w-10 h-10 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-800 mb-4">أكاديمية الذكاء الاصطناعي</h1>
        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
          تجربة تدريبية غامرة. استمع لشكاوى العملاء بصوتهم الحقيقي 🔊، واستشر الذكاء الاصطناعي ⚖️ في السياسات قبل الرد.
        </p>
        <button 
          onClick={() => { setGeneratedScenarios([]); setAppState('quiz'); }}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 rounded-full shadow-lg flex items-center justify-center gap-3 transition-transform hover:scale-105"
        >
          ابدأ التدريب <Send className="w-5 h-5 rotate-180" />
        </button>
        <button 
          onClick={generateNewScenario}
          disabled={isGenerating}
          className="w-full mt-4 bg-white text-purple-600 border-2 border-purple-100 hover:bg-purple-50 font-bold py-4 px-12 rounded-full shadow-sm flex items-center justify-center gap-3"
        >
          {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />} سيناريو عشوائي (AI)
        </button>
      </div>
    </div>
  );

  const QuizScreen = () => {
    const currentScenario = scenarios[currentQuestion];
    if (!currentScenario) return <div>Loading...</div>;

    return (
      <div className="min-h-screen bg-slate-100 p-4 md:p-8" dir="rtl">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm">
            <span className="font-bold text-slate-600">السؤال {currentQuestion + 1} من {scenarios.length}</span>
            <span className="font-bold text-indigo-600 text-lg">النقاط: {score}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Scenario & Draft */}
            <div className="space-y-6">
              {/* Message Card */}
              <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0"><User className="text-slate-500" /></div>
                  <div className="w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-800">{currentScenario.customerName}</h3>
                        <span className="text-xs text-slate-400">{currentScenario.platform}</span>
                      </div>
                      <button 
                        onClick={() => playCustomerVoice(currentScenario.message, currentScenario.type)}
                        disabled={isPlayingAudio}
                        className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded-full transition-all shadow-sm ${isPlayingAudio ? 'bg-indigo-100 text-indigo-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                      >
                        {isPlayingAudio ? <Loader2 className="w-3 h-3 animate-spin" /> : <Volume2 className="w-3 h-3" />}
                        {isPlayingAudio ? 'جاري التحدث...' : 'استمع للرسالة'}
                      </button>
                    </div>
                    <p className="mt-3 bg-slate-50 p-4 rounded-xl text-slate-700 border border-slate-100 leading-relaxed text-lg">{currentScenario.message}</p>
                    
                    {/* AI Tools Buttons */}
                    <div className="mt-3 flex gap-2 flex-wrap">
                       {/* Insight Button */}
                       {!aiInsight && !isLoadingInsight ? (
                         <button onClick={() => analyzeCurrentSituation(currentScenario.message)} className="text-xs flex items-center gap-1 text-purple-600 bg-purple-50 border border-purple-100 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors font-medium">
                           <Sparkles className="w-3 h-3" /> تحليل نفسي
                         </button>
                       ) : isLoadingInsight ? (
                         <span className="text-xs text-slate-400 flex items-center gap-1 px-3"><Loader2 className="w-3 h-3 animate-spin" /></span>
                       ) : null}

                       {/* Policy Button */}
                       {!policyAdvice && !isLoadingPolicy ? (
                         <button onClick={() => getPolicyAdvice(currentScenario.type, currentScenario.message)} className="text-xs flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-100 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors font-medium">
                           <Scale className="w-3 h-3" /> استشارة السياسات
                         </button>
                       ) : isLoadingPolicy ? (
                         <span className="text-xs text-slate-400 flex items-center gap-1 px-3"><Loader2 className="w-3 h-3 animate-spin" /></span>
                       ) : null}
                    </div>

                    {/* AI Output Areas */}
                    <div className="space-y-2 mt-2">
                      {aiInsight && (
                        <div className="text-xs bg-purple-50 text-purple-900 p-3 rounded-lg border border-purple-100 animate-fadeIn flex gap-2">
                          <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          {aiInsight}
                        </div>
                      )}
                      {policyAdvice && (
                        <div className="text-xs bg-amber-50 text-amber-900 p-3 rounded-lg border border-amber-100 animate-fadeIn flex gap-2 whitespace-pre-line">
                          <Gavel className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          {policyAdvice}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Magic Draft Lab */}
              <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2"><PenTool className="w-4 h-4" /> مختبر الردود الذكي</h4>
                <textarea
                  value={userDraft}
                  onChange={(e) => setUserDraft(e.target.value)}
                  placeholder="اكتب ردك المقترح هنا..."
                  className="w-full p-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-sm min-h-[100px] mb-3 bg-white"
                  disabled={draftAnalysis !== null || isRewriting}
                />
                
                {/* Magic Rewrite Buttons */}
                {!draftAnalysis && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    <button onClick={() => rewriteDraft("More Empathetic")} disabled={isRewriting || !userDraft.trim()} className="text-xs bg-white text-pink-600 border border-pink-200 hover:bg-pink-50 px-3 py-1 rounded-full flex items-center gap-1 transition-colors">
                      {isRewriting ? <Loader2 className="w-3 h-3 animate-spin" /> : "💖 أكثر تعاطفاً"}
                    </button>
                    <button onClick={() => rewriteDraft("More Professional")} disabled={isRewriting || !userDraft.trim()} className="text-xs bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 px-3 py-1 rounded-full flex items-center gap-1 transition-colors">
                      {isRewriting ? <Loader2 className="w-3 h-3 animate-spin" /> : "💼 أكثر احترافية"}
                    </button>
                    <button onClick={() => rewriteDraft("More Concise")} disabled={isRewriting || !userDraft.trim()} className="text-xs bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 px-3 py-1 rounded-full flex items-center gap-1 transition-colors">
                      {isRewriting ? <Loader2 className="w-3 h-3 animate-spin" /> : "⚡ مختصر"}
                    </button>
                  </div>
                )}

                {!draftAnalysis ? (
                  <div className="flex justify-between items-center">
                    <button onClick={() => analyzeUserDraft(currentScenario.message)} disabled={isAnalyzingDraft || !userDraft.trim()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                      {isAnalyzingDraft ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} تقييم الرد
                    </button>
                    <button onClick={() => setShowOptions(true)} className="text-slate-500 text-sm underline hover:text-slate-700">عرض الاختيارات</button>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-3 border border-indigo-100 animate-fadeIn">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-indigo-900 text-sm">التقييم:</span>
                      <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{draftAnalysis.score}/100</span>
                    </div>
                    <p className="text-xs text-slate-600">{draftAnalysis.feedback}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Options & Feedback */}
            <div className="space-y-4">
              {(showOptions || draftAnalysis) ? (
                <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200 animate-slideIn">
                   <h4 className="font-bold text-slate-800 mb-4">اختر الرد الأنسب:</h4>
                   <div className="space-y-3">
                    {currentScenario.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleOptionSelect(option)}
                        disabled={selectedOption !== null}
                        className={`w-full text-right p-4 rounded-xl border-2 transition-all ${selectedOption === option ? (option.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-slate-100 hover:border-indigo-200'}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-slate-700 font-medium text-sm">{option.text}</span>
                          {selectedOption === option && (option.isCorrect ? <CheckCircle className="text-green-500 w-5 h-5" /> : <XCircle className="text-red-500 w-5 h-5" />)}
                        </div>
                        {selectedOption === option && <p className={`text-xs mt-2 ${option.isCorrect ? 'text-green-700' : 'text-red-700'}`}>{option.feedback}</p>}
                      </button>
                    ))}
                   </div>
                   {selectedOption && (
                     <button onClick={handleNext} className="w-full mt-4 bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-900 transition-colors">
                       {currentQuestion < scenarios.length - 1 ? 'التالي' : 'إنهاء وعرض التقرير'}
                     </button>
                   )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl p-8">
                  <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
                  <p>حاول كتابة ردك أولاً في المختبر لتحدي نفسك!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ResultsScreen = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6" dir="rtl">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-2xl w-full border border-slate-200">
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-green-100 mb-4">
             <Award className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">تقرير الأداء النهائي</h2>
          <div className="text-slate-500 mt-2">النتيجة: <span className="text-indigo-600 font-bold text-xl">{score}</span> / {scenarios.length * 10}</div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-8 min-h-[200px]">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" /> تحليل الذكاء الاصطناعي:
          </h3>
          {isGeneratingReport ? (
            <div className="flex flex-col items-center justify-center h-32 text-slate-400 gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              <p>جاري كتابة تقريرك الشخصي...</p>
            </div>
          ) : (
            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line animate-fadeIn">
              {finalReport || "لم يتم توليد التقرير."}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={restartGame} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> تدريب جديد
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen">
      {appState === 'welcome' && <WelcomeScreen />}
      {appState === 'quiz' && <QuizScreen />}
      {appState === 'results' && <ResultsScreen />}
    </div>
  );
};
