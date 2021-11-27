import mongoose from 'mongoose';

const Player = new mongoose.Schema(
	{
        playerId: { type: String, required: true, unique: true },
		teamId: { type: String, required: true },
		firstName: { type: String },
        lastName: { type: String },
	},
	{
		collection: 'players',
		strict: false
	}
)

const model = mongoose.model('PlayerData', Player)

export default model