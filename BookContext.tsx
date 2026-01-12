import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export type SegmentType = 'h3' | 'h4' | 'p';

export interface Segment {
  type: SegmentType;
  text: string;
}

export interface Book {
  id: string;
  title: string;
  segments: Segment[];
  totalWords: number;
}

interface BookContextType {
  book: Book | null;
  isLoading: boolean;
  consumeBook: () => void;
  defaultText: Book;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

const DEFAULT_TEXT_RAW = `
  The art of reading is not merely about identifying words on a page, but about the profound connection between the mind and the narrative. As we delve into the depths of a text, our eyes dance across the lines, absorbing meaning and context at varying speeds. In these drills, we challenge our cognitive boundaries, pushing the limits of our visual span and processing speed. Whether reading at a normal pace or pushing towards triple or quadruple speeds, the goal remains the same: to maintain comprehension while increasing efficiency. 

  Focus on the flow of the sentences. Let the words wash over you as you maintain a steady rhythm. The 1-minute timer is a tool to measure your progress and build stamina. Consistent practice is the key to mastering any skill, and reading is no exception. By engaging in these exercises, you are training your brain to recognize patterns and process information more rapidly. 

  As the timer counts down, maintain your focus. Do not worry about perfection; instead, focus on the persistence of your gaze. The justified alignment of this text is designed to provide a consistent visual field, helping you develop a more rhythmic eye movement. When the time is up, reflect on your experience and prepare for the next round. Each drill is a step towards becoming a more proficient and faster reader.
`;

const parseTextToSegments = (text: string): Segment[] => {
  const paragraphs = text.split(/\n\s*\n/);
  return paragraphs
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => ({ type: 'p', text: p }));
};

const DEFAULT_BOOK: Book = {
  id: 'default',
  title: 'Default Text',
  segments: parseTextToSegments(DEFAULT_TEXT_RAW),
  totalWords: DEFAULT_TEXT_RAW.trim().split(/\s+/).length
};

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookQueue, setBookQueue] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBook = useCallback(async () => {
    let attempts = 0;
    const MAX_ATTEMPTS = 10;

    while (attempts < MAX_ATTEMPTS) {
      attempts++;
      // Random ID between 500 and 10000
      const bookId = Math.floor(Math.random() * (10000 - 500 + 1)) + 500;
      console.log(`[Attempt ${attempts}/${MAX_ATTEMPTS}] Fetching book ID: ${bookId}`);
      const metadataUrl = `https://gutendex.com/books/${bookId}/`;
      
      try {
        // 1. Fetch Metadata
        console.log('Fetching metadata:', metadataUrl);
        const metadataResponse = await fetch(metadataUrl);
        
        if (metadataResponse.status === 404) {
          console.warn(`Book ${bookId} not found (404), retrying...`);
          continue;
        }
        
        if (!metadataResponse.ok) throw new Error('Failed to fetch book metadata');
        
        const metadata = await metadataResponse.json();
        const textUrl = metadata.formats['text/plain; charset=us-ascii'] || metadata.formats['text/plain'];
        console.log('Text URL found:', textUrl);
        
        if (!textUrl) {
          console.warn(`Book ${bookId} has no plain text format, retrying...`);
          continue;
        }

        // 2. Fetch the actual text content via proxy
        console.log('Fetching text content via proxy...');
        const proxiedUrl = `/api/proxy?url=${encodeURIComponent(textUrl)}`;
        const textResponse = await fetch(proxiedUrl);
        
        if (!textResponse.ok) throw new Error(`Failed to fetch text content: ${textResponse.status} ${textResponse.statusText}`);
        
        const fullText = await textResponse.text();
        console.log('Text content fetched, length:', fullText.length);

        if (fullText.length < 100) {
           console.warn(`Book ${bookId} text is too short, retrying...`);
           continue;
        }
        
        // 3. Get first 50,000 characters
        const slicedText = fullText.slice(0, 50000);
        
        // 4. Parse text
        const segments = parseTextToSegments(slicedText);

        return {
          id: metadata.id.toString(),
          title: metadata.title,
          segments,
          totalWords: slicedText.trim().split(/\s+/).length
        };

      } catch (error) {
        console.error(`Error fetching book ${bookId}:`, error);
        // If it's a network error (like proxy failure), we might want to keep trying or stop?
        // We'll keep trying in case it was a specific glitch or bad book URL.
      }
    }
    
    console.error('Failed to fetch any book after max attempts.');
    return null;
  }, []);

  const isFetchingRef = useRef(false);

  useEffect(() => {
    const fillQueue = async () => {
      // If we already have a book, don't fetch more for this specific use case
      // since we are always fetching the same book (ID 10000).
      if (isFetchingRef.current || bookQueue.length > 0) return;

      isFetchingRef.current = true;
      try {
        const newBook = await fetchBook();
        if (newBook) {
          setBookQueue([newBook]); // Only keep one book since it's always the same
        }
      } catch (error) {
        console.error('Failed to fill book queue:', error);
      } finally {
        isFetchingRef.current = false;
        setIsLoading(false);
      }
    };

    fillQueue();
  }, [bookQueue.length, fetchBook]);

  const consumeBook = useCallback(() => {
    // For this specific 'single book' requirement, we might just want to reload the same book
    // or arguably do nothing if we want to keep reading the same one.
    // Let's re-fetch or just keep it. 
    // If requirement is "consume", usually implies moving to next. 
    // But since it's the SAME book, maybe we just reset?
    // Let's essentially clear and re-trigger fetch if we want to "reset" it, 
    // or since it's static, maybe we don't need a queue.
    // However, to keep API similar to WikipediaContext:
    setBookQueue([]); // This will trigger useEffect to fetch again
  }, []);

  const value = {
    book: bookQueue[0] || null,
    isLoading: isLoading && bookQueue.length === 0,
    consumeBook,
    defaultText: DEFAULT_BOOK
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};

export const useBook = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBook must be used within a BookProvider');
  }
  return context;
};
