import mongoose from 'mongoose';

const NbaPlayer = new mongoose.Schema(
	{
		displayName: { type: String, required: true },
		code: { type: String, required: true },
      	team: { type: mongoose.Schema.Types.ObjectId, ref: "NbaTeam", required: true },
	},
    {
​        collection: 'Nba-Players',
​        strict: false
​   }
)

const model = mongoose.model('PlayerData', NbaPlayer)

export default model