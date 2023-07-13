import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    text: { type: String, required: true },
    receiverId: { type:mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    softDeleted: { type: Boolean, default: false }
},
{
    timestamps: true
})

export const messageModel = mongoose.model('Message', messageSchema);