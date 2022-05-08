import { env } from '../../../../config';
import { Router, Request, Response } from 'express';
import { AuthService, LeaguesService, ResponsesService } from '../../services';
// import { UserData } from '../../types/auth';

export const leaguesRouter = Router();

leaguesRouter.post('/league', async (req: Request, res: Response) => {
	try {
		const headersToken: string = await AuthService.sliceToken(req);
		const isTokenValid = await AuthService.verifyToken(headersToken, env.JWT_SECRET as string);

        if (isTokenValid) {
            const createdTeam = await LeaguesService.createLeague(headersToken, req);
            await ResponsesService.sendOkPost('League created successfully', res, createdTeam);
        } else {
            await ResponsesService.sendBadRequestResponse('User token is not valid', res);
        }
	} catch (err: any) {
		await ResponsesService.sendUnexpectedErrorResponse('User creation failed', err.message, res);
	}
});