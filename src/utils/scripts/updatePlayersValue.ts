import mongoose from 'mongoose';
import PlayerValue from '../../models/game-data/playerValue.js';
import NbaPlayer from '../../models/nba-data/nbaPlayer.js';
import { comparePlayerValuesAndGetNewValues } from '../../api/services/NbaDataService/utils/comparePlayersAndGetNewValues.js';
import { playerValueMapper } from '../../api/services/GameDataService/utils/playerValueMapper.js';
import PlayerSingleGame from '../../models/nba-data/playerSingleGame.js';
import { env } from '../../../config.js';

mongoose.connect(env.MONGODB_URI as string || 'mongodb://localhost:27017/nba-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const run = async () => {

    // node --loader ts-node/esm --experimental-json-modules ./updatePlayersValue.ts
        try {
            const nbaPlayers = await NbaPlayer.find();
            const endDate = new Date('2022-04-10').toISOString().slice(0, 10)
            const startDate = new Date('2022-04-10')
            startDate.setDate(startDate.getDate() - 7);

            const begDate = startDate.toISOString().slice(0, 10);

            for (const player of nbaPlayers) {
                const playerSingleGames = await PlayerSingleGame.find({
                    displayName: player.displayName, gameDate: {
                        $gte: begDate,
                        $lte: endDate
                    }
                })
                if (playerSingleGames && playerSingleGames.length > 0) {
                    const playerValue = await PlayerValue.findOne({ displayName: player.displayName });
                    const fantasyPtsLastWeek = playerSingleGames.reduce((accumulator: any, singleGame: any) => {
                        return accumulator + singleGame.nbaFantasyPts
                    }, 0);
    
                    const fantasyPtsPerGameLastWeek = fantasyPtsLastWeek && fantasyPtsLastWeek > 0 ? fantasyPtsLastWeek / playerSingleGames.length : 0;
                    const playerValueLastWeek = playerValueMapper(fantasyPtsPerGameLastWeek);
                    console.log('playerValueLastWeek', playerValueLastWeek);
                    console.log('playerValue', playerValue.value);
                    if (playerValue && playerValueLastWeek) {
                        const newValue = comparePlayerValuesAndGetNewValues(playerValueLastWeek, playerValue.value);
                        console.log('newValue', newValue);
                        await PlayerValue.findOneAndUpdate({ displayName: player.displayName }, {$set: {value: newValue.value, increment: newValue.increment}} )
                        await NbaPlayer.findByIdAndUpdate(player._id, { $set: { playerValue: playerValue._id } })
                    }
                } else {
                    console.log(`No new games for player ${player.displayName}`)
                }
            }
            console.log('Player values updated successfully');
        } catch (error) {
            console.log(error)
        }
}

run();