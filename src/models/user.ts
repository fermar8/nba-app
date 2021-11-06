import mongoose from 'mongoose';

const User = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		createdAt: { type: Number },
		token: { type: String }
	},
	{
		collection: 'user-data',
		strict: false
	}
)

const model = mongoose.model('UserData', User)

export default model
