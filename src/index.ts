import { FibaRankingTable } from "./FIBARankingTable";
import { Group } from "./Group";
import { GroupRankingTable } from "./GroupRankingTable";
import { Team } from "./Team";
import { TeamRepository } from "./TeamRepository";

const teamRepo = new TeamRepository(
  new Map([
    ["Serbia", new Team("Serbia", "SRB", 300)],
    ["USA", new Team("USA", "USA", 300)],
    ["South Sudan", new Team("South Sudan", "SSD", 100)],
    ["Puerto Rico", new Team("Puerto Rico", "PUE", 200)],
  ])
);

const group = new Group(
  "C",
  ["Serbia", "USA", "South Sudan", "Puerto Rico"],
  teamRepo
);

const groupRankingTable = new GroupRankingTable([group]);

teamRepo.getTeam("Serbia").groupStatistics.winGame(100, 90);
teamRepo.getTeam("South Sudan").groupStatistics.loseGame(90, 100);
teamRepo.getTeam("USA").groupStatistics.loseGame(80, 100);
teamRepo.getTeam("Puerto Rico").groupStatistics.winGame(100, 80);

const fibaRankingTable = new FibaRankingTable(
  ["Serbia", "South Sudan", "USA", "Puerto Rico"],
  teamRepo
);

group.rankTeams();
groupRankingTable.displayTable();

// fibaRankingTable.rankTeams();
// fibaRankingTable.displayTable();
