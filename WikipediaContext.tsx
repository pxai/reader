import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export type SegmentType = 'h3' | 'h4' | 'p';

export interface Segment {
  type: SegmentType;
  text: string;
}

export interface WikipediaArticle {
  id: string;
  segments: Segment[];
  totalWords: number;
}

interface WikipediaContextType {
  article: WikipediaArticle | null;
  isLoading: boolean;
  consumeArticle: () => void;
  defaultText: WikipediaArticle;
}

const WikipediaContext = createContext<WikipediaContextType | undefined>(undefined);

const DEFAULT_TEXT_RAW = `
  The art of reading is not merely about identifying words on a page, but about the profound connection between the mind and the narrative. As we delve into the depths of a text, our eyes dance across the lines, absorbing meaning and context at varying speeds. In these drills, we challenge our cognitive boundaries, pushing the limits of our visual span and processing speed. Whether reading at a normal pace or pushing towards triple or quadruple speeds, the goal remains the same: to maintain comprehension while increasing efficiency. 

  Focus on the flow of the sentences. Let the words wash over you as you maintain a steady rhythm. The 1-minute timer is a tool to measure your progress and build stamina. Consistent practice is the key to mastering any skill, and reading is no exception. By engaging in these exercises, you are training your brain to recognize patterns and process information more rapidly. 

  As the timer counts down, maintain your focus. Do not worry about perfection; instead, focus on the persistence of your gaze. The justified alignment of this text is designed to provide a consistent visual field, helping you develop a more rhythmic eye movement. When the time is up, reflect on your experience and prepare for the next round. Each drill is a step towards becoming a more proficient and faster reader.
`;

const parseWikipediaText = (text: string): Segment[] => {
  const lines = text.split('\n');
  const segments: Segment[] = [];
  let currentParagraph = '';

  const flushParagraph = () => {
    if (currentParagraph.trim()) {
      segments.push({ type: 'p', text: currentParagraph.trim() });
      currentParagraph = '';
    }
  };

  lines.forEach(line => {
    const h3Match = line.match(/^==\s*(.*?)\s*==$/);
    const h4Match = line.match(/^===\s*(.*?)\s*===$/);

    if (h3Match) {
      flushParagraph();
      segments.push({ type: 'h3', text: h3Match[1] });
    } else if (h4Match) {
      flushParagraph();
      segments.push({ type: 'h4', text: h4Match[1] });
    } else if (line.trim()) {
      currentParagraph += (currentParagraph ? ' ' : '') + line.trim();
    } else {
      flushParagraph();
    }
  });

  flushParagraph();
  return segments;
};

const DEFAULT_ARTICLE: WikipediaArticle = {
  id: 'default',
  segments: parseWikipediaText(DEFAULT_TEXT_RAW),
  totalWords: DEFAULT_TEXT_RAW.trim().split(/\s+/).length
};

export const WikipediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [articleQueue, setArticleQueue] = useState<WikipediaArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchArticle = useCallback(async () => {
    const url = 'https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&explaintext&format=json&origin=*';
    
    try {
      let combinedText = '';
      let totalWordCount = 0;
      let attempts = 0;
      const MAX_ATTEMPTS = 15;

      while (totalWordCount < 2000 && attempts < MAX_ATTEMPTS) {
        attempts++;
        const response = await fetch(url);
        if (!response.ok) continue;
        
        const data = await response.json();
        const pages = data.query?.pages;
        if (!pages) continue;

        const pageId = Object.keys(pages)[0];
        const extract = pages[pageId].extract || '';
        
        if (extract.trim()) {
          combinedText += (combinedText ? '\n\n' : '') + extract;
          totalWordCount = combinedText.trim().split(/\s+/).length;
        }
      }

      if (totalWordCount > 0) {
        const segments = parseWikipediaText(combinedText);
        return {
          id: Math.random().toString(36).substr(2, 9),
          segments,
          totalWords: totalWordCount
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching Wikipedia article:', error);
      return null;
    }
  }, []);

  const isFetchingRef = useRef(false);

  useEffect(() => {
    const fillQueue = async () => {
      if (isFetchingRef.current || articleQueue.length >= 2) return;

      isFetchingRef.current = true;
      try {
        const newArticle = await fetchArticle();
        if (newArticle) {
          setArticleQueue(prev => [...prev, newArticle]);
        }
      } catch (error) {
        console.error('Failed to fill Wikipedia queue:', error);
      } finally {
        isFetchingRef.current = false;
        setIsLoading(false);
      }
    };

    fillQueue();
  }, [articleQueue.length, fetchArticle]);

  const consumeArticle = useCallback(() => {
    setArticleQueue(prev => prev.slice(1));
  }, []);

  const value = {
    article: articleQueue[0] || null,
    isLoading: isLoading && articleQueue.length === 0,
    consumeArticle,
    defaultText: DEFAULT_ARTICLE
  };

  return (
    <WikipediaContext.Provider value={value}>
      {children}
    </WikipediaContext.Provider>
  );
};

export const useWikipedia = () => {
  const context = useContext(WikipediaContext);
  if (context === undefined) {
    throw new Error('useWikipedia must be used within a WikipediaProvider');
  }
  return context;
};
