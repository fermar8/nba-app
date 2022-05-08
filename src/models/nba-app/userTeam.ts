import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserTeam = new mongoose.Schema(
	{
		name: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
		league: { type: Schema.Types.ObjectId, required: true, ref: "League" },
        players: [{ type: Schema.Types.ObjectId, ref: "NbaPlayer" }],
	},
	{
		collection: 'teams',
		strict: false
	}
)

const model = mongoose.model('UserTeamData', UserTeam)

export default model