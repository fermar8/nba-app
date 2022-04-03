import mongoose from 'mongoose';


const PlayerStatsLast5 = new mongoose.Schema(
	{
		displayName: { type: String, required: true },  
    },
	{
		collection: 'Player-Stats-Last-Five',
		strict: false
	}
)

const model = mongoose.model('PlayerStatsLast5', PlayerStatsLast5)

export default model