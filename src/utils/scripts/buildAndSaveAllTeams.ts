import mongoose from 'mongoose';
import axios, { Method } from 'axios';
import NbaTeam from '../../models/nba-data/nbaTeam.js';
import { env } from '../../../config.js';
import { NbaTeamType } from '../types/NbaTeam.js';



mongoose.connect(env.MONGODB_URI as string || 'mongodb://localhost:27017/nba-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const buildAndSaveAllTeams = async () => {
    try {

        const options = {
            method: 'GET' as Method,
            url: 'https://es.global.nba.com/stats2/league/conferenceteamlist.json?locale=es',
        };

        const response = await axios.request(options);
        const eastConferenceTeams = response.data.payload.listGroups[0].teams;
        const westConferenceTeams = response.data.payload.listGroups[1].teams;
        const allTeams = [...eastConferenceTeams, ...westConferenceTeams];

        let teams: any = [];
        allTeams.forEach((team) => {
            let newObject: NbaTeamType = {
                city: team.profile.city,
                name: team.profile.name,
                code: team.profile.code,
                abbr: team.profile.abbr,
                cityEn: team.profile.cityEn,
                conference: team.profile.conference,
                displayAbbr: team.profile.displayAbbr,
                displayConference: team.profile.displayConference,
                division: team.profile.division,
                isAllStarTeam: team.profile.isAllStarTeam,
                isLeagueTeam: team.profile.isLeagueTeam,
                leagueId: team.profile.leagueId,
                nameEn: team.profile.nameEn
            }
            teams.push(newObject);
            return teams;
        })

        await NbaTeam.deleteMany();
        await NbaTeam.insertMany(teams);

        console.log('Teams have been saved to DB successfully');
        await mongoose.connection.close();
    } catch (err) {
        console.log(err)
    }
}

buildAndSaveAllTeams();