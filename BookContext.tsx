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
    const MAX_ATTEMPTS = 5;

    while (attempts < MAX_ATTEMPTS) {
      attempts++;
      try {
        // 1. Get random page from Gutendex (1-200)
        const randomPage = Math.floor(Math.random() * 200) + 1;
        const listUrl = `https://gutendex.com/books/?page=${randomPage}`;
        console.log(`[Attempt ${attempts}/${MAX_ATTEMPTS}] Fetching book list from page: ${randomPage}`);

        const listRes = await fetch(listUrl);
        if (!listRes.ok) throw new Error(`Failed to fetch book list: ${listRes.status}`);
        
        const listData = await listRes.json();
        if (!listData.results || listData.results.length === 0) continue;

        // 2. Pick a random book from the page results
        const randomBookIndex = Math.floor(Math.random() * listData.results.length);
        const bookMetadata = listData.results[randomBookIndex];
        
        const textUrl = bookMetadata.formats['text/plain; charset=utf-8'] || bookMetadata.formats['text/plain'];
        
        if (!textUrl) {
          console.warn(`Book "${bookMetadata.title}" has no text format, retrying...`);
          continue;
        }

        console.log(`Selected book: "${bookMetadata.title}" (ID: ${bookMetadata.id})`);

        // 3. Fetch text content via proxy
        const proxiedUrl = `/api/proxy?url=${encodeURIComponent(textUrl)}`;
        const textRes = await fetch(proxiedUrl);
        
        if (!textRes.ok) {
          console.warn(`Failed to fetch text for book "${bookMetadata.title}", retrying...`);
          continue;
        }

        let fullText = await textRes.text();

        // 4. Content cleaning (remove Gutenberg headers/footers)
        const startMarker = fullText.indexOf("*** START");
        const endMarker = fullText.indexOf("*** END");
        
        if (startMarker !== -1 && endMarker !== -1) {
          fullText = fullText.slice(startMarker, endMarker);
        }

        // 5. Cleanup whitespace and split into words
        // We replace newlines with spaces to treat it as one continuous flow for now, 
        // or keep paragraphs? The sample code does: text.replace(/\s+/g, " ").trim()
        // which flattens everything into a single line of words.
        const cleanText = fullText.replace(/\s+/g, " ").trim();
        const words = cleanText.split(" ");
        const TARGET_WORD_COUNT = 3000;

        if (words.length <= TARGET_WORD_COUNT) {
          console.warn(`Book "${bookMetadata.title}" is too short (${words.length} words), retrying...`);
          continue;
        }

        // 6. Select a random slice of words
        const maxStartIndex = words.length - TARGET_WORD_COUNT;
        const startIndex = Math.floor(Math.random() * (maxStartIndex + 1));
        const selectedWords = words.slice(startIndex, startIndex + TARGET_WORD_COUNT);
        const finalText = selectedWords.join(" ");

        console.log(`Processed ${selectedWords.length} words from "${bookMetadata.title}"`);

        // 7. Return Book structure
        // Since we flattened the text, we'll put it all in one paragraph segment for now.
        // Or we could try to re-segment if we kept newlines.
        // Given the sample code explicitly flattens, we will follow that.
        const segments: Segment[] = [{ type: 'p', text: finalText }];

        return {
          id: bookMetadata.id.toString(),
          title: bookMetadata.title,
          segments,
          totalWords: selectedWords.length
        };

      } catch (error) {
        console.error('Error in fetchBook loop:', error);
        // Continue to next attempt
      }
    }

    console.error('Failed to fetch a valid book after max attempts.');
    return null;
  }, []);

  const isFetchingRef = useRef(false);

  useEffect(() => {
    const fillQueue = async () => {
      if (isFetchingRef.current || bookQueue.length > 0) return;

      isFetchingRef.current = true;
      try {
        const newBook = await fetchBook();
        if (newBook) {
          setBookQueue([newBook]);
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
