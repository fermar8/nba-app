import mongoose from 'mongoose';

const NbaPlayer = new mongoose.Schema(
	{
		displayName: { type: String, required: true },
		code: { type: String, required: true },
      	team: { type: mongoose.Schema.Types.ObjectId, ref: "NbaTeam", required: true },
		stats: { type: mongoose.Schema.Types.ObjectId, ref: "PlayerStats" },
		playerValue: { type: mongoose.Schema.Types.ObjectId, ref: "PlayerValue"}
	},
    {
​        collection: 'Nba-Players',
​        strict: false
​   }
)

const model = mongoose.model('NbaPlayer', NbaPlayer)

export default model