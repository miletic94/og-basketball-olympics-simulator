import type { Pair } from "../../types";

export function randomizePairs<T>(
  pairList: Pair<T>[],
  randomBetween: (a: number, b: number) => number
): Pair<T>[] {
  const randomizedPairs: Pair<T>[] = [];
  const pairLength = pairList[0].length; // length of pair is always two since Pair<T> is a type of tuple of two elements of type T
  const pairListLength = pairList.length;
  if (pairListLength % 2 !== 0)
    throw new Error(
      `Number of pairs in a pair list must be an even number. Length is ${pairListLength}`
    );

  let first, last: number;
  first = 0;
  last = pairListLength - 1;
  while (first < last) {
    let secondPairIndex = randomBetween(0, 1); // between first and last of the tuple;
    for (let j = 0; j < pairLength; j++) {
      randomizedPairs.push([
        pairList[first][j],
        pairList[last][secondPairIndex],
      ]);
      secondPairIndex = (secondPairIndex + 1) % 2;
    }
    first++;
    last--;
  }

  return randomizedPairs;
}
