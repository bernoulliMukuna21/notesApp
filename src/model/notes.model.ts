import mongoose from "mongoose";
import { IUser } from "./user.model";
import { dbConnection } from "../database/connection";

export interface INote extends mongoose.Document{
    note: string;
    createdAt: Date;
    updatedAt: Date;
    status: string;
}

export interface IUserNotes extends mongoose.Document{
    user: IUser['_id'];
    notes: [INote];
}

const Notes = new mongoose.Schema<INote>({
    note:{
        type: String
    },
     status:{
        type: String,
        default: 'active'
    },
}, { timestamps: true });

const userNotes = new mongoose.Schema<IUserNotes>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "UserModel",
    },
    notes: [Notes]
}, {
    timestamps: true
});

export const NotesModel = dbConnection.model('NotesModel', userNotes);
