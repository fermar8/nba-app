import { env } from '../../../../config';
import { Router, Request, Response } from 'express';
import { AuthService, ResponsesService, SendGridService } from '../../services';
import { UserBasic, UserComplete, UserToFront } from '../../types/auth';

export const authRouter = Router();

authRouter.post('/register', async (req: Request, res: Response) => {
	try {
		const userData: UserBasic = await AuthService.getUserData(req);
		const hashedPassword: string = await AuthService.createPassword(userData.password);
		const signedTokens: { [key: string]: string; } = await AuthService.signTokens(userData, env.JWT_SECRET as string);

		await AuthService.createUser(userData, hashedPassword, signedTokens);
		await AuthService.sendCookiesAndUser(signedTokens, res);
	} catch (err: any) {
		await ResponsesService.sendUnexpectedErrorResponse('User creation failed', err.message, res);
	}
});

authRouter.post('/login', async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body
		const userData: UserComplete = await AuthService.findUserByEmail(email);
		const isPasswordValid = await AuthService.validatePassword(password, userData.password);
		if (isPasswordValid) {
			const signedTokens: { [key: string]: string; } = await AuthService.signTokens(userData, env.JWT_SECRET as string);
			await AuthService.updateTokenByEmail(userData.email, signedTokens, res);
		} else {
            await ResponsesService.sendBadRequestResponse('Password is not valid', res);
        }
	} catch (err: any) {
		await ResponsesService.sendUnexpectedErrorResponse('Invalid Login', err.message, res);
	}
});

authRouter.put('/me', async (req: Request, res: Response) => {
	try {
		const dbCookie: string = await AuthService.getCookieByName(req.headers.cookie, 'dbToken');
		const isTokenValid = await AuthService.verifyToken(dbCookie, env.JWT_SECRET as string);
		const userData: UserToFront = await AuthService.findUserByToken(dbCookie);

		if (isTokenValid && userData) {
			const refreshTokens: { [key: string]: string; } = await AuthService.signTokens(userData, env.JWT_SECRET as string);
			await AuthService.updateTokenByToken(dbCookie, refreshTokens, res);
		} else {
            await ResponsesService.sendBadRequestResponse('User token is not valid', res);
        }
	} catch (err: any) {
		await ResponsesService.sendUnexpectedErrorResponse('Could not retrieve user', err.message, res);
	}
});

authRouter.put('/logout', async (req: Request, res: Response) => {
	try {
		const dbCookie: string = await AuthService.getCookieByName(req.headers.cookie, 'dbToken');
		const isTokenValid = await AuthService.verifyToken(dbCookie, env.JWT_SECRET as string);
		if (isTokenValid) {
			await AuthService.TokenRepository.deleteTokenFromDb(dbCookie);
			await ResponsesService.sendOkNoContent('Token deleted and logged out successfully', res);
		} else {
            await ResponsesService.sendBadRequestResponse('User token is not valid', res);
        }
	} catch (err: any) {
		await ResponsesService.sendUnexpectedErrorResponse('Could not log out', err.message, res);
	}
});

authRouter.delete('/delete', async (req: Request, res: Response) => {
	try {
		const dbCookie: string = await AuthService.getCookieByName(req.headers.cookie, 'dbToken');
		const isTokenValid = await AuthService.verifyToken(dbCookie, env.JWT_SECRET as string);
		if (isTokenValid) {
			await AuthService.deleteUser(dbCookie);
			await ResponsesService.sendOkNoContent('User deleted from DB', res);
		} else {
            await ResponsesService.sendBadRequestResponse('User token is not valid', res);
        }
	} catch (err: any) {
		await ResponsesService.sendUnexpectedErrorResponse('Could not delete user', err.message, res);
	}
});

authRouter.post('/forgotpassword', async (req: Request, res: Response) => {
	try {
		const { email } = req.body;
		const userData: UserComplete = await AuthService.findUserByEmail(email);
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
		await ResponsesService.sendUnexpectedErrorResponse('Operation could not be fulfilled', err.message, res);
	}
})

authRouter.post('/resetpassword', async (req: Request, res: Response) => {
	try {
		await AuthService.resetPassword(req.body.email, req.body.password);
		await ResponsesService.sendOkPost('Password reset successful', res);
	} catch (err: any) {
		await ResponsesService.sendUnexpectedErrorResponse('Could not reset password', err.message, res);
	}
})