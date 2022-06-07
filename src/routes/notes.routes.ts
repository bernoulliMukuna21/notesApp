import { ensureAuthentication } from '../middleware/authentication.middleware';
import validateRequest from '../middleware/validateRequest.middleware';
import { saveNoteSchema, updateNoteSchema, deleteNoteSchema, patchNoteStatusSchema, showNoteSchema } from '../schema/note.schema';
import { saveNoteHandler, updateNoteHandler, deleteNoteHandler, modifyNoteStatusHandler, getUserNotesHandler } from '../controller/notes.controller';
import express from 'express';

var router = express.Router();

// Save a note
router.post('/', [ensureAuthentication, validateRequest(saveNoteSchema)], saveNoteHandler);

// Update a note
router.put('/:noteId', [ensureAuthentication, validateRequest(updateNoteSchema)], updateNoteHandler);

// Delete a note
router.delete("/:noteId", [ensureAuthentication, validateRequest(deleteNoteSchema)], deleteNoteHandler);

// Active/Archived a note
router.patch('/:status/:noteId', [ensureAuthentication, validateRequest(patchNoteStatusSchema)], modifyNoteStatusHandler);

// Get a post
router.get('/:status', [ensureAuthentication, validateRequest(showNoteSchema)], getUserNotesHandler);


export default router;