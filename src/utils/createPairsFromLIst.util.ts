import type { Pair } from "../../types/";

export function createPairsFromList<T>(list: T[]) {
  //TODO: Put this check in this function's client
  // if (list.length % 2 !== 1) throw Error(`In list must be odd number of teams`);
  const pairs: Pair<T>[] = [];
  const listLength = list.length;
  for (let i = 0; i < listLength - (listLength % 2); i = i + 2) {
    pairs.push([list[i], list[i + 1]]);
  }

  return pairs;
}
