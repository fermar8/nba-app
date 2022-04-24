import { NbaPlayer } from '../../../models/nba-data';

class GameDataService {
    createGameData = async () => {
        const allPlayersInDb = await NbaPlayer.find();
    }
}

const gameDataService = new GameDataService();

export default gameDataService;