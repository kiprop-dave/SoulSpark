interface MatchesListProps {}

export function MatchesList({}: MatchesListProps): JSX.Element {
  return (
    <section className="flex gap-4 p-2 w-full overflow-scroll no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-3 lg:gap-6 md:h-[92%]">
      <div className="ring ring-orange-400 h-32 rounded min-w-[5rem] md:w-auto">Likes</div>
      {new Array(10).fill(0).map((_, i) => {
        return (
          <div key={i} className="rounded h-32 ring ring-orange-400 min-w-[5rem] md:w-auto">
            Match {i}
          </div>
        );
      })}
    </section>
  );
}
