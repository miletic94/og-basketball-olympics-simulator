import { randomBetween } from "../../src/utils/randomBetween.util";

describe("It should provide a random number between a and b", () => {
  test("Should return values from 3 to 10", () => {
    const numbers: number[] = [];
    for (let i = 0; i < 50; i++) {
      numbers.push(randomBetween(3, 10));
    }
    expect(Math.min(...numbers)).toBe(3);
    expect(Math.max(...numbers)).toBe(10);
  });

  test("Should return values from -3 to 10", () => {
    const numbers: number[] = [];
    for (let i = 0; i < 50; i++) {
      numbers.push(randomBetween(-3, 10));
    }
    expect(Math.min(...numbers)).toBe(-3);
    expect(Math.max(...numbers)).toBe(10);
  });

  test("Should return 0 in an array", () => {
    const numbers: number[] = [];
    for (let i = 0; i < 50; i++) {
      numbers.push(randomBetween(0, 0));
    }
    expect(Math.min(...numbers)).toBe(0);
    expect(Math.max(...numbers)).toBe(0);
  });
});
