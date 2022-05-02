import dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cron from 'node-cron';
import { NbaDataService } from './src/api/services';



import { authRouter } from './src/api/routes/auth';

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

//'*/2 * * * *'
//'0 0 */8 * * *'
cron.schedule('*/2 * * * *', async function () {
    try {
        await NbaDataService.buildAndSaveAllPlayers();
        await NbaDataService.buildAndSavePlayerSeasonStats();
        await NbaDataService.buildAndSaveLast5GamesStats();
        await NbaDataService.buildAndSaveAllGamesByPlayer();
        await NbaDataService.buildAndSaveAllPlayerStats();
        await NbaDataService.buildAndSaveInjuryReports();
        console.log('All nba data updated successfully in DB');
        console.log('Task running every 8 hours');
    } catch (err: any) {
        console.log('Could not update nba data', err)
    }
})


export default app;