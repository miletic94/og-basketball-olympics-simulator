import { IComparer, ISortStrategy } from "../../types";
import type { Team } from "../Team";
import { TeamRepository } from "../TeamRepository";

export class MergeSortStrategy implements ISortStrategy {
  constructor(private teamRepo: TeamRepository) {}
  sort = (teamNames: string[], comparer: IComparer<Team>) => {
    const merge = (
      teamsNames: string[],
      left: number,
      mid: number,
      right: number
    ) => {
      const leftArrayLength = mid - left + 1;
      const rightArrayLength = right - mid;

      const leftArray: string[] = new Array(leftArrayLength);
      const rightArray: string[] = new Array(rightArrayLength);

      for (let i = 0; i < leftArrayLength; i++) {
        leftArray[i] = teamsNames[left + i];
      }
      for (let j = 0; j < rightArrayLength; j++) {
        rightArray[j] = teamsNames[mid + 1 + j];
      }

      let i = 0,
        j = 0,
        k = left;

      while (i < leftArrayLength && j < rightArrayLength) {
        if (
          comparer.compare(
            this.teamRepo.getTeam(leftArray[i]),
            this.teamRepo.getTeam(rightArray[j])
          ) >= 0
        ) {
          teamsNames[k] = leftArray[i]; // TODO: Typescript bug? If I put array[k] = leftArray[i] here it won't throw an error
          i++;
        } else {
          teamsNames[k] = rightArray[j];
          j++;
        }
        k++;
      }

      while (i < leftArrayLength) {
        teamsNames[k] = leftArray[i];
        i++;
        k++;
      }

      while (j < rightArrayLength) {
        teamsNames[k] = rightArray[j];
        j++;
        k++;
      }
    };

    function mergeSort(teamNames: string[], left: number, right: number): void {
      if (left >= right) return;

      const mid = Math.floor(left + (right - left) / 2);
      mergeSort(teamNames, left, mid);
      mergeSort(teamNames, mid + 1, right);

      merge(teamNames, left, mid, right);
    }
    return mergeSort(teamNames, 0, teamNames.length - 1);
  };
}
