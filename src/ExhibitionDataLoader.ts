import { readFileSync } from "fs";

type ExhibitionsData = {
  [K in string]: Array<{
    Date: string;
    Opponent: string;
    Result: `${string}-${string}`;
  }>;
};

// TODO: Better type safety
export type MatchKeyType = `${`${string}-${string}`}|${`${string}-${string}`}`;
export type ExhibitionMatchesDataType = {
  [x: string]: number;
}[];

export class ExhibitionLoader {
  static loadExhibitions = (pathToFile: string) => {
    let data: ExhibitionsData;

    try {
      data = JSON.parse(readFileSync(pathToFile, "utf8"));
      return this.normalizeMatches(data);
    } catch (err) {
      console.error("Error reading the file:", err);
      return {} as ExhibitionMatchesDataType;
    }
  };

  private static normalizeMatches(data: ExhibitionsData) {
    const matchSet: Set<MatchKeyType> = new Set();

    for (const [team, matches] of Object.entries(data)) {
      for (const match of matches) {
        const opponent = match.Opponent;
        const date = match.Date;
        const result = match.Result;

        // Create a unique key for each match, ensuring the team names are sorted
        const matchKey: MatchKeyType = `${team}-${opponent}|${result}`;

        const reverseKey: MatchKeyType = `${opponent}-${team}|${result
          .split("-")
          .reverse()
          .join("-")}` as MatchKeyType;

        // Check if the match is already recorded
        if (!matchSet.has(matchKey) && !matchSet.has(reverseKey)) {
          matchSet.add(matchKey);
        }
      }
    }

    // Convert the set back to a list of matches
    const normalizedMatches: ExhibitionMatchesDataType = [];
    for (const matchKey of matchSet) {
      let [teams, result] = matchKey.split("|");
      const [teamA, teamB] = teams.split("-");
      const intResult = result.split("-").map((res) => parseInt(res));
      normalizedMatches.push({
        [teamA]: intResult[0],
        [teamB]: intResult[1],
      });
    }

    return normalizedMatches;
  }
}
