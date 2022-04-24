import mongoose from 'mongoose';
import PlayerSingleGame from '../../models/nba-data/playerSingleGame.js';
import { env } from '../../../config.js';

mongoose.connect(env.MONGODB_URI as string || 'mongodb://localhost:27017/nba-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const run = async () => {

    // node --loader ts-node/esm --experimental-json-modules ./searchByDate.ts

    try {
       const endDate = new Date('2022-04-10').toISOString().slice(0, 10)
       const startDate = new Date('2022-04-10')
       startDate.setDate(startDate.getDate() - 7);

       const begDate = startDate.toISOString().slice(0, 10);

     console.log('DATE', endDate);
     console.log('finalDate', begDate);

       const result = await PlayerSingleGame.find({ gameDate: {
            $gte: begDate,
            $lte: endDate
       }
    })

        console.log('result', result);
        
    } catch (error) {
        console.log(error)
    }
}

run();