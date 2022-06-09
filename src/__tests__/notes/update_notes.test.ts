import request from 'supertest';
import { app } from '../../app';
import { NotesModel } from '../../model/notes.model';
import { UserModel } from '../../model/user.model';

var agent = request.agent(app);

let userPayload = {
    name: "joe Doe",
    email: "joeDoe@something.com",
    password: "we12re34",
    passwordConfirmation: "we12re34"
};

let notePayload = {
    note: "some note. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.some note. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
};

//tests
describe('update, delete, archive and unarchived saved notes', () => {

    // - when user is not logged in, return an error (forbidden)
    describe('given the user is not logged in', () => {
        it('should return error code 403 forbidden and message prompting login', async () => {
            const id = "123";
            const response = await agent
                                        .put(`/api/notes/${id}`)
                                        .send({
                                            note: "Etiam, lectus. Sodales. Etiam risus velit quam, porta morbi adipiscing tempor Sociosqu massa donec sem dictumst luctus."
                                        });

            expect(response.statusCode).toEqual(403);
            expect(response.text).toMatch('Please login to proceed!');
        })
    });

    // when the user is logged in
    describe('given the user is logged in', () => {

        // call endpoint to sign up and login the user before each test
        beforeAll(async () => {
            await UserModel.deleteMany({});
            await agent
                    .post('/api/users/join')
                    .send(userPayload);
        });

        // if user wants to update note without passing the id of the note, it should fail
        describe('given the note id does not exist', () => {
            it('should return error 404', async() => {
                const id = "123";
                const response = await agent
                                        .put(`/api/notes/${id}`)
                                        .send(notePayload);

                expect(response.statusCode).toEqual(400);
             })
        });
        
        // when the id of the note to update is given
        describe('given the note id exists', () => {
            
            let savedNoteId: any, userId: any;

            beforeEach(async () => {
                await NotesModel.deleteMany({});
                await agent.post(`/api/notes`).send(notePayload);
                userId = (await UserModel.findOne({email: userPayload.email}))._id;
                savedNoteId = (await NotesModel.findOne({user: userId})).notes[0]._id;
            });
            
            // if the id of the note is found, it should update it successfully
            it('should update and return success',async () => {
                const noteToUpdateId = savedNoteId.toString();
                const response = await agent
                                        .put(`/api/notes/${noteToUpdateId}`)
                                        .send(notePayload);

                expect(response.statusCode).toEqual(200);
                expect(response.text).toMatch('note update success');
            })

            // if the id of the note is found, it should delete it successfully
            it('should delete note and return success', async () => {
                const noteToDeleteId = savedNoteId.toString();
                const response = await agent.delete(`/api/notes/${noteToDeleteId}`);
                const userNotes = await agent.get(`/api/notes/active`);

                expect(response.statusCode).toEqual(200);
                expect(response.text).toMatch('note delete success');
                expect(userNotes.body.length).toBe(0)
            })

            // if the id of the note is found, it should archive it successfully
            it('should change note status to archive and return success', async () => {
                let status = 'archive';
                const noteToArchiveId = savedNoteId.toString();
                const response = await agent.patch(`/api/notes/${status}/${noteToArchiveId}`);
                const userNotes = await agent.get(`/api/notes/${status}`);

                expect(response.statusCode).toEqual(200);
                expect(response.text).toMatch('note status update success');
                expect(userNotes.body.length).toBe(1);
            })

            // if the id of the note is found, it should unarchive it successfully
            it('should change note status to active and return success', async () => {
                let status = 'active';
                const noteToActivateId = savedNoteId.toString();
                var response = await agent.patch(`/api/notes/archive/${noteToActivateId}`);
                response = await agent.patch(`/api/notes/${status}/${noteToActivateId}`);
                const userNotes = await agent.get(`/api/notes/${status}`);

                expect(response.statusCode).toEqual(200);
                expect(response.text).toMatch('note status update success');
                expect(userNotes.body.length).toBe(1);
            })
        });
    });
}) 