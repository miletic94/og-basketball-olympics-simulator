import { createPairsFromList } from "../../src/utils/createPairsFromLIst.util";

describe("It should create an array of pairs from the given array by grouping every two consecutive elements into a tuple.", () => {
  test("Should return [[1, 2], [3, 4]] from [1, 2, 3, 4]", () => {
    const result = createPairsFromList([1, 2, 3, 4]);
    expect(result).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  test("Should return [[1, 2], [3, 4]] from [1, 2, 3, 4, 5]", () => {
    const result = createPairsFromList([1, 2, 3, 4, 5]);
    expect(result).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  [
    [1, 2],
    [3, 4],
    [5, 6],
    [7, 8],
  ];
  test("Should return [[ [1, 2], [3, 4] ], [ [5, 6], [7, 8]] ] from   [[1, 2], [3, 4], [5, 6], [7, 8]]", () => {
    const result = createPairsFromList([
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
    ]);
    expect(result).toEqual([
      [
        [1, 2],
        [3, 4],
      ],
      [
        [5, 6],
        [7, 8],
      ],
    ]);
  });

  test("Should return   [['a', 'b'], ['c', 'd']] from   ['a', 'b', 'c', 'd']", () => {
    const result = createPairsFromList(["a", "b", "c", "d"]);
    expect(result).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });
});
