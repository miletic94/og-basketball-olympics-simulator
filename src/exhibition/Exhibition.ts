import { EXHIBITION_PATH } from "../constants/exhibitionsPath.const";
import {
  ExhibitionLoader,
  ExhibitionMatchesDataType,
} from "./ExhibitionDataLoader";
import { Match } from "../match/Match";
import { Round } from "../Round";
import { ISOtoNameMap, TeamRepository } from "../team/TeamRepository";
import { RoundWeight } from "../tournament/stages/elimination.stage";

export class Exhibition {
  private exhibitionMatchesData: ExhibitionMatchesDataType;
  private round: Round;
  constructor(
    loader: typeof ExhibitionLoader,
    private teamRepo: TeamRepository
  ) {
    this.round = new Round(
      "initial round",
      RoundWeight.GROUP,
      [],
      this.teamRepo
    );
    this.exhibitionMatchesData = loader.loadExhibitions(EXHIBITION_PATH);
  }

  // TODO: Terrible!
  setRound() {
    const round = new Round(
      "exhibition round",
      RoundWeight.GROUP,
      [],
      this.teamRepo
    );
    for (let match of this.exhibitionMatchesData) {
      const result: { [x: string]: number } = {};
      const teamNames = [];
      for (let team of Object.keys(match)) {
        const teamISO = team as keyof typeof ISOtoNameMap;
        const teamName = this.teamRepo.getTeamNameByISO(teamISO);
        result[teamName] = match[teamISO];
        teamNames.push(teamName);
      }
      const m = new Match([teamNames[0], teamNames[1]], this.teamRepo);
      m.setResult(result[teamNames[0]], result[teamNames[1]]);

      round.addMatch(m);
    }

    this.round = round;
  }

  playRound() {
    this.round.finishRound();
  }
}
