import axios from 'axios';
import {
    NbaTeam,
    NbaPlayer,
    // PlayerInjuryReport,
    PlayerStats,
    PlayerStatsPerGame,
    PlayerStatsLast5,
    PlayerSingleGame 
} from '../../../models/nba-data';
import NbaDataService from '../../../api/services/NbaDataService/NbaDataService';

import teamsApiResponse from './fixtures/buildAndSaveAllTeams/teamsApiResponse.json';
import teams from './fixtures/buildAndSaveAllTeams/teams.json';

import mockTeamFromDb from './fixtures/buildAndSaveAllPlayers/mockTeamFromDb.json'
import playersApiResponse from './fixtures/buildAndSaveAllPlayers/playersApiResponse.json';
import players from './fixtures/buildAndSaveAllPlayers/players.json';

import playerStatsPerGame from './fixtures/buildAndSaveAllPlayerStats/playerStatsPerGame.json';
import playerStatsLast5 from './fixtures/buildAndSaveAllPlayerStats/playerStatsLast5.json';
import playerStatsSingleGame from './fixtures/buildAndSaveAllPlayerStats/playerStatsSingleGame.json';

jest.mock('axios');
console.log = jest.fn();
console.error = jest.fn();


describe("NbaDataService", () => {
    const service = new NbaDataService()
    afterEach(async () => {
        jest.clearAllMocks();
    })

    describe("buildAndSaveAllTeams", () => {
        test("Calls the delete and insert functions with valid format", async () => {
            NbaTeam.deleteMany = jest.fn();
            NbaTeam.insertMany = jest.fn();
            (axios.request as jest.Mock).mockResolvedValueOnce(teamsApiResponse);
            await service.buildAndSaveAllTeams();
            expect(axios.request).toHaveBeenCalled();
            expect(NbaTeam.deleteMany).toHaveBeenCalled();
            expect(NbaTeam.insertMany).toHaveBeenCalledWith(teams);
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(console.log).toHaveBeenCalledWith('Teams created successfully')
        })
        test("Logs an error when API response is empty", async () => {
            NbaTeam.deleteMany = jest.fn();
            NbaTeam.insertMany = jest.fn();
            (axios.request as jest.Mock).mockResolvedValueOnce([]);
            await service.buildAndSaveAllTeams();
            expect(axios.request).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledTimes(1);
        })
    });
    describe("buildAndSaveAllPlayers", () => {
        test("When player doesn't exist in DB, it inserts it", async () => {
            NbaPlayer.exists = jest.fn().mockResolvedValueOnce(false);
            NbaTeam.findOne = jest.fn().mockResolvedValueOnce(mockTeamFromDb);
            NbaPlayer.insertMany = jest.fn();
            (axios.request as jest.Mock).mockResolvedValueOnce(playersApiResponse);
            await service.buildAndSaveAllPlayers();
            expect(axios.request).toHaveBeenCalled();
            expect(NbaPlayer.insertMany).toHaveBeenCalledWith(players);
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(console.log).toHaveBeenCalledWith('Players updated successfully')
        })
        test("When player exists in DB, doesn't insert it", async () => {
            NbaPlayer.exists = jest.fn().mockResolvedValueOnce(true);
            NbaTeam.findOne = jest.fn()
            NbaPlayer.insertMany = jest.fn();
            (axios.request as jest.Mock).mockResolvedValueOnce(playersApiResponse);
            await service.buildAndSaveAllPlayers();
            expect(axios.request).toHaveBeenCalled();
            expect(NbaPlayer.insertMany).toHaveBeenCalledWith([])
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(console.log).toHaveBeenCalledWith('Players updated successfully')
        })
        test("Logs an error when API response does not contain valid fields", async () => {
            NbaPlayer.exists = jest.fn().mockResolvedValueOnce(false);
            NbaTeam.findOne = jest.fn()
            NbaPlayer.insertMany = jest.fn();
            (axios.request as jest.Mock).mockResolvedValueOnce({anInvalidResponse: 'anInvalidResponse'});
            await service.buildAndSaveAllPlayers();
            expect(console.error).toHaveBeenCalledTimes(1);
        })
    });
    describe("buildAndSaveAllPlayerStats", () => {
        test("Builds and saves objectIds to PlayerStats and assigns them to a Player", async () => {
            PlayerStats.deleteMany = jest.fn();
            NbaPlayer.find = jest.fn().mockResolvedValueOnce(players);
            PlayerStatsPerGame.findOne = jest.fn().mockResolvedValueOnce(playerStatsPerGame);
            PlayerStatsLast5.findOne = jest.fn().mockResolvedValueOnce(playerStatsLast5);
            PlayerSingleGame.find = jest.fn().mockResolvedValueOnce(playerStatsSingleGame);
            PlayerStats.create = jest.fn().mockResolvedValueOnce({_id: 'anId'});
            NbaPlayer.findByIdAndUpdate = jest.fn();
            await service.buildAndSaveAllPlayerStats();
            expect(NbaPlayer.find).toHaveBeenCalled();
            expect(PlayerStatsPerGame.findOne).toHaveBeenCalled();
            expect(PlayerStatsLast5.findOne).toHaveBeenCalled();
            expect(PlayerSingleGame.find).toHaveBeenCalled();
            expect(PlayerStats.create).toHaveBeenCalledWith({
                perGame: playerStatsPerGame._id,
                lastFive: playerStatsLast5._id,
                games: ['anObjectId', 'anotherObjectId']
            });
            expect(NbaPlayer.findByIdAndUpdate).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(console.log).toHaveBeenCalledWith('All player stats saved correctly to DB')
        })
        test("When there are no stats available, builds PlayerStats properties as null", async () => {
            PlayerStats.deleteMany = jest.fn();
            NbaPlayer.find = jest.fn().mockResolvedValueOnce(players);
            PlayerStatsPerGame.findOne = jest.fn().mockResolvedValueOnce({});
            PlayerStatsLast5.findOne = jest.fn().mockResolvedValueOnce({});
            PlayerSingleGame.find = jest.fn().mockResolvedValueOnce([]);
            PlayerStats.create = jest.fn().mockResolvedValueOnce({_id: 'anId'});
            NbaPlayer.findByIdAndUpdate = jest.fn();
            await service.buildAndSaveAllPlayerStats();
            expect(NbaPlayer.find).toHaveBeenCalled();
            expect(PlayerStatsPerGame.findOne).toHaveBeenCalled();
            expect(PlayerStatsLast5.findOne).toHaveBeenCalled();
            expect(PlayerSingleGame.find).toHaveBeenCalled();
            expect(PlayerStats.create).toHaveBeenCalledWith({
                perGame: null,
                lastFive: null,
                games: null
            });
            expect(NbaPlayer.findByIdAndUpdate).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(console.log).toHaveBeenCalledWith('All player stats saved correctly to DB')
        })
        test("Logs an error when DB operation fails", async () => {
            PlayerStats.deleteMany = jest.fn().mockImplementationOnce(() => {
                throw new Error('anError');
            });
            await service.buildAndSaveAllPlayerStats();
            expect(console.error).toHaveBeenCalledTimes(1);
        })
    });
})