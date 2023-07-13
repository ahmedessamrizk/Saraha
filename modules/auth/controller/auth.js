import dotenv from 'dotenv'
dotenv.config()
import { userModel } from './../../../DB/models/user.model.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { myEmail } from './../../../services/email.js';
import { nanoid } from 'nanoid';

export const SignUp = async(req, res) =>
{
    try {
        const { firstName, lastName, email, password, age, phone } = req.body;
        const user = await userModel.findOne({email}).select('email');
        if (!user) {
            const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SaltRound));
            const newUser = new userModel({ firstName, lastName, email, password: hashPassword, age, phone });
            const savedUser = await newUser.save();
            res.json({ message: "Done" });
            const token = jwt.sign({id: savedUser._id}, process.env.emailToken);
            const link = `${req.protocol}://${req.headers.host}${process.env.baseURL}/auth/confirmEmail/${token}`
            myEmail(email, 'ConfirmEmail', `<a href='${link}'>Follow me to confirm ur account</a>`);
        } else {
            res.json({message: "Email exist!"});
        }
    } catch (error) {
        res.json({message: "catch error", error});
    }
}

export const confirmEmail = async(req, res) => {
    try {
        const {token} = req.params;
        if (token) {
            const { id } = jwt.decode( token, process.env.emailToken ,  process.env.emailToken);
            if (id) {
                const user = await userModel.findById(id).select('email');
                if (user) {
                    const updatedUser = await userModel.updateOne({_id:id, confirmEmail: false}, {confirmEmail: true});
                    updatedUser.modifiedCount? res.json({message: "Done plz proceed to login page"}) : res.json({message: "Already Confirmed"});
                } else {
                    res.json({message: "Invalid ID"});
                }
            } else {
                res.json({message: "Invalid payload data"});
            }
        } else {
            res.json({message: "Invalid token"});
        }

    } catch (error) {
        res.json({ message: "catch error", error });
        console.log(error);
    }
}

export const SignIn = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (user?.softDeleted == false) {
            if (user.confirmEmail) {
                const match = bcrypt.compareSync(password, user.password);
                if (match) {
                    const LoggedUser = await userModel.findByIdAndUpdate(user.id, {isOnline: true});
                    const token = jwt.sign({id: user.id}, process.env.emailToken, {expiresIn: '1h'});
                    res.json({ message: "Done", token });
                } else {
                    res.json({ message: "Email password misMatch" });
                }
            } else {
                res.json({ message: "u need to confirm ur account" });
            }
        } else {
            res.json({ message: "Email password misMatch" });
        }
    } catch (error) {
        res.json({ message: "catch error", error})
    }
}

export const sendCode = async(req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email }).select('email');
        if (user) {
            const code = nanoid();
            myEmail(email, 'ForgetPassword', `<h1>Acess code: ${code} </h1>`);
            const updatedUser = await userModel.updateOne({email}, {code});
            updatedUser.modifiedCount? res.json({message: "Done"}) : res.json({message: "fail"});
        } else {
            res.json({message: "Invalid account"});
        }
    } catch (error) {
        res.json({ message: "catch error", error });
    }
}

export const forgetPassword = async(req, res) => {
    try {
        const { code, email, newPassword } = req.body;
        if (code) {
            const newHash = bcrypt.hashSync(newPassword);
            const user = await userModel.updateOne({ code, email }, { code:null, password: newHash });
            user.modifiedCount? res.json({message: "Done"}) : res.json({message: "Invalid code or email"});
        } else {
            res.json({message: "code can't be null"});
        }
        
    } catch (error) {
        res.json({message: "Catch error", error})
    }
}
