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
import { Request } from 'express';

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

    createLeague = async (headersToken: string, req: Request) => {
        const user = await this.UserRepository.findUserByToken(headersToken);
        return this.LeaguesRepository.createLeague(user, req);
    }
}

const leaguesService = new LeaguesService(userRepository, tokenRepository, leaguesRepository);

export default leaguesService;