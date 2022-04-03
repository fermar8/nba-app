import mongoose from 'mongoose';


const PlayerStats = new mongoose.Schema(
    {
        perGame: { type: mongoose.Schema.Types.ObjectId, ref: "PlayerStatsPerGame" },
        lastFive: { type: mongoose.Schema.Types.ObjectId, ref: "PlayerStatsLast5" },
        games: [{ type: mongoose.Schema.Types.ObjectId, ref: "PlayerSingleGame" }]
    },
    {
        collection: 'Player-Stats',
    }
)

const model = mongoose.model('PlayerStats', PlayerStats)

export default model