'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Lightbulb, 
  PhoneOff, 
  Bot, 
  Mic, 
  Video, 
  ClosedCaption,
  Activity,
  CheckCircle2,
  BrainCircuit,
  ListTodo,
  Upload,
  FileText,
  Trophy,
  Target,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
  Loader2,
  Volume2,
  AlertCircle
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { aiService } from '@/lib/services/ai.services';
import { resumeService } from '@/lib/services/resume.services';
import { toast } from 'react-hot-toast';
import { cn } from '@/utils/cn';

type InterviewStep = 'START' | 'ANALYZING' | 'INTERVIEW' | 'RESULTS';

const MockInterviewView = () => {
  const [step, setStep] = useState<InterviewStep>('START');
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const isListeningRef = useRef(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [allAnswers, setAllAnswers] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(900);
  const [loading, setLoading] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [introText, setIntroText] = useState<string | null>(null);
  const [candidateName, setCandidateName] = useState('Candidate');

  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // Sync ref with state
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    let interval: any;
    if (step === 'INTERVIEW' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setStep('RESULTS');
    }
    return () => clearInterval(interval);
  }, [step, timeLeft]);

  useEffect(() => {
    checkResume();
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        let final = '';
        let interim = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += text + ' ';
          } else {
            interim += text;
          }
        }

        if (final) {
          setTranscript(prev => prev + final);
        }
        setInterimTranscript(interim);
      };

      recognition.onend = () => {
        if (isListeningRef.current) {
          try {
            recognition.start();
          } catch (e) {
            console.error('Recognition restart error:', e);
          }
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const checkResume = async () => {
    try {
      const res = await resumeService.getResumeHistory();
      if (res.success && res.data.length > 0) {
        setResumeId(res.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch resume history');
    }
  };

  const startInterviewProcess = async () => {
    if (!resumeId) {
      toast.error('Please upload a resume first in Resume Analysis section');
      return;
    }

    setStep('ANALYZING');
    setAnalysisProgress(10);
    
    try {
      // Fetch user name from storage
      const userData = localStorage.getItem('portal_user');
      let currentName = 'Candidate';
      if (userData) {
        const user = JSON.parse(userData);
        currentName = user.fullname?.split(' ')[0] || 'Candidate';
        setCandidateName(currentName);
      }

      const res = await aiService.generateResumeQuestions(resumeId);
      if (res.success) {
        setAnalysisProgress(100);
        const allQuestions = [...res.data.technical, ...res.data.behavioral];
        setQuestions(allQuestions);
        
        // Create personalized intro
        const skills = res.data.detectedSkills?.slice(0, 3).join(', ') || 'your technical background';
        setIntroText(`Hello ${currentName}! I've thoroughly reviewed your resume. I see you have impressive experience with ${skills}. I'm Aria, your Senior Recruiter today. Let's start with the first question.`);
        
        setTimeout(() => setStep('INTERVIEW'), 1000);
      }
    } catch (error) {
      toast.error('Failed to generate interview questions');
      setStep('START');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const setVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        const ariaVoice = voices.find(v => 
          v.name.includes('Aria') || 
          v.name.includes('Female') || 
          v.name.includes('Google UK English Female') ||
          v.name.includes('Zira')
        );
        
        if (ariaVoice) utterance.voice = ariaVoice;
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        
        const startMic = () => {
          if (!isListening) {
            setTranscript('');
            try {
              recognitionRef.current?.start();
              setIsListening(true);
            } catch (e) {
              console.error('Mic start error:', e);
            }
          }
        };

        utterance.onend = startMic;
        utterance.onerror = (e) => {
          console.error('TTS Error:', e);
          startMic();
        };

        window.speechSynthesis.speak(utterance);
      };

      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
      } else {
        setVoiceAndSpeak();
      }
    }
  };

  useEffect(() => {
    if (step === 'INTERVIEW') {
      if (introText && currentQuestionIndex === 0) {
        speak(introText);
      } else if (questions[currentQuestionIndex]) {
        speak(questions[currentQuestionIndex]);
      }
    }
  }, [step, currentQuestionIndex, introText]);

  const submitAnswer = async () => {
    if (!transcript) return;
    
    // Stop speaking if still talking
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setLoading(true);
    try {
      const res = await aiService.analyzeAnswer(questions[currentQuestionIndex], transcript);
      if (res.success) {
        setAnalysis(res.data);
        setAllAnswers(prev => [...prev, { question: questions[currentQuestionIndex], answer: transcript, analysis: res.data }]);
        toast.success('Response analyzed!');
        
        if (currentQuestionIndex < questions.length - 1) {
          setTimeout(() => {
            setCurrentQuestionIndex(prev => prev + 1);
            setTranscript('');
            setAnalysis(null);
            setLoading(false);
          }, 3000);
        } else {
          setStep('RESULTS');
        }
      }
    } catch (error) {
      toast.error('Analysis failed');
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(26, 32, 44);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('MOCK INTERVIEW REPORT', 20, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 60, 25);

    // Candidate Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Candidate: ${candidateName}`, 20, 55);
    
    // Summary Box
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(20, 65, pageWidth - 40, 30);
    
    const totalScore = allAnswers.reduce((acc, curr) => acc + (curr.analysis?.score || 0), 0);
    const avgScore = allAnswers.length > 0 ? Math.round(totalScore / allAnswers.length) : 0;
    const timeSpent = 900 - timeLeft;

    doc.setFontSize(11);
    doc.text(`Overall Score: ${avgScore}%`, 30, 75);
    doc.text(`Time Taken: ${formatTime(timeSpent)}`, 30, 85);
    doc.text(`Questions: ${allAnswers.length}/${questions.length}`, 100, 75);

    // Q&A Section
    let yPos = 110;
    doc.setFontSize(16);
    doc.text('Detailed Analysis', 20, yPos);
    yPos += 10;

    allAnswers.forEach((item, idx) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Q${idx + 1}: ${item.question}`, 20, yPos, { maxWidth: pageWidth - 40 });
      yPos += (doc.splitTextToSize(item.question, pageWidth - 40).length * 7);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      const answerText = `Your Answer: ${item.answer || 'No response'}`;
      doc.text(answerText, 25, yPos, { maxWidth: pageWidth - 50 });
      yPos += (doc.splitTextToSize(answerText, pageWidth - 50).length * 5) + 5;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      const feedbackText = `Feedback: ${item.analysis?.feedback}`;
      doc.text(feedbackText, 25, yPos, { maxWidth: pageWidth - 50 });
      yPos += (doc.splitTextToSize(feedbackText, pageWidth - 50).length * 5) + 10;
    });

    doc.save(`${candidateName}_Interview_Report.pdf`);
  };

  const renderStartStep = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-4xl mx-auto text-center space-y-12 px-6 py-12">
      <div className="relative">
        <div className="w-32 h-32 rounded-[40px] bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
          <Bot className="w-16 h-16 text-primary" />
        </div>
        <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shadow-lg shadow-secondary/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-on-surface tracking-tight leading-tight px-2">AI Practice Engine</h1>
        <p className="text-base md:text-xl text-on-surface-variant font-medium max-w-xl mx-auto leading-relaxed px-4">
          Prepare for your dream job with real-time feedback and resume-tailored questions from our AI coach.
        </p>
      </div>

      <div className="w-full max-w-sm md:max-w-xl p-6 md:p-10 glass-card rounded-[32px] border-outline-variant/30 flex flex-col items-center gap-6 mx-4">
        <div className={cn(
          "px-6 py-3 rounded-2xl flex items-center gap-3 border transition-all",
          resumeId ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-amber-500/10 border-amber-500/20 text-amber-600"
        )}>
          {resumeId ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-bold text-sm uppercase tracking-widest">
            {resumeId ? "Resume Ready" : "Resume Required"}
          </span>
        </div>

        <button 
          onClick={resumeId ? startInterviewProcess : () => window.location.href = '/candidate/resume-analysis'}
          className="w-full md:w-auto gradient-button text-white px-12 py-5 rounded-[24px] font-black shadow-2xl flex items-center justify-center gap-4 text-lg hover:scale-[1.02] active:scale-95 transition-all"
        >
          {resumeId ? <Zap className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
          {resumeId ? "Launch Practice Mode" : "Upload Resume to Start"}
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-8 pt-4">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Real-time analysis
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">
          <BrainCircuit className="w-4 h-4 text-primary" />
          Tailored Questions
        </div>
      </div>
    </div>
  );

  const renderAnalyzingStep = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-10 px-4">
      <div className="relative">
        <div className="w-40 h-40 md:w-52 md:h-52 rounded-full border-4 border-primary/10 flex items-center justify-center overflow-hidden">
          <div 
            className="absolute bottom-0 w-full bg-primary/20 transition-all duration-300"
            style={{ height: `${analysisProgress}%` }}
          />
          <BrainCircuit className="w-16 h-16 md:w-20 md:h-20 text-primary animate-pulse z-10" />
        </div>
        <div className="absolute -top-2 -right-2 bg-surface rounded-2xl p-3 shadow-xl border border-outline-variant/20 animate-bounce">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="text-center space-y-4 max-w-md">
        <h3 className="text-2xl font-black text-on-background tracking-tight">AI Brain at Work...</h3>
        <p className="text-on-surface-variant font-bold text-sm uppercase tracking-widest">
          Generating personalized technical questions
        </p>
        <div className="w-full bg-surface-container rounded-full h-2 mt-6 overflow-hidden">
          <div 
            className="bg-primary h-full rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(70,72,212,0.4)]" 
            style={{ width: `${analysisProgress}%` }}
          />
        </div>
      </div>
    </div>
  );

  const renderInterviewStep = () => (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20 px-4 md:px-0 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div className="w-full">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1.5 rounded-full bg-error/10 text-error text-[9px] md:text-[11px] font-black tracking-[0.1em] md:tracking-[0.2em] flex items-center gap-2 border border-error/20">
              <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
              LIVE INTERVIEW
            </span>
            <span className="text-primary font-black text-[9px] md:text-[11px] uppercase tracking-[0.1em] md:tracking-[0.2em] flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full border border-primary/10">
              <Sparkles className="w-3.5 h-3.5" />
              Q {currentQuestionIndex + 1}/{questions.length}
            </span>
          </div>
          <h2 className="text-2xl md:text-5xl font-black text-on-background mb-1 leading-tight">Practice Session</h2>
          <p className="text-on-surface-variant text-sm md:text-lg font-medium opacity-80">With Aria AI Coach</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => setStep('RESULTS')}
            className="flex-1 md:flex-none bg-error text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:shadow-error/30 transition-all active:scale-95 flex items-center justify-center gap-3 text-sm"
          >
            <PhoneOff className="w-5 h-5" />
            End Session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6 md:gap-10">
          
          <div className="glass-card rounded-[40px] overflow-hidden relative group aspect-video shadow-2xl border-outline-variant/20">
            <img 
              alt="Aria AI Coach" 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200&h=800" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            
            <div className="absolute top-6 left-6">
              <div className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-[24px] px-5 py-2.5 flex items-center gap-3 text-white shadow-2xl">
                <Bot className="w-5 h-5 text-primary" />
                <span className="text-sm font-black uppercase tracking-widest">Aria - Senior Recruiter</span>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 bg-black/40 backdrop-blur-[32px] border border-white/10 rounded-[32px] p-6 md:p-8 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20">
                  {introText && currentQuestionIndex === 0 ? "Aria's Introduction" : "Current Question"}
                </span>
              </div>
              <p className="text-base md:text-2xl text-white font-bold leading-relaxed mb-4 md:mb-6 italic line-clamp-4 md:line-clamp-none">
                "{introText && currentQuestionIndex === 0 ? introText : questions[currentQuestionIndex]}"
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1.5 items-end h-5">
                      <div className="w-2 h-4 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-6 bg-primary rounded-full animate-[bounce_1.2s_infinite]"></div>
                      <div className="w-2 h-3 bg-primary rounded-full animate-[bounce_0.8s_infinite]"></div>
                    </div>
                    <span className="text-[11px] font-black text-primary tracking-[0.25em] uppercase">
                      {introText && currentQuestionIndex === 0 ? "Aria is Speaking..." : isListening ? "Listening to you..." : "Waiting..."}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => speak(introText && currentQuestionIndex === 0 ? introText : questions[currentQuestionIndex])}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all border border-white/5"
                      title="Replay Question"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    {introText && currentQuestionIndex === 0 && (
                      <button 
                        onClick={() => setIntroText(null)}
                        className="bg-primary text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                      >
                        Start Answering
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="glass-card rounded-[32px] p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-xl">
              <div className="relative group shrink-0">
                <button 
                  onClick={toggleListening}
                  className={cn(
                    "w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl",
                    isListening ? "bg-error text-white scale-110 shadow-error/40" : "bg-primary text-white hover:scale-105 shadow-primary/40"
                  )}
                >
                  {isListening ? <Mic className="w-10 h-10 animate-pulse" /> : <Mic className="w-10 h-10" />}
                </button>
                {isListening && (
                  <div className="absolute -inset-4 rounded-full border-2 border-error animate-ping opacity-20"></div>
                )}
              </div>

              <div className="flex-1 w-full space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <ClosedCaption className="w-4 h-4" />
                    Live Transcription
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-black text-on-surface tabular-nums">{formatTime(timeLeft)}</span>
                  </div>
                </div>
                <div className="min-h-[80px] md:min-h-[120px] p-6 rounded-2xl bg-surface-container/30 border border-outline-variant/10 text-on-surface text-lg font-medium leading-relaxed italic">
                  {transcript}
                  <span className="text-on-surface/50">{interimTranscript}</span>
                  {!transcript && !interimTranscript && !isListening && "Click the mic to start speaking your answer..."}
                  {!transcript && !interimTranscript && isListening && "Listening..."}
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={submitAnswer}
                    disabled={!transcript || loading}
                    className="flex-1 gradient-button text-white font-black text-sm py-4 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale transition-all"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
                    Analyze & Continue
                  </button>
                  <button 
                    onClick={() => setTranscript('')}
                    className="px-6 py-4 rounded-2xl border border-outline-variant text-on-surface-variant font-black text-sm hover:bg-surface-container transition-all"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 md:gap-10">
          
          <div className="glass-card rounded-[32px] p-8 border border-outline-variant/20 shadow-2xl">
            <h3 className="text-xl font-black text-on-surface mb-8 flex items-center gap-3">
              <Activity className="w-6 h-6 text-primary" />
              AI Live Insights
            </h3>
            
            {analysis ? (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="text-center">
                  <div className="text-5xl font-black text-primary mb-2">{analysis.score}%</div>
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Confidence Score</p>
                </div>

                <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-primary">Aria's Feedback</span>
                  </div>
                  <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
                    {analysis.feedback}
                  </p>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Recommended Points:</span>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keyPoints?.map((pt: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl bg-surface-container text-[11px] font-bold text-on-surface border border-outline-variant/10">
                        {pt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <Volume2 className="w-12 h-12 mb-4" />
                <p className="font-bold text-sm uppercase tracking-widest leading-relaxed">
                  Start speaking to see<br/>live AI feedback
                </p>
              </div>
            )}
          </div>

          <div className="glass-card rounded-[32px] p-8 bg-gradient-to-br from-surface to-primary/5 border-primary/10">
            <h3 className="text-xl font-black text-on-surface mb-6">Framework</h3>
            <div className="space-y-6">
              {questions.map((q, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-black text-[10px] border-2 transition-all",
                    i < currentQuestionIndex ? "bg-emerald-500 border-emerald-500 text-white" : 
                    i === currentQuestionIndex ? "bg-primary border-primary text-white shadow-lg shadow-primary/30" : 
                    "bg-surface-container border-outline-variant text-on-surface-variant"
                  )}>
                    {i < currentQuestionIndex ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <p className={cn(
                    "text-xs font-bold transition-all",
                    i < currentQuestionIndex ? "text-on-surface-variant/40 line-through" : 
                    i === currentQuestionIndex ? "text-primary" : "text-on-surface-variant"
                  )}>
                    {i < 5 ? "Technical Skill Check" : "Behavioral Analysis"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResultsStep = () => {
    const totalScore = allAnswers.reduce((acc, curr) => acc + (curr.analysis?.score || 0), 0);
    const avgScore = allAnswers.length > 0 ? Math.round(totalScore / allAnswers.length) : 0;
    const timeSpent = 900 - timeLeft; // 15 minutes = 900 seconds
    
    return (
      <div ref={reportRef} className="max-w-5xl mx-auto space-y-10 pb-20 px-4 animate-in zoom-in duration-500 print:p-0 print:m-0">
        <div className="text-center space-y-4 print:mt-10">
          <div className="w-24 h-24 bg-emerald-500/10 text-emerald-600 rounded-[32px] mx-auto flex items-center justify-center border border-emerald-500/20 shadow-xl print:hidden">
            <Trophy className="w-12 h-12" />
          </div>
          <h2 className="text-3xl md:text-6xl font-black text-on-background tracking-tight leading-tight">Session Complete!</h2>
          <p className="text-base md:text-xl text-on-surface-variant font-medium max-w-2xl mx-auto px-4">
            {avgScore >= 80 ? "Excellent performance! You're ready for the real deal." : 
             avgScore >= 60 ? "Good job! A little more practice and you'll be perfect." :
             "Keep practicing! Focus on the key points provided below."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-2">
          <div className="glass-card rounded-[24px] md:rounded-[32px] p-6 md:p-8 text-center border-emerald-500/20 bg-emerald-500/5">
            <div className="text-4xl md:text-5xl font-black text-emerald-600 mb-1">{avgScore}%</div>
            <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.15em]">Average Score</p>
          </div>
          <div className="glass-card rounded-[24px] md:rounded-[32px] p-6 md:p-8 text-center border-primary/20 bg-primary/5">
            <div className="text-4xl md:text-5xl font-black text-primary mb-1">{formatTime(timeSpent)}</div>
            <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.15em]">Time Taken</p>
          </div>
          <div className="glass-card rounded-[24px] md:rounded-[32px] p-6 md:p-8 text-center border-secondary/20 bg-secondary/5 sm:col-span-2 md:col-span-1">
            <div className="text-4xl md:text-5xl font-black text-secondary mb-1">{allAnswers.length}/{questions.length}</div>
            <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.15em]">Questions Covered</p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-on-surface flex items-center gap-3">
            <Activity className="w-7 h-7 text-primary" />
            Detailed Question Breakdown
          </h3>
          <div className="grid gap-6">
            {allAnswers.map((item, idx) => (
              <div key={idx} className="glass-card rounded-[32px] p-6 md:p-8 border-outline-variant/20 space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Question {idx + 1}</span>
                    <h4 className="text-lg md:text-xl font-bold text-on-surface">{item.question}</h4>
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-primary/10 text-primary font-black text-lg">
                    {item.analysis?.score}%
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                      Your Response
                    </span>
                    <p className="text-sm text-on-surface italic bg-surface-container/30 p-4 rounded-2xl border border-outline-variant/10">
                      "{item.answer || "No response recorded"}"
                    </p>
                  </div>
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                      AI Feedback
                    </span>
                    <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                      <p className="text-sm font-medium text-on-surface-variant mb-4">{item.analysis?.feedback}</p>
                      <div className="flex flex-wrap gap-2">
                        {(item.analysis?.keyPoints || []).map((pt: string, i: number) => (
                          <span key={i} className="px-2 py-1 rounded-lg bg-white/5 text-[9px] font-bold text-primary border border-primary/10 uppercase">
                            {pt}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4 pt-10 print:hidden">
          <button 
            onClick={() => window.location.reload()}
            className="px-10 py-5 rounded-2xl border-2 border-outline-variant text-on-surface font-black text-sm uppercase tracking-widest hover:bg-surface-container transition-all active:scale-95"
          >
            Start New Session
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="gradient-button text-white px-10 py-5 rounded-2xl font-black shadow-2xl flex items-center justify-center gap-3 text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all"
          >
            Download PDF Report <FileText className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {step === 'START' && renderStartStep()}
      {step === 'ANALYZING' && renderAnalyzingStep()}
      {step === 'INTERVIEW' && renderInterviewStep()}
      {step === 'RESULTS' && renderResultsStep()}
    </div>
  );
};

export default MockInterviewView;
