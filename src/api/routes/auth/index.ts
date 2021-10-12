import { env } from '../../../../config';
import { Router, Request, Response } from 'express'
import bcrypt from 'bcrypt';
import jwt  from 'jsonwebtoken';
import { UserType, UserTypeExtended } from './types';
import  User from '../../../models/user';

export const authRouter = Router();

authRouter.post('/register', async (req: Request, res: Response) => {
		const newPassword:string = await bcrypt.hash(req.body.password, 10);
		const userDataJWT:UserType = {
			name: req.body.name,
			email: req.body.email
		}
		const token:string = jwt.sign(
			{ userDataJWT },
			env.JWT_SESSION as string, { expiresIn: '7d' }
		)
		const user:UserTypeExtended = {
			name: req.body.name,
			email: req.body.email,
			password: newPassword,
			token,
			createdAt: Date.now()
		}
		try {
		await User.create({ 
			name: user.name,
			email: user.email,
			password: user.password,
			token: user.token,
			createdAt: user.createdAt 
		})
		res.status(200);
		res.cookie('token', token, {
			sameSite: 'strict',
			path: '/',
			expires: new Date(new Date().setDate(new Date().getDate() + 7)),
			httpOnly: true
		})
		.json({ status: 'ok', message: 'cookie initialized' })
	} catch (err) {
		res.status(400).json({ status: 'error', error: 'Email already in use', err })
	}
});

authRouter.post('/login', async (req: any, res: any) => {
	const foundUser = await User.findOne({
		email: req.body.email,
	})

	if (!foundUser) {
		return res.status(400).json({ status: 'error', error: 'Invalid login' })
	}

	const isPasswordValid = await bcrypt.compare(
		req.body.password,
		foundUser.password
	)

	if (isPasswordValid) {
		const token = jwt.sign(
			{
				name: foundUser.name,
				email: foundUser.email,
			},
			'secret123'
		)

		return res.status(200).json({ status: 'ok', userToken: token })
	} else {
		return res.status(400).json({ status: 'error', userToken: false, error: 'Invalid login' })
	}
});