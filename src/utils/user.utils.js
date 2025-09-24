import { UserModel } from "../modules/Auth/auth.model.js";

export const getUserByEmail = async(email) =>{
    const user = await UserModel.findOne({email});
    return user?._id || null;
};

export const getUserByUserName = async(username) =>{
    const user = await UserModel.findOne({username});
    return user?._id || null;
};