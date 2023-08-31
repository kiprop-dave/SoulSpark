import { useMemo } from 'react';
import { Navigate, Link } from '@tanstack/router';
import { format } from 'date-fns';
import { ImCross } from 'react-icons/im';
import { IoChevronBack } from 'react-icons/io5';
import { useAuth } from '@/context/AuthContext';
import { useConversations } from '@/context/ConversationsContext';
import { useAppRoutes } from '@/hooks/useAppRoutes';
import UserAvatar from '@/pages/App/components/UserAvatar';
import NoMessages from './components/NoMessages';

export default function ConversationPage(): JSX.Element {
  const { user } = useAuth();
  const { location } = useAppRoutes();
  const { conversations } = useConversations();
  const conversationId = useMemo(() => location.split('/')[2], [location, conversations]);

  const conversation = conversations.find((c) => c.id === conversationId);
  if (!conversation) {
    return <Navigate to="/app/messages" replace />;
  }

  const otherUser = conversation.participants.find((p) => p.id !== user!.id)!; // User will always be defined here

  return (
    <div className="w-full h-full flex bg-white dark:bg-neutral-800">
      <div className="w-full h-full sm:w-[60%] lg:w-2/3 sm:border-r border-slate-300 dark:border-gray-700 text-white">
        <div className="hidden md:block w-full h-[14%] border-b border-slate-300 dark:border-gray-700 p-4">
          <div className="flex items-center w-full h-full">
            <div className="w-12 h-12 rounded-full border-[3px] border-black dark:border-white">
              <UserAvatar imageSrc={otherUser.images[0].secure_url} isBlurred={false} />
            </div>
            <p className="ml-4 font-semibold text-slate-700 dark:text-slate-300 tracking-wider cursor-default">
              {`You matched with ${otherUser.first_name} on ${format(
                conversation.createdAt,
                'dd/MM/yyyy'
              )}`}
            </p>
            <div className="ml-auto w-8 h-8 rounded-full p-1 border-2 border-slate-700 dark:border-slate-300 cursor-pointer">
              <Link to="/app/messages" from="/app/messages/$conversationId">
                <ImCross className="w-full h-full text-slate-700 dark:text-slate-300 transform transition-transform duration-200 hover:rotate-90" />
              </Link>
            </div>
          </div>
        </div>
        <nav className="flex items-center w-full h-12 px-2 border-b border-slate-300 dark:border-gray-700 md:hidden">
          <Link to="/app/messages" from="/app/messages/$conversationId">
            <IoChevronBack className="w-8 h-8 text-slate-700 dark:text-slate-300" />
          </Link>
          <div className="w-full h-full ml-4 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-black dark:border-white">
              <UserAvatar imageSrc={otherUser.images[0].secure_url} isBlurred={false} />
            </div>
            <p className="ml-2 font-semibold text-slate-700 dark:text-slate-300 tracking-wider cursor-default">
              {otherUser.first_name}
            </p>
          </div>
        </nav>
        <div className="h-[74%]">
          {conversation.messages.length > 0 ? (
            <div>Messages Box</div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <NoMessages
                matchDate={conversation.createdAt}
                name={otherUser.first_name}
                profilePic={otherUser.images[0].secure_url}
              />
            </div>
          )}
        </div>
        <div className="h-[12%] border-t border-slate-300 dark:border-gray-700">Message Box</div>
      </div>
      <div className="hidden sm:flex flex-col items-center justify-center w-full h-full sm:w-[40%] lg:w-1/3 text-white">
        Profile Box
      </div>
    </div>
  );
}
