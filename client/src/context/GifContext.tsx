import { createContext, useState, useEffect, useContext } from 'react';
import { getTrendingGifs, Tenor, queryGifs } from '@/api/tenor';

type GifContextType = {
  gifStatus: 'loading' | 'success' | 'error';
  gifs: Record<string, Tenor>;
  setQueryGifs: (query: string) => void;
};
const GifContext = createContext<GifContextType | null>(null);

export const GifProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [gifStatus, setGifStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [gifs, setGifs] = useState<Record<string, Tenor>>({}); // Cache for quicker search results

  useEffect(() => {
    const fetchTrendingGifs = async () => {
      setGifStatus('loading');
      const result = await getTrendingGifs();
      if (result.status === 'success') {
        setGifs((prev) => ({ ...prev, trending: result.data }));
        setGifStatus('success');
      } else {
        setGifStatus('error');
      }
    };
    fetchTrendingGifs();
  }, []);

  const setQueryGifs = (query: string) => {
    if (query.length === 0) return;
    if (gifs[query]) return;
    setGifStatus('loading');
    queryGifs(query).then((result) => {
      if (result.status === 'success') {
        setGifs((prev) => ({ ...prev, [query]: result.data }));
        setGifStatus('success');
      } else {
        setGifStatus('error');
      }
    });
  };

  const value: GifContextType = {
    gifStatus,
    gifs,
    setQueryGifs,
  };
  return <GifContext.Provider value={value}>{children}</GifContext.Provider>;
};

export const useGif = (): GifContextType => {
  const context = useContext(GifContext);
  if (context === null) {
    throw new Error('useGif must be used within a GifProvider');
  }
  return context;
};
