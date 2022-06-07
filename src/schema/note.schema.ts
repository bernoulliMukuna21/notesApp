import { object, string } from "yup";
import log from '../logger/index'

const noteRequirements = string()
                        .trim()
                        .required("Note is required")
                        .min(60, "Note is too short - should 60 chars minimum.");

const noteIdRequirements = string().trim().required("noteId is required");

const noteStatusRequirements = string()
                              .trim()
                              .required("Note status is required as parameter.")
                              .test('status must be either active or archive', (value: string | undefined) => {
                                if ( value && value === 'active' || value === 'archive' ) return true;
                                log.error('status must be either active or archive');
                                return false;
                              });


// export variables
export const saveNoteSchema = object({
  body: object({
    note: noteRequirements,
  }),
});

export const updateNoteSchema = object({
  params: object({
    noteId: noteIdRequirements,
  }),
  body: object({
    note: noteRequirements,
  }),
});

export const deleteNoteSchema = object({
  params: object({
    noteId: noteIdRequirements,
  }),
});

export const patchNoteStatusSchema = object({
  params: object({
    noteId: noteIdRequirements,
    status: noteStatusRequirements,
  }),
});

export const showNoteSchema = object({
  params: object({
    status: noteStatusRequirements,
  }),
});