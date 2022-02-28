import mongoose from 'mongoose';


const NbaTeam = new mongoose.Schema(
	{
		name: { type: String, required: true },
        code: { type: String, required: true }, 
		city: { type: String, required: true }   
    },
	{
		collection: 'Nba-Teams',
		strict: false
	}
)

const model = mongoose.model('NbaTeamData', NbaTeam)

export default model