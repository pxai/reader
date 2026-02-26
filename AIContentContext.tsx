import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useSettings } from './SettingsContext';

export type SegmentType = 'h3' | 'h4' | 'p';

export interface Segment {
  type: SegmentType;
  text: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  wordIndex: number;
}

export interface AIArticle {
  id: string;
  segments: Segment[];
  totalWords: number;
  quiz: QuizQuestion[];
}

interface AIContentContextType {
  article: AIArticle | null;
  isLoading: boolean;
  error: string | null;
  consumeArticle: () => void;
  defaultText: AIArticle;
}

const DEFAULT_TEXT_RAW = `
  The art of reading is not merely about identifying words on a page, but about the profound connection between the mind and the narrative. As we delve into the depths of a text, our eyes dance across the lines, absorbing meaning and context at varying speeds. In these drills, we challenge our cognitive boundaries, pushing the limits of our visual span and processing speed. Whether reading at a normal pace or pushing towards triple or quadruple speeds, the goal remains the same: to maintain comprehension while increasing efficiency. 

  Focus on the flow of the sentences. Let the words wash over you as you maintain a steady rhythm. The 1-minute timer is a tool to measure your progress and build stamina. Consistent practice is the key to mastering any skill, and reading is no exception. By engaging in these exercises, you are training your brain to recognize patterns and process information more rapidly. 

  As the timer counts down, maintain your focus. Do not worry about perfection; instead, focus on the persistence of your gaze. The justified alignment of this text is designed to provide a consistent visual field, helping you develop a more rhythmic eye movement. When the time is up, reflect on your experience and prepare for the next round. Each drill is a step towards becoming a more proficient and faster reader.
`;

const DEFAULT_ARTICLE: AIArticle = {
  id: 'default',
  segments: DEFAULT_TEXT_RAW.split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => ({ type: 'p' as SegmentType, text: p })),
  totalWords: DEFAULT_TEXT_RAW.trim().split(/\s+/).length,
  quiz: [],
};

const RANDOM_TOPICS = [
  'space exploration', 'ancient civilizations', 'marine biology', 'quantum physics',
  'renewable energy', 'artificial intelligence', 'human psychology', 'world geography',
  'musical history', 'architecture', 'culinary science', 'climate change',
  'mythology', 'genetics', 'philosophy', 'volcanoes', 'economics', 'robotics',
];

const AIContentContext = createContext<AIContentContextType | undefined>(undefined);

function buildPrompt(topics: string): string {
  let topicInstruction: string;

  if (topics.trim()) {
    const topicList = topics.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const chosen = topicList[Math.floor(Math.random() * topicList.length)];
    topicInstruction = `Write about the topic: "${chosen}".`;
  } else {
    const chosen = RANDOM_TOPICS[Math.floor(Math.random() * RANDOM_TOPICS.length)];
    topicInstruction = `Write about the topic: "${chosen}".`;
  }

  return `You are a content generator for a reading comprehension training app.

${topicInstruction}

Generate a response in this EXACT JSON format (no markdown, no code fences, just raw JSON):
{
  "text": "Your article text here, approximately 1000 words. Use plain paragraphs separated by double newlines. Do not include any headings or special formatting.",
  "quiz": [
    {
      "question": "Question about the content?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "wordIndex": 100
    }
  ]
}

Requirements:
- The "text" field must contain approximately 1000 words of engaging, informative content
- The "quiz" array must have exactly 10 questions
- Each question must have exactly 4 options
- "correctIndex" is the 0-based index of the correct option
- "wordIndex" is the approximate word number (position) in the text where the answer to that question can be found
- Spread the wordIndex values evenly across the text (roughly at words 100, 200, 300, ..., 1000)
- Questions should test comprehension of the content up to that word position
- Return ONLY valid JSON, nothing else`;
}

export const AIContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { openaiApiKey, aiTopics } = useSettings();
  const [article, setArticle] = useState<AIArticle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  const fetchArticle = useCallback(async () => {
    if (!openaiApiKey) {
      setError('No OpenAI API key configured. Go to Settings to add one.');
      return null;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'user', content: buildPrompt(aiTopics) },
          ],
          temperature: 0.8,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API request failed: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('Empty response from ChatGPT');
      }

      // Parse JSON — strip possible markdown fences
      const cleaned = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(cleaned);

      if (!parsed.text || !Array.isArray(parsed.quiz)) {
        throw new Error('Invalid response format from ChatGPT');
      }

      // Build segments from the text
      const segments: Segment[] = parsed.text
        .split(/\n\s*\n/)
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 0)
        .map((p: string) => ({ type: 'p' as SegmentType, text: p }));

      const totalWords = parsed.text.trim().split(/\s+/).length;

      // Validate and normalize quiz
      const quiz: QuizQuestion[] = parsed.quiz
        .slice(0, 10)
        .map((q: any) => ({
          question: q.question || '',
          options: Array.isArray(q.options) ? q.options.slice(0, 4) : [],
          correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
          wordIndex: typeof q.wordIndex === 'number' ? q.wordIndex : 0,
        }))
        .filter((q: QuizQuestion) => q.question && q.options.length === 4);

      return {
        id: Math.random().toString(36).substr(2, 9),
        segments,
        totalWords,
        quiz,
      };
    } catch (err: any) {
      console.error('Error fetching AI content:', err);
      setError(err.message || 'Failed to generate AI content');
      return null;
    }
  }, [openaiApiKey, aiTopics]);

  const loadArticle = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const newArticle = await fetchArticle();
      if (newArticle) {
        setArticle(newArticle);
      }
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }, [fetchArticle]);

  const consumeArticle = useCallback(() => {
    setArticle(null);
    // Will be loaded on next request / when component calls loadArticle
    loadArticle();
  }, [loadArticle]);

  // Auto-load on mount if we have an API key and no article
  React.useEffect(() => {
    if (openaiApiKey && !article && !isFetchingRef.current) {
      loadArticle();
    }
  }, [openaiApiKey]); // Only trigger on key changes, not on every render

  const value: AIContentContextType = {
    article,
    isLoading,
    error,
    consumeArticle,
    defaultText: DEFAULT_ARTICLE,
  };

  return (
    <AIContentContext.Provider value={value}>
      {children}
    </AIContentContext.Provider>
  );
};

export const useAIContent = () => {
  const context = useContext(AIContentContext);
  if (context === undefined) {
    throw new Error('useAIContent must be used within an AIContentProvider');
  }
  return context;
};
