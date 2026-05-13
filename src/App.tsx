import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, ChevronLeft, CheckCircle2, 
  XCircle, Trash2, Eye, Target, Search, ListChecks, Lightbulb, 
  Activity, BookOpen, Star, ArrowRight, 
  MessageCircleQuestion, Link, Award, ArrowUp, ArrowDown, AlertCircle, Leaf,
  Microscope, TestTube, AlignLeft, Scale, Home
} from 'lucide-react';
import { closedQuestionsData, openQuestionsChapters, bagrutExamData } from './data';

// ==========================================
// TYPES
// ==========================================

type ViewState = 'welcome' | 'paths_menu' | 'learn' | 'practice' | 'bagrut_exam';

// ==========================================
// MAIN APP COMPONENT
// ==========================================

export default function BiologyApp() {
  const [view, setView] = useState<ViewState>('welcome');
  const [selectedPath, setSelectedPath] = useState<'closed' | 'open' | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  const getActiveChapter = () => {
    if (selectedPath === 'closed') return closedQuestionsData;
    if (selectedPath === 'open') return openQuestionsChapters[currentChapterIndex];
    return null;
  };

  const [showRoadmap, setShowRoadmap] = useState(false);

  const handleStartPath = (pathType: 'closed' | 'open') => {
    setSelectedPath(pathType);
    setCurrentChapterIndex(0);
    if (pathType === 'open') {
      setShowRoadmap(true);
      setView('learn');
    } else {
      setShowRoadmap(false);
      setView('learn');
    }
  };

  const handleSelectOpenChapter = (index: number) => {
    setCurrentChapterIndex(index);
    setShowRoadmap(false);
  };

  const handleStartOpenChallenge = () => {
    setShowRoadmap(false);
  };

  const handleFinishLearn = () => {
    setView('practice');
  };

  const handleFinishPractice = () => {
    if (selectedPath === 'open') {
      setShowRoadmap(true);
      setView('learn');
    } else {
      setView('paths_menu');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeChapter = getActiveChapter();

  return (
    <div className="min-h-screen bg-[#F0FDF4] text-slate-800 font-sans selection:bg-green-200" dir="rtl">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm p-4 sticky top-0 z-50 border-b-4 border-green-800">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-green-800 p-2 rounded-xl shadow-md cursor-pointer hover:scale-105 transition-transform" onClick={() => setView('welcome')}>
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-green-900 tracking-tight leading-none">הקוד לביולוגיה</h1>
              <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Mastering Bagrut Questions</span>
            </div>
          </div>
          
          {view !== 'welcome' && view !== 'paths_menu' && (
            <button 
              onClick={() => { setView('paths_menu'); setShowRoadmap(false); }} 
              className="text-xs font-bold text-green-700 hover:text-white hover:bg-green-800 px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 border border-green-200"
            >
              <Home className="w-3.5 h-3.5" /> תפריט ראשי
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className={`max-w-4xl mx-auto transition-all ${view === 'bagrut_exam' ? 'p-2 md:p-4' : 'p-4 md:p-8'}`}>
        <AnimatePresence mode="wait">
          {view === 'welcome' && (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <WelcomeScreen onStart={() => setView('paths_menu')} />
            </motion.div>
          )}
          
          {view === 'paths_menu' && (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <PathsMenu 
                onSelect={handleStartPath} 
                onBagrut={() => setView('bagrut_exam')}
              />
            </motion.div>
          )}
          
          {view === 'learn' && activeChapter && (
            <motion.div 
              key={`learn-${activeChapter.id}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              {showRoadmap ? (
                <Roadmap 
                  onSelectStep={handleSelectOpenChapter} 
                />
              ) : (
                <LearningSlider chapter={activeChapter} onFinish={handleFinishLearn} />
              )}
            </motion.div>
          )}
          
          {view === 'practice' && activeChapter && (
            <motion.div 
              key={`practice-${activeChapter.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
            >
              <PracticeDispatcher chapter={activeChapter} onFinish={handleFinishPractice} />
            </motion.div>
          )}

          {view === 'bagrut_exam' && (
            <motion.div 
              key="bagrut_exam"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <BagrutExam onFinish={() => setView('paths_menu')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ==========================================
// VIEWS COMPONENTS
// ==========================================

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center py-16 md:py-24 flex flex-col items-center">
      <div className="relative mb-10 group">
        <div className="absolute inset-0 bg-green-500 blur-3xl opacity-30 rounded-full group-hover:opacity-50 transition-opacity duration-700"></div>
        <motion.div 
          animate={{ rotate: [-3, 0, -3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="bg-gradient-to-br from-green-700 to-green-900 p-8 rounded-3xl shadow-2xl relative border-4 border-green-200"
        >
          <Award className="w-20 h-20 text-white" />
        </motion.div>
      </div>
      
      <h2 className="text-5xl md:text-6xl font-black text-green-900 mb-6 tracking-tight">לפצח את הבגרות.</h2>
      <p className="text-xl text-green-800 mb-12 max-w-2xl leading-relaxed font-medium">
        ברוכים הבאים למערכת הפיצוח. כאן תוכלו ללמוד ולתרגל בנפרד את השיטות המדויקות למענה על <span className="font-bold text-green-700 bg-white px-2 py-1 rounded-md shadow-sm">שאלות סגורות</span> ועל <span className="font-bold text-green-700 bg-white px-2 py-1 rounded-md shadow-sm">שאלות פתוחות</span>.
      </p>
      
      <button 
        onClick={onStart}
        className="group relative inline-flex items-center justify-center gap-3 bg-green-800 text-white px-10 py-5 rounded-2xl font-black text-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 hover:bg-green-900 border-b-4 border-green-950"
      >
        <span className="relative z-10">היכנסו למערכת</span>
        <ArrowRight className="w-6 h-6 relative z-10 group-hover:-translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

function PathsMenu({ onSelect, onBagrut }: { onSelect: (type: 'closed' | 'open') => void, onBagrut: () => void }) {
  return (
    <div className="pb-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-green-900 mb-4">בחרו מסלול תרגול</h2>
        <p className="text-lg text-green-800 font-medium">בחרו איזה סוג של שאלות תרצו לתרגל כעת. כל מסלול מתחיל בהדרכה קצרה וממוקדת.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-3xl p-6 shadow-xl border-2 border-green-100 hover:border-green-500 transition-all group flex flex-col items-center text-center"
        >
          <div className="bg-green-100 p-5 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-inner">
            <ListChecks className="w-10 h-10 text-green-800" />
          </div>
          <h3 className="text-xl font-black text-green-900 mb-2">מסלול שאלות סגורות</h3>
          <p className="text-green-800 mb-6 flex-grow leading-relaxed font-medium text-sm">
            איך לעבוד נכון עם שאלות רב-ברירה. נלמד את שיטת השליפה מהראש ואלימינציית מסיחים.
          </p>
          <button 
            onClick={() => onSelect('closed')}
            className="w-full bg-green-800 hover:bg-green-900 text-white font-bold py-3 rounded-xl shadow-md transition-all text-base border-b-4 border-green-950 active:border-b-0 active:translate-y-1"
          >
            התחל מסלול סגורות
          </button>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-3xl p-6 shadow-xl border-2 border-green-100 hover:border-green-500 transition-all group flex flex-col items-center text-center"
        >
          <div className="bg-green-100 p-5 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-inner">
            <BookOpen className="w-10 h-10 text-green-800" />
          </div>
          <h3 className="text-xl font-black text-green-900 mb-2">מסלול שאלות פתוחות</h3>
          <p className="text-green-800 mb-6 flex-grow leading-relaxed font-medium text-sm">
            אסטרטגיית 3 השאלות, זיהוי מילות הוראה, ובניית שרשור נסיבתי. מסלול יסודי בן 3 פרקים.
          </p>
          <button 
            onClick={() => onSelect('open')}
            className="w-full bg-green-800 hover:bg-green-900 text-white font-bold py-3 rounded-xl shadow-md transition-all text-base border-b-4 border-green-950 active:border-b-0 active:translate-y-1"
          >
            התחל מסלול פתוחות
          </button>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-green-50 rounded-3xl p-6 shadow-xl border-2 border-green-300 hover:border-green-600 transition-all group flex flex-col items-center text-center"
        >
          <div className="bg-white p-5 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-md">
            <Award className="w-10 h-10 text-green-800" />
          </div>
          <h3 className="text-xl font-black text-green-900 mb-2">סימולציית בחינת בגרות</h3>
          <p className="text-green-800 mb-6 flex-grow leading-relaxed font-medium text-sm">
            תרגול הכוללת שאלת סגורות ופתוחות עם פתרונות מלאים ומחוון.
          </p>
          <button 
            onClick={onBagrut}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl shadow-md transition-all text-base border-b-4 border-green-900 active:border-b-0 active:translate-y-1"
          >
            התחל בחינת בגרות
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function Roadmap({ onSelectStep }: { onSelectStep: (idx: number) => void }) {
  const steps = [
    { title: 'מילות הוראה', desc: 'ציינו, רשמו, קבעו, תארו, פרטו, הסבירו, נמקו, השוו', icon: <Target className="w-6 h-6" /> },
    { title: '3 השאלות', desc: 'אפיון השאלה והידע הנדרש', icon: <MessageCircleQuestion className="w-6 h-6" /> },
    { title: 'שרשור נסיבתי', desc: 'בניית הסבר לוגי מלא', icon: <Link className="w-6 h-6" /> }
  ];

  return (
    <div className="max-w-xl mx-auto py-10 animate-fade-in text-right">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-black text-green-900 mb-2">מפת הדרכים לשאלות פתוחות</h3>
        <p className="text-green-700 font-bold">בחרו את התחנה שבה תרצו להתחיל:</p>
      </div>

      <div className="relative space-y-6">
        {/* Connecting line */}
        <div className="absolute top-2 bottom-2 right-[27px] w-1 bg-green-200 -z-10 rounded-full" />
        
        {steps.map((step, idx) => {
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => onSelectStep(idx)}
              className="flex items-start gap-6 bg-white p-5 rounded-2xl shadow-md border-2 border-green-100 hover:border-green-500 cursor-pointer group transition-all"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-green-800 text-white shadow-lg border-2 border-green-400 z-10 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              
              <div className="pt-1 flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-xl font-black text-green-900">{step.title}</h4>
                  <div className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">תחנה {idx + 1}</div>
                </div>
                <p className="text-sm font-bold text-green-700">{step.desc}</p>
                
                <div className="mt-3 flex items-center gap-2 text-green-800 font-black text-xs group-hover:gap-3 transition-all">
                  יוצאים לדרך <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function LearningSlider({ chapter, onFinish }: { chapter: any, onFinish: () => void }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const slide = chapter.learnSlides[slideIdx];
  const isLast = slideIdx === chapter.learnSlides.length - 1;

  useEffect(() => { setSlideIdx(0); }, [chapter]);

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="text-center mb-8">
        <span className={`${chapter.theme.bg} ${chapter.theme.text} px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest inline-block mb-3 border ${chapter.theme.border} shadow-sm`}>
          שלב למידה והדרכה
        </span>
        <h2 className="text-3xl font-black text-green-900">{chapter.title}</h2>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl border-2 border-green-200 overflow-hidden relative">
        <div className="bg-green-50 border-b border-green-200 p-4 flex justify-center items-center gap-3">
          {chapter.learnSlides.map((_: any, i: number) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === slideIdx ? `${chapter.theme.primary} w-8 shadow-sm` : i < slideIdx ? `${chapter.theme.primary} w-4 opacity-40` : 'bg-green-200 w-4'}`} />
          ))}
        </div>

        <div className="p-8 md:p-12 text-center min-h-[440px] flex flex-col justify-center items-center">
          <AnimatePresence mode="wait">
            <motion.div 
              key={slideIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-lg"
            >
              <div className="mb-8">{slide.icon}</div>
              <h3 className="text-3xl font-black text-green-900 mb-6">{slide.title}</h3>
              <div className="text-lg text-green-900 leading-relaxed text-right bg-green-50 p-6 rounded-2xl border border-green-200 shadow-inner whitespace-pre-line"
                 dangerouslySetInnerHTML={{__html: slide.content.replace(/\*\*(.*?)\*\*/g, `<strong class="text-green-900 bg-white border border-green-200 px-2 py-0.5 rounded shadow-sm">$1</strong>`)}}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-6 bg-green-50 border-t border-green-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={() => setSlideIdx(s => Math.max(0, s - 1))} 
              className={`font-bold px-6 py-3 rounded-xl transition-all flex-1 md:flex-none ${slideIdx === 0 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-green-800 hover:bg-green-200 border border-green-300 shadow-sm'}`} 
              disabled={slideIdx === 0}
            >
              חזור
            </button>
            <button 
              onClick={onFinish}
              className="font-bold px-4 py-3 rounded-xl text-green-600 hover:bg-green-100 border border-green-200 transition-all text-sm flex-1 md:flex-none"
            >
              דלג לתרגול
            </button>
          </div>
          
          <button 
            onClick={() => isLast ? onFinish() : setSlideIdx(s => s + 1)} 
            className={`w-full md:w-auto font-bold px-8 py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-white border-b-4 border-green-950 active:border-b-0 active:translate-y-1 ${isLast ? 'bg-orange-600 hover:bg-orange-700 animate-pulse-subtle' : chapter.theme.primary + ' ' + chapter.theme.hover}`}
          >
            {isLast ? `קדימה, לתרגול השאלות!` : 'המשך בהדרכה'} <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PracticeDispatcher({ chapter, onFinish }: { chapter: any, onFinish: () => void }) {
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (chapter.practice) {
      setShuffledQuestions([...chapter.practice].sort(() => Math.random() - 0.5));
    }
  }, [chapter]);

  if (!shuffledQuestions.length) return null;

  return (
    <div className="pb-20">
       <div className="text-center mb-8">
        <span className={`${chapter.theme.bg} ${chapter.theme.text} border ${chapter.theme.border} px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest inline-flex items-center gap-2 mb-3 shadow-sm`}>
          <Activity className="w-4 h-4 text-green-700" /> זמן לתרגול מעשי
        </span>
        <h2 className="text-3xl font-black text-green-900">{chapter.title}</h2>
      </div>

      {chapter.id === 'closed' && <PracticeClosed questions={shuffledQuestions} theme={chapter.theme} onFinish={onFinish} />}
      {chapter.type === 'three_questions' && <PracticeThreeQuestions questions={shuffledQuestions} theme={chapter.theme} onFinish={onFinish} />}
      {chapter.type === 'words' && <PracticeWords questions={shuffledQuestions} theme={chapter.theme} onFinish={onFinish} />}
      {chapter.type === 'chain' && <PracticeChain questions={shuffledQuestions} theme={chapter.theme} onFinish={onFinish} />}
    </div>
  );
}

// ==========================================
// 1. PRACTICE: CLOSED QUESTIONS
// ==========================================
function PracticeClosed({ questions, theme, onFinish }: { questions: any[], theme: any, onFinish: () => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [step, setStep] = useState(1);
  const [eliminated, setEliminated] = useState<Record<number, boolean>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [mentalGuess, setMentalGuess] = useState('');

  const q = questions[qIndex];

  useEffect(() => {
    setStep(1);
    setEliminated({});
    setSelected(null);
    setMentalGuess('');
  }, [qIndex]);

  // Shuffled options for consistency during the question
  const shuffledOptions = useMemo(() => {
    return [...q.options].sort(() => Math.random() - 0.5);
  }, [q]);

  const handleNextQ = () => {
    if (qIndex < questions.length - 1) {
      setQIndex(p => p + 1);
      setStep(1); setEliminated({}); setSelected(null); setMentalGuess('');
    } else onFinish();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-green-200 overflow-hidden max-w-2xl mx-auto">
      <div className="p-2 bg-green-50 border-b border-green-200 flex justify-between font-bold text-[10px] text-green-800 uppercase tracking-widest">
        <span>שאלה {qIndex + 1} מתוך {questions.length}</span>
        <span className={`${theme.text}`}>אסטרטגית אלימינציה: מחקו את המסיחים שאתם חושבים שהם בטוח לא נכונים</span>
      </div>
      
      <div className="p-4 md:p-5 bg-white border-b border-green-50 shadow-sm">
        <h3 className="text-base md:text-lg font-bold text-green-900 leading-snug text-right">{q.text}</h3>
      </div>
      
      <div className="p-4 md:p-6 bg-[#FBFDFB]">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className={`border-2 ${theme.border} ${theme.bg} rounded-xl p-6 mb-6 shadow-inner`}>
              <Eye className={`w-8 h-8 ${theme.text} mx-auto mb-3`} />
              <h4 className="text-base font-black text-green-900 mb-1">המסיחים מוסתרים במכוון</h4>
              <p className="text-[11px] text-green-800 mb-6 font-bold text-center">כדי לא להתבלבל, נסו לענות על השאלה בראש קודם.</p>
              <textarea 
                className="w-full p-3 rounded-lg border border-white focus:border-green-400 outline-none resize-none shadow-md text-green-900 font-bold text-sm" 
                rows={2} 
                placeholder="לדעתי התשובה היא..." 
                value={mentalGuess} 
                onChange={e => setMentalGuess(e.target.value)} 
              />
            </div>
            <button 
              onClick={() => setStep(2)} 
              className={`w-full bg-green-800 hover:bg-green-900 text-white font-black py-4 rounded-xl shadow-lg transition-all text-sm border-b-4 border-green-950 active:border-b-0 active:translate-y-1`}
            >
              כתבתי, הראה לי מסיחים
            </button>
          </motion.div>
        )}

        {step >= 2 && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              {shuffledOptions.map((opt: any, idx: number) => {
                const isEliminated = eliminated[idx];
                const isSelected = selected === idx;
                const showResults = step === 3;
                
                let boxStyle = "relative flex items-center border-2 rounded-xl p-3 transition-all duration-300 min-h-[50px] ";
                let textStyle = "flex-grow text-sm pr-10 transition-all ";

                if (showResults) {
                  if (opt.isCorrect) boxStyle += "bg-green-50 border-green-500 shadow-sm ring-1 ring-green-100";
                  else if (isSelected) boxStyle += "bg-red-50 border-red-400";
                  else boxStyle += "bg-gray-50 border-gray-100 opacity-60";
                  textStyle += (opt.isCorrect ? "font-black text-green-900" : isSelected ? "font-bold text-red-900" : "text-gray-400");
                } else {
                  if (isEliminated) { 
                    boxStyle += "bg-gray-50 border-gray-100 opacity-40 shadow-none"; 
                    textStyle += "line-through text-gray-400"; 
                  }
                  else { 
                    boxStyle += `bg-white border-green-50 hover:border-green-400 cursor-pointer shadow-sm hover:shadow-md`; 
                    textStyle += "text-slate-700 font-bold";
                  }
                }

                return (
                  <motion.div 
                    layout
                    key={idx} 
                    className={boxStyle} 
                    onClick={() => { if(step===2 && !isEliminated) { setSelected(idx); setStep(3); } }}
                  >
                    {!showResults && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEliminated(p => ({...p, [idx]: !p[idx]})); }} 
                        className={`absolute left-3 p-1.5 rounded-lg transition-all z-10 ${isEliminated ? 'bg-gray-300 text-white' : 'bg-red-50 text-red-400 hover:bg-red-500 hover:text-white shadow-sm border border-red-100'}`} 
                        title="אלימינציה"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    {showResults && opt.isCorrect && <CheckCircle2 className="absolute right-3 w-5 h-5 text-green-600" />}
                    {showResults && isSelected && !opt.isCorrect && <XCircle className="absolute right-3 w-5 h-5 text-red-500" />}
                    <div className={textStyle}>{opt.text}</div>
                  </motion.div>
                );
              })}
            </div>

            {step === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-green-200 p-4 rounded-xl shadow-md space-y-2">
                <h4 className="text-xs font-black text-green-900 flex items-center gap-2">
                   <Target className="w-4 h-4 text-green-700" /> ניתוח התשובות:
                </h4>
                <ul className="space-y-1.5">
                  {[...q.options].sort((a,b) => (a.isCorrect === b.isCorrect ? 0 : a.isCorrect ? -1 : 1)).map((opt: any, idx: number) => (
                    <li key={idx} className={`p-2 rounded-lg border-r-4 flex gap-2 items-start text-[11px] ${opt.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-300'}`}>
                      <div className="pt-0.5">{opt.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600"/> : <XCircle className="w-3.5 h-3.5 text-red-500"/>}</div>
                      <span className="text-slate-900 font-bold leading-tight text-right">{opt.explanation}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
            
            {step === 3 && (
              <button 
                onClick={handleNextQ} 
                className="w-full bg-green-800 hover:bg-green-900 text-white font-black py-3.5 rounded-xl shadow-lg transition-all text-sm border-b-4 border-green-950 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2"
              >
                {qIndex < questions.length - 1 ? 'לשאלה הבאה' : 'סיום מסלול'} <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 2. PRACTICE: 3 QUESTIONS STRATEGY
// ==========================================
function PracticeThreeQuestions({ questions, theme, onFinish }: { questions: any[], theme: any, onFinish: () => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [inputs, setInputs] = useState({ final: '' });

  const q = questions[qIndex];

  // Get options for current stage
  const currentOptions = useMemo(() => {
    let opts = [];
    if (step === 1) opts = q.stage1Options || [];
    else if (step === 2) opts = q.stage2Options || [];
    else if (step === 3) opts = q.stage3Options || [];
    
    if (opts.length === 0) return [];
    return [...opts].sort(() => Math.random() - 0.5);
  }, [qIndex, step, q]);

  const handleNextQ = () => {
    if (qIndex < questions.length - 1) {
      setQIndex(p => p + 1);
      setStep(1);
      setSelectedOption(null);
      setIsAnswered(false);
      setInputs({ final: '' });
    } else onFinish();
  };

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
  };

  const nextStep = () => {
    if (step < 4) {
      setStep(p => p + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setStep(5);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-green-200 overflow-hidden max-w-2xl mx-auto">
      <div className="p-2 bg-green-50 border-b border-green-200 flex justify-between font-bold text-[10px] text-green-800 uppercase tracking-widest">
        <span>שאלה {qIndex + 1} מתוך {questions.length}</span>
        <span className={`${theme.text}`}>אסטרטגיית 3 השאלות</span>
      </div>
      
      <div className="p-4 md:p-5 bg-white border-b border-green-50 shadow-sm">
        <h3 className="text-base md:text-lg font-bold text-green-900 leading-snug text-right mb-4">{q.text}</h3>
        
        {q.table && (
          <div className="overflow-x-auto mb-2">
            <table className="w-full border-collapse border border-green-100 text-right text-[10px]">
              <thead>
                <tr className="bg-green-50">
                  {q.table[0].map((cell: any, i: number) => (
                    <th key={i} className="border border-green-100 p-1.5 font-black text-green-900">{cell}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {q.table.slice(1).map((row: any[], i: number) => (
                  <tr key={i} className="hover:bg-green-50/50">
                    {row.map((cell: any, j: number) => (
                      <td key={j} className="border border-green-50 p-1.5 text-green-800 font-bold">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="p-4 md:p-6 bg-[#FBFDFB]">
        <div className="flex gap-1.5 mb-6 justify-center">
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`h-2 rounded-full transition-all duration-500 ${step >= i ? `${theme.primary} w-8 shadow-sm` : 'bg-green-100 w-3 opacity-30'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step <= 3 && (
            <motion.div key={`s${step}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <h4 className="text-base font-black text-green-900 flex items-center gap-2">
                  {step === 1 && <><MessageCircleQuestion className="w-5 h-5 text-green-700"/> 1. מה שואלים?</>}
                  {step === 2 && <><Lightbulb className="w-5 h-5 text-green-700"/> 2. מה ידוע לי?</>}
                  {step === 3 && <><AlignLeft className="w-5 h-5 text-green-700"/> 3. מה סוג התשובה?</>}
                </h4>
                <p className="text-[11px] text-green-700 font-bold leading-tight mt-1">
                  {step === 1 && 'מה מוטל עלי לעשות? האם מבקשים קביעה או הסבר?'}
                  {step === 2 && 'מה נאמר בטקסט או בטבלה? איזה עקרון ביולוגי נדרש?'}
                  {step === 3 && 'איך נבנה את התשובה? מהו רצף השלבים הלוגי?'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {currentOptions.map((opt: any, idx: number) => {
                  const isSelected = selectedOption === idx;
                  let btnClass = "w-full p-3.5 rounded-xl font-bold text-sm border-2 transition-all text-right flex items-start gap-3 ";
                  
                  if (isSelected) {
                    btnClass += opt.isCorrect ? "bg-green-800 text-white border-transparent shadow-md" : "bg-red-50 text-red-800 border-red-300";
                  } else {
                    btnClass += isAnswered && opt.isCorrect ? "bg-green-50 border-green-500 text-green-900" : "bg-white text-green-800 border-green-50 hover:border-green-400";
                    if (isAnswered) btnClass += " opacity-60";
                  }

                  return (
                    <button 
                      key={idx} 
                      onClick={() => handleSelect(idx)}
                      disabled={isAnswered}
                      className={btnClass}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'border-white' : 'border-green-200'}`}>
                        {isSelected ? <div className={`w-2.5 h-2.5 rounded-full ${opt.isCorrect ? 'bg-white' : 'bg-red-500'}`} /> : isAnswered && opt.isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />}
                      </div>
                      <span className="flex-grow leading-tight">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border-2 border-green-100 p-4 rounded-xl shadow-md space-y-3">
                   <div className="flex items-center gap-2">
                     {currentOptions[selectedOption!].isCorrect ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                     <h5 className="text-sm font-black text-green-900">{currentOptions[selectedOption!].isCorrect ? 'זיהוי מעולה!' : 'לא בדיוק...'}</h5>
                   </div>
                   
                   <div className={`p-2.5 rounded-lg border-r-4 ${currentOptions[selectedOption!].isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-300'}`}>
                     <p className="text-xs text-slate-900 font-bold leading-tight text-right">
                       {currentOptions[selectedOption!].explanation || (currentOptions[selectedOption!].isCorrect ? 'זהו אכן הזיהוי המדויק לשלב זה.' : 'האופציה הזו אינה משקפת נכון את דרישות השלב.')}
                     </p>
                   </div>

                   <p className="text-xs text-green-800 font-bold leading-relaxed border-t border-green-50 pt-2">המחוון לשלב זה: {step === 1 ? q.stage1Rubric : step === 2 ? q.stage2Rubric : q.stage3Rubric}</p>
                   
                   <button onClick={nextStep} className={`w-full bg-green-800 hover:bg-green-900 text-white font-black py-3 rounded-xl shadow-lg border-b-4 border-green-950 active:border-b-0 active:translate-y-1 transition-all text-xs flex items-center justify-center gap-2`}>
                      {step < 3 ? 'לשלב הבא' : 'לניסוח התשובה'} <ArrowRight className="w-4 h-4 rotate-180" />
                   </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <h4 className="text-lg font-black text-green-900 leading-tight">עכשיו הכל ברור. נסחו את התשובה.</h4>
              <textarea className={`w-full p-4 rounded-xl border-2 border-green-100 focus:border-green-800 outline-none min-h-[140px] shadow-inner font-bold text-green-900 bg-white text-sm`} value={inputs.final} onChange={e => setInputs({...inputs, final: e.target.value})} placeholder="כתבו כאן את התשובה המלאה..." />
              <button onClick={() => setStep(5)} disabled={inputs.final.length < 5} className="w-full bg-green-800 hover:bg-green-900 text-white font-black py-4 rounded-xl shadow-lg disabled:opacity-50 border-b-4 border-green-950 active:border-b-0 active:translate-y-1 text-sm">הגש ובדוק מול המחוון</button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="s5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h4 className="text-lg font-black text-green-800 flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5"/> השוואה למחוון הפיצוח</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border-2 border-slate-200 p-4 rounded-xl shadow-sm relative">
                  <div className="absolute -top-3 -right-3 bg-slate-600 text-white px-3 py-0.5 rounded-full text-[9px] font-black shadow-md uppercase">הניסוח שלך</div>
                  <p className="text-slate-800 font-bold text-sm leading-relaxed whitespace-pre-line italic underline decoration-slate-200 underline-offset-4">{inputs.final}</p>
                </div>
                
                <div className={`${theme.bg} border-2 ${theme.border} p-4 rounded-xl shadow-md relative`}>
                  <div className="absolute -top-3 -right-3 bg-green-800 text-white px-3 py-0.5 rounded-full text-[9px] font-black shadow-md uppercase">תשובת המומחה</div>
                  <p className="text-green-900 font-black text-sm leading-relaxed whitespace-pre-line">{q.rubric}</p>
                </div>
              </div>

              <button onClick={handleNextQ} className="w-full bg-green-800 hover:bg-green-900 text-white font-black py-4 rounded-xl shadow-xl flex items-center justify-center gap-3 border-b-4 border-green-950 active:border-b-0 active:translate-y-1 text-sm">
                {qIndex < questions.length - 1 ? 'לשאלה הבאה' : 'סיום הפרק'} <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==========================================
// 3. PRACTICE: INSTRUCTION WORDS
// ==========================================
function PracticeWords({ questions, theme, onFinish }: { questions: any[], theme: any, onFinish: () => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [finalAnswer, setFinalAnswer] = useState('');

  const q = questions[qIndex];

  // Shuffled MCQ options
  const shuffledOptions = useMemo(() => {
    return [...q.mcOptions].sort(() => Math.random() - 0.5);
  }, [qIndex, q]);

  const handleNextQ = () => {
    if (qIndex < questions.length - 1) {
      setQIndex(p => p + 1); setStep(1); setSelectedOption(null); setFinalAnswer('');
    } else onFinish();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-green-200 overflow-hidden max-w-2xl mx-auto">
      <div className="p-2.5 bg-green-50 border-b border-green-200 flex justify-between font-bold text-[10px] text-green-800 uppercase tracking-widest">
        <span>שאלה {qIndex + 1} מתוך {questions.length}</span>
        <span className={`${theme.text}`}>זיהוי מילות הוראה</span>
      </div>
      
      <div className="p-4 md:p-6 bg-white border-b border-green-50 shadow-sm">
        <h3 className="text-base md:text-lg font-bold text-green-900 leading-snug text-right">{q.text}</h3>
      </div>
      
      <div className="p-4 md:p-6 bg-[#FBFDFB]">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h4 className="text-lg font-black text-green-900 mb-4">{q.mcQuestion}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
              {shuffledOptions.map((opt: any, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setSelectedOption(idx)} 
                  className={`p-3 rounded-xl font-bold text-sm border-2 transition-all text-right flex items-center gap-3 ${selectedOption === idx ? 'bg-green-800 text-white border-transparent shadow-md' : 'bg-white text-green-800 border-green-50 hover:border-green-500 hover:bg-green-50'}`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedOption === idx ? 'border-white bg-white/20' : 'border-green-200'}`}>
                    {selectedOption === idx && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                  </div>
                  {opt.text}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setStep(2)} 
              disabled={selectedOption === null} 
              className={`w-full bg-green-800 hover:bg-green-900 text-white font-black py-3.5 rounded-xl shadow-lg disabled:opacity-50 border-b-4 border-green-950 active:border-b-0 active:translate-y-1 text-sm`}
            >
              אשר והמשך לניסוח התשובה
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className={`p-4 rounded-xl shadow-md border-r-8 space-y-2 ${shuffledOptions[selectedOption!].isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-400'}`}>
              <div className="flex items-center gap-3">
                {shuffledOptions[selectedOption!].isCorrect ? <CheckCircle2 className="w-6 h-6 text-green-700"/> : <XCircle className="w-6 h-6 text-red-600" />}
                <h4 className={`text-sm font-black ${shuffledOptions[selectedOption!].isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                  {shuffledOptions[selectedOption!].isCorrect ? `זיהוי מעולה!` : `לא בדיוק...`}
                </h4>
              </div>
              <p className="text-xs text-slate-800 font-bold leading-relaxed text-right">
                {shuffledOptions[selectedOption!].explanation || (shuffledOptions[selectedOption!].isCorrect ? 'נכון, המילה מחייבת התייחסות לנקודות אלו בדיוק.' : 'שימו לב לדרישות המילה - עליכם לכלול את המאפיינים המתאימים להנחיה זו.')}
              </p>
              <div className="pt-2 border-t border-black/5">
                <p className="text-[10px] text-slate-600 font-black uppercase">הנחיית הפיצוח:</p>
                <p className="text-[11px] text-slate-700 font-bold leading-tight">
                  {shuffledOptions[selectedOption!].isCorrect ? 'עכשיו נסחו את התשובה המלאה המקיפה את הנקודות הללו:' : 'נסו בכל זאת לנסח תשובה מלאה המביאה לידי ביטוי את הדרישות:'}
                </p>
              </div>
            </div>
            <textarea 
              className={`w-full p-4 rounded-xl border-2 border-green-200 focus:border-green-600 outline-none min-h-[120px] shadow-inner font-bold text-green-900 bg-white text-sm`} 
              placeholder="כתבו כאן את תשובת הבגרות שלכם..." 
              value={finalAnswer} 
              onChange={e => setFinalAnswer(e.target.value)} 
            />
            <button 
              onClick={() => setStep(3)} 
              disabled={finalAnswer.length < 5} 
              className={`w-full bg-green-800 hover:bg-green-900 text-white font-black py-3.5 rounded-xl shadow-lg disabled:opacity-50 border-b-4 border-green-950 active:border-b-0 active:translate-y-1 text-sm`}
            >
              אשר והמשך למחוון
            </button>
          </motion.div>
        )}

        {step === 3 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
               <h4 className="text-lg font-black text-green-800 flex items-center justify-center gap-2 mb-2"><CheckCircle2 className="w-5 h-5"/> השוואה למחוון הפיצוח</h4>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-slate-50 border-2 border-slate-200 p-4 rounded-xl shadow-sm relative">
                   <div className="absolute -top-3 -right-3 bg-slate-600 text-white px-3 py-0.5 rounded-full text-[9px] font-black shadow-md uppercase">הניסוח שלך</div>
                   <p className="text-slate-800 font-bold text-sm leading-relaxed whitespace-pre-line italic underline decoration-slate-200 underline-offset-4">{finalAnswer}</p>
                 </div>
                 
                 <div className={`${theme.bg} border-2 ${theme.border} p-4 rounded-xl shadow-md relative`}>
                   <div className="absolute -top-3 -right-3 bg-green-800 text-white px-3 py-0.5 rounded-full text-[9px] font-black shadow-md uppercase">תשובת המומחה</div>
                   <p className="text-green-900 font-black text-sm leading-relaxed whitespace-pre-line">{q.rubric}</p>
                 </div>
               </div>

              <button onClick={handleNextQ} className="w-full bg-green-800 hover:bg-green-900 text-white font-black py-4 rounded-xl shadow-xl flex items-center justify-center gap-3 border-b-4 border-green-950 active:border-b-0 active:translate-y-1 text-sm">
                {qIndex < questions.length - 1 ? 'לשאלה הבאה' : 'לפרק הבא'} <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </motion.div>
          )}
      </div>
    </div>
  );
}

// ==========================================
// 4. PRACTICE: CAUSAL CHAIN (Drag & Drop replacement)
// ==========================================
function PracticeChain({ questions, theme, onFinish }: { questions: any[], theme: any, onFinish: () => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [step, setStep] = useState(1);
  const [sentences, setSentences] = useState<any[]>([]);
  const [userOrders, setUserOrders] = useState<Record<number, string>>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [studentAnswer, setStudentAnswer] = useState('');

  const q = questions[qIndex];

  useEffect(() => {
    const shuffled = [...q.sentences].sort(() => Math.random() - 0.5);
    setSentences(shuffled);
    setUserOrders({});
    setStep(1);
    setErrorMsg('');
    setStudentAnswer('');
  }, [qIndex, q]);

  const checkOrder = () => {
    const allFilled = sentences.every(s => userOrders[s.id] && userOrders[s.id].trim() !== '');
    if (!allFilled) {
      setErrorMsg('אנא מלאו מספר סדר עבור כל המשפטים.');
      return;
    }
    setStep(2);
  };

  const handleNextQ = () => {
    if (qIndex < questions.length - 1) setQIndex(p => p + 1);
    else onFinish();
  };

  const orderedSentences = useMemo(() => {
    return [...q.sentences].sort((a, b) => a.order - b.order);
  }, [q]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-green-200 overflow-hidden max-w-2xl mx-auto">
      <div className="p-2.5 bg-green-50 border-b border-green-200 flex justify-between font-bold text-[10px] text-green-800 uppercase tracking-widest">
        <span>שאלה {qIndex + 1} מתוך {questions.length}</span>
        <span className={`${theme.text}`}>בניית שרשור נסיבתי</span>
      </div>
      
      <div className="p-4 md:p-6 bg-white border-b border-green-50 shadow-sm text-right">
        <h3 className="text-base md:text-lg font-bold text-green-900 leading-snug">{q.text}</h3>
      </div>
      
      <div className="p-4 md:p-6 bg-[#FBFDFB]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <h4 className="text-base font-black text-green-900 flex items-center gap-2">
                <Link className="w-5 h-5 text-green-700" /> מיספור שלבי השרשור
              </h4>
              
              <div className="space-y-2">
                {sentences.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-3 bg-white border border-green-100 rounded-xl shadow-sm flex items-center gap-4 transition-all hover:border-green-400 group`}
                  >
                    <input 
                      type="text"
                      inputMode="numeric"
                      className="w-10 h-10 bg-green-50 border border-green-200 rounded-lg text-center font-black text-green-900 text-lg focus:border-green-600 outline-none"
                      value={userOrders[item.id] || ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setUserOrders(prev => ({ ...prev, [item.id]: val }));
                        setErrorMsg('');
                      }}
                      placeholder="#"
                    />
                    <span className="font-bold text-green-900 flex-grow text-sm leading-tight text-right">{item.text}</span>
                  </div>
                ))}
              </div>

              {errorMsg && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-50 text-red-800 p-3 rounded-xl flex items-center gap-2 text-xs font-bold border border-red-200 shadow-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errorMsg}
                </motion.div>
              )}

              <button 
                onClick={checkOrder} 
                className={`w-full bg-green-800 hover:bg-green-900 text-white font-black py-4 rounded-xl shadow-lg transition-all text-sm border-b-4 border-green-950 active:border-b-0 active:translate-y-1`}
              >
                בדוק את המספור שלי
              </button>
            </motion.div>
          )}

          {step === 2 && (
             <motion.div key="s2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full border-2 border-white shadow-md">
                    <Search className="w-8 h-8 text-green-700"/>
                  </div>
                  <h4 className="text-xl font-black text-green-900 tracking-tight">כך נראה שרשור מדעי נכון</h4>
                  <p className="text-xs font-bold text-green-700">השתמשו בשלבים אלו כדי לנסח את התשובה המלאה למטה</p>
                </div>

                <div className="bg-white border-2 border-green-100 p-4 rounded-2xl shadow-inner relative text-right">
                  <div className="absolute -top-3 -right-3 bg-slate-600 text-white px-3 py-0.5 rounded-full text-[9px] font-black shadow-md uppercase">שלבי השרשור</div>
                  <div className="space-y-2 pt-2">
                    {orderedSentences.map((s, i) => {
                      const isCause = i === 0;
                      const isOutcome = i === orderedSentences.length - 1;
                      return (
                        <div key={i} className={`flex gap-3 items-start p-2 rounded-xl transition-colors ${isCause ? 'bg-cyan-50 border border-cyan-100' : isOutcome ? 'bg-purple-50 border border-purple-100' : ''}`}>
                          <div className={`w-5 h-5 rounded-lg ${isCause ? 'bg-cyan-600' : isOutcome ? 'bg-purple-600' : theme.primary} text-white flex items-center justify-center font-black flex-shrink-0 shadow-sm text-[10px]`}>{i+1}</div>
                          <div className="flex-grow">
                            <p className={`font-bold text-[11px] leading-snug ${isCause ? 'text-cyan-900' : isOutcome ? 'text-purple-900' : 'text-green-950'}`}>
                              {s.text}
                            </p>
                            {isCause && <span className="text-[8px] font-black text-cyan-600 uppercase tracking-tighter block mt-0.5">סיבה ראשונית (Input)</span>}
                            {isOutcome && <span className="text-[8px] font-black text-purple-600 uppercase tracking-tighter block mt-0.5">תוצאה סופית (Output)</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2 text-right">
                  <label className="text-sm font-black text-green-900 block px-1">ניסוח תשובת בגרות מנצחת:</label>
                  <textarea 
                    className={`w-full p-4 rounded-xl border-2 border-green-100 focus:border-green-800 outline-none min-h-[140px] shadow-inner font-bold text-green-900 bg-white text-sm`} 
                    value={studentAnswer}
                    onChange={e => setStudentAnswer(e.target.value)}
                    placeholder="חברו את שלבי השרשור למעלה לתשובה קולחת ומקצועית..."
                  />
                </div>
                
                <button 
                  onClick={() => setStep(3)} 
                  disabled={studentAnswer.length < 5}
                  className="w-full bg-green-800 hover:bg-green-900 text-white font-black py-4 rounded-xl shadow-lg border-b-4 border-green-950 active:border-b-0 active:translate-y-1 text-sm flex items-center justify-center gap-2"
                >
                  בדוק תשובה מול המחוון <CheckCircle2 className="w-4 h-4" />
                </button>
             </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
               <div className="text-center space-y-2">
                 <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full border-2 border-white shadow-md">
                   <Target className="w-8 h-8 text-green-700"/>
                 </div>
                 <h4 className="text-xl font-black text-green-900 tracking-tight">השוואה למחוון הפיצוח</h4>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                 <div className="bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl shadow-inner relative h-full">
                   <div className="absolute -top-3 -right-3 bg-slate-600 text-white px-3 py-0.5 rounded-full text-[9px] font-black shadow-md uppercase">הניסוח שלך</div>
                   <p className="text-slate-800 font-bold text-xs leading-relaxed whitespace-pre-line pt-2 italic underline underline-offset-4 decoration-slate-200">{studentAnswer}</p>
                 </div>

                 <div className={`${theme.bg} border-2 ${theme.border} p-4 rounded-2xl shadow-md relative h-full`}>
                   <div className="absolute -top-3 -right-3 bg-green-800 text-white px-3 py-0.5 rounded-full text-[9px] font-black shadow-md uppercase">תשובת מומחה</div>
                   <p className="text-green-900 font-black text-xs leading-relaxed whitespace-pre-line pt-2">{q.rubric}</p>
                 </div>
               </div>
               
               <button 
                 onClick={handleNextQ} 
                 className="w-full bg-green-800 hover:bg-green-900 text-white font-black py-4 rounded-xl shadow-lg border-b-4 border-green-950 active:border-b-0 active:translate-y-1 text-sm flex items-center justify-center gap-2"
               >
                 {qIndex < questions.length - 1 ? 'לשאלה הבאה' : 'סיום הפרק'} <ArrowRight className="w-4 h-4 rotate-180" />
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function BagrutExam({ onFinish }: { onFinish: () => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [selectedClosed, setSelectedClosed] = useState<number | null>(null);
  const [showClosedResult, setShowClosedResult] = useState(false);
  const [eliminated, setEliminated] = useState<number[]>([]);
  
  // Results for scoring
  const [closedResults, setClosedResults] = useState<Record<number, boolean>>({});
  const [openInstructionResults, setOpenInstructionResults] = useState<Record<number, boolean>>({});
  const [openSelfAssessment, setOpenSelfAssessment] = useState<Record<number, 'full' | 'partial' | 'none'>>({});
  
  // Open questions states
  const [openStep, setOpenStep] = useState(1); // 1: Instruction, 2: 3 Questions, 3: Answer
  const [openAnswer, setOpenAnswer] = useState('');
  const [showOpenRubric, setShowOpenRubric] = useState(false);
  const [instructionFeedback, setInstructionFeedback] = useState<{isCorrect: boolean, text: string} | null>(null);

  // Combine questions into a single flow
  const allQuestions = useMemo(() => [
    ...bagrutExamData.closedQuestions.map(q => ({ ...q, type: 'closed' })),
    ...bagrutExamData.openQuestions.map(q => ({ ...q, type: 'open', section: 'core' })),
    ...bagrutExamData.microbiologyQuestions.map(q => ({ ...q, type: 'open', section: 'micro' }))
  ], []);

  const currentQ = allQuestions[qIndex];

  const calculateGrade = () => {
    const closedCount = bagrutExamData.closedQuestions.length;
    const openCount = bagrutExamData.openQuestions.length + bagrutExamData.microbiologyQuestions.length;
    
    // Closed questions total 40 points, Open questions total 60 points
    const closedWeight = 40 / closedCount;
    const openWeight = 60 / openCount;
    
    // Within an open question: 1 point for instruction word, the rest for content
    const instructionWeight = 1;
    const contentWeight = openWeight - instructionWeight;
    
    let totalScore = 0;
    
    // Closed questions
    Object.values(closedResults).forEach(isCorrect => {
      if (isCorrect) totalScore += closedWeight;
    });
    
    // Open questions instruction
    Object.values(openInstructionResults).forEach(isCorrect => {
      if (isCorrect) totalScore += instructionWeight;
    });
    
    // Open questions content self-assessment
    Object.values(openSelfAssessment).forEach(assessment => {
      if (assessment === 'full') totalScore += contentWeight;
      else if (assessment === 'partial') totalScore += contentWeight / 2;
    });
    
    return Math.round(Math.min(100, totalScore));
  };

  const getGradeCategory = (grade: number) => {
    if (grade >= 95) return { label: 'מצוין!', color: 'text-green-600', feedback: 'הפגנת שליטה מוחלטת בחומר ובטכניקת הפיצוח.' };
    if (grade >= 85) return { label: 'טוב מאוד!', color: 'text-green-500', feedback: 'הבנה טובה מאוד. שימו לב לדיוק בשרשורים הנסיבתיים.' };
    if (grade >= 70) return { label: 'טוב', color: 'text-amber-600', feedback: 'יש לכם בסיס טוב, כדאי לתרגל עוד אלימינציה בשאלות סגורות.' };
    if (grade >= 55) return { label: 'מספיק', color: 'text-orange-600', feedback: 'צריך לעבור שוב על פרקי הלמידה, במיוחד על מילות הוראה.' };
    return { label: 'צריך תרגול נוסף', color: 'text-red-500', feedback: 'אל תתייאשו! חזרו על מסלולי הלמידה ותרגלו שוב.' };
  };

  // Shuffle options for closed questions
  const shuffledOptions = useMemo(() => {
    if (currentQ.type !== 'closed') return [];
    return [...(currentQ as any).options].sort(() => Math.random() - 0.5);
  }, [qIndex]);

  const handleNext = () => {
    if (qIndex < allQuestions.length - 1) {
      setQIndex(qIndex + 1);
      setSelectedClosed(null);
      setShowClosedResult(false);
      setEliminated([]);
      setOpenAnswer('');
      setShowOpenRubric(false);
      setOpenStep(1);
      setInstructionFeedback(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsDone(true);
    }
  };

  const toggleEliminate = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    if (eliminated.includes(idx)) {
      setEliminated(eliminated.filter(i => i !== idx));
    } else {
      setEliminated([...eliminated, idx]);
    }
  };

  const currentTotalScore = useMemo(() => calculateGrade(), [closedResults, openInstructionResults, openSelfAssessment]);

  if (isDone) {
    const finalGrade = calculateGrade();
    const cat = getGradeCategory(finalGrade);
    
    return (
      <div className="text-center py-16">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-10 shadow-2xl border-2 border-green-100 max-w-sm mx-auto mb-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
          
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-white relative z-10">
            <Award className="w-12 h-12 text-green-800" />
          </div>
          
          <h2 className="text-5xl font-black text-green-900 mb-2 relative z-10">{finalGrade}</h2>
          <p className="text-lg font-bold text-green-700 uppercase tracking-widest border-b border-green-100 pb-4 mb-4 relative z-10">ציון סופי בסולם הפיצוח</p>
          
          <div className={`text-2xl font-black mb-2 ${cat.color}`}>{cat.label}</div>
          <p className="text-slate-600 font-medium leading-relaxed">{cat.feedback}</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10">
          <div className="bg-white p-4 rounded-2xl border border-green-100 shadow-sm">
            <div className="text-2xl font-black text-green-800">
              {Object.values(closedResults).filter(v => v).length}/{bagrutExamData.closedQuestions.length}
            </div>
            <div className="text-[10px] font-bold text-slate-500">שאלות סגורות נכונות</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-green-100 shadow-sm">
            <div className="text-2xl font-black text-green-800">
              {Object.values(openSelfAssessment).filter(v => v === 'full' || v === 'partial').length}/{bagrutExamData.openQuestions.length + bagrutExamData.microbiologyQuestions.length}
            </div>
            <div className="text-[10px] font-bold text-slate-500">שאלות פתוחות (מלא/חלקי)</div>
          </div>
        </div>

        <button 
          onClick={onFinish}
          className="bg-green-800 hover:bg-green-900 text-white font-black px-10 py-5 rounded-2xl shadow-xl transition-all border-b-4 border-green-950 active:border-b-0 active:translate-y-1 text-xl flex items-center gap-3 mx-auto"
        >
          חזרה לתפריט הראשי <ArrowRight className="w-5 h-5 rotate-180" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col overflow-hidden">
      <div className="flex-none mb-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col items-start translate-y-1">
            <div className="bg-green-800 text-white px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 shadow-md">
              <Award className="w-2.5 h-2.5" /> סימולציית בגרות
            </div>
            <h2 className="text-lg md:text-xl font-black text-green-900 leading-tight">
              {currentQ.type === 'closed' ? 'חלק א\': שאלות סגורות' : (currentQ as any).section === 'core' ? 'חלק ב\': שאלות פתוחות' : 'חלק ג\': מיקרוביולוגיה'}
            </h2>
            <div className="text-green-700 text-[9px] font-bold">שאלה {qIndex + 1} מתוך {allQuestions.length}</div>
          </div>
          
          <motion.div 
            key={currentTotalScore}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border-2 border-green-600 px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2 flex-none"
          >
            <div className="text-[9px] font-black text-green-700 leading-none">ציון</div>
            <div className="text-xl md:text-2xl font-black text-green-900">{currentTotalScore}</div>
            <div className="text-[9px] font-bold text-green-600 self-end mb-0.5">/ 100</div>
          </motion.div>
        </div>
      </div>

      <div className="bg-white rounded-xl md:rounded-2xl shadow-xl border-2 border-green-200 overflow-hidden flex flex-col flex-grow min-h-0">
        <div className="p-3 md:p-4 border-b border-green-50 bg-white flex-none">
          <h3 className="text-base md:text-lg font-bold text-green-900 leading-relaxed text-right">{currentQ.text}</h3>
        </div>

        <div className="p-3 md:p-4 bg-[#FBFDFB] flex-grow overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-green-200">
          {currentQ.type === 'closed' ? (
            <div className="space-y-3">
              <div className="bg-amber-50 p-2 rounded-xl border border-amber-200 mb-2 text-[10px] font-medium text-amber-900 flex items-center gap-2">
                <XCircle className="w-3 h-3 text-amber-700" />
                <span>טיפ: השתמשו בלחצן ה-X כדי למחוק מסיחים (אלימינציה).</span>
              </div>
              
              <div className="space-y-2">
                {shuffledOptions.map((opt: any, idx: number) => (
                  <div key={idx} className="relative group">
                    <button
                      disabled={showClosedResult}
                      onClick={() => { 
                        const isCorrect = opt.isCorrect;
                        setClosedResults(prev => ({ ...prev, [qIndex]: isCorrect }));
                        setSelectedClosed(idx); 
                        setShowClosedResult(true); 
                      }}
                      className={`w-full p-3 rounded-xl border-2 transition-all text-right flex items-center gap-3 ${
                        showClosedResult 
                          ? opt.isCorrect 
                            ? 'bg-green-100 border-green-500 shadow-md ring-2 ring-green-200' 
                            : selectedClosed === idx ? 'bg-red-50 border-red-500' : 'bg-gray-50 border-gray-200 opacity-50'
                          : eliminated.includes(idx) 
                            ? 'bg-gray-100 border-gray-200 opacity-40 grayscale pointer-events-none'
                            : 'bg-white border-green-100 hover:border-green-500 hover:bg-green-50 shadow-sm'
                      }`}
                    >
                      <div className="flex-none">
                        {showClosedResult && opt.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className={`w-5 h-5 rounded-full border-2 ${selectedClosed === idx ? 'bg-green-800 border-green-800' : (eliminated.includes(idx) ? 'border-gray-300' : 'border-green-200')}`} />
                        )}
                      </div>
                      <span className={`text-sm font-bold ${showClosedResult && opt.isCorrect ? 'text-green-900' : 'text-slate-800'} ${eliminated.includes(idx) ? 'line-through text-gray-400' : ''}`}>
                        {opt.text}
                      </span>
                    </button>
                    
                    {!showClosedResult && !eliminated.includes(idx) && (
                      <button 
                        onClick={(e) => toggleEliminate(e, idx)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                        title="מחק מסיח"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {showClosedResult && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 bg-white border border-green-200 p-4 rounded-xl shadow-md space-y-3">
                  <h4 className="text-xs font-black text-green-900 flex items-center gap-2">
                     <Target className="w-4 h-4 text-green-700" /> ניתוח התשובות:
                  </h4>
                  <ul className="space-y-1.5">
                    {[...currentQ.options].sort((a,b) => (a.isCorrect === b.isCorrect ? 0 : a.isCorrect ? -1 : 1)).map((opt: any, idx: number) => (
                      <li key={idx} className={`p-2 rounded-lg border-r-4 flex gap-2 items-start text-[11px] ${opt.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-300'}`}>
                        <div className="pt-0.5">{opt.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600"/> : <XCircle className="w-3.5 h-3.5 text-red-500"/>}</div>
                        <span className="text-slate-900 font-bold leading-tight text-right">{opt.explanation}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={handleNext}
                    className="w-full bg-green-800 hover:bg-green-900 text-white font-black py-3 rounded-xl shadow-lg border-b-4 border-green-950 active:border-b-0 active:translate-y-1 text-sm mt-2"
                  >
                    המשך לשאלה הבאה <ArrowRight className="w-4 h-4 inline-block mr-2 rotate-180" />
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {openStep === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                  <h4 className="text-sm font-black text-green-900 flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4" /> זיהוי מילת ההוראה
                  </h4>
                  <div className="grid grid-cols-5 gap-1.5">
                    {['הסבירו', 'תארו', 'ציינו', 'השוו', 'נמקו'].map(word => (
                      <button 
                        key={word}
                        onClick={() => {
                          const correct = (currentQ as any).instructionWord === word;
                          if (correct) {
                            setOpenInstructionResults(prev => ({ ...prev, [qIndex]: true }));
                            setInstructionFeedback({ isCorrect: true, text: 'נכון!' });
                            setTimeout(() => { setOpenStep(2); setInstructionFeedback(null); }, 800);
                          } else {
                            setOpenInstructionResults(prev => ({ ...prev, [qIndex]: false }));
                            setInstructionFeedback({ isCorrect: false, text: `הנכונה: ${(currentQ as any).instructionWord}` });
                          }
                        }}
                        className={`p-2 border-2 rounded-lg font-bold transition-all text-center text-xs ${
                          instructionFeedback?.isCorrect && (currentQ as any).instructionWord === word
                            ? 'bg-green-100 border-green-500 text-green-900'
                            : instructionFeedback && !instructionFeedback.isCorrect && word === instructionFeedback.text.split(': ')[1]
                              ? 'bg-amber-100 border-amber-500 text-amber-900'
                              : 'bg-white border-green-100 hover:border-green-600 text-green-900 shadow-sm'
                        }`}
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                  
                  {instructionFeedback && !instructionFeedback.isCorrect && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-900">{instructionFeedback.text}</span>
                      <button onClick={() => { setOpenStep(2); setInstructionFeedback(null); }} className="bg-amber-200 px-2 py-0.5 rounded text-[10px] font-black">המשך</button>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {openStep === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3 text-center">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { t: 'מה שואלים?', i: '1' },
                      { t: 'ידע ביולוגי', i: '2' },
                      { t: 'שרשור נסיבתי', i: '3' }
                    ].map(item => (
                      <div key={item.i} className="bg-white p-2 rounded-xl border border-green-100 shadow-sm">
                        <div className="w-5 h-5 rounded-full bg-green-200 flex items-center justify-center text-[10px] font-bold mx-auto mb-1">{item.i}</div>
                        <div className="text-[11px] font-bold text-green-900 leading-tight">{item.t}</div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setOpenStep(3)}
                    className="w-full bg-green-800 text-white font-black py-2.5 rounded-xl shadow-md border-b-4 border-green-950 active:border-b-0 active:translate-y-1 text-sm"
                  >
                    אני מוכן לכתוב
                  </button>
                </motion.div>
              )}

              {openStep === 3 && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
                  {!showOpenRubric ? (
                    <>
                      <textarea
                        className="w-full p-3 rounded-xl border-2 border-green-200 focus:border-green-600 outline-none min-h-[120px] shadow-inner font-bold text-green-900 bg-white text-xs"
                        placeholder="כתבו את התשובה בשרשור נסיבתי..."
                        value={openAnswer}
                        onChange={e => setOpenAnswer(e.target.value)}
                      />
                      <button
                        disabled={openAnswer.trim().length < 3}
                        onClick={() => setShowOpenRubric(true)}
                        className="w-full bg-green-800 text-white font-black py-3 rounded-xl shadow-lg border-b-4 border-green-950 active:border-b-0 active:translate-y-1 text-sm"
                      >
                        הגש ובדוק מול המחוון
                      </button>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 max-h-[180px]">
                        <div className="bg-white border-2 border-green-200 p-2.5 rounded-xl shadow-sm overflow-y-auto">
                          <div className="text-[9px] bg-green-800 text-white px-2 py-0.5 rounded-full inline-block mb-1 font-black leading-none">מחוון</div>
                          <p className="text-green-950 font-black text-[11px] leading-relaxed whitespace-pre-line">{currentQ.rubric}</p>
                        </div>
                        <div className="bg-slate-50 border-2 border-slate-200 p-2.5 rounded-xl shadow-sm overflow-y-auto">
                          <div className="text-[9px] bg-slate-600 text-white px-2 py-0.5 rounded-full inline-block mb-1 font-black leading-none">תשובתך</div>
                          <p className="text-slate-800 font-bold text-[11px] leading-relaxed italic">{openAnswer}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => { setOpenSelfAssessment(prev => ({ ...prev, [qIndex]: 'full' })); handleNext(); }}
                          className="flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-xl shadow-md text-[10px] font-black"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> תשובה מלאה
                        </button>
                        <button
                          onClick={() => { setOpenSelfAssessment(prev => ({ ...prev, [qIndex]: 'partial' })); handleNext(); }}
                          className="flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-white rounded-xl shadow-md text-[10px] font-black"
                        >
                          <AlertCircle className="w-3.5 h-3.5" /> עניתי חלקית
                        </button>
                        <button
                          onClick={() => { setOpenSelfAssessment(prev => ({ ...prev, [qIndex]: 'none' })); handleNext(); }}
                          className="flex items-center justify-center gap-2 py-2.5 bg-red-500 text-white rounded-xl shadow-md text-[10px] font-black"
                        >
                          <XCircle className="w-3.5 h-3.5" /> לא עניתי נכון
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

