import { FIBARankingStatistics } from "../src/team/FIBARankingStatistics";
import { MatchResult } from "../src/match/MatchResult";
import { Round } from "../src/Round";
import { TeamRepository } from "../src/team/TeamRepository";

describe("FIBARankingStatistics", () => {
  let teamRepo: jest.Mocked<TeamRepository>;
  let round: jest.Mocked<Round>;
  let matchResult: jest.Mocked<MatchResult>;

  beforeEach(() => {
    teamRepo = {
      getAverageFIBAPoints: jest.fn().mockReturnValue(100),
      getTeamFIBAPoints: jest.fn().mockReturnValue(90),
    } as unknown as jest.Mocked<TeamRepository>;

    matchResult = {
      getTeamScore: jest.fn(),
      getOtherTeamName: jest.fn().mockReturnValue("Opponent"),
      winner: null,
      forfeit: false,
    } as unknown as jest.Mocked<MatchResult>;

    round = {
      getMatches: jest.fn().mockReturnValue([
        {
          getTeam: jest.fn().mockReturnValue(true),
          getResult: jest.fn().mockReturnValue(matchResult),
        },
      ]),
      getWeight: jest.fn().mockReturnValue(2),
    } as unknown as jest.Mocked<Round>;
  });

  it("should calculate points correctly for a drawn match", () => {
    const ranking = new FIBARankingStatistics(teamRepo, 200);

    ranking.resolveRound("Team1", round);

    expect(ranking.getFibaPoints()).toBeCloseTo(236.7, 1);
    expect(teamRepo.getAverageFIBAPoints).toHaveBeenCalled();
    expect(teamRepo.getTeamFIBAPoints).toHaveBeenCalledWith("Opponent");
  });

  it("should calculate points correctly for a win", () => {
    matchResult.winner = "Team1";
    matchResult.getTeamScore.mockReturnValueOnce(80).mockReturnValueOnce(60);

    const ranking = new FIBARankingStatistics(teamRepo, 200);

    ranking.resolveRound("Team1", round);

    expect(ranking.getFibaPoints()).toBeCloseTo(260.5, 1); // Example expected value
  });

  it("should calculate points correctly for a loss", () => {
    matchResult.winner = "Opponent";
    matchResult.getTeamScore.mockReturnValueOnce(60).mockReturnValueOnce(80);

    const ranking = new FIBARankingStatistics(teamRepo, 200);

    ranking.resolveRound("Team1", round);

    expect(ranking.getFibaPoints()).toBeCloseTo(212.9, 1); // Example expected value
  });

  it("should handle win by forfeit correctly", () => {
    matchResult.winner = "Team1";
    matchResult.forfeit = true;

    const ranking = new FIBARankingStatistics(teamRepo, 200);

    ranking.resolveRound("Team1", round);

    expect(ranking.getFibaPoints()).toBeCloseTo(265.2, 1); // Example expected value
  });

  it("should handle loss by forfeit correctly", () => {
    matchResult.winner = "Opponent";
    matchResult.forfeit = true;

    const ranking = new FIBARankingStatistics(teamRepo, 200);

    ranking.resolveRound("Team1", round);

    expect(ranking.getFibaPoints()).toBeCloseTo(190.5, 1); // Example expected value
  });

  it("should compare rankings correctly", () => {
    const ranking1 = new FIBARankingStatistics(teamRepo, 250);
    const ranking2 = new FIBARankingStatistics(teamRepo, 200);

    expect(ranking1.compareTo(ranking2)).toBeGreaterThan(0);
    expect(ranking2.compareTo(ranking1)).toBeLessThan(0);
    expect(ranking1.compareTo(ranking1)).toBe(0);
  });
});
