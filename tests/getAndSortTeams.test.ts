import getAndSortTeams from "../src/getAndSortTeams";
import axios, {AxiosResponse} from "axios";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

describe("getAndSortTeams", function() {
    it("Gets and sorts teams for 2016/17 season", async () => {
        let sortedTeams = getAndSortTeams();
        let response: AxiosResponse = await axios.get("https://en.wikipedia.org/wiki/2016%E2%80%9317_Premier_League");
        const html = response.data;
        const dom = new JSDOM(html);
        const leagueTable = dom.window.document.querySelector("#League_table").parentElement.nextElementSibling;
        const teams = leagueTable.querySelectorAll("tr");
        for(let i = 1; i < teams.length; i ++) {
            const rowData = teams[i].children;
            let currentTeam = sortedTeams[i - 1];
            expect(currentTeam.rank).toBe(Number(rowData[0].textContent.trim())); //Rank
            expect(currentTeam.wins).toBe(Number(rowData[3].textContent.trim())); //Wins
            expect(currentTeam.draws).toBe(Number(rowData[4].textContent.trim())); //Draws
            expect(currentTeam.losses).toBe(Number(rowData[5].textContent.trim())); //Losses
            expect(currentTeam.goalsFor).toBe(Number(rowData[6].textContent.trim())); //GoalsFor
            expect(currentTeam.goalsAgainst).toBe(Number(rowData[7].textContent.trim())); //GoalsAgainst
            expect(currentTeam.goalsDifference).toBe(parseInt(rowData[8].textContent.trim().replace("−", "-"), 10)); //GoalDifference
            expect(currentTeam.points).toBe(Number(rowData[9].textContent.trim())); //Points
        }
    })
});