import { useEffect, useMemo, useState } from 'react';
import { useGif } from '@/context/GifContext';
import useDebounce from '@/hooks/useDebounce';

export default function GifPicker(): JSX.Element {
  const { gifs, loadingGifs, setQueryGifs } = useGif();
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

  if (loadingGifs) {
    return <p>Loading...</p>;
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
          disabled={loadingGifs}
        />
      </div>
    </div>
  );
}
