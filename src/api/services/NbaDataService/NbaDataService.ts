import axios, { Method } from 'axios';
import NbaTeam from '../../../models/nba-data/nbaTeam';
import NbaPlayer from '../../../models/nba-data/nbaPlayer';
import PlayerStats from '../../../models/nba-data/playerStats';
import PlayerStatsPerGame from '../../../models/nba-data/playerStatsPerGame';
import PlayerStatsLast5 from '../../../models/nba-data/playerStatsLast5';
import PlayerSingleGame from '../../../models/nba-data/playerSingleGame';
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
    }

    buildAndSaveAllPlayers = async () => {
        await NbaPlayer.deleteMany();
        const options = {
            method: 'GET' as Method,
            url: `https://es.global.nba.com/stats2/league/playerlist.json?locale=es`,
        };

        const response = await axios.request(options);
        const allPlayers = response.data.payload.players;
        const playersToDb = [];

        for (const player of allPlayers) {
            const findPlayersTeam = await NbaTeam.findOne({ code: player.teamProfile.code });
            console.log('findPlayersTeam', findPlayersTeam);
            const newObject: NbaPlayerType = {
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
            };
            playersToDb.push(newObject);
        }
        await NbaPlayer.deleteMany();
        await NbaPlayer.insertMany(playersToDb);
    }

    buildAndSavePlayerSeasonStats = async () => {
        const seasonId = '2021-22';
        const perMode = 'PerGame';
        const headers = {
            'Connection': 'keep-alive',
            'Accept': 'application/json, text/plain, */*',
            'x-nba-stats-token': 'true',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
            'x-nba-stats-origin': 'stats',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Referer': 'https://stats.nba.com/',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9',
        }
        const options = {
            headers,
            method: 'GET' as Method,
            url: `https://stats.nba.com/stats/leaguedashplayerstats?College=&Conference=&Country=&DateFrom=&DateTo=&Division=&DraftPick=&DraftYear=&GameScope=&GameSegment=&Height=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=${perMode}&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=${seasonId}&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&StarterBench=&TeamID=0&TwoWay=0&VsConference=&VsDivision=&Weight=`,
        };

        const response: any = await axios.request(options);
        const playerInfo = response.data.resultSets[0].rowSet;
        const allPlayerPerGameStats: any = [];

        playerInfo.forEach(async (el: any[]) => {
            const playerPerGameStats = {
                seasonId: seasonId,
                playerId: el[0],
                displayName: el[1],
                firstName: el[2],
                teamId: el[3],
                teamAbbreviation: el[4],
                age: el[5],
                gp: el[6],
                w: el[7],
                l: el[8],
                wPct: el[9],
                min: el[10],
                fgm: el[11],
                fga: el[12],
                fgPct: el[13],
                fg3m: el[14],
                fg3a: el[15],
                fg3Pct: el[16],
                ftm: el[17],
                fta: el[18],
                ftPct: el[19],
                oreb: el[20],
                dreb: el[21],
                reb: el[22],
                ast: el[23],
                tov: el[24],
                stl: el[25],
                blk: el[26],
                blka: el[27],
                pf: el[28],
                pfd: el[29],
                pts: el[30],
                plusMinus: el[31],
                nbaFantasyPts: el[32],
                dd2: el[33],
                td3: el[34],
                gpRank: el[35],
                wRank: el[36],
                lRank: el[37],
                wPctRank: el[38],
                minRank: el[39],
                fgmRank: el[40],
                fgaRank: el[41],
                fgPctRank: el[42],
                fg3mRank: el[43],
                fg3aRank: el[44],
                fg3PctRank: el[45],
                ftmRank: el[46],
                ftaRank: el[47],
                ftPctRank: el[48],
                orebRank: el[49],
                drebRank: el[50],
                rebRank: el[51],
                astRank: el[52],
                tovRank: el[53],
                stlRank: el[54],
                blkRank: el[55],
                blkaRank: el[56],
                pfRank: el[57],
                pfdRank: el[58],
                ptsRank: el[59],
                plusMinusRank: el[60],
                nbaFantasyPtsRank: el[61],
                dd2Rank: el[62],
                td3Rank: el[63],
                cfid: el[64],
                cfparams: el[65]
            }
            allPlayerPerGameStats.push(playerPerGameStats);
        });
        await PlayerStatsPerGame.deleteMany();
        await PlayerStatsPerGame.insertMany(allPlayerPerGameStats);
    }

    buildAndSaveLast5GamesStats = async () => {
        const seasonId = '2021-22';
        const perMode = 'PerGame';
        const lastNGames = 5;
        const headers = {
            'Connection': 'keep-alive',
            'Accept': 'application/json, text/plain, */*',
            'x-nba-stats-token': 'true',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
            'x-nba-stats-origin': 'stats',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Referer': 'https://stats.nba.com/',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9',
        }
        const options = {
            headers,
            method: 'GET' as Method,
            url: `https://stats.nba.com/stats/leaguedashplayerstats?College=&Conference=&Country=&DateFrom=&DateTo=&Division=&DraftPick=&DraftYear=&GameScope=&GameSegment=&Height=&LastNGames=${lastNGames}&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=${perMode}&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=${seasonId}&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&StarterBench=&TeamID=0&TwoWay=0&VsConference=&VsDivision=&Weight=`,
        };

        const response: any = await axios.request(options);
        const playerInfo = response.data.resultSets[0].rowSet;
        const allLastFive: any = [];

        playerInfo.forEach(async (el: any[]) => {
            const lastFive = {
                seasonId: seasonId,
                playerId: el[0],
                displayName: el[1],
                firstName: el[2],
                teamId: el[3],
                teamAbbreviation: el[4],
                age: el[5],
                gp: el[6],
                w: el[7],
                l: el[8],
                wPct: el[9],
                min: el[10],
                fgm: el[11],
                fga: el[12],
                fgPct: el[13],
                fg3m: el[14],
                fg3a: el[15],
                fg3Pct: el[16],
                ftm: el[17],
                fta: el[18],
                ftPct: el[19],
                oreb: el[20],
                dreb: el[21],
                reb: el[22],
                ast: el[23],
                tov: el[24],
                stl: el[25],
                blk: el[26],
                blka: el[27],
                pf: el[28],
                pfd: el[29],
                pts: el[30],
                plusMinus: el[31],
                nbaFantasyPts: el[32],
                dd2: el[33],
                td3: el[34],
                gpRank: el[35],
                wRank: el[36],
                lRank: el[37],
                wPctRank: el[38],
                minRank: el[39],
                fgmRank: el[40],
                fgaRank: el[41],
                fgPctRank: el[42],
                fg3mRank: el[43],
                fg3aRank: el[44],
                fg3PctRank: el[45],
                ftmRank: el[46],
                ftaRank: el[47],
                ftPctRank: el[48],
                orebRank: el[49],
                drebRank: el[50],
                rebRank: el[51],
                astRank: el[52],
                tovRank: el[53],
                stlRank: el[54],
                blkRank: el[55],
                blkaRank: el[56],
                pfRank: el[57],
                pfdRank: el[58],
                ptsRank: el[59],
                plusMinusRank: el[60],
                nbaFantasyPtsRank: el[61],
                dd2Rank: el[62],
                td3Rank: el[63],
                cfid: el[64],
                cfparams: el[65]
            }
            allLastFive.push(lastFive);
        })
        await PlayerStatsLast5.deleteMany();
        await PlayerStatsLast5.insertMany(allLastFive);
    }

    buildAndSaveAllGamesByPlayer = async () => {
        const seasonId = '2021-22';
        const headers = {
            'Connection': 'keep-alive',
            'Accept': 'application/json, text/plain, */*',
            'x-nba-stats-token': 'true',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
            'x-nba-stats-origin': 'stats',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Referer': 'https://stats.nba.com/',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9',
        }
        const options = {
            headers,
            method: 'GET' as Method,
            url: `https://stats.nba.com/stats/leaguegamelog?Counter=1000&DateFrom=&DateTo=&Direction=DESC&LeagueID=00&PlayerOrTeam=P&Season=${seasonId}&SeasonType=Regular+Season&Sorter=DATE`,
        };

        const response: any = await axios.request(options);
        const gamesInfo = response.data.resultSets[0].rowSet;
        const allGamesByPlayer: any = [];

        gamesInfo.forEach(async (el: any[]) => {
            const gameByPlayer = {
                seasonId: seasonId,
                displayName: el[2],
                teamId: el[3],
                teamAbbreviation: el[4],
                teamName: el[5],
                gameId: el[6],
                gameDate: el[7],
                matchup: el[8],
                wl: el[9],
                min: el[10],
                fgm: el[11],
                fga: el[12],
                fgPct: el[13],
                fg3m: el[14],
                fg3a: el[15],
                fg3Pct: el[16],
                ftm: el[17],
                fta: el[18],
                ftPct: el[19],
                oreb: el[20],
                dreb: el[21],
                reb: el[22],
                ast: el[23],
                stl: el[24],
                blk: el[25],
                tov: el[26],
                pf: el[27],
                pts: el[28],
                plusMinus: el[29],
                nbaFantasyPts: el[30],
                videoAvailable: el[31]
            }
            allGamesByPlayer.push(gameByPlayer);
        })
        await PlayerSingleGame.deleteMany();
        await PlayerSingleGame.insertMany(allGamesByPlayer);
    }

    saveAndBuildAllPlayerStats = async () => {
        await PlayerStats.deleteMany();
        const allPlayers = await NbaPlayer.find();
        for (const player of allPlayers) {
            const playerStatsPerGame = await PlayerStatsPerGame.findOne({ displayName: player.displayName });
            const playerStatsLast5 = await PlayerStatsLast5.findOne({ displayName: player.displayName });
            const playerStatsSingleGame = await PlayerSingleGame.find({ displayName: player.displayName });
            const gameIds = await playerStatsSingleGame.map((game: { _id: any; }) => {
                return game._id
            });
            const createdStats = await PlayerStats.create({
                perGame: playerStatsPerGame && playerStatsPerGame._id ? playerStatsPerGame._id : null,
                lastFive: playerStatsLast5 && playerStatsLast5._id ? playerStatsLast5._id : null,
                games: gameIds ? [ ...gameIds ] : null
            })
            
            await NbaPlayer.findByIdAndUpdate(player._id, { $set: { stats: createdStats._id }})
        }
    }

}

const nbaSiteService = new NbaSiteService();

export default nbaSiteService;