import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { get } from "lodash";
import { NotesModel, IUserNotes, INote } from '../model/notes.model';
import log from '../logger/index'

// helper functions
async function findAndUpdateNote(userId: mongoose.Types.ObjectId, noteId: string, updateQuery: Object, options?: Object){
  try{
    let result = await NotesModel.updateOne( {
      "user": userId,
      "notes._id":  new mongoose.Types.ObjectId(noteId)
    }, updateQuery, options );
    
    return result;

  }catch(error: any){
    throw error;
  }
}

function updateMessageResponse(result: any, message: string, res: Response){
  if(result.matchedCount === 1 && result.modifiedCount === 1){
    log.info(`${message} success`);
    return res.status(200).send(`${message} success`);

  }else if(result.matchedCount === 0) {
    return res.status(400).send(`${message} failed. note not found!`)
  }
  else if(result.modifiedCount === 0) {
    return res.status(400).send(`${message} failed. Please try again!`);
  };
}

// export 
export async function saveNoteHandler(req: Request, res: Response) {
    try{

      const userId =  get(req, "user._id");
      var userNotes = await NotesModel.findOne({user: userId});

      if(!userNotes){
        // user does not have any notes yet
        userNotes = new NotesModel({user: userId});
      }

      userNotes.notes.push({note: req.body.note.trim()});

      userNotes.save((error: any) => {
        if(error){
            throw error;
        }
        log.info('note saved');
        return res.status(200).send('note saved');
      })

    }catch(error: any){
      return res.status(400).send(`note save failed: ${error}`);
    }   
}

export async function updateNoteHandler(req: Request, res: Response) {
  try{

    const userId = get(req, "user._id");
    const noteId = get(req, "params.noteId");
    const newNote = req.body.note;

    let updateResult: any = await findAndUpdateNote(userId, noteId, 
    { "notes.$.note":  newNote }, { upsert: false });

    updateMessageResponse(updateResult, 'note update', res);

  }catch(error: any){
    log.error('note update failed');
    return res.status(400).send(`note update failed. ${error}`);
  }
}

export async function deleteNoteHandler(req: Request, res: Response) {
  try{

    const userId = get(req, "user._id");
    const noteId = get(req, "params.noteId");

    let deleteResult: any = await findAndUpdateNote(userId, noteId,
      { $pull:
        {
          "notes":  { _id: new mongoose.Types.ObjectId(noteId) }
        }
      },{ upsert: false }
    );

    updateMessageResponse(deleteResult, 'note delete', res);

  }catch(error: any){
    log.error('note delete failed');
    return res.status(400).send(`note delete failed. ${error}`);
  }
} 

export async function modifyNoteStatusHandler(req: Request, res: Response) {
  try{

    const userId = get(req, "user._id");
    const status = get(req, "params.status");
    const noteId = get(req, "params.noteId");

    let statusModificationResult: any = await findAndUpdateNote(userId, noteId,
      { "notes.$.status":  status },{ upsert: false }
    );

    updateMessageResponse(statusModificationResult, 'note status update', res);

  }catch(error: any){
    log.error('note status update failed');
    return res.status(400).send(`note status update failed. ${error}`);
  }
} 

export async function getUserNotesHandler(req: Request, res: Response) {
  try{

    const userId = get(req, "user._id");
    const status = get(req, "params.status");

    let notes = await NotesModel.aggregate([
      { $match: {"user": new mongoose.Types.ObjectId(userId),} },
      { $unwind: "$notes" },
      { $match: {'notes.status': status}},
      { $group: {_id: '$user', notes: {'$push': '$notes.note'}}}
    ]);

    log.info('get user notes success');
    return res.status(200).send(notes);

  }catch(error: any){
    log.error('get user notes failed');
    return res.status(400).send(`get user notes failed. ${error}`);
  }
}