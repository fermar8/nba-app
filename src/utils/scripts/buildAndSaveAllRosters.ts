import axios, { Method } from 'axios';
import NbaTeam from '../../models/nba-data/nbaTeam.js';
import NbaTeamExtended from '../../models/nba-data/nbaTeamExtended.js';
import mongoose from 'mongoose';
import { env } from '../../../config.js';


mongoose.connect(env.MONGODB_URI as string || 'mongodb://localhost:27017/nba-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const buildAndSaveAllRosters = async () => {

    // node --loader ts-node/esm --experimental-json-modules ./buildPlayers.ts
    try {
        await NbaTeamExtended.deleteMany();
        const allTeams = await NbaTeam.find();

        allTeams.forEach(async (team: any) => {
            const options = {
                method: 'GET' as Method,
                url: `https://es.global.nba.com/stats2/team/playerstats.json?locale=es&teamCode=${team.code}`,
            };

            const response = await axios.request(options);
            const singleTeam = response.data.payload.team;
            let newTeam = {
                profile: singleTeam.profile,
                standing: singleTeam.standing,
                players: singleTeam.players
            }
            console.log('newTeam', newTeam)
            await NbaTeamExtended.insertMany(newTeam);
        })

        console.log('Extended teams with roster have been saved to DB');
        await mongoose.connection.close();
    } catch (error) {
        console.log(error)
    }
}

buildAndSaveAllRosters();
