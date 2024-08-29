function roundRobinTournament(teams: any[]) {
  if (teams.length % 2 !== 0) teams.push("dummy");

  const length = teams.length;
  const n = length - 1; // number of rounds
  const rounds = [];

  let first, last; // pointers

  for (let i = 0; i < n; i++) {
    first = 0;
    last = length - 1;
    const subRound = [];

    while (first < last) {
      subRound.push([teams[first], teams[last]]);
      first++;
      last--;
    }

    rounds.push(subRound);

    teams = rotate(teams);
  }

  return rounds;
}

function rotate(array: any[]) {
  if (array.length == 0) return array;
  return [array[0], array[array.length - 1], ...array.slice(1, -1)];
}
