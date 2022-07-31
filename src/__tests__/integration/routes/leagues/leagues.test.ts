import request from 'supertest';
import app from '../../../../../app';
import authService from '../../../../api/services/AuthService';
import leaguesService from '../../../../api/services/LeaguesService';
import mongoose from 'mongoose';
import User from '../../../../models/nba-app/user';
import League from '../../../../models/nba-app/league';
import UserTeam from '../../../../models/nba-app/userTeam';
const databaseName = 'leagues-test';
const url = `mongodb://localhost:27017/${databaseName}`;

import leagues from './fixtures/leagues.json';
import teams from './fixtures/teams.json';

describe("api/leagues", () => {
    const mockUser = {
        name: 'aUser',
        email: 'anEmail',
        password: '123456'
    }
    beforeAll(async () => {
        await mongoose.disconnect();
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
    });
    beforeEach(async () => {
        await request(app).post('/api/auth/register').send(mockUser);
        await League.insertMany(leagues);
        await UserTeam.insertMany(teams);
    })
    afterEach(async () => {
        await League.deleteMany();
        await User.deleteMany();
        await UserTeam.deleteMany();
    })
    describe("get api/leagues", () => {
        jest.mock('../../../../api/services/AuthService');
        jest.mock('../../../../api/services/LeaguesService');

        test("respond with a 200 status if leagues are retrieved successfully", async () => {
            jest.spyOn(authService, 'verifyToken')
                .mockReturnValueOnce(Promise.resolve(true));
            const response = await request(app).get('/api/leagues').set('Cookie', `token=123456`);
            expect(response.statusCode).toBe(200);
        });
        test("respond with 400 if token is invalid", async () => {
            jest.spyOn(authService, 'verifyToken')
                .mockReturnValueOnce(Promise.resolve(false));
            const response = await request(app).get('/api/leagues').set('Cookie', `token=123456`);
            expect(response.statusCode).toBe(400);
        });
        test("respond with 404 if there is an unexpected error", async () => {
            jest.spyOn(leaguesService, 'getLeagues')
                .mockImplementation(() => {
                    throw new Error();
                });
            const response = await request(app).get('/api/leagues').set('Cookie', `token=123456`);
            expect(response.statusCode).toBe(404);
        });
    })
    describe("get api/leagues/:id", () => {
        test("respond with a 200 status if league is retrieved successfully by leagueId", async () => {
            jest.spyOn(authService, 'verifyToken')
                .mockReturnValueOnce(Promise.resolve(true));
            const leaguesFromDb = await League.find();
            const response = await request(app).get(`/api/leagues/${leaguesFromDb[0]._id}`).set('Cookie', `token=123456`);
            expect(response.statusCode).toBe(200);
        });
    })
    describe("post api/leagues/", () => {
        test("respond with a 200 status if league is created successfully", async () => {
            jest.spyOn(authService, 'verifyToken')
                .mockReturnValueOnce(Promise.resolve(true));
            const userFromDb = await User.findOne({ name: 'aUser' })
            const response = await request(app).post('/api/leagues')
                .set('Cookie', `token=${userFromDb.token}`)
                .send({ name: 'aLeague' })
            expect(response.statusCode).toBe(200);
        });
    })
    describe("post api/leagues/team/:id", () => {
        test("respond with a 200 status if team is created successfully and added to league", async () => {
            jest.spyOn(authService, 'verifyToken')
                .mockReturnValueOnce(Promise.resolve(true));
            const userFromDb = await User.findOne({ name: 'aUser' });
            const leagueFromDb = await League.findOne({ name: 'aLeague' });
            const response = await request(app).post(`/api/leagues/team/${leagueFromDb._id}`)
                .set('Cookie', `token=${userFromDb.token}`)
                .send({
                    name: 'aTeam',
                })
            expect(response.statusCode).toBe(200);
        });
    })
    describe("delete api/leagues/team/:leagueId/:teamId", async () => {
        const userFromDb = await User.findOne({ name: 'aUser' });
        const leagueFromDb = await League.findOne({ name: 'aLeague' });
        const teamFromDb = await UserTeam.findOne({ name: 'aTeam' });
        test("respond with a 204 status if team is deleted from league by admin", async () => {
            jest.spyOn(authService, 'verifyToken')
                .mockReturnValueOnce(Promise.resolve(true));
            jest.spyOn(leaguesService, 'checkIfUserIsLeagueAdmin')
                .mockReturnValueOnce(Promise.resolve(true));
            const response = await request(app).delete(`/api/leagues/team/${leagueFromDb._id}/${teamFromDb._id}`)
                .set('Cookie', `token=${userFromDb.token}`)
            expect(response.statusCode).toBe(204);
        });
        test("respond with a 204 status if team is deleted from league by team owner", async () => {
            jest.spyOn(authService, 'verifyToken')
                .mockReturnValueOnce(Promise.resolve(true));
            jest.spyOn(leaguesService, 'checkIfUserIsOwner')
                .mockReturnValueOnce(Promise.resolve(true));
            const response = await request(app).delete(`/api/leagues/team/${leagueFromDb._id}/${teamFromDb._id}`)
                .set('Cookie', `token=${userFromDb.token}`)
            expect(response.statusCode).toBe(204);
        });
        test("respond with a 400 status if user deleting isn't owner or admin of league", async () => {
            jest.spyOn(authService, 'verifyToken')
                .mockReturnValueOnce(Promise.resolve(true));
            const response = await request(app).delete(`/api/leagues/team/${leagueFromDb._id}/${teamFromDb._id}`)
                .set('Cookie', `token=${userFromDb.token}`)
            expect(response.statusCode).toBe(400);
        });
    })
    afterAll(async (done) => {
        await mongoose.connection.close();
        done();
    })
})