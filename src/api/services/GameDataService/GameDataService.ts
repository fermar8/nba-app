import { NbaPlayer, PlayerStats, PlayerStatsPerGame, PlayerSingleGame } from '../../../models/nba-data';
import { PlayerValue } from '../../../models/game-data';
import { buildValue } from './utils/buildValue';
import { playerValueMapper } from './utils/playerValueMapper';
import { comparePlayerValuesAndGetNewValues } from './utils/comparePlayersAndGetNewValues';

class GameDataService {
    buildAndSavePlayerValues = async () => {
        try {
            const statsLastSeason = await PlayerStatsPerGame.find({ seasonId: '2020-21' });
            const nbaPlayer = await NbaPlayer.find().populate({ path: 'stats', model: PlayerStats, populate: { path: 'perGame', model: PlayerStatsPerGame } });
    
            const playerValues = await Promise.all(nbaPlayer.map(async (player: any) => {
                let newPlayerValues;
    
                if (statsLastSeason.some((el: any) => el.displayName === player.displayName)) {
                    newPlayerValues = {
                        displayName: player.displayName,
                        value: buildValue(player.stats.perGame),
                        increment: 0
                    }
                } else {
                    newPlayerValues = {
                        displayName: player.displayName,
                        value: null,
                        increment: 0
                    }
                }
                return newPlayerValues;
            })
            )
            await PlayerValue.deleteMany();
            await PlayerValue.insertMany(playerValues);
            await this.setInitialPlayerValues();
            console.log('Player values stored successfully')
        } catch (err:any) {
            console.error('Could not set player values', err);
        }
    }
    
    setInitialPlayerValues = async () => {
        const allPlayers = await NbaPlayer.find();
        for (const player of allPlayers) {
            const playerValue = await PlayerValue.findOne({ displayName: player.displayName });
            await NbaPlayer.findByIdAndUpdate(player._id, { $set: { playerValue: playerValue._id } })
        }
    }

    updatePlayerValues = async () => {
        try {
            const nbaPlayers = await NbaPlayer.find();
            const endDate = new Date().toISOString().slice(0, 10)
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);

            const begDate = startDate.toISOString().slice(0, 10);

            for (const player of nbaPlayers) {
                const playerSingleGames = await PlayerSingleGame.find({
                    displayName: player.displayName, gameDate: {
                        $gte: begDate,
                        $lte: endDate
                    }
                })
                const playerValue = await PlayerValue.findOne({ displayName: player.displayName });
                const fantasyPtsLastWeek = playerSingleGames.reduce((accumulator: any, singleGame: any) => {
                    return accumulator + singleGame.nbaFantasyPts
                }, 0);

                const fantasyPtsPerGameLastWeek = fantasyPtsLastWeek && fantasyPtsLastWeek > 0 ? fantasyPtsLastWeek / playerSingleGames.length : 0;
                const playerValueLastWeek = playerValueMapper(fantasyPtsPerGameLastWeek);
                if (playerValue && playerValueLastWeek) {
                    const newValue = comparePlayerValuesAndGetNewValues(playerValueLastWeek, playerValue.value);
                    await PlayerValue.findOneAndUpdate({ displayName: player.displayName }, {$set: {value: newValue.value, increment: newValue.increment}} )
                    await NbaPlayer.findByIdAndUpdate(player._id, { $set: { playerValue: playerValue._id } })
                }
            }
        } catch (err: any) {
            console.error('Error when updating player values', err);
        }
    }
}


export default GameDataService;