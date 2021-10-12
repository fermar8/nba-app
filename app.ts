import dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser'


import { authRouter } from './src/api/routes/auth';

try {
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nba-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
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

app.listen(process.env.PORT || 4000, () => {
    console.log(`Server started on ${process.env.PORT}`)
});