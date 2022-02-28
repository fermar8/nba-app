import dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';


import { authRouter } from './src/api/routes/auth';
import { nbaData } from './src/api/routes/nbaData';

try {
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nba-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});
} catch (error) {
    console.log('Error connecting to mongo', error)
}

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRouter);
app.use('/api/nbadata', nbaData);


export default app;