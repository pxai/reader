import React, { createContext, useContext, useState, useCallback } from 'react';

export type TextSource = 'wikipedia' | 'ai';

interface Settings {
  textSource: TextSource;
  openaiApiKey: string;
  aiTopics: string;
}

interface SettingsContextType {
  textSource: TextSource;
  openaiApiKey: string;
  aiTopics: string;
  setTextSource: (source: TextSource) => void;
  setOpenaiApiKey: (key: string) => void;
  setAiTopics: (topics: string) => void;
  resetAllData: () => void;
}

const STORAGE_KEY = 'reader_settings';

const loadSettings = (): Settings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        textSource: parsed.textSource || 'wikipedia',
        openaiApiKey: parsed.openaiApiKey || '',
        aiTopics: parsed.aiTopics || '',
      };
    }
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  return { textSource: 'wikipedia', openaiApiKey: '', aiTopics: '' };
};

const saveSettings = (settings: Settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  const setTextSource = useCallback((source: TextSource) => {
    setSettings(prev => {
      const next = { ...prev, textSource: source };
      saveSettings(next);
      return next;
    });
  }, []);

  const setOpenaiApiKey = useCallback((key: string) => {
    setSettings(prev => {
      const next = { ...prev, openaiApiKey: key };
      saveSettings(next);
      return next;
    });
  }, []);

  const setAiTopics = useCallback((topics: string) => {
    setSettings(prev => {
      const next = { ...prev, aiTopics: topics };
      saveSettings(next);
      return next;
    });
  }, []);

  const resetAllData = useCallback(() => {
    localStorage.removeItem('read_drill_stats');
    localStorage.removeItem('lang');
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }, []);

  return (
    <SettingsContext.Provider value={{
      textSource: settings.textSource,
      openaiApiKey: settings.openaiApiKey,
      aiTopics: settings.aiTopics,
      setTextSource,
      setOpenaiApiKey,
      setAiTopics,
      resetAllData,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
