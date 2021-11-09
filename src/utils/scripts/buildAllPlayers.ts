import axios, { Method } from 'axios';
import fs from 'fs';

const run = async () => {

    // node --loader ts-node/esm --experimental-json-modules ./buildPlayers.ts

    try {
        const options = {
            method: 'GET' as Method,
            url: `https://api-nba-v1.p.rapidapi.com/players/league/standard`,
            headers: {
                'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
                'x-rapidapi-key': '00d5d18222msh3995671da32df35p1a9c04jsn4801a4d80b73'
            }
        };

        const response = await axios.request(options);
        const allPlayers: Array<any> = response.data.api.players;

        const allActivePlayers = allPlayers.filter(el => el.leagues.standard.active === "1" && el.teamId && el.yearsPro && el.collegeName && el.country && el.playerId && el.dateOfBirth && el.affiliation && el.startNba && el.heightInMeters && el.weightInKilograms);

        const stringify = JSON.stringify(allActivePlayers, null, 2);
        fs.writeFile('./../rosters/AllPlayers.json', stringify, function (err) {
            if (err) {
                return console.error(err);
            }
            console.log("File created!");
        });

    } catch (error) {
        console.log(error)
    }

}

run();