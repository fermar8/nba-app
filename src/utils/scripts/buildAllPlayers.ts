import axios, { Method } from 'axios';
import fs from 'fs';

const run = async () => {

    // node --loader ts-node/esm --experimental-json-modules ./buildPlayers.ts

    try {
        const options = {
            method: 'GET' as Method,
            url: `https://es.global.nba.com/stats2/league/playerlist.json?locale=es`,
        };

        const response = await axios.request(options);
        const allPlayers = response.data.payload.players;
        /* 

        const allActivePlayers = allPlayers.filter(el => el.leagues.standard.active === "1" && el.teamId && el.yearsPro && el.collegeName && el.country && el.playerId && el.dateOfBirth && el.affiliation && el.startNba && el.heightInMeters && el.weightInKilograms);
        */
        const stringify = JSON.stringify(allPlayers, null, 2);
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