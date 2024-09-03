import { randomBetween } from "../../src/utils/randomBetween.util";
import { randomizePairs } from "../../src/utils/randomizePairs.util";
import { Pair } from "../../types";

describe("Creates new tuples by combining elements of the first and last pair, second and second to last, and so on, randomly pairing elements from the corresponding tuples", () => {
  test("should throw an error when there is an odd number of tuples in an array", () => {
    const pairs: Pair<number>[] = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    expect(() => randomizePairs(pairs, randomBetween)).toThrow();
  });

  test(`
    With argument of: [[1, 2], [3, 4], [5, 6], [7, 8]] it should return some of these results:
    a) [[1, 7], [2, 8], [3, 5], [4, 6]]
    b) [[1, 7], [2, 8], [3, 6], [4, 5]]
    c) [[1, 8], [2, 7], [3, 5], [4, 6]]
    d) [[1, 8], [2, 7], [3, 6], [4, 5]]
    `, () => {
    const pairs: Pair<number>[] = [
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
    ];
    const randomizedPairsMap = new Map([
      [
        JSON.stringify([
          [1, 7],
          [2, 8],
          [3, 5],
          [4, 6],
        ]),
        0,
      ],
      [
        JSON.stringify([
          [1, 7],
          [2, 8],
          [3, 6],
          [4, 5],
        ]),
        0,
      ],
      [
        JSON.stringify([
          [1, 8],
          [2, 7],
          [3, 5],
          [4, 6],
        ]),
        0,
      ],
      [
        JSON.stringify([
          [1, 8],
          [2, 7],
          [3, 6],
          [4, 5],
        ]),
        0,
      ],
    ]);

    const numberOfIterations = 100;

    for (let i = 0; i < numberOfIterations; i++) {
      const result = JSON.stringify(randomizePairs(pairs, randomBetween));
      expect(randomizedPairsMap.has(result)).toBe(true);
      randomizedPairsMap.set(result, randomizedPairsMap.get(result)! + 1);
    }

    const sum = Array.from(randomizedPairsMap.values()).reduce(
      (acc, current) => {
        return (acc += current);
      },
      0
    );
    expect(sum).toBe(numberOfIterations);
  });

  test(`
    With argument of: [[[1, 2], [3, 4]], [[5, 6], [7, 8]]] it should return some of these results:
    a) [ [[1, 2], [5, 6]], [[3, 4], [7, 8]] ]
    a) [ [[1, 2], [7, 8]], [[3, 4], [5, 6]] ]
    `, () => {
    // TODO: Implement
    // Test implementation here
  });
});
