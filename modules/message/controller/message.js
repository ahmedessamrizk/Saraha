import { messageModel } from './../../../DB/models/message.model.js';
import { userModel } from './../../../DB/models/user.model.js';

export const sendMessage = async(req, res) => {
    try {
        const { text, receiverId } = req.body;
        const user = await userModel.findById(receiverId);
        if (user) {
            const newMessage = new messageModel({ text, receiverId });
            const savedMessage = await newMessage.save();
            res.json({message: "Done", savedMessage})
        } else {
            res.json({message: "Invalid receiver ID"})
        }
    } catch (error) {
        res.json({message: "catch erro", error})
    }
}

export const deleteMessage = async(req, res) => {
    try {
        const { id } = req.params;
        const message = await messageModel.updateOne({_id: id, receiverId: req.user._id}, {softDeleted: true});
        message.modifiedCount? res.json({message: "Done"}) : res.json({message: "Not auth or invalid message"});
    } catch (error) {
        res.json({message: "catch error", error})
    }
}
