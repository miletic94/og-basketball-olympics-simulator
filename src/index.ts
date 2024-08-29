import { Group } from "./Group";
import { Team } from "./Team";

const Serbia = new Team("Serbia", "SRB");
const USA = new Team("USA", "USA");
const SouthSudan = new Team("South Sudan", "SSD");
const PuertoRico = new Team("Puerto Rico", "PUE");

Serbia.groupStatistics.winGame(100, 90);
SouthSudan.groupStatistics.loseGame(90, 100);
USA.groupStatistics.loseGame(80, 100);
PuertoRico.groupStatistics.winGame(100, 80);

const group = new Group("C", [Serbia, USA, SouthSudan, PuertoRico]);

group.rankTeams();
