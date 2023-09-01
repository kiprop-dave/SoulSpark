import { useState } from 'react';
import clsx from 'clsx';
import { TfiGallery } from 'react-icons/tfi';
import { AiOutlineGif } from 'react-icons/ai';
import { MdOutlineEmojiEmotions } from 'react-icons/md';

type MessageInputProps = {};

export default function MessageInput({}: MessageInputProps): JSX.Element {
  const [messageInput, setMessageInput] = useState('');
  const [buttonActive, setButtonActive] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    setButtonActive(e.target.value.length > 0);
  };

  return (
    <div className="w-full h-full flex flex-row items-center px-2 lg:px-4">
      <div className="h-1/2 flex items-center gap-2">
        <button
          type="button"
          aria-label="Attach a photo"
          className="p-1 flex items-center justify-center bg-gray-700 dark:bg-gray-400 rounded"
        >
          <TfiGallery className=" h-6 w-6 text-white text-xl dark:text-black" />
        </button>
        <button
          type="button"
          aria-label="Attach a gif"
          className="p-1 flex items-center justify-center bg-gray-700 dark:bg-gray-400 rounded"
        >
          <AiOutlineGif className=" h-6 w-6 text-white text-xl dark:text-black" />
        </button>
      </div>
      <div className="h-1/2 flex items-center flex-1 ml-2 lg:ml-5">
        <form className="w-full h-full flex items-center">
          <input
            type="text"
            value={messageInput}
            onChange={handleInputChange}
            name="message"
            id="message"
            autoComplete="off"
            placeholder="Type a message"
            className="w-full h-full bg-transparent outline-none px-2 text-black dark:text-white"
          />
          <button
            type="button"
            aria-label="Pick an emoji"
            className="p-1 flex items-center justify-center"
          >
            <MdOutlineEmojiEmotions className=" h-8 w-8 text-slate-700 text-2xl dark:text-slate-300" />
          </button>
          <button
            type="submit"
            aria-label="Send message"
            className={clsx(
              'ml-2 px-4 lg:px-6 py-2 bg-slate-300 dark:bg-neutral-700 rounded-3xl text-slate-600 dark:text-slate-300 font-semibold',
              {
                'bg-red-500 dark:bg-red-400 text-white': buttonActive,
              }
            )}
          >
            SEND
          </button>
        </form>
      </div>
    </div>
  );
}
