import mongoose from 'mongoose';
import PlayerValue from '../../models/game-data/playerValue.js';
import NbaPlayer from '../../models/nba-data/nbaPlayer.js';
import PlayerStats from '../../models/nba-data/playerStats.js';
import PlayerStatsPerGame from '../../models/nba-data/playerStatsPerGame.js';
import { env } from '../../../config.js';

mongoose.connect(env.MONGODB_URI as string || 'mongodb://localhost:27017/nba-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const run = async () => {

    // node --loader ts-node/esm --experimental-json-modules ./buildNbaData.ts

    try {
        const statsLastSeason = await PlayerStatsPerGame.find({ seasonId: '2020-21' });
        const nbaPlayer = await NbaPlayer.find().populate({ path: 'stats', model: PlayerStats, populate: { path: 'perGame', model: PlayerStatsPerGame } });

        // console.log('NBAPLAYER', nbaPlayer[0].stats.perGame);
        const playerValues = await Promise.all(nbaPlayer.map(async (player: any) => {
            let playerValues;

            if (statsLastSeason.some((el: any) => el.displayName === player.displayName)) {
                playerValues = {
                    displayName: player.displayName,
                    value: buildValue(player.stats.perGame),
                    increment: 0
                }
            } else {
                playerValues = {
                    displayName: player.displayName,
                    value: null,
                    increment: 0
                }
            }
            return playerValues;
        })
        )
        await PlayerValue.insertMany(playerValues);
        await saveAndBuildPlayerValues();
        console.log('Player values stored successfully')
    } catch (error) {
        console.log(error)
    }
}

const buildValue = (perGameStats: any) => {
    const value = mapper(perGameStats && perGameStats.nbaFantasyPts ? perGameStats.nbaFantasyPts : null)
    return value;

}

const mapper = (value: any) => {
    let builtValue;
    if (value && value > 0) {
        if (value > 55) {
            builtValue = 2000000;
        } else if (value > 50 && value < 55) {
            builtValue = 1800000;
        } else if (value > 45 && value < 50) {
            builtValue = 1600000;
        } else if (value > 40 && value < 45) {
            builtValue = 1400000;
        } else if (value > 35 && value < 40) {
            builtValue = 1200000;
        } else if (value > 30 && value < 35) {
            builtValue = 1000000;
        } else if (value > 25 && value < 30) {
            builtValue = 800000;
        } else if (value > 20 && value < 25) {
            builtValue = 600000;
        } else if (value > 15 && value < 20) {
            builtValue = 400000;
        } else if (value > 10 && value < 15) {
            builtValue = 200000;
        } else if (value > 5 && value < 10) {
            builtValue = 100000;
        } else if (value > 2.5 && value < 5) {
            builtValue = 50000;
        } else if (value > 0 && value < 2.5) {
            builtValue = 20000;
        }
    } else {
        builtValue = null;
    }
    return builtValue;
}

const saveAndBuildPlayerValues = async () => {
    const allPlayers = await NbaPlayer.find();
    for (const player of allPlayers) {
        const playerValue = await PlayerValue.findOne({ displayName: player.displayName });
        await NbaPlayer.findByIdAndUpdate(player._id, { $set: { playerValue: playerValue._id } })
    }
}

run();