import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MousePointer2,
  CheckCircle,
  Columns
} from 'lucide-react';
import { useWikipedia } from './WikipediaContext';

const Grouping: React.FC = () => {
  const navigate = useNavigate();
  const { article, isLoading, defaultText } = useWikipedia();
  
  const [isAutoscrollActive, setIsAutoscrollActive] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  
  const activeArticle = article || defaultText;
  
  // Flatten words for display (simpler than ReadDrill since we don't need word interaction)
  const segments = useMemo(() => {
    return activeArticle.segments;
  }, [activeArticle]);

  // Autoscroll logic
  useEffect(() => {
    let animationFrameId: number;
    let lastTime: number;
    let scrollAccumulator = 0;

    const animate = (time: number) => {
      if (lastTime !== undefined) {
        const deltaTime = (time - lastTime) / 1000; // in seconds
        
        const speedMapping: Record<number, number> = {
          1: 25,
          2: 37.5, // Reduced from 75 by half
          3: 100
        };
        const pixelsPerSecond = speedMapping[scrollSpeed] || 50;
        const scrollAmount = pixelsPerSecond * deltaTime;
        
        scrollAccumulator += scrollAmount;

        if (scrollAccumulator >= 1) {
          const pixelsToScroll = Math.floor(scrollAccumulator);
          window.scrollBy({ top: pixelsToScroll, behavior: 'auto' });
          scrollAccumulator -= pixelsToScroll;
        }
        
        // Stop if we've reached the bottom
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
           setIsAutoscrollActive(false);
           return;
        }
      }
      lastTime = time;
      animationFrameId = requestAnimationFrame(animate);
    };

    if (isAutoscrollActive) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isAutoscrollActive, scrollSpeed]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12 sticky top-24 bg-white/80 backdrop-blur-xl py-4 z-50 border-b border-slate-200 px-6 rounded-2xl shadow-sm">
          <button 
            onClick={() => navigate('/')}
            className="text-blue-600 font-bold hover:underline flex items-center gap-2"
          >
            <ArrowLeft size={20} /> Back to Home
          </button>

          <div className="flex items-center gap-4">
            <div className="text-slate-400 font-bold uppercase tracking-widest text-xs hidden sm:block">
              Grouping Exercise
            </div>
            
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
        </div>

        <div className="relative bg-white p-12 md:p-20 rounded-[48px] shadow-2xl border border-slate-100">
          {/* Vertical Guides */}
          <div className="absolute inset-0 pointer-events-none z-10 flex justify-center">
            <div className="w-full max-w-3xl flex justify-between h-full px-4 md:px-0">
               {/* Left guide at ~38% (was ~33%) */}
               <div className="absolute left-[30%] md:left-[36%] top-20 bottom-20 w-0.5 bg-blue-200/80 shadow-[0_0_12px_rgba(37,99,235,0.3)]" />
               {/* Right guide at ~38% from right (was ~33%) */}
               <div className="absolute right-[30%] md:right-[36%] top-20 bottom-20 w-0.5 bg-blue-200/80 shadow-[0_0_12px_rgba(37,99,235,0.3)]" />
            </div>
          </div>

          <div className="max-w-3xl mx-auto relative z-0">
            <div className="flex items-center justify-center gap-4 mb-12 opacity-20">
               <div className="h-px w-20 bg-slate-900" />
               <span className="text-2xl">📏</span>
               <div className="h-px w-20 bg-slate-900" />
            </div>
            
            <article className="text-xl md:text-2xl text-slate-700 leading-[2.2] text-justify font-serif">
              {segments.map((segment, sIdx) => {
                const Tag = segment.type;
                const className = segment.type === 'p' 
                  ? 'mb-8' 
                  : segment.type === 'h3' 
                    ? 'text-3xl font-black text-slate-900 mt-12 mb-6 block text-left' 
                    : 'text-2xl font-bold text-slate-800 mt-8 mb-4 block text-left';
                
                return (
                  <Tag key={sIdx} className={className}>
                    {segment.text}
                  </Tag>
                );
              })}
            </article>

            <div className="mt-20 text-center">
              <button 
                onClick={() => navigate('/')}
                className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl flex items-center gap-3 mx-auto hover:bg-slate-800 transition-colors"
              >
                <CheckCircle size={24} />
                Finish Exercise
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grouping;
