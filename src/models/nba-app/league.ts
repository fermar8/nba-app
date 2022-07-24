import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const teamValidators = [
	{ validator: arrayLimit, msg: 'League exceeds the limit of 10 teams' }
]

const League = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true },
		admin: { type: Schema.Types.ObjectId, ref: "User" },
		teams: {
			type: [{ type: Schema.Types.ObjectId, ref: "UserTeam" }],
			validate: teamValidators
		},
		isPrivate: { type: Boolean }
	},
	{
		collection: 'leagues',
		strict: false
	}
)

function arrayLimit(val: any) {
	return val.length <= 10;
}

const model = mongoose.model('Leagues', League)

export default model