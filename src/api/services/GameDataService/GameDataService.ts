import { NbaPlayer, PlayerStats, PlayerStatsPerGame } from '../../../models/nba-data';
import { PlayerValue } from '../../../models/game-data';
import { buildValue } from './utils/buildValue';

class GameDataService {
    buildAndSavePlayerValues = async () => {
        try {
            const statsLastSeason = await PlayerStatsPerGame.find({ seasonId: '2020-21' });
            const nbaPlayer = await NbaPlayer.find().populate({ path: 'stats', model: PlayerStats, populate: { path: 'perGame', model: PlayerStatsPerGame } });
    
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
                        value: 200000,
                        increment: 0
                    }
                }
                return playerValues;
            })
            )
            await PlayerValue.deleteMany();
            await PlayerValue.insertMany(playerValues);
            await this.updatePlayerValues();
            console.log('Player values stored successfully')
        } catch (error) {
            console.log(error)
        }
    }
    
    updatePlayerValues = async () => {
        const allPlayers = await NbaPlayer.find();
        for (const player of allPlayers) {
            const playerValue = await PlayerValue.findOne({ displayName: player.displayName });
            await NbaPlayer.findByIdAndUpdate(player._id, { $set: { playerValue: playerValue._id } })
        }
    }
}

const gameDataService = new GameDataService();

export default gameDataService;