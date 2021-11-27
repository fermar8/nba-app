import request from 'supertest';
import app from '../../../../../app';
import mongoose from 'mongoose';
import User from '../../../../models/user';
const databaseName = 'login-test';
const url = `mongodb://localhost:27017/${databaseName}`;


describe("post api/auth/login", () => {
    const mockUser = {
        name: 'aUser',
        email: 'anEmail',
        password: '123456'
    }
    const mockLogin = {
        email: 'anEmail',
        password: '123456'
    }
    const mockFailLogin = {
        email: 'wrongEmail',
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
        await User.deleteMany();
    });
    beforeEach(async () => {
        await request(app).post('/api/auth/register').send(mockUser);
    })
    afterEach(async () => {
        await User.deleteMany();
    })
    describe("success cases", () => {
        test("respond with a 200 status if user logs in and cookie is sent", async () => {
            const response = await request(app).post('/api/auth/login').send(mockLogin);
            const user = await User.findOne({ email: 'anEmail' });
            expect(response.statusCode).toBe(200);
            expect(user.token).toBeTruthy();
        });
        test("save token in database", async () => {
            const expectedUser = mockUser;
            await request(app).post('/api/auth/login').send(mockLogin);
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
            const response = await request(app).post('/api/auth/login').send(mockLogin);
            expect(response.header).toHaveProperty('set-cookie');
        });
    })
    describe("failure cases", () => {
        test("respond with a 400 status if user login fails", async () => {
            const response = await request(app).post('/api/auth/login').send(mockFailLogin);
            expect(response.statusCode).toBe(400);
        });
    })
    afterAll(async (done) => {
        await User.deleteMany()
        await mongoose.connection.close();
        done();
    })
})