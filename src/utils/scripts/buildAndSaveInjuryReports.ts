import mongoose from 'mongoose';
import axios from 'axios';
import { buildOptions } from '../../api/services/NbaDataService/options/buildOptions.js';
import NbaPlayer from '../../models/nba-data/nbaPlayer.js';
import PlayerInjuryReport from '../../models/nba-data/playerInjuryReport.js';
import { env } from '../../../config.js';

mongoose.connect(env.MONGODB_URI as string || 'mongodb://localhost:27017/nba-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const run = async () => {

    // node --loader ts-node/esm --experimental-json-modules ./buildAndSaveInjuryReports.ts
        try {
            await PlayerInjuryReport.deleteMany();
            const options = buildOptions('https://www.rotowire.com/basketball/tables/injury-report.php?team=ALL&pos=ALL');
            const response = await axios.request(options);
            const reportsToDb = [];
            for (const report of response.data) {
                const newReport = {
                    displayName: report.player,
                    injury: report.injury,
                    status: report.status
                }
                reportsToDb.push(newReport);
            }
            await PlayerInjuryReport.insertMany(reportsToDb);
            await saveInjuryReportToPlayer();
        } catch (error) {
            console.log(error)
        }
}

const saveInjuryReportToPlayer = async () => {
    const injuryReports = PlayerInjuryReport.find();

    for (const report of injuryReports ) {
        await NbaPlayer.findOneAndUpdate({ displayName: report.displayName } , { $set: { injuryReport: report._id } })
    }
}

run();