/* import axios, { Method } from 'axios';
import mongoose from 'mongoose';
import SeasonStatsByPlayer from '../../models/nba-data/seasonStatsByPlayer';
import { env } from '../../../config.js';

mongoose.connect(env.MONGODB_URI as string || 'mongodb://localhost:27017/nba-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const run = async () => {

    // node --loader ts-node/esm --experimental-json-modules ./buildAllPlayers.ts

    const seasonId = '2021-22';
    const perMode = 'Totals';
    const headers = {
        'Connection': 'keep-alive',
        'Accept': 'application/json, text/plain, ',
        'x-nba-stats-token': 'true',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
        'x-nba-stats-origin': 'stats',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Referer': 'https://stats.nba.com/',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
    }

    try {
        const options = {
            headers,
            method: 'GET' as Method,
            url: `https://stats.nba.com/stats/leaguedashplayerstats?College=&Conference=&Country=&DateFrom=&DateTo=&Division=&DraftPick=&DraftYear=&GameScope=&GameSegment=&Height=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=${perMode}&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=${seasonId}&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&StarterBench=&TeamID=0&TwoWay=0&VsConference=&VsDivision=&Weight=`,
        };

        const response: any = await axios.request(options);
        const playerInfo = response.data.resultSets[0].rowSet;
        const allPlayerSeasonStats: mongoose.AnyObject = [];

        playerInfo.forEach(async (el: any[]) => {
            const playerSeasonStats = {
                seasonId: seasonId,
                playerId: el[0],
                displayName: el[1],
                teamId: el[2],
                teamAbbreviation: el[3],
                age: el[4],
                gp: el[5],
                w: el[6],
                l: el[7],
                wPct: el[8],
                min: el[9],
                fgm: el[10],
                fga: el[11],
                fgPct: el[12],
                fg3m: el[13],
                fg3a: el[14],
                fg3Pct: el[15],
                ftm: el[16],
                fta: el[17],
                ftPct: el[18],
                oreb: el[19],
                dreb: el[20],
                reb: el[21],
                ast: el[22],
                tov: el[23],
                stl: el[24],
                blk: el[25],
                blka: el[26],
                pf: el[27],
                pfd: el[28],
                pts: el[29],
                plusMinus: el[30],
                nbaFantasyPts: el[31],
                dd2: el[32],
                td3: el[33],
                gpRank: el[34],
                wRank: el[35],
                lRank: el[36],
                wPctRank: el[37],
                minRank: el[38],
                fgmRank: el[39],
                fgaRank: el[40],
                fgPctRank: el[41],
                fg3mRank: el[42],
                fg3aRank: el[43],
                fg3PctRank: el[44],
                ftmRank: el[45],
                ftaRank: el[46],
                ftPctRank: el[47],
                orebRank: el[48],
                drebRank: el[49],
                rebRank: el[50],
                astRank: el[51],
                tovRank: el[52],
                stlRank: el[53],
                blkRank: el[54],
                blkaRank: el[55],
                pfRank: el[56],
                pfdRank: el[57],
                ptsRank: el[58],
                plusMinusRank: el[59],
                nbaFantasyPtsRank: el[60],
                dd2Rank: el[61],
                td3Rank: el[62],
                cfid: el[63],
                cfparams: el[64]
            }
            allPlayerSeasonStats.push(playerSeasonStats);
        })

        await SeasonStatsByPlayer.insertMany(allPlayerSeasonStats)

    } catch (error) {
        console.log(error)

        fs.writeFile('./../rosters/AllPlayers.json', stringify, function (err) {
            if (err) {
                return console.error(err);
            }
            console.log("File created!");
        }); 
    }
}


run();

*/