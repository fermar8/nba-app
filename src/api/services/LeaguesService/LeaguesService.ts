import { tokenRepository, userRepository, leaguesRepository } from '../../repositories';

class LeaguesService {
    UserRepository: typeof userRepository;
    TokenRepository: typeof tokenRepository;
    LeaguesRepository: typeof leaguesRepository;
    constructor(UserRepository: typeof userRepository, TokenRepository: typeof tokenRepository, LeaguesRepository: typeof leaguesRepository) {
        this.UserRepository = UserRepository,
            this.TokenRepository = TokenRepository,
            this.LeaguesRepository = LeaguesRepository
    }

    addTeamToLeague = async (headersToken: string, leagueId: string, name: string, players: string[]) => {
        const user = await this.UserRepository.findUserByToken(headersToken);
        return this.LeaguesRepository.addTeamToLeague(user._id, leagueId, name, players);
    }

    createLeague = async (headersToken: string, name: string) => {
        const user = await this.UserRepository.findUserByToken(headersToken);
        return this.LeaguesRepository.createLeague(user._id, name);
    }

    checkIfUserIsLeagueAdmin = async (userId: string, leagueId: string) => {
        const league = await this.getLeagueById(leagueId);
        if (league.admin.toString() === userId.toString()) {
            return true;
        } else {
            return false;
        }
    }

    checkIfUserIsOwner = async (userId: string, teamId: string) => {
        const team = await this.LeaguesRepository.getTeamById(teamId);
        if (team.user.toString() === userId.toString()) {
            return true;
        } else {
            return false;
        }
    }

    deleteTeamFromLeague = async (user: any, leagueId: string, teamId: string) => {
        await this.LeaguesRepository.deleteTeamFromLeague(user, leagueId, teamId);
    }

    getLeagues = async () => {
        return this.LeaguesRepository.getLeagues();
    }

    getLeagueById = async (leagueId: string) => {
        return this.LeaguesRepository.getLeagueById(leagueId);
    }

    getTeamsByUser = async (userId: string) => {
        return await this.LeaguesRepository.getTeamsByUser(userId);        
    }
}

const leaguesService = new LeaguesService(userRepository, tokenRepository, leaguesRepository);

export default leaguesService;