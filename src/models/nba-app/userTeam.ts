import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserTeam = new mongoose.Schema(
	{
		name: { type: String, required: true },
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        players: [{ type: Schema.Types.ObjectId, ref: "NbaPlayer", required: true }],
		league: {type: Schema.Types.ObjectId, ref: "League", required: true }
	},
	{
		collection: 'teams',
		strict: false
	}
)

const model = mongoose.model('UserTeamData', UserTeam)

export default model