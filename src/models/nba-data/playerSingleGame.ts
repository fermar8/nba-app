import mongoose from 'mongoose';


const PlayerSingleGame = new mongoose.Schema(
    {
        displayName: { type: String, required: true },
        gameDate: { type: String },
        nbaFantasyPts: { type: Number }
    },
    {
        collection: 'Player-Single-Game-Stats',
        strict: false
    }
)

const model = mongoose.model('PlayerSingleGame', PlayerSingleGame)

export default model