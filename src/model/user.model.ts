import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import { dbConnection } from "../database/connection";

export interface IUser extends mongoose.Document{
    name: string;
    email: string;
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

let UserSchema = new mongoose.Schema<IUser>({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
}, { timestamps: true });

UserSchema.pre('save', function (next) {
    const user = this;
    if(!user.isModified('password')) return next();

    bcrypt.genSalt(parseInt(`${process.env.SALT_FACTOR}`), (err, salt) => bcrypt.hash(user.password, salt, (err, hash)=>{
        if(err)  next(err);
        user.password = hash;
        next();
    }));
});

UserSchema.methods.comparePassword = async function(candidatePassword: string){
    const user = this;
    return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

export const UserModel = dbConnection.model('UserModel', UserSchema);
