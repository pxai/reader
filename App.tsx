
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { translations } from './translations';
import { Language, TranslationContent } from './types';

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
      <Link to="/contact" className="px-12 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-1 inline-block">
        {t.hero.cta}
      </Link>
    </header>

    <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 py-20">
      {t.features.items.map((f, i: number) => (
        <div key={i} className="bg-white p-10 rounded-[32px] border border-slate-200 hover:shadow-xl transition-all group">
          <div className="text-4xl mb-6">{f.icon}</div>
          <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
          <p className="text-slate-500 leading-relaxed">{f.description}</p>
        </div>
      ))}
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
    <Router>
      <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
        <Navbar t={t} currentLang={lang} setLang={setLang} />
        <main className="pb-32">
          <Routes>
            <Route path="/" element={<Home t={t} />} />
            <Route path="/about" element={<div className="py-20 text-center text-4xl font-black">{t.nav.about}</div>} />
            <Route path="/contact" element={<div className="py-20 text-center text-4xl font-black">{t.nav.contact}</div>} />
          </Routes>
        </main>
        <footer className="py-12 text-center text-slate-400 font-medium border-t border-slate-200">
           © {new Date().getFullYear()} POLYGLOT. {t.footer.rights}
        </footer>
      </div>
    </Router>
  );
};

export default App;
