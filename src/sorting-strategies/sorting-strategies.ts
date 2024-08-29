import { IComparable, IComparer } from "../comparers/Comparers";
import { Team } from "../Team";

//TODO: Move this? Rename?
export interface RankingTable {
  rankTeams: SortFunction;
}

export type SortFunction = (
  teams: Team[],
  comparer: IComparer<IComparable<any>>
) => Team[];

export const sort: SortFunction = (
  teams: Team[],
  comparer: IComparer<IComparable<any>>
) => {
  function merge(leftArr: Team[], rightArr: Team[]) {
    const resArr = [];
    let i = 0;
    let j = 0;
    while (i < leftArr.length && j < rightArr.length) {
      if (
        comparer.compare(
          leftArr[i].groupStatistics,
          rightArr[j].groupStatistics
        ) > 0
      ) {
        resArr.push(leftArr[i]);
        i++;
      } else {
        resArr.push(rightArr[j]);
        j++;
      }
    }

    while (i < leftArr.length) {
      resArr.push(leftArr[i]);
      i++;
    }

    while (j < rightArr.length) {
      resArr.push(rightArr[j]);
      j++;
    }
    return resArr;
  }

  function mergeSort(teams: Team[]): Team[] {
    const first = 0;
    const last = teams.length - 1;

    if (first == last) return teams;

    const mid = Math.ceil(first + (last - first) / 2);
    const L = mergeSort(teams.slice(first, mid));
    const R = mergeSort(teams.slice(mid));

    const res = merge(L, R);
    return res;
  }
  return mergeSort(teams);
};
