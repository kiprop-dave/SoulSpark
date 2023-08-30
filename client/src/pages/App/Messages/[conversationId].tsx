export function ConversationPage(): JSX.Element {
  return (
    <div className="w-full h-full flex">
      <div className="w-full h-full sm:w-[60%] lg:w-2/3 sm:border-r border-slate-300 dark:border-gray-700 text-white">
        <div className="w-full h-[14%] border-b border-slate-300 dark:border-gray-700">
          Header Box
        </div>
        <div className="h-[72%]">Conversation Box</div>
        <div className="h-[14%] border-t border-slate-300 dark:border-gray-700">
          Message input Box
        </div>
      </div>
      <div className="hidden sm:flex flex-col items-center justify-center w-full h-full sm:w-[40%] lg:w-1/3 text-white">
        Profile Box
      </div>
    </div>
  );
}
