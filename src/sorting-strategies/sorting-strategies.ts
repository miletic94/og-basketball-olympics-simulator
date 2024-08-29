import { IComparer } from "../comparers/Comparers";
import { Team } from "../Team";

//TODO: Move this?
export interface ITeamRanker {
  rankTeams(sortFunction: SortFunction): void;
}

export type SortFunction = (teams: Team[], comparer: IComparer<Team>) => void;

export const sort: SortFunction = (
  teams: Team[],
  comparer: IComparer<Team>
) => {
  function merge(teams: Team[], left: number, mid: number, right: number) {
    const leftArrayLength = mid - left + 1;
    const rightArrayLength = right - mid;

    const leftArray = new Array(leftArrayLength);
    const rightArray = new Array(rightArrayLength);

    for (let i = 0; i < leftArrayLength; i++) {
      leftArray[i] = teams[left + i];
    }
    for (let j = 0; j < rightArrayLength; j++) {
      rightArray[j] = teams[mid + 1 + j];
    }

    let i = 0,
      j = 0,
      k = left;

    while (i < leftArrayLength && j < rightArrayLength) {
      if (comparer.compare(leftArray[i], rightArray[j]) >= 0) {
        teams[k] = leftArray[i]; // TODO: Typescript bug? If I put array[k] = leftArray[i] here it won't throw an error
        i++;
      } else {
        teams[k] = rightArray[j];
        j++;
      }
      k++;
    }

    while (i < leftArrayLength) {
      teams[k] = leftArray[i];
      i++;
      k++;
    }

    while (j < rightArrayLength) {
      teams[k] = rightArray[j];
      j++;
      k++;
    }
  }

  function mergeSort(teams: Team[], left: number, right: number): void {
    if (left >= right) return;

    const mid = Math.floor(left + (right - left) / 2);
    const L = mergeSort(teams, left, mid);
    const R = mergeSort(teams, mid + 1, right);

    merge(teams, left, mid, right);
  }
  return mergeSort(teams, 0, teams.length - 1);
};
