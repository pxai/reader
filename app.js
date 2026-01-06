
import { translations } from './translations.js';

// --- State Management ---
const state = {
    lang: localStorage.getItem('lang') || 'en',
    route: window.location.hash.replace('#/', '') || 'home'
};

const updateState = (key, value) => {
    state[key] = value;
    if (key === 'lang') localStorage.setItem('lang', value);
    render();
};

// --- Router ---
window.addEventListener('hashchange', () => {
    const newRoute = window.location.hash.replace('#/', '') || 'home';
    updateState('route', newRoute);
    window.scrollTo(0, 0);
});

// --- Components ---
const Navbar = (t, currentLang) => `
<nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
        <a href="#/" class="text-2xl font-black tracking-tighter text-blue-600">POLY</a>
        <div class="hidden md:flex items-center space-x-8 font-semibold text-slate-600">
            <a href="#/" class="hover:text-blue-600 transition-colors">${t.nav.home}</a>
            <a href="#/about" class="hover:text-blue-600 transition-colors">${t.nav.about}</a>
            <a href="#/contact" class="hover:text-blue-600 transition-colors">${t.nav.contact}</a>
        </div>
        <div class="flex items-center gap-2">
            ${['en', 'es', 'fr'].map(l => `
                <button onclick="window.setLanguage('${l}')" class="px-3 py-1 rounded-full text-xs font-bold transition-all ${currentLang === l ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}">
                    ${l.toUpperCase()}
                </button>
            `).join('')}
        </div>
    </div>
</nav>
`;

const Hero = (t) => `
<header class="relative py-24 sm:py-32 overflow-hidden fade-in">
    <div class="absolute inset-0 -z-10 overflow-hidden">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-100/50 rounded-full blur-[120px]"></div>
    </div>
    <div class="max-w-7xl mx-auto px-6 text-center">
        <h1 class="text-5xl sm:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
            ${t.hero.title}
        </h1>
        <p class="max-w-2xl mx-auto text-xl text-slate-600 mb-12">
            ${t.hero.subtitle}
        </p>
        <div class="flex flex-wrap justify-center gap-4">
            <a href="#/contact" class="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl hover:bg-blue-600 transition-all hover:-translate-y-1">
                ${t.hero.cta}
            </a>
            <button class="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                Learn More
            </button>
        </div>
    </div>
</header>
`;

const Features = (t) => `
<section class="py-24 bg-white border-y border-slate-100 fade-in">
    <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-3xl font-black text-center mb-16">${t.features.title}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            ${t.features.items.map(item => `
                <div class="p-10 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group">
                    <div class="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all scale-100 group-hover:scale-110">${item.icon}</div>
                    <h3 class="text-xl font-bold mb-3">${item.title}</h3>
                    <p class="text-slate-500 leading-relaxed">${item.desc}</p>
                </div>
            `).join('')}
        </div>
    </div>
</section>
`;

const About = (t) => `
<main class="py-24 fade-in">
    <div class="max-w-3xl mx-auto px-6">
        <h1 class="text-5xl font-black mb-10">${t.nav.about}</h1>
        <div class="prose prose-slate lg:prose-xl">
            <p class="text-xl text-slate-600 mb-8 leading-relaxed">
                This project showcases the power of **Vanilla JavaScript** in a modern world. 
                By avoiding heavy frameworks, we achieve instant load times and perfect compatibility with platforms like GitHub Pages.
            </p>
            <div class="h-64 rounded-3xl bg-slate-200 overflow-hidden mb-8 shadow-inner">
                <img src="https://picsum.photos/1200/800?tech" class="w-full h-full object-cover" />
            </div>
            <p class="text-slate-500">
                Created with care for speed-conscious developers. 🌍
            </p>
        </div>
    </div>
</main>
`;

const Contact = (t) => `
<main class="py-24 fade-in">
    <div class="max-w-xl mx-auto px-6">
        <h1 class="text-4xl font-black mb-4 text-center">${t.contact.title}</h1>
        <form class="space-y-6 mt-12" onsubmit="event.preventDefault(); alert('Message Sent!');">
            <div>
                <label class="block text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">${t.contact.name}</label>
                <input type="text" class="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
            </div>
            <div>
                <label class="block text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">${t.contact.email}</label>
                <input type="email" class="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
            </div>
            <div>
                <label class="block text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">${t.contact.message}</label>
                <textarea rows="4" class="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-600 transition-all"></textarea>
            </div>
            <button class="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all">
                ${t.contact.submit}
            </button>
        </form>
    </div>
</main>
`;

const Footer = (t) => `
<footer class="py-12 bg-slate-50 text-slate-400 text-center border-t border-slate-200">
    <p class="text-sm font-medium">© ${new Date().getFullYear()} POLYGLOT. ${t.footer.rights}</p>
</footer>
`;

// --- Global Actions ---
window.setLanguage = (l) => updateState('lang', l);

// --- Main Render Engine ---
function render() {
    const t = translations[state.lang];
    const app = document.getElementById('app');
    
    let pageContent = '';
    if (state.route === 'home') {
        pageContent = Hero(t) + Features(t);
    } else if (state.route === 'about') {
        pageContent = About(t);
    } else if (state.route === 'contact') {
        pageContent = Contact(t);
    }

    app.innerHTML = `
        ${Navbar(t, state.lang)}
        <div class="min-h-[80vh]">
            ${pageContent}
        </div>
        ${Footer(t)}
    `;
    
    document.documentElement.lang = state.lang;
}

// Initial boot
render();
