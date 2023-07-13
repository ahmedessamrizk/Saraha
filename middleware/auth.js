import jwt from 'jsonwebtoken'
import { userModel } from './../DB/models/user.model.js';

export const auth = () => {
    return async(req, res, next) => {
        try {
            const { authorization } = req.headers;
            if (!authorization?.startsWith(process.env.Bearer + " ")) {
                res.json({message: "Invalid Bearer"});
            } else {
                const token = authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.emailToken);
                if (!decoded?.id) {
                    res.json({message: "Invalid payload data"});
                } else {
                    const user = await userModel.findById(decoded.id).select('firstName lastName');
                    if (!user) {
                        res.jon({message: "Invalid ID"});
                    } else {
                        req.user = user;
                        next();
                    }
                }
            }
        } catch (error) {
            res.json({message: "catch error", error});
            console.log(error);
        }
    }
}