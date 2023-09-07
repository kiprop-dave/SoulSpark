import { useCallback, useState } from 'react';
import clsx from 'clsx';
import { TfiGallery } from 'react-icons/tfi';
import { AiOutlineGif } from 'react-icons/ai';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import { useConversations } from '@/context/ConversationsContext';
import { GifProvider } from '@/context/GifContext';
import GifPicker from './GifPicker';

type MessageInputProps = {
  conversationId: string;
};

type OpenAttachment = 'none' | 'gallery' | 'gif' | 'emoji';

export default function MessageInput({ conversationId }: MessageInputProps): JSX.Element {
  const { sendMessage } = useConversations();
  const [messageInput, setMessageInput] = useState('');
  const [buttonActive, setButtonActive] = useState(false);
  const [openAttachment, setOpenAttachment] = useState<OpenAttachment>('none');

  const toggleOpenAttachment = useCallback(
    (attachment: OpenAttachment) => {
      if (openAttachment === attachment) {
        setOpenAttachment('none');
      } else {
        setOpenAttachment(attachment);
      }
    },
    [openAttachment]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    setButtonActive(e.target.value.length > 0);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (messageInput.length > 0) {
      sendMessage(conversationId, { format: 'text', body: messageInput });
      setMessageInput('');
      setButtonActive(false);
    }
  };

  return (
    <GifProvider>
      <div className="w-full h-full flex flex-row items-center px-2 lg:px-4">
        {openAttachment === 'none' ? null : (
          <div
            className={clsx('absolute left-0 w-full', {
              'top-[] h-[]': openAttachment === 'gallery',
              'top-[-12rem] h-[12rem]': openAttachment === 'gif',
              'top-[-16px] h-[12px]': openAttachment === 'emoji',
            })}
          >
            {openAttachment === 'gallery' ? (
              <div>Gallery</div>
            ) : openAttachment === 'gif' ? (
              <GifPicker />
            ) : openAttachment === 'emoji' ? (
              <div>Emoji</div>
            ) : null}
          </div>
        )}
        <div className="h-1/2 flex items-center gap-2">
          <button
            type="button"
            aria-label="Attach a photo"
            onClick={() => toggleOpenAttachment('gallery')}
            className="p-1 flex items-center justify-center bg-gray-700 dark:bg-gray-400 rounded"
          >
            <TfiGallery className=" h-6 w-6 text-white text-xl dark:text-black" />
          </button>
          <button
            type="button"
            aria-label="Attach a gif"
            onClick={() => toggleOpenAttachment('gif')}
            className="p-1 flex items-center justify-center bg-gray-700 dark:bg-gray-400 rounded"
          >
            <AiOutlineGif className=" h-6 w-6 text-white text-xl dark:text-black" />
          </button>
        </div>
        <div className="h-1/2 flex items-center flex-1 ml-2 lg:ml-5">
          <form className="w-full h-full flex items-center" onSubmit={handleSubmit}>
            <input
              type="text"
              value={messageInput}
              onChange={handleInputChange}
              name="message"
              id="message"
              autoComplete="off"
              placeholder="Type a message"
              className="w-full h-full bg-transparent outline-none px-2 text-black dark:text-white disabled:cursor-not-allowed"
              disabled={openAttachment !== 'none'}
            />
            <button
              type="button"
              aria-label="Pick an emoji"
              onClick={() => toggleOpenAttachment('emoji')}
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
    </GifProvider>
  );
}
