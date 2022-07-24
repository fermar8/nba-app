/* import axios from 'axios';
import { ObjectId } from 'mongoose';
import { env } from '../../../../config';

import {
    NbaTeam,
    NbaPlayer,
    PlayerInjuryReport,
    PlayerStats,
    PlayerStatsPerGame,
    PlayerStatsLast5,
    PlayerSingleGame
} from '../../../models/nba-data';

import {
    NbaPlayerType,
    NbaTeamType,
    PlayerPerGameStatsNewType,
    PlayerLastFiveNewType,
    PlayerSingleGameNewType,
    PlayerPerGameStatsDbType,
    PlayerLastFiveDbType,
    PlayerSingleGameDbType
} from '../../types/nbaData'; */
import { tokenRepository, userRepository, leaguesRepository } from '../../repositories';
// import { Request } from 'express';

class LeaguesService {
    UserRepository: typeof userRepository;
    TokenRepository: typeof tokenRepository;
    LeaguesRepository: typeof leaguesRepository;
    constructor(UserRepository: typeof userRepository, TokenRepository: typeof tokenRepository, LeaguesRepository: typeof leaguesRepository) {
        this.UserRepository = UserRepository,
            this.TokenRepository = TokenRepository,
            this.LeaguesRepository = LeaguesRepository
    }
    /* createTeam = async (headersToken: string, req: Request) => {
        const user = this.UserRepository.findUserByToken(headersToken);
        return user;
    } */


    addTeamToLeague = async (headersToken: string, leagueId: string, userTeam: any) => {
        const user = await this.UserRepository.findUserByToken(headersToken);
        console.log('user', user);
        return this.LeaguesRepository.addTeamToLeague(user._id, leagueId, userTeam);
    }

    createLeague = async (headersToken: string, name: string, isPrivate: boolean) => {
        const user = await this.UserRepository.findUserByToken(headersToken);
        return this.LeaguesRepository.createLeague(user._id, name, isPrivate);
    }

    checkIfUserIsLeagueAdmin = async (userId: string, leagueId: string) => {
        const league = await this.getLeagueById(leagueId);
        console.log('league', league);
        console.log('userId', userId);
        if (league.admin.toString() === userId.toString()) {
            console.log('heyhey');
            return true;
        } else {
            console.log('heyheyyyyyy');
            return false;
        }
    }

    checkIfUserIsOwner = async (userId: string, teamId: string) => {
        const team = await this.LeaguesRepository.getTeamById(teamId);
        console.log('teamId', teamId);
        console.log('userId', userId);
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
}

const leaguesService = new LeaguesService(userRepository, tokenRepository, leaguesRepository);

export default leaguesService;