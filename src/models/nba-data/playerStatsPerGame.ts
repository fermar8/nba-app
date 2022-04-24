import mongoose from 'mongoose';


const PlayerStatsPerGame = new mongoose.Schema(
	{
		displayName: { type: String, required: true },
		nbaFantasyPts: { type: Number }
    },
	{
		collection: 'Player-Stats-Per-Game',
		strict: false
	}
)

const model = mongoose.model('PlayerStatsPerGame', PlayerStatsPerGame)

export default model