import mongoose from 'mongoose';
import Player from '../../models/player.js';
import AtlantaHawks from '../rosters/AtlantaHawks.json';
import { env } from '../../../config.js';
// import BostonCeltics from '../rosters/BostonCeltics.json';
// import BrooklynNets from '../rosters/BrooklynNets.json';
// import CharlotteHornets from '../rosters/CharlotteHornets.json';
// import ChicagoBulls from '../rosters/ChicagoBulls.json';
// import ClevelandCavaliers from '../rosters/ClevelandCavaliers.json';
// import DallasMavericks from '../rosters/DallasMavericks.json';
// import DenverNuggets from '../rosters/DenverNuggets.json';
// import DetroitPistons from '../rosters/DetroitPistons.json';
// import GoldenStateWarriors from '../rosters/GoldenStateWarriors.json';
// import HoustonRockets from '../rosters/HoustonRockets.json';
// import IndianaPacers from '../rosters/IndianaPacers.json';
// import LAClippers from '../rosters/LAClippers.json';
// import LosAngelesLakers from '../rosters/LosAngelesLakers.json';
// import MemphisGrizzlies from '../rosters/MemphisGrizzlies.json';
// import MiamiHeat from '../rosters/MiamiHeat.json';
// import MilwaukeeBucks from '../rosters/MilwaukeeBucks.json';
// import MinnesotaTimberwolves from '../rosters/MinnesotaTimberwolves.json';
// import NewOrleansPelicans from '../rosters/NewOrleansPelicans.json';
// import NewYorkKnicks from '../rosters/NewYorkKnicks.json';
// import OKC from '../rosters/OklahomaCityThunder.json';
// import OrlandoMagic from '../rosters/OrlandoMagic.json';
// import Philadelphia76ers from '../rosters/Philadelphia76ers.json';
// import PhoenixSuns from '../rosters/PhoenixSuns.json';
// import PortlandTrailBlazers from '../rosters/PortlandTrailBlazers.json';
// import SacramentoKings from '../rosters/SacramentoKings.json';
// import SanAntonioSpurs from '../rosters/SanAntonioSpurs.json';
// import TorontoRaptors from '../rosters/TorontoRaptors.json';
// import UtahJazz from '../rosters/UtahJazz.json';
// import WashingtonWizards from '../rosters/WashingtonWizards.json';



mongoose.connect(env.MONGODB_URI as string || 'mongodb://localhost:27017/nba-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const createPlayersForTeam = async (team: Array<object>) => {
    try {
        console.log(AtlantaHawks)
           await Player.insertMany(team);
        console.log('Players for team created successfully');
        await mongoose.connection.close();
    } catch (err) {
        console.log(err)
    }
    
}

createPlayersForTeam(AtlantaHawks);