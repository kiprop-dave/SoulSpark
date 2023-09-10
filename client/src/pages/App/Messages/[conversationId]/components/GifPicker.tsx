import { useEffect, useMemo, useState } from 'react';
import { useGif } from '@/context/GifContext';
import useDebounce from '@/hooks/useDebounce';
import Spinner from '@/components/Spinner';

type GifPickerProps = {
  onSelect: (url: string) => void;
};

export default function GifPicker({ onSelect }: GifPickerProps): JSX.Element {
  const { gifs, gifStatus, setQueryGifs } = useGif();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    setQueryGifs(debouncedQuery);
  }, [debouncedQuery]);

  const gifsToDisplay = useMemo(() => {
    if (debouncedQuery.length < 1) {
      return gifs.trending?.results || [];
    } else {
      return gifs[debouncedQuery]?.results || [];
    }
  }, [gifs, debouncedQuery]);

  if (gifStatus === 'loading') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner size="sm" />
      </div>
    );
  }

  if (gifStatus === 'error') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-red-500">Error loading GIFs</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col pt-2 bg-white dark:bg-neutral-800 border-t border-t-slate-300 dark:border-t-gray-700">
      <div className="w-full h-full p-2 flex items-center overflow-x-scroll no-scrollbar">
        {gifsToDisplay.map((gif) => {
          const url = gif.media_formats.tinygif.url;
          return (
            <img
              key={gif.id}
              src={url}
              alt={gif.title}
              className="w-36 h-36 rounded-lg mr-2 cursor-pointer"
              onClick={() => onSelect(url)}
            />
          );
        })}
      </div>
      <div className="w-full h-12 flex items-center mt-2">
        <input
          type="text"
          placeholder="Search GIFs"
          className="w-full h-full px-2 py-1 rounded-lg bg-white dark:bg-neutral-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </div>
  );
}
