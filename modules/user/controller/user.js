import { userModel } from './../../../DB/models/user.model.js';
import  bcrypt  from 'bcryptjs';
import  jwt  from 'jsonwebtoken';
import { messageModel } from './../../../DB/models/message.model.js';

export const SignOut = async(req, res) => {
    try {
        const updatedUser = await userModel.updateOne({_id: req.user._id}, {isOnline: false});
        updatedUser.modifiedCount? res.json({ message: "Done" }) : res.json({message: "Fail to Sign out"});
    } catch (error) {
        res.json({ message: "catch error", error })
    }
}

export const updateUser = async(req, res) => {
    try {
        const { firstName, lastName, age } = req.body;
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {firstName, lastName, age}, {new: true}).select('firstName lastName age');
        updatedUser? res.json({message: "Done", updatedUser}) : res.json({message: "Invalid ID"});
    } catch (error) {
        res.json({message: "catch error", error})
    }
}

export const deleteUser  = async(req, res) => {
    try {
        const { password } = req.body;
        const user = await userModel.findById(req.user._id);
        const match = bcrypt.compareSync(password, user.password);
        if (match) {
            const deletedUser = await userModel.updateOne({_id: user.id}, {softDeleted: true});
            deletedUser.modifiedCount? res.json({message: "Done"}) : res.json({message: "Failed to delete account"});
        } else {
            res.json({message: "Invalid password"})
        }
    } catch (error) {
        res.json({message: "catch error", error})
    }
}

export const getUsers = async(req, res) => {
    try {
        const users = await userModel.find({softDeleted: false}).select('email firstName lastName  phone age');
        users.length? res.json({ message: "Done", users }) : res.json({message: "Empty"});
    } catch (error) {
        res.json({message: "catch error", error});
    }
}

export const shareProfile = async(req, res) => {
    try {
        const {id} = req.params;
        const user = await userModel.findById(id).select('firstName lastName age phone');
        user? res.json({message: "Done", user}) : res.json({message: "Invalid ID"});
    } catch (error) {
        res.json({message: "catch error", error});
    }
}

export const updatePassword = async(req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await userModel.findById(req.user._id);
        const match = bcrypt.compareSync(oldPassword, user.password);
        if (match) {
            const hashPassword = bcrypt.hashSync(newPassword, parseInt(process.env.SaltRound));
            const updatedUser = await userModel.updateOne({_id: req.user.id}, {password: hashPassword});
            updatedUser.modifiedCount? res.json({message: "Done"}) : res.json({ message: "Failed to update password" });
        } else {
            res.json({message: "Invalid password"});
        }
    } catch (error) {
        res.json({message: "catch error", error});
    }
}

export const getProfile = async(req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select('firstName lastName age phone');
        res.json({ message: "Done", user });
    } catch (error) {
        res.json({message: "catch error", error});
    }
}

export const getMessages = async(req, res) => {
    try {
        const userMessages = await messageModel.find({receiverId: req.user._id, softDeleted: false});
        userMessages.length? res.json({message: "Done", userMessages}) : res.json({message: "Empty"});
    } catch (error) {
        res.json({message: "catch error", errro})
    }
}