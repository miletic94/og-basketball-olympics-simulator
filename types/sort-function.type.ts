export type SortFunction = (
  teamNames: string[] /*TODO: Make TeamNames*/,
  comparer: IComparer<Team>
) => void;
