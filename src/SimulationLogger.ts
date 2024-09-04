import { Pair } from "../types";
import { Group } from "./Group";
import { Match } from "./match/Match";
import { Round } from "./Round";
import { TeamRepository } from "./team/TeamRepository";
import {
  RoundName,
  RoundNameIndex,
} from "./tournament/stages/elimination.stage";

export class SimulationLogger {
  logGroupStageRound(round: Round, teamRepo: TeamRepository) {
    console.log(`${round.name}`);
    let groupName = "";
    round.getMatches().forEach((match) => {
      const teamNames = match.getTeams();
      const teams = teamRepo.getTeamsByNames(teamNames);
      const group = teams[0].group;
      if (group !== groupName) {
        console.log(`\tGroup ${group}`);
        groupName = group;
      }
      const score = match.getResult().getScore();

      const string = `\t${[...score.keys()].join(" - ")}  (${[
        ...score.values(),
      ].join(":")})`;

      console.log(string);
    });
  }

  logFinalGroupRankings(groups: Map<string, Group>, teamRepo: TeamRepository) {
    console.log(`\nFinal group rankings:`);
    groups.forEach((group) => {
      const teamNames = group.getTeams();
      const teams = teamRepo.getTeamsByNames(teamNames);

      console.log(`\nGroup ${group.name}:`);
      console.log(`rank name\twins\tlosses\tpoints\tPF\tPA\tPD`);
      teams.forEach((team, index) => {
        let teamName;
        team.name === "USA"
          ? (teamName = `${team.name}\t`)
          : (teamName = team.name);
        console.log(
          `${index + 1}. ${teamName}\t${team.groupStatistics.wins}\t${
            team.groupStatistics.losses
          }\t${team.groupStatistics.points}\t${
            team.groupStatistics.pointsForwarded
          }\t${
            team.groupStatistics.pointsAccepted
          }\t${team.groupStatistics.getPointDifference()}`
        );
      });
    });
  }

  logDrawingHats(drawingHats: Pair<string>[]) {
    console.log("Hats:");
    const hatNames = ["D", "E", "F", "G"];
    drawingHats.forEach((hat, index) => {
      console.log(`Hat: ${hatNames[index]}`);
      hat.forEach((teamName) => {
        console.log(`\t${teamName}`);
      });
    });
  }

  logEliminationStagePairs(matches: Match[]) {
    console.log("\nElimination stage:");

    matches.forEach((match, index) => {
      const teams = match.getTeams();
      let string = `\t${teams[0]} - ${teams[1]}`;
      string = index % 2 == 1 ? string + `\n` : string;
      console.log(string);
    });
  }

  loadEliminationStageRound(matches: Match[], roundName: string) {
    console.log(`${roundName}`);

    matches.forEach((match, index) => {
      const score = match.getResult().getScore();

      let string = `\t${[...score.keys()].join(" - ")}  (${[
        ...score.values(),
      ].join(":")})`;

      string = index % 2 === 1 ? string + `\n` : string;

      string =
        roundName === RoundName[RoundNameIndex.FINALS]
          ? index == 0
            ? "Gold medal match:" + string
            : "Bronze medal match:" + string
          : string;

      console.log(string);
    });
  }

  logMedals(groups: Map<string, Group>) {
    console.log("Medals:");
    groups.forEach((group) => {
      const teams = group.getTeams();
      for (let i = 0; i < teams.length - 1; i++) {
        console.log(`\t${i + 1}. ${teams[i]}`);
      }
    });
  }
}
