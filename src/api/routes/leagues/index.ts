import { env } from '../../../../config';
import { Router, Request, Response } from 'express';
import { AuthService, LeaguesService, ResponsesService } from '../../services';
// import { UserData } from '../../types/auth';

export const leaguesRouter = Router();

leaguesRouter.get('/', async (req: Request, res: Response) => {
	try {
		const headersToken: string = await AuthService.sliceToken(req);
		const isTokenValid = await AuthService.verifyToken(headersToken, env.JWT_SECRET as string);

        if (isTokenValid) {
            const allLeagues = await LeaguesService.getLeagues();
            await ResponsesService.sendOkPost('Leagues retrieved successfully', res, allLeagues);
        } else {
            await ResponsesService.sendBadRequestResponse('User token is not valid', res);
        }
	} catch (err: any) {
		await ResponsesService.sendUnexpectedErrorResponse('Error while retrieving leagues', err.message, res);
	}
});

leaguesRouter.get('/:id', async (req: Request, res: Response) => {
	try {
		const headersToken: string = await AuthService.sliceToken(req);
		const isTokenValid = await AuthService.verifyToken(headersToken, env.JWT_SECRET as string);

        const { id } = req.params;

        if (isTokenValid) {
            const league = await LeaguesService.getLeagueById(id);
            await ResponsesService.sendOkPost('League retrieved successfully', res, league);
        } else {
            await ResponsesService.sendBadRequestResponse('User token is not valid', res);
        }
	} catch (err: any) {
		await ResponsesService.sendUnexpectedErrorResponse('Error while retrieving league', err.message, res);
	}
});
leaguesRouter.post('/', async (req: Request, res: Response) => {
	try {
		const headersToken: string = await AuthService.sliceToken(req);
		const isTokenValid = await AuthService.verifyToken(headersToken, env.JWT_SECRET as string);

        if (isTokenValid) {
            const { name } = req.body;
            const createdTeam = await LeaguesService.createLeague(headersToken, name);
            await ResponsesService.sendOkPost('League created successfully', res, createdTeam);
        } else {
            await ResponsesService.sendBadRequestResponse('User token is not valid', res);
        }
	} catch (err: any) {
		await ResponsesService.sendUnexpectedErrorResponse('League creation failed', err.message, res);
	}
});

leaguesRouter.post('/team/:id', async (req: Request, res: Response) => {
	try {
		const headersToken: string = await AuthService.sliceToken(req);
		const isTokenValid = await AuthService.verifyToken(headersToken, env.JWT_SECRET as string);
        const { id } = req.params;
        const { name, players } = req.body;

        if (isTokenValid) {
            const league = await LeaguesService.addTeamToLeague(headersToken, id, name, players);
            await ResponsesService.sendOkPost('User joined the league', res, league);
        } else {
            await ResponsesService.sendBadRequestResponse('User token is not valid', res);
        }
	} catch (err: any) {
		await ResponsesService.sendUnexpectedErrorResponse('User could not join the league', err.message, res);
	}
});


leaguesRouter.delete('/team/:leagueId/:teamId', async (req: Request, res: Response) => {
	try {
		const headersToken: string = await AuthService.sliceToken(req);
		const isTokenValid = await AuthService.verifyToken(headersToken, env.JWT_SECRET as string);
        const user = await AuthService.findUserByToken(headersToken);
        const { leagueId } = req.params;
        const { teamId } = req.params;
        const isAdmin = await LeaguesService.checkIfUserIsLeagueAdmin(user._id, leagueId);
        const isOwnerOfTeam = await LeaguesService.checkIfUserIsOwner(user._id, teamId);

        if ((isTokenValid && isAdmin) || (isTokenValid && isOwnerOfTeam)) {
            await LeaguesService.deleteTeamFromLeague(user, leagueId, teamId);
            await ResponsesService.sendOkNoContent('User deleted from the league', res);
        } else {
            await ResponsesService.sendBadRequestResponse('User token is not valid, user is not admin or owner of the team', res);
        }
	} catch (err: any) {
		await ResponsesService.sendUnexpectedErrorResponse('Could not delete user from league', err.message, res);
	}
});