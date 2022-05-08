import request from 'supertest';
import app from '../../../../../app';
import mongoose from 'mongoose';
import User from '../../../../models/nba-app/user';
const databaseName = 'register-test';
const url = `mongodb://localhost:27017/${databaseName}`;

describe("post api/auth/register", () => {
    const mockUser = {
        name: 'aName',
        email: 'anEmail',
        password: '123456',
    }
    const mockFailUser = {
        name: 'aName',
        password: '123456',
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
    afterEach(async () => {
        await User.deleteMany()
    })
    describe("success cases", () => {
        test("respond with a 200 status if user registers and cookie is sent", async () => {
            const response = await request(app).post('/api/auth/register').send(mockUser);
            expect(response.statusCode).toBe(200);
        });
        test("save user to database", async () => {
            const expectedUser = mockUser;
            await request(app).post('/api/auth/register').send(mockUser);
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
            expect(response.statusCode).toBe(404);
        });
    })
    afterAll(async (done) => {
        await mongoose.connection.close();
        done();
    })
})