import request from 'supertest';
import app from '../../../../../app';
import mongoose from 'mongoose';
import {
    NbaTeam,
    NbaPlayer,
    PlayerStats,
    PlayerStatsPerGame,
    PlayerStatsLast5,
    PlayerSingleGame
} from '../../../../models/nba-data';
const databaseName = 'nba-data-update-test';
const url = `mongodb://localhost:27017/${databaseName}`;

describe("post api/nbadata/nbadataupdate", () => {
    beforeAll(async () => {
        await mongoose.disconnect();
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
    });
    afterEach(async () => {
        await NbaTeam.deleteMany()
        await NbaPlayer.deleteMany()
        await PlayerStats.deleteMany()
        await PlayerStatsPerGame.deleteMany()
        await PlayerStatsLast5.deleteMany()
        await PlayerSingleGame.deleteMany()
    })
    describe("success cases", () => {
        test("respond with a 201 status if all data is successfully stored in db", async () => {
            const response = await request(app).post('/api/nbadata/nbadataupdate');
            expect(response.statusCode).toBe(201);
        });
        test("save all data to db", async () => {

            await request(app).post('/api/nbadata/nbadataupdate');
            const user = await User.findOne({ email: 'anEmail' });
            expect(user.toJSON()).toEqual(expect.objectContaining({
                _id: expect.anything(),
                name: expectedUser.name,
                email: expectedUser.email,
                password: expect.stringContaining(''),
                createdAt: expect.any(Number),
                token: expect.stringContaining(''),
                __v: expect.any(Number)
            }))
        })
        test("send token as cookie in response headers", async () => {
            const response = await request(app).post('/api/auth/register').send(mockUser);
            expect(response.header).toHaveProperty('set-cookie');
        });
    })
    describe("failure cases", () => {
        test("respond with a 400 status if user registration fails", async () => {
            const response = await request(app).post('/api/auth/register').send(mockFailUser);
            expect(response.statusCode).toBe(400);
        });
    })
    afterAll(async (done) => {
        await mongoose.connection.close();
        done();
    })
})