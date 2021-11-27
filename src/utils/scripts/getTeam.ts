import axios, { Method } from 'axios';

const run = async () => {

    // node --loader ts-node/esm --experimental-json-modules ./buildPlayers.ts

    try {
        const options = {
            method: 'GET' as Method,
            url: 'https://api-nba-v1.p.rapidapi.com/teams/teamId/2',
            headers: {
                'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
                'x-rapidapi-key': '00d5d18222msh3995671da32df35p1a9c04jsn4801a4d80b73'
            }
        };

        const response = await axios.request(options);
        console.log('response', response.data.api.teams[0])
    } catch (err) {
        console.log(err)
    }

}

run();