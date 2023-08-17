interface MessageListProps {}

export function MessagesList({}: MessageListProps): JSX.Element {
  return (
    <div className="h-[92%] overflow-y-scroll no-scrollbar p-2">
      <div className="w-full border-b border-b-orange-400 h-20">Likes</div>
      {new Array(10).fill(0).map((_, i) => {
        return (
          <div key={i} className="w-full border-b border-b-orange-400 h-20">
            Conversation {i}
          </div>
        );
      })}
    </div>
  );
}
