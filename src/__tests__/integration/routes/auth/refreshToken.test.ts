import request from 'supertest';
import app from '../../../../../app';
import mongoose from 'mongoose';
import User from '../../../../models/user';
import authService from '../../../../api/services/AuthService';
const databaseName = 'refreshToken-test';
const url = `mongodb://localhost:27017/${databaseName}`;


describe("post api/auth/refresh", () => {
    const mockUser = {
        name: 'aUser',
        email: 'anEmail',
        password: '123456',
        createdAt: Date.now(),
        token: 'aToken'
    }
    beforeAll(async () => {
        await mongoose.disconnect();
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        await User.deleteMany();
    });
    beforeEach(async () => {
        await User.create(mockUser)
    })
    afterEach(async () => {
        await User.deleteMany();
    })
    describe("success cases", () => {
        jest.mock('../../../../api/services/AuthService');

        jest.spyOn(authService, 'verifyToken')
            .mockReturnValue(Promise.resolve({name: "aName", email: 'anEmail'}));

        test("respond with a 200 status if refresh token is successful", async () => {
            const user = await User.findOne({ email: 'anEmail' });
            const response = await request(app).put('/api/auth/refresh').set('Cookie', `token=${user.token}`);
            expect(response.statusCode).toBe(200);
            expect(user.token).toBeTruthy();
        });
        test("save refreshed token to database", async () => {
            const user = await User.findOne({ email: 'anEmail' });
            await request(app).put('/api/auth/refresh').set('Cookie', `token=${user.token}`);
            const userAfterRefresh = await User.findOne({ email: 'anEmail' });
            expect(userAfterRefresh.toJSON()).toEqual(expect.objectContaining({
                _id: expect.anything(),
                name: user.name,
                email: user.email,
                password: expect.stringContaining(''),
                createdAt: expect.any(Number),
                token: expect.not.stringMatching(user.token),
                __v: expect.any(Number)
            }))
        })
        test("send refreshed token as cookie in response headers", async () => {
            const user = await User.findOne({ email: 'anEmail' });
            const response = await request(app).put('/api/auth/refresh').set('Cookie', `token=${user.token}`);
            expect(response.header).toHaveProperty('set-cookie');
        });
    })
    describe("failure cases", () => {
        test("should respond with a 404 status if refresh fails", async () => {
            const response = await request(app).put('/api/auth/refresh').set('token', 'anInvalidToken');
            expect(response.statusCode).toBe(404);
        });
    })
    afterAll(async (done) => {
        await User.deleteMany()
        await mongoose.connection.close();
        done();
    })
})
