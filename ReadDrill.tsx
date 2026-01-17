import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Zap, 
  RotateCcw, 
  Play, 
  MousePointer2, 
  TrendingUp,
  Timer,
  ZapOff,
  Gauge,
  Rocket
} from 'lucide-react';
import { useWikipedia, WikipediaArticle } from './WikipediaContext';

interface DrillMode {
  id: string;
  title: string;
  description: string;
  speed: number;
  icon?: React.ReactNode;
}

const DRILL_MODES: DrillMode[] = [
  { id: 'normal', title: 'Normal drill', description: 'read at normal speed', speed: 1, icon: <Timer size={24} /> },
  { id: 'double', title: 'Double drill', description: 'read at x2 speed', speed: 2, icon: <Zap size={24} /> },
  { id: 'triple', title: 'Triple drill', description: 'read at x3 speed', speed: 3, icon: <Rocket size={24} /> },
  { id: 'normal_2', title: 'Normal drill', description: 'read at normal speed', speed: 1, icon: <Gauge size={24} /> },
];

const ReadDrill: React.FC = () => {
  const navigate = useNavigate();
  const { article, isLoading, consumeArticle, defaultText } = useWikipedia();
  
  const [selectedDrill, setSelectedDrill] = useState<string>('normal');
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showInstruction, setShowInstruction] = useState(false);
  const [calculatedWPM, setCalculatedWPM] = useState<number | null>(null);
  const [currentArticle, setCurrentArticle] = useState<WikipediaArticle | null>(null);
  const [isAutoscrollActive, setIsAutoscrollActive] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Set initial article or fallback
  useEffect(() => {
    if (!currentArticle && article) {
      setCurrentArticle(article);
    }
  }, [article, currentArticle]);

  const activeArticle = currentArticle || article || defaultText;
  
  // Flatten words and keep track of segment indices
  const wordsWithMetadata = useMemo(() => {
    let globalIndex = 0;
    return activeArticle.segments.map(segment => {
      const segmentWords = segment.text.trim().split(/\s+/);
      const result = {
        ...segment,
        words: segmentWords.map(w => ({ text: w, index: globalIndex++ }))
      };
      return result;
    });
  }, [activeArticle]);

  // Timer logic
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerRunning(false);
      setIsFinished(true);
      setShowInstruction(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, timeLeft]);

  // Autoscroll logic
  useEffect(() => {
    let animationFrameId: number;
    let lastTime: number;

    const animate = (time: number) => {
      if (lastTime !== undefined) {
        const deltaTime = (time - lastTime) / 1000; // in seconds
        
        const baseSpeedPPS = 20; // Pixels per second for 1x speed - reduced to half per user request
        const scrollAmount = baseSpeedPPS * scrollSpeed * deltaTime;

        window.scrollBy({ top: scrollAmount, behavior: 'auto' });
      }
      lastTime = time;
      animationFrameId = requestAnimationFrame(animate);
    };

    if (timerRunning && isAutoscrollActive) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [timerRunning, isAutoscrollActive, scrollSpeed]);


  const startDrill = () => {
    setTimeLeft(60);
    setTimerRunning(true);
    setIsFinished(false);
    setShowText(true);
    setCalculatedWPM(null);
    setShowInstruction(false);
  };

  const resetDrill = () => {
    setTimerRunning(false);
    setTimeLeft(60);
    setIsFinished(false);
    setShowText(false);
    setCalculatedWPM(null);
    setShowInstruction(false);
    if (timerRef.current) clearInterval(timerRef.current);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Switch to next article if we are resetting after a finished drill
    if (isFinished) {
      consumeArticle();
      setCurrentArticle(null); // This will trigger the useEffect to pick the next one
    }
  };


  const handleWordClick = (index: number) => {
    if (isFinished && !calculatedWPM) {
      const wpm = index + 1;
      setCalculatedWPM(wpm);
      setShowInstruction(false);

      // Save to local storage
      const newStat = {
        timestamp: Date.now(),
        type: selectedDrill,
        wpm: wpm
      };

      try {
        const existingStats = JSON.parse(localStorage.getItem('read_drill_stats') || '[]');
        localStorage.setItem('read_drill_stats', JSON.stringify([...existingStats, newStat]));
      } catch (e) {
        console.error('Failed to save stats', e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 animate-in fade-in duration-500">
      <style>
        {`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
          .animate-blink {
            animation: blink 0.5s linear infinite;
          }
        `}
      </style>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 sticky top-24 bg-white/80 backdrop-blur-xl py-4 z-50 border-b border-slate-200 px-6 rounded-2xl shadow-sm">
          <button 
            onClick={() => navigate('/')}
            className="text-blue-600 font-bold hover:underline flex items-center gap-2"
          >
            <ArrowLeft size={20} /> Back to Home
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {DRILL_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                setSelectedDrill(mode.id);
                resetDrill();
              }}
              className={`p-6 rounded-[24px] border-2 transition-all text-left group ${
                selectedDrill === mode.id 
                  ? 'bg-white border-blue-600 shadow-xl ring-4 ring-blue-50' 
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`${selectedDrill === mode.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-400'} transition-colors`}>
                  {(mode as any).icon}
                </div>
                <h3 className={`text-lg font-black ${selectedDrill === mode.id ? 'text-blue-600' : 'text-slate-900'}`}>
                  {mode.title}
                </h3>
              </div>
              <p className="text-sm text-slate-500 font-medium">{mode.description}</p>
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className={`text-6xl font-black tabular-nums ${timeLeft <= 10 ? 'text-red-500' : 'text-slate-900'}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </div>
            {!timerRunning ? (
              <button 
                onClick={startDrill}
                className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-105 transition-all text-2xl flex items-center gap-3"
              >
                {calculatedWPM ? <RotateCcw size={28} /> : <Play size={28} fill="currentColor" />}
                {calculatedWPM ? 'RESTART' : 'START DRILL'}
              </button>
            ) : (
              <button 
                onClick={resetDrill}
                className="px-10 py-4 bg-slate-200 text-slate-600 font-black rounded-2xl hover:bg-slate-300 transition-all text-2xl flex items-center gap-3"
              >
                <RotateCcw size={28} />
                RESET
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {/* Autoscroll Toggle */}
            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isAutoscrollActive}
                  onChange={(e) => setIsAutoscrollActive(e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-2 text-sm font-bold text-slate-700 flex items-center gap-1.5 hidden sm:inline">
                  <MousePointer2 size={16} />
                  Autoscroll
                </span>
              </label>
            </div>

            {/* Speed Control */}
            <div className="flex bg-slate-100 rounded-lg p-1">
              {[1, 2, 3].map((s) => (
                <button
                  key={s}
                  onClick={() => setScrollSpeed(s)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    scrollSpeed === s 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {calculatedWPM !== null && (
            <div className="flex flex-col items-center animate-in zoom-in duration-300">
              <div className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Results</div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-7xl font-black text-blue-600">{calculatedWPM}</span>
                <span className="text-2xl font-black text-slate-900">WPM</span>
              </div>
              <button
                onClick={() => navigate('/stats')}
                className="text-blue-600 font-bold hover:underline flex items-center gap-2"
              >
                View Progress <TrendingUp size={20} />
              </button>
            </div>
          )}
        </div>

        {showInstruction && (
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-8 duration-500">
            <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-xl">
              <span className="text-2xl">👆</span>
              <p className="font-bold text-lg">Click on the last word you were reading when the timer stopped</p>
            </div>
          </div>
        )}

        {showText && (
          <div className={`bg-white p-12 md:p-20 rounded-[48px] shadow-2xl border border-slate-100 transition-all relative ${isFinished && !calculatedWPM ? 'ring-8 ring-blue-100' : ''} ${isFinished && calculatedWPM ? 'opacity-50 grayscale-[0.5]' : ''}`}>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-12 opacity-20">
                 <div className="h-px w-20 bg-slate-900" />
                 <span className="text-2xl">🌍</span>
                 <div className="h-px w-20 bg-slate-900" />
              </div>
              <div className={`text-xl md:text-2xl text-slate-700 leading-[2.2] text-justify font-serif transition-all ${isFinished && !calculatedWPM ? 'cursor-pointer' : ''}`}>
                {wordsWithMetadata.map((segment, sIdx) => {
                  const Tag = segment.type;
                  const className = segment.type === 'p' 
                    ? 'mb-8' 
                    : segment.type === 'h3' 
                      ? 'text-3xl font-black text-slate-900 mt-12 mb-6 block' 
                      : 'text-2xl font-bold text-slate-800 mt-8 mb-4 block';
                  
                  return (
                    <Tag key={sIdx} className={className}>
                      {segment.words.map((word) => (
                        <span
                          key={word.index}
                          onClick={() => handleWordClick(word.index)}
                          className={`inline-block px-1 rounded transition-colors ${
                            isFinished && !calculatedWPM ? 'hover:bg-blue-100 hover:text-blue-900' : ''
                          } ${calculatedWPM !== null && word.index < calculatedWPM ? 'text-blue-600/40' : ''} ${calculatedWPM !== null && word.index === calculatedWPM - 1 ? 'bg-blue-600 text-white ring-4 ring-blue-100' : ''}`}
                        >
                          {word.text}{' '}
                        </span>
                      ))}
                    </Tag>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadDrill;
