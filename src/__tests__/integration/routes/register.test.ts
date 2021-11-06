import request from 'supertest';
import app from '../../../../app';
import mongoose from 'mongoose';
import User from '../../../models/user';
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
        test("should respond with a 200 status if user registers and cookie is sent", async () => {
            const response = await request(app).post('/api/auth/register').send(mockUser);
            expect(response.statusCode).toBe(200);
        });
        test("should save user to database", async () => {
            const expectedUser = mockUser;
            await request(app).post('/api/auth/register').send(mockUser);
            const user = await User.findOne({ email: 'anEmail' });
            expect(user.name).toEqual(expectedUser.name);
            expect(user.email).toEqual(expectedUser.email);
            expect(user.password).toBeTruthy();
        });
    })
    describe("failure cases", () => {
        test("should respond with a 400 status if user registration fails", async () => {
            const response = await request(app).post('/api/auth/register').send(mockFailUser);
            expect(response.statusCode).toBe(400);
        });
    })
    afterAll(async (done) => {
        await mongoose.connection.close();
        done();
    })
})