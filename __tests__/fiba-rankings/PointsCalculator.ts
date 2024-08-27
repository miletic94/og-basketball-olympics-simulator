import {
  PointsCalculator,
  VictoryMargin,
} from "../../src/fiba-ranking/PointsCalculator";
import type { TeamScore } from "../../src/fiba-ranking/PointsCalculator";
describe("PointsCalculator", () => {
  let winningTeamScore: TeamScore;
  let losingTeamScore: TeamScore;
  let pointsCalculator: PointsCalculator;

  beforeEach(() => {
    // Reset variables before each test
    winningTeamScore = { name: "Team A", score: 0 };
    losingTeamScore = { name: "Team B", score: 0 };
  });

  test("should return VictoryMargin.ZERO when scores are equal", () => {
    winningTeamScore.score = 100;
    losingTeamScore.score = 100;

    pointsCalculator = new PointsCalculator(winningTeamScore, losingTeamScore);
    expect(pointsCalculator.getVictoryMargin()).toBe(VictoryMargin.ZERO);
    expect(pointsCalculator.getWTBasisPoints()).toBe(500);
    expect(pointsCalculator.getLTBasisPoints()).toBe(500);
  });

  test("should return VictoryMargin.LESS_THAN_TEN when margin is less than 10", () => {
    winningTeamScore.score = 105;
    losingTeamScore.score = 100;

    pointsCalculator = new PointsCalculator(winningTeamScore, losingTeamScore);
    expect(pointsCalculator.getVictoryMargin()).toBe(
      VictoryMargin.LESS_THAN_TEN
    );
    expect(pointsCalculator.getWTBasisPoints()).toBe(700);
    expect(pointsCalculator.getLTBasisPoints()).toBe(300);
  });

  test("should return VictoryMargin.TEN_TO_TWENTY when margin is between 10 and 20", () => {
    winningTeamScore.score = 115;
    losingTeamScore.score = 100;

    pointsCalculator = new PointsCalculator(winningTeamScore, losingTeamScore);
    expect(pointsCalculator.getVictoryMargin()).toBe(
      VictoryMargin.TEN_TO_TWENTY
    );
    expect(pointsCalculator.getWTBasisPoints()).toBe(750);
    expect(pointsCalculator.getLTBasisPoints()).toBe(250);
  });

  test("should return VictoryMargin.MORE_THAN_TWENTY when margin is more than 20", () => {
    winningTeamScore.score = 125;
    losingTeamScore.score = 100;

    pointsCalculator = new PointsCalculator(winningTeamScore, losingTeamScore);
    expect(pointsCalculator.getVictoryMargin()).toBe(
      VictoryMargin.MORE_THAN_TWENTY
    );
    expect(pointsCalculator.getWTBasisPoints()).toBe(800);
    expect(pointsCalculator.getLTBasisPoints()).toBe(200);
  });

  test("should throw an error when winning team has fewer points than losing team", () => {
    winningTeamScore.score = 90;
    losingTeamScore.score = 100;

    expect(
      () => new PointsCalculator(winningTeamScore, losingTeamScore)
    ).toThrow("Winning team has fewer points than losing team");
  });
});
