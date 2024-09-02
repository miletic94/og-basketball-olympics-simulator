export class MatchResult {
  constructor(
    private scores: Map<string, number> & { size: 2 }, // To guarantee that developer never assigns a scores  with more than two teams
    public forfeit: boolean,
    public winner: string | null
  ) {}

  getTeamScore(teamName: string) {
    const teamScore = this.scores.get(teamName);
    if (teamScore === undefined) {
      throw new Error(`No team by name ${teamName}`);
    }
    return teamScore;
  }

  setTeamScore(teamName: string, score: number) {
    const teamScore = this.scores.get(teamName);
    if (teamScore === undefined) {
      throw new Error(`No team by name ${teamName}`);
    }
    this.scores.set(teamName, score);
  }

  getOtherTeamScore(teamName: string) {
    return this.scores.get(this.getOtherTeamName(teamName))!;
  }

  getOtherTeamName(teamName: string) {
    const scores = this.scores;
    if (scores.size !== 2 && scores.get(teamName))
      throw new Error(
        `Result scores should have two team scores. It has ${scores.size}`
      );

    return Array.from(scores.keys()).find((key) => key !== teamName)!; // This will work because we have two team scores and one is from ${teamName}
  }
}
