import { env } from '../../../../config';
import { Router, Request, Response } from 'express'
import AuthService from '../../../middlewares/auth/AuthService';
import ResponsesService from '../../../middlewares/responses/ResponsesService';
import { UserData } from './types';

export const authRouter = Router();

authRouter.post('/register', async (req: Request, res: Response) => {
	const userData: UserData = await AuthService.getUserData(req);
	const hashedPassword: string = await AuthService.createPassword(userData.password);
	const signedToken: string = await AuthService.signToken(userData, env.JWT_SECRET as string);
	try {
		await AuthService.createUser(userData, hashedPassword, signedToken);
		await AuthService.sendCookie(signedToken, res);
	} catch (err) {
		await ResponsesService.sendBadRequestResponse('User creation failed', err, res);
	}
});

authRouter.post('/login', async (req: Request, res: Response) => {
	try {
		const userData: UserData = await AuthService.findUserByEmail(req);
		const isPasswordValid = await AuthService.validatePassword(req.body.password, userData.password);
		if (isPasswordValid) {
			const signedToken: string = await AuthService.signToken(userData, env.JWT_SECRET as string);
			await AuthService.updateTokenByEmail(userData.email, signedToken, res);
		} 
	} catch (err) {
		await ResponsesService.sendBadRequestResponse('Invalid Login', err, res);
	}
});

authRouter.post('/refresh', async (req: Request, res: Response) => {
	try {
		const headersToken = await AuthService.sliceToken(req);
		const isTokenValid = await AuthService.verifyToken(headersToken, env.JWT_SECRET as string);
		if (isTokenValid) {
			const userData: UserData = await AuthService.findUserByToken(headersToken);
			const refreshToken: string = await AuthService.signToken(userData, env.JWT_SECRET as string);
			await AuthService.updateTokenByToken(headersToken, refreshToken, res);
		}
	} catch (err) {
		await ResponsesService.sendUnexpectedErrorResponse('Unexpected error when refreshing token', err, res);
	}
});

authRouter.put('/logout', async (req: Request, res: Response) => {
	try {
		const headersToken = await AuthService.sliceToken(req);
		const isTokenValid = await AuthService.verifyToken(headersToken, env.JWT_SECRET as string);
		if (isTokenValid) {
			await AuthService.TokenController.deleteTokenFromDb(headersToken);
			await ResponsesService.sendOkNoContent('Token deleted and logged out successfully', res);
		}
	} catch (err) {
		await ResponsesService.sendUnexpectedErrorResponse('Unexpected error when logging out', err, res);
	}
})