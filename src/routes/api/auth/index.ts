import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt  from 'jsonwebtoken';

import  User from '../../../models/user';

export const authRouter = Router();

authRouter.post('/register', async (req: any, res: any) => {
	console.log('req', req);
	console.log(req.body)
	try {
		const newPassword = await bcrypt.hash(req.body.password, 10)
		await User.create({
			name: req.body.name,
			email: req.body.email,
			password: newPassword,
		})
		res.json({ status: 'ok' })
	} catch (err) {
		res.json({ status: 'error', error: 'Duplicate email' })
	}
});

authRouter.post('/login', async (req: any, res: any) => {
	const foundUser = await User.findOne({
		email: req.body.email,
	})

	if (!foundUser) {
		return { status: 'error', error: 'Invalid login' }
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

		return res.json({ status: 'ok', user: token })
	} else {
		return res.json({ status: 'error', user: false })
	}
});