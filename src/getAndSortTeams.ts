import * as inputData from '../input.json';

interface Score {
    ft: number[];
}

interface Match {
    date: string;
    team1: string;
    team2: string;
    score: Score;
}

interface Team {
    rank: number;
    name: string;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalsDifference: number;
    points: number;
}

function newTeam(teamName: string): Team {
    let team: Team = {
        rank: 0,
        name: teamName,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalsDifference: 0,
        points: 0
    }
    return team;
}

/*
The first pass reads all wins/losses/draws and goals scored both for and against
for each team in the input JSON file
*/
function matchFirstPass(footballMatches: Object, match: Match) {
    if(footballMatches[match.team1] == undefined) {
        footballMatches[match.team1] = newTeam(match.team1);
    }
    if(footballMatches[match.team2] == undefined) {
        footballMatches[match.team2] = newTeam(match.team2);
    }

    footballMatches[match.team1].goalsFor += match.score.ft[0];
    footballMatches[match.team2].goalsFor += match.score.ft[1];

    footballMatches[match.team1].goalsAgainst += match.score.ft[1];
    footballMatches[match.team2].goalsAgainst += match.score.ft[0];

    //team1 Win
    if(match.score.ft[0] > match.score.ft[1]) {
        footballMatches[match.team1].wins += 1;
        footballMatches[match.team2].losses += 1;
    }
    //Draw
    else if(match.score.ft[0] === match.score.ft[1]) {
        footballMatches[match.team1].draws += 1;
        footballMatches[match.team2].draws += 1;
    }
    //team1 Loss
    else if(match.score.ft[0] < match.score.ft[1]) {
        footballMatches[match.team1].losses += 1;
        footballMatches[match.team2].wins += 1;
    }
}

/*
The second pass calculates the goal difference and points from the
information collected in the first pass
*/
function matchSecondPass(footballMatches: Object): Team[] {
    let teams: Team[] = [];
    for (const [key, value] of Object.entries(footballMatches)) {
        const gf = footballMatches[key].goalsFor;
        const ga = footballMatches[key].goalsAgainst;
        const wins = footballMatches[key].wins;
        const draws = footballMatches[key].draws;
        footballMatches[key].goalsDifference = gf - ga;
        footballMatches[key].points = (wins * 3) + draws;
        teams.push(footballMatches[key]);
    }
    return teams;
}

export function getAndSortTeams(): Team[] {
    let footballMatches = new Object();
    inputData.rounds.forEach(round => {
        round.matches.forEach(match => {
            matchFirstPass(footballMatches, match);
        });
    });
    let teams: Team[] = matchSecondPass(footballMatches);
    teams.sort(
        function(a, b) {
            if(a.points === b.points) {
                //points are equal, sort by goal difference
                if(a.goalsDifference === b.goalsDifference) {
                    //goal difference is equal, sort by goals scored
                    return a.goalsFor > b.goalsFor ? -1 : 1;
                }
                else {
                    return a.goalsDifference > b.goalsDifference ? -1 : 1;
                }
            }
            return a.points > b.points ? -1 : 1;
        }
    );
    for(let i = 0; i < teams.length; i++) {
        teams[i].rank = i + 1;
    }
    return teams;
}

export default getAndSortTeams;