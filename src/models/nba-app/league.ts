import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const League = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true },
        admin: { type: String, required: true },
		teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
	},
	{
		collection: 'leagues',
		strict: false
	}
)

const model = mongoose.model('LeagueData', League)

export default model