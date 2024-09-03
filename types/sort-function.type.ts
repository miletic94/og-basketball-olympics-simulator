import type { Team } from "../src/team/Team";
import { IComparer } from "./comparer.interface";

export type SortFunction = (
  teamNames: string[] /*TODO: Make TeamNames*/,
  comparer: IComparer<Team>
) => void;
