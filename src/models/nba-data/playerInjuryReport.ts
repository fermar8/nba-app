import mongoose from 'mongoose';


const PlayerInjuryReport = new mongoose.Schema(
    {
        displayName: { type: String, required: true },
        injury: { type: String },
        status: { type: String }
    },
    {
        collection: 'Player-Injury-Report',
        strict: false
    }
)

const model = mongoose.model('PlayerInjuryReport', PlayerInjuryReport);

export default model