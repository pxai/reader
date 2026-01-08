
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { translations } from './translations';
import { Language, TranslationContent } from './types';
import ReadDrill from './ReadDrill';
import { WikipediaProvider } from './WikipediaContext';

interface NavbarProps {
  t: TranslationContent;
  currentLang: Language;
  setLang: (lang: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ t, currentLang, setLang }) => (
  <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
      <Link to="/" className="text-2xl font-black text-blue-600 tracking-tighter">READER</Link>
      <div className="hidden md:flex gap-8 font-bold text-slate-500">
        <Link to="/" className="hover:text-blue-600 transition-colors">{t.nav.home}</Link>
        <Link to="/about" className="hover:text-blue-600 transition-colors">{t.nav.about}</Link>
        <Link to="/contact" className="hover:text-blue-600 transition-colors">{t.nav.contact}</Link>
      </div>
      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
        {Object.values(Language).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l as Language)}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
              currentLang === l ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  </nav>
);

const TrainingView: React.FC = () => {
  const { id, level } = useParams<{ id: string; level: string }>();
  const navigate = useNavigate();

  const lines = useMemo(() => {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let layouts = [1, 1, 1]; // Default layout (1 char per column)

    if (id === '1') {
      if (level === '2') chars += '0123456789';
      if (level === '3') chars += 'abcdefghijklmnopqrstuvwxyz0123456789';
    } else if (id === '2') {
      layouts = [1, 3, 1]; // Exercise 2 layout requested: U YSA Z
      if (level === '2') chars += '0123456789';
      if (level === '3') chars += 'abcdefghijklmnopqrstuvwxyz0123456789';
    } else if (id === '3') {
      layouts = [1, 1, 1, 1, 1]; // Exercise 3 layout: Z P K R A
      if (level === '2') chars += '0123456789';
      if (level === '3') chars += 'abcdefghijklmnopqrstuvwxyz0123456789';
    } else if (id === '4') {
      layouts = [1, 1, 3, 1, 1]; // Exercise 4 layout: K O UBP G E
      if (level === '2') chars += '0123456789';
      if (level === '3') chars += 'abcdefghijklmnopqrstuvwxyz0123456789';
    } else if (id === '5') {
      layouts = [1, 1, 1, 3, 1, 1, 1]; // Exercise 5 layout: E C K LJC R U P
      if (level === '2') chars += '0123456789';
      if (level === '3') chars += 'abcdefghijklmnopqrstuvwxyz0123456789';
    }

    const result = [];
    for (let i = 0; i < 60; i++) {
      const lineChars = layouts.map(len => 
        Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
      );
      result.push(lineChars);
    }
    return result;
  }, [id, level]);

  return (
    <div className="min-h-screen bg-white py-12 px-4 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12 sticky top-24 bg-white/90 backdrop-blur py-4 z-10 border-b border-slate-100 px-4">
          <button 
            onClick={() => navigate(`/vision-span/exercise/${id}`)}
            className="text-blue-600 font-bold hover:underline"
          >
            ← Exit Training
          </button>
          <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">
            Ex {id} • Level {level}
          </div>
        </div>
        <div className="flex flex-col items-center space-y-8 font-mono text-2xl md:text-4xl text-slate-800">
          {lines.map((line, idx) => (
            <div key={idx} className="flex justify-center w-full max-w-2xl px-4">
              {line.map((item, iIdx) => (
                <span 
                  key={iIdx} 
                  className={`flex-1 text-center whitespace-pre ${
                    id === '5' ? (
                      (iIdx === 2 || iIdx === 5) ? 'ml-12 md:ml-20' : 
                      (iIdx === 3 || iIdx === 4) ? 'ml-6 md:ml-10' : ''
                    ) : ''
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-20 text-center pb-20">
          <button 
             onClick={() => navigate(`/vision-span/exercise/${id}`)}
             className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl"
          >
            Finish Exercise
          </button>
        </div>
      </div>
    </div>
  );
};

const VisionSpanSelect: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">Vision Span Exercises</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {[1, 2, 3, 4, 5].map((num) => (
          <Link
            key={num}
            to={`/vision-span/exercise/${num}`}
            className="group relative h-64 bg-white border border-slate-200 rounded-[32px] overflow-hidden hover:shadow-2xl hover:border-blue-300 transition-all flex flex-col items-center justify-center gap-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
               <span className="text-2xl font-black">{num}</span>
            </div>
            <span className="text-xl font-bold text-slate-900">Exercise {num}</span>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>
        ))}
      </div>
    </div>
  );
};

const ExerciseLevelSelect: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
      <button 
        onClick={() => navigate('/vision-span')}
        className="mb-8 text-blue-600 font-bold flex items-center gap-2 mx-auto hover:underline"
      >
        ← Back to Exercises
      </button>
      <h2 className="text-4xl font-black text-slate-900 mb-4">Exercise {id}</h2>
      <p className="text-slate-500 mb-12">Select your difficulty level to begin</p>
      
      <div className="flex flex-col gap-4 max-w-md mx-auto">
        {[1, 2, 3].map((level) => (
          <button
            key={level}
            onClick={() => navigate(`/vision-span/exercise/${id}/level/${level}`)}
            className="group p-6 bg-white border border-slate-200 rounded-2xl flex items-center justify-between hover:border-blue-600 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center font-bold text-slate-600 group-hover:text-blue-600">
                {level}
              </div>
              <span className="text-lg font-bold text-slate-800">Level {level}</span>
            </div>
            <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-black">START →</span>
          </button>
        ))}
      </div>
    </div>
  );
};

interface HomeProps {
  t: TranslationContent;
}

const Home: React.FC<HomeProps> = ({ t }) => (
  <div className="animate-in fade-in duration-700">
    <header className="py-24 text-center">
      <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tight">
        {t.hero.title}
      </h1>
      <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-12 leading-relaxed">
        {t.hero.subtitle}
      </p>
      <Link to="/vision-span" className="px-12 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-1 inline-block">
        {t.hero.cta}
      </Link>
    </header>

    <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 py-20">
      {t.features.items.map((f, i: number) => {
        const isVisionSpan = i === 0;
        const content = (
          <div className="bg-white p-10 rounded-[32px] border border-slate-200 hover:shadow-xl transition-all group h-full">
            <div className="text-4xl mb-6">{f.icon}</div>
            <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors">{f.title}</h3>
            <p className="text-slate-500 leading-relaxed">{f.description}</p>
          </div>
        );

        return isVisionSpan ? (
          <Link key={i} to="/vision-span" className="block transform transition-transform hover:-translate-y-2">
            {content}
          </Link>
        ) : i === 1 ? (
          <Link key={i} to="/read-drill" className="block transform transition-transform hover:-translate-y-2">
            {content}
          </Link>
        ) : (
          <div key={i}>{content}</div>
        );
      })}
    </section>
  </div>
);

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => 
    (localStorage.getItem('lang') as Language) || Language.EN
  );

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = translations[lang];

  return (
    <WikipediaProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
          <Navbar t={t} currentLang={lang} setLang={setLang} />
          <main className="pb-32">
            <Routes>
              <Route path="/" element={<Home t={t} />} />
              <Route path="/vision-span" element={<VisionSpanSelect />} />
              <Route path="/vision-span/exercise/:id" element={<ExerciseLevelSelect />} />
              <Route path="/vision-span/exercise/:id/level/:level" element={<TrainingView />} />
              <Route path="/about" element={<div className="py-20 text-center text-4xl font-black">{t.nav.about}</div>} />
              <Route path="/read-drill" element={<ReadDrill />} />
              <Route path="/contact" element={<div className="py-20 text-center text-4xl font-black">{t.contact.title}</div>} />
            </Routes>
          </main>
          <footer className="py-12 text-center text-slate-400 font-medium border-t border-slate-200">
             © {new Date().getFullYear()} POLYGLOT. {t.footer.rights}
          </footer>
        </div>
      </Router>
    </WikipediaProvider>
  );
};

export default App;
