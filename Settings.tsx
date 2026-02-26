import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Sparkles, Key, Trash2, Eye, EyeOff } from 'lucide-react';
import { useSettings, TextSource } from './SettingsContext';
import { MessageSquareText } from 'lucide-react';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { textSource, openaiApiKey, aiTopics, setTextSource, setOpenaiApiKey, setAiTopics, resetAllData } = useSettings();
  const [showApiKey, setShowApiKey] = useState(false);

  const handleReset = () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset all progress and settings? This action cannot be undone.'
    );
    if (confirmed) {
      resetAllData();
    }
  };

  const sources: { id: TextSource; title: string; description: string; icon: React.ReactNode }[] = [
    {
      id: 'wikipedia',
      title: 'Random Wikipedia',
      description: 'Fetches random Wikipedia articles as reading material. No configuration needed.',
      icon: <Globe size={32} />,
    },
    {
      id: 'ai',
      title: 'AI Generated',
      description: 'Uses ChatGPT to generate custom reading content. Requires an OpenAI API key.',
      icon: <Sparkles size={32} />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 animate-in fade-in duration-500">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 font-bold hover:underline flex items-center gap-2"
          >
            <ArrowLeft size={20} /> Back to Home
          </button>
        </div>

        <h1 className="text-4xl font-black text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-500 mb-12">Configure your reading experience</p>

        {/* Text Source */}
        <section className="mb-16">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">
            Text Source
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sources.map((source) => {
              const isActive = textSource === source.id;
              return (
                <button
                  key={source.id}
                  onClick={() => setTextSource(source.id)}
                  className={`relative p-6 rounded-2xl border-2 text-left transition-all group ${
                    isActive
                      ? 'bg-white border-blue-600 shadow-xl ring-4 ring-blue-50'
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-lg'
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                  )}

                  <div
                    className={`mb-4 ${
                      isActive
                        ? 'text-blue-600'
                        : 'text-slate-400 group-hover:text-blue-400'
                    } transition-colors`}
                  >
                    {source.icon}
                  </div>
                  <h3
                    className={`text-lg font-black mb-1 ${
                      isActive ? 'text-blue-600' : 'text-slate-900'
                    }`}
                  >
                    {source.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {source.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* API Key Input — visible when AI Generated is selected */}
          {textSource === 'ai' && (
            <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Key size={20} className="text-blue-600" />
                  <h3 className="font-bold text-slate-900">OpenAI API Key</h3>
                </div>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={openaiApiKey}
                    onChange={(e) => setOpenaiApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  Your API key is stored locally in your browser and never sent to our servers.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mt-4">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquareText size={20} className="text-blue-600" />
                  <h3 className="font-bold text-slate-900">Topics</h3>
                </div>
                <input
                  type="text"
                  value={aiTopics}
                  onChange={(e) => setAiTopics(e.target.value)}
                  placeholder="e.g. science, history, technology"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
                <p className="text-xs text-slate-400 mt-3">
                  Comma-separated list of topics for AI-generated reading content.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Danger Zone */}
        <section>
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">
            Danger Zone
          </h2>
          <div className="bg-white rounded-2xl border border-red-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Reset Progress and Settings Data</h3>
                <p className="text-sm text-slate-500">
                  Delete all reading stats, settings, and preferences. This cannot be undone.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-red-600/20"
              >
                <Trash2 size={18} />
                Reset All Data
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
