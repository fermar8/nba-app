// import UserTeam from '../../models/nba-app/userTeam';
import League from '../../models/nba-app/league';
import User from '../../models/nba-app/user';
import UserTeam from '../../models/nba-app/userTeam';

class LeaguesRepository {

    createLeague = async (userId: string, name: string, isPrivate: boolean) => {
        const newLeague = {
            name,
            admin: userId,
            isPrivate
        };

        const leagueToDb = await League.create(newLeague);
        return leagueToDb;
    }

    addTeamToLeague = async (userId: string, leagueId: string, userTeam: any) => {
        const createdTeam = await UserTeam.create(userTeam);
        await User.findByIdAndUpdate(userId, { $push: { leagues: leagueId, teams: createdTeam._id } });
        await League.findByIdAndUpdate(leagueId, {$push: {teams: createdTeam._id }});
        return League.findById(leagueId);
    }

    deleteTeamFromLeague = async (user: any, leagueId: string, teamId: string) => {
        await UserTeam.findByIdAndDelete(teamId);
        await League.findByIdAndUpdate(leagueId, {$pull: {teams: teamId}});
        await User.findByIdAndUpdate(user._id, {$pull: {teams: teamId}});
    }

    getLeagues = async() => {
        return await League.find();
    }

    getLeagueById = async (leagueId: string) => {
        return await League.findById(leagueId);
    }

    getTeamById = async (teamId: string) => {
        return await UserTeam.findById(teamId);
    }



}

const leaguesRepository = new LeaguesRepository();

export default leaguesRepository;