import axios from 'axios';
import { ObjectId } from 'mongoose';
import { buildOptions, buildOptionsWithHeaders } from './options/buildOptions';
import { env } from '../../../../config';

import {
    NbaTeam,
    NbaPlayer,
    PlayerStats,
    PlayerStatsPerGame,
    PlayerStatsLast5,
    PlayerSingleGame
} from '../../../models/nba-data';

import {
    NbaPlayerType,
    NbaTeamType,
    PlayerPerGameStatsNewType,
    PlayerLastFiveNewType,
    PlayerSingleGameNewType,
    PlayerPerGameStatsDbType,
    PlayerLastFiveDbType,
    PlayerSingleGameDbType
} from '../../types/nbaData';


class NbaDataService {
    buildAndSaveAllTeams = async () => {
        try {
            const options = buildOptions(env.NBA_DATA_TEAMS_URL as string);

            const response = await axios.request(options);
            const eastConferenceTeams = response.data.payload.listGroups[0].teams;
            const westConferenceTeams = response.data.payload.listGroups[1].teams;
            const allTeams = [...eastConferenceTeams, ...westConferenceTeams];

            const teams: NbaTeamType[] = [];
            allTeams.forEach((team) => {
                const newTeam: NbaTeamType = {
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
                teams.push(newTeam);
                return teams;
            })
            await NbaTeam.deleteMany();
            await NbaTeam.insertMany(teams);
        } catch (err: any) {
            console.log('Error when updating teams');
        }

    }

    buildAndSaveAllPlayers = async () => {
        try {
            await NbaPlayer.deleteMany();
            const options = buildOptions(env.NBA_DATA_PLAYERS_URL as string);

            const response = await axios.request(options);
            const allPlayers = response.data.payload.players;
            const playersToDb: NbaPlayerType[] = [];

            for (const player of allPlayers) {
                const findPlayersTeam = await NbaTeam.findOne({ code: player.teamProfile.code });
                const newPlayer: NbaPlayerType = {
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
                playersToDb.push(newPlayer);
            }
            await NbaPlayer.deleteMany();
            await NbaPlayer.insertMany(playersToDb);
        } catch (err: any) {
            console.log('Error when updating players');
        }

    }

    buildAndSavePlayerSeasonStats = async () => {
        try {
            const seasonId = '2021-22';
            const perMode = 'PerGame';
            const options = buildOptionsWithHeaders(`https://stats.nba.com/stats/leaguedashplayerstats?College=&Conference=&Country=&DateFrom=&DateTo=&Division=&DraftPick=&DraftYear=&GameScope=&GameSegment=&Height=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=${perMode}&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=${seasonId}&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&StarterBench=&TeamID=0&TwoWay=0&VsConference=&VsDivision=&Weight=`);
            const response: any = await axios.request(options);
            const playerInfo = response.data.resultSets[0].rowSet;
            const allPlayerPerGameStats: PlayerPerGameStatsNewType[] = [];

            playerInfo.forEach(async (el: any[]) => {
                const playerPerGameStats: PlayerPerGameStatsNewType = {
                    seasonId,
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
        } catch (err: any) {
            console.log('Error when updating season stats');
        }

    }

    buildAndSaveLast5GamesStats = async () => {
        try {
            const seasonId = '2021-22';
            const perMode = 'PerGame';
            const lastNGames = 5;
            const options = buildOptionsWithHeaders(`https://stats.nba.com/stats/leaguedashplayerstats?College=&Conference=&Country=&DateFrom=&DateTo=&Division=&DraftPick=&DraftYear=&GameScope=&GameSegment=&Height=&LastNGames=${lastNGames}&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=${perMode}&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=${seasonId}&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&StarterBench=&TeamID=0&TwoWay=0&VsConference=&VsDivision=&Weight=`);
            const response: any = await axios.request(options);
            const playerInfo = response.data.resultSets[0].rowSet;
            const allLastFive: PlayerLastFiveNewType[] = [];

            playerInfo.forEach(async (el: any[]) => {
                const lastFive: PlayerLastFiveNewType = {
                    seasonId,
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
        } catch (err: any) {
            console.log('Error when updating last five games stats');
        }
    }

    buildAndSaveAllGamesByPlayer = async () => {
        try {
            const seasonId = '2021-22';
            const options = buildOptionsWithHeaders(`https://stats.nba.com/stats/leaguegamelog?Counter=1000&DateFrom=&DateTo=&Direction=DESC&LeagueID=00&PlayerOrTeam=P&Season=${seasonId}&SeasonType=Regular+Season&Sorter=DATE`);
            const response: any = await axios.request(options);
            const gamesInfo = response.data.resultSets[0].rowSet;
            const allGamesByPlayer: PlayerSingleGameNewType[] = [];

            gamesInfo.forEach(async (el: any[]) => {
                const gameByPlayer: PlayerSingleGameNewType = {
                    seasonId,
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
        } catch (err: any) {
            console.log('Error when updating games by player');
        }

    }

    saveAndBuildAllPlayerStats = async () => {
        try {
            await PlayerStats.deleteMany();
            const allPlayers = await NbaPlayer.find();
            for (const player of allPlayers) {
                const playerStatsPerGame: PlayerPerGameStatsDbType = await PlayerStatsPerGame.findOne({ displayName: player.displayName });
                const playerStatsLast5: PlayerLastFiveDbType = await PlayerStatsLast5.findOne({ displayName: player.displayName });
                const playerStatsSingleGame: PlayerSingleGameDbType[] = await PlayerSingleGame.find({ displayName: player.displayName });
                const gameIds = await playerStatsSingleGame.map((game: { _id: ObjectId; }) => {
                    return game._id
                });
                const createdStats = await PlayerStats.create({
                    perGame: playerStatsPerGame && playerStatsPerGame._id ? playerStatsPerGame._id : null,
                    lastFive: playerStatsLast5 && playerStatsLast5._id ? playerStatsLast5._id : null,
                    games: gameIds ? [...gameIds] : null
                })

                await NbaPlayer.findByIdAndUpdate(player._id, { $set: { stats: createdStats._id } })
            }
        } catch (err: any) {
            console.log('Error when updating player stats in db')
        }
    }

    buildPlayerGameData = async () => {
        const playerAndStats = await PlayerStatsPerGame.find();

        console.log('playerAndStats', playerAndStats);
    }

}

const nbaDataService = new NbaDataService();

export default nbaDataService;