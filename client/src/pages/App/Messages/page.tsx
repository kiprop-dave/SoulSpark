import { MatchesList } from '../components/MatchesList';
import { MessagesList } from '../components/MessagesList';
import { Swipe } from '../components/Swipe';

export function MessagesPage(): JSX.Element {
  return (
    <>
      <div className="md:hidden w-full h-full overflow-scroll no-scrollbar">
        <div className="mt-4 w-full overflow-scroll no-scrollbar">
          <h2 className="px-2 font-bold dark:text-slate-200">New Matches</h2>
          <div className="w-full overflow-scroll no-scrollbar">
            <MatchesList />
          </div>
        </div>
        <div className="my-4">
          <h2 className="px-2 font-bold dark:text-slate-200">New Matches</h2>
          <MessagesList />
        </div>
      </div>
      <div className="hidden w-full h-full md:flex md:items-center md:justify-center border-2 border-black">
        <Swipe />
      </div>
    </>
  );
}
