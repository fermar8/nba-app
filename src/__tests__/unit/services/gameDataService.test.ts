import {
    NbaPlayer,
    PlayerStatsPerGame,
} from '../../../models/nba-data';
import { PlayerValue } from '../../../models/game-data';
import GameDataService from '../../../api/services/GameDataService/GameDataService';

import nbaPlayer from './fixtures/gameDataservice/nbaPlayer.json';
import statsLastSeason from './fixtures/gameDataservice/statsLastSeason.json';

jest.mock('axios');
console.log = jest.fn();
console.error = jest.fn();


describe("GameDataService", () => {
    const service = new GameDataService()
    afterEach(async () => {
        jest.clearAllMocks();
    })

    describe("buildAndSavePlayerValues", () => {
        test("If player has recorded stats from last season, saves with correct value", async () => {
            PlayerStatsPerGame.find = jest.fn().mockResolvedValueOnce(statsLastSeason);
            NbaPlayer.find = jest.fn().mockImplementation(() => ({
                populate: jest.fn().mockReturnValueOnce(nbaPlayer)
            }));
            PlayerValue.deleteMany = jest.fn();
            PlayerValue.insertMany = jest.fn();
            service.setInitialPlayerValues = jest.fn();
            await service.buildAndSavePlayerValues();
            expect(PlayerStatsPerGame.find).toHaveBeenCalled();
            expect(NbaPlayer.find).toHaveBeenCalled();
            expect(PlayerValue.deleteMany).toHaveBeenCalled();
            expect(PlayerValue.insertMany).toHaveBeenCalledWith([{
                displayName: 'aName',
                value: 600000,
                increment: 0
            }]);
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(console.log).toHaveBeenCalledWith('Player values stored successfully');
        })
        test("If player does NOT have recorded stats from last season, saves with correct value", async () => {
            PlayerStatsPerGame.find = jest.fn().mockResolvedValueOnce([]);
            NbaPlayer.find = jest.fn().mockImplementation(() => ({
                populate: jest.fn().mockReturnValueOnce(nbaPlayer)
            }));
            PlayerValue.deleteMany = jest.fn();
            PlayerValue.insertMany = jest.fn();
            service.setInitialPlayerValues = jest.fn();
            await service.buildAndSavePlayerValues();
            expect(PlayerStatsPerGame.find).toHaveBeenCalled();
            expect(NbaPlayer.find).toHaveBeenCalled();
            expect(PlayerValue.deleteMany).toHaveBeenCalled();
            expect(PlayerValue.insertMany).toHaveBeenCalledWith([{
                displayName: 'aName',
                value: null,
                increment: 0
            }]);
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(console.log).toHaveBeenCalledWith('Player values stored successfully');
        });
        test("If there is an error while updating, logs it", async () => {
            PlayerStatsPerGame.find = jest.fn().mockResolvedValueOnce([]);
            NbaPlayer.find = jest.fn().mockImplementation(() => ({
                populate: jest.fn().mockReturnValueOnce(nbaPlayer)
            }));
            PlayerValue.deleteMany = jest.fn();
            PlayerValue.insertMany = jest.fn().mockImplementationOnce(() => {
                throw new Error('anError');
            });
            await service.buildAndSavePlayerValues();
            expect(PlayerStatsPerGame.find).toHaveBeenCalled();
            expect(NbaPlayer.find).toHaveBeenCalled();
            expect(PlayerValue.deleteMany).toHaveBeenCalled();
            expect(PlayerValue.insertMany).toHaveBeenCalledWith([{
                displayName: 'aName',
                value: null,
                increment: 0
            }]);
            expect(console.error).toHaveBeenCalledTimes(1);
        })
    });
});