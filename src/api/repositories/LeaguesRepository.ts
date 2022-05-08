// import UserTeam from '../../models/nba-app/userTeam';
import League from '../../models/nba-app/league';
import { Request } from 'express';

class LeaguesRepository {

    createLeague = async (user: any, req: Request) => {
        const { name, password, isPrivate } = req.body;
        const newLeague = {
            name,
            admin: user._id,
            password: password || null,
            isPrivate
        };

        const leagueToDb = await League.create(newLeague);
        return leagueToDb;
     }
}

const leaguesRepository = new LeaguesRepository();

export default leaguesRepository;