import mongoose from 'mongoose';


const PlayerValue = new mongoose.Schema(
    {
        displayName: { type: String, required: true },
        value: { type: String },
        increment: { type: String }
    },
    {
        collection: 'Player-Value',
        strict: false
    }
)

const model = mongoose.model('PlayerValue', PlayerValue)

export default model