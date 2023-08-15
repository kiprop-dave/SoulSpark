import { MatchesList } from "../components/MatchesList"
import { MessagesList } from "../components/MessagesList"

export function MessagesPage(): JSX.Element {

  return (
    <>
      <div className="md:hidden w-full overflow-scroll no-scrollbar">
        <div className="mt-4 w-full overflow-scroll no-scrollbar">
          <h2 className="font-bold">New Matches</h2>
          <div className="w-full overflow-scroll no-scrollbar">
            <MatchesList />
          </div>
        </div>
        <div className="my-4">
          <h2 className="font-bold">New Matches</h2>
          <MessagesList />
        </div>
      </div>
      <div className="hidden md:block">Swipe component goes here</div>
    </>
  )
}
