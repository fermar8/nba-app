import axios from 'axios';
import {
    NbaTeam,
    NbaPlayer,
    /*PlayerInjuryReport,
    PlayerStats,
    PlayerStatsPerGame,
    PlayerStatsLast5,
    PlayerSingleGame */
} from '../../../models/nba-data';
import NbaDataService from '../../../api/services/NbaDataService/NbaDataService';

import teamsApiResponse from './fixtures/buildAndSaveAllTeams/teamsApiResponse.json';
import teams from './fixtures/buildAndSaveAllTeams/teams.json';

import mockTeamFromDb from './fixtures/buildAndSaveAllPlayers/mockTeamFromDb.json'
import playersApiResponse from './fixtures/buildAndSaveAllPlayers/playersApiResponse.json';
import players from './fixtures/buildAndSaveAllPlayers/players.json';

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
    });
})