import { createContext, useState, useEffect, useContext } from 'react';
import { getTrendingGifs, Tenor, queryGifs } from '@/api/tenor';

type GifContextType = {
  loadingGifs: boolean;
  gifs: Record<string, Tenor>;
  setQueryGifs: (query: string) => void;
};
const GifContext = createContext<GifContextType | null>(null);

export const GifProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [loadingGifs, setLoadingGifs] = useState(false);
  const [gifs, setGifs] = useState<Record<string, Tenor>>({}); // Cache for quicker search results

  useEffect(() => {
    const fetchTrendingGifs = async () => {
      setLoadingGifs(true);
      const result = await getTrendingGifs();
      if (result.status === 'success') {
        setGifs((prev) => ({ ...prev, trending: result.data }));
      }
      //TODO: Handle error
      setLoadingGifs(false);
    };
    fetchTrendingGifs();
  }, []);

  const setQueryGifs = (query: string) => {
    if (query.length === 0) return;
    if (gifs[query]) return;
    setLoadingGifs(true);
    queryGifs(query).then((result) => {
      if (result.status === 'success') {
        setGifs((prev) => ({ ...prev, [query]: result.data }));
      }
      setLoadingGifs(false);
    });
  };

  const value: GifContextType = {
    loadingGifs,
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
