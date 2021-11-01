import { env } from '../../../../config';
import { Router, Request, Response } from 'express'
import AuthService from '../../../services/AuthService';
import SendGridService from '../../../services/SendGridService';
import ResponsesService from '../../../services/ResponsesService';
import { UserData } from './types';

export const authRouter = Router();

authRouter.post('/register', async (req: Request, res: Response) => {
	const userData: UserData = await AuthService.getUserData(req);
	const hashedPassword: string = await AuthService.createPassword(userData.password);
	const signedToken: string = await AuthService.signToken(userData, env.JWT_SECRET as string);
	try {
		await AuthService.createUser(userData, hashedPassword, signedToken);
		await AuthService.sendCookie(signedToken, res);
	} catch (err: any) {
		await ResponsesService.sendBadRequestResponse('User creation failed', err.message, res);
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
	} catch (err: any) {
		await ResponsesService.sendBadRequestResponse('Invalid Login', err.message, res);
	}
});

authRouter.put('/refresh', async (req: Request, res: Response) => {
	try {
		const headersToken: string = await AuthService.sliceToken(req);
		const isTokenValid = await AuthService.verifyToken(headersToken, env.JWT_SECRET as string);
		if (isTokenValid) {
			const userData: UserData = await AuthService.findUserByToken(headersToken);
			const refreshToken: string = await AuthService.signToken(userData, env.JWT_SECRET as string);
			await AuthService.updateTokenByToken(headersToken, refreshToken, res);
		}
	} catch (err: any) {
		await ResponsesService.sendUnexpectedErrorResponse('Could not refresh token', err.message, res);
	}
});

authRouter.put('/logout', async (req: Request, res: Response) => {
	try {
		const headersToken: string = await AuthService.sliceToken(req);
		const isTokenValid = await AuthService.verifyToken(headersToken, env.JWT_SECRET as string);
		if (isTokenValid) {
			await AuthService.TokenController.deleteTokenFromDb(headersToken);
			await ResponsesService.sendOkNoContent('Token deleted and logged out successfully', res);
		}
	} catch (err: any) {
		await ResponsesService.sendUnexpectedErrorResponse('Could not log out', err.message, res);
	}
});

authRouter.post('/forgotpassword', async (req: Request, res: Response) => {
	try {
		const userData: UserData = await AuthService.findUserByEmail(req);
		if (userData && userData.email) {
			await SendGridService.sendForgotPasswordEmail(
				userData.email,
				env.SENDGRID_API_KEY as string,
				env.SENDGRID_EMAIL as string,
				res);
		} else {
			throw new Error ('Could not find user matching email');
		}
	} catch (err: any) {
		await ResponsesService.sendBadRequestResponse('Operation could not be fulfilled', err.message, res);
	}
})