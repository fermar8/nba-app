import axios, { Method } from 'axios';
import NbaTeam from '../../../models/nba-data/nbaTeam.js';
import NbaPlayer from '../../../models/nba-data/nbaPlayer.js';
import { NbaTeamType } from '../../routes/nbaData/types/NbaTeam';
import { NbaPlayerType } from '../../routes/nbaData/types/NbaPlayer';


class NbaSiteService {
    
    buildAndSaveAllTeams = async () => {
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
                city: team.playerProfile.city,
                name: team.playerProfile.name,
                code: team.playerProfile.code,
                abbr: team.playerProfile.abbr,
                cityEn: team.playerProfile.cityEn,
                conference: team.playerProfile.conference,
                displayAbbr: team.playerProfile.displayAbbr,
                displayConference: team.playerProfile.displayConference,
                division: team.playerProfile.division,
                isAllStarTeam: team.playerProfile.isAllStarTeam,
                isLeagueTeam: team.playerProfile.isLeagueTeam,
                leagueId: team.playerProfile.leagueId,
                nameEn: team.playerProfile.nameEn
            }
            teams.push(newObject);
            return teams;
        })
        await NbaTeam.deleteMany();
        await NbaTeam.insertMany(teams);
    }

    buildAndSaveAllPlayers = async () => {
        const options = {
            method: 'GET' as Method,
            url: `https://es.global.nba.com/stats2/league/playerlist.json?locale=es`,
        };

        const response = await axios.request(options);
        const allPlayers = response.data.payload.players;

        let players: any = [];
        allPlayers.forEach(async (player: any) => {
            let findPlayersTeam = await NbaTeam.findOne({ code: player.teamProfile.code });
            let newObject: NbaPlayerType = {
                team: findPlayersTeam._id,
                code: player.playerProfile.code,
                displayName: player.playerProfile.displayName,
                country: player.playerProfile.country,
                countryEn: player.playerProfile.countryEn,
                displayAffiliation: player.playerProfile.displayAffiliation,
                displayNameEn: player.playerProfile.displayNameEn,
                dob: player.playerProfile.dob,
                draftYear: player.playerProfile.draftYear,
                experience: player.playerProfile.experience,
                firstInitial: player.playerProfile.firstInitial,
                firstName: player.playerProfile.firstName,
                firstNameEn: player.playerProfile.firstNameEn,
                height: player.playerProfile.height,
                jerseyNo: player.playerProfile.jerseyNo,
                lastName: player.playerProfile.lastName,
                lastNameEn: player.playerProfile.lastNameEn,
                leagueId: player.playerProfile.leagueId,
                position: player.playerProfile.position,
                schoolType: player.playerProfile.schoolType,
                weight: player.playerProfile.weight
            }
            players.push(newObject);
            return players;
        })
        await NbaPlayer.deleteMany();
        await NbaPlayer.insertMany(players);
    }
    
}

const nbaSiteService = new NbaSiteService();

export default nbaSiteService;