import request from 'supertest';
import { app } from '../../app';
import { dbConnection } from '../../database/connection';
import { NotesModel } from '../../model/notes.model';
import { UserModel } from '../../model/user.model';

var agent = request.agent(app);

describe('update, delete, archive and unarchived saved notes', () => {
   /*
    * In order to complete the testing, one thing must first be done. 
    * In the database/connection.ts file, dbName should be change to notes-test.
    * This is to create a separate db to run the test.
    * After the test, this db is deleted.
    */
   
    beforeAll(() => {
        if(!dbConnection._connectionString.includes('notes-test'))
            throw new Error('notes-test DB must be used. Check database connection file!') 
    })

    afterAll(async () => {
        dbConnection.db.dropDatabase()
    });

    describe('given the user is not logged in', () => {
        it('should return error code 403 forbidden and message prompting login', async () => {
            const status = "active" || "archive";
            const response = await agent.get(`/api/notes/${status}`);

            expect(response.statusCode).toEqual(403);
            expect(response.text).toMatch('Please login to proceed!');
        })
    });

    describe('given the user is logged in', () => {

        beforeAll(async () => {
            await agent
                    .post('/api/users/join')
                    .send({
                        name: "joe Doe",
                        email: "joeDoe@something.com",
                        password: "we12re34",
                        passwordConfirmation: "we12re34"
                    });
        });

        afterAll(async () =>  await agent.get('/api/users/logout'));

        describe('given the note id does not exist', () => {
            it('should return error 404', async() => {
                const id = "123";
                const response = await agent
                                        .put(`/api/notes/${id}`)
                                        .send(
                                            {
                                                note: "Etiam, lectus. Sodales. Etiam risus velit quam, porta morbi adipiscing tempor Sociosqu massa donec sem dictumst luctus."
                                            });

                expect(response.statusCode).toEqual(400);
             })
        });
        
        describe('given the note id exists', () => {
            let notePayload = 
                {
                    note: "some note. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.some note. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
                };
            let savedNoteId: any, userId: any;

            beforeEach(async () => {
                await dbConnection.collections.notesmodels.deleteMany({});
                await agent.post(`/api/notes`).send(notePayload);
                userId = (await UserModel.findOne({email: "joeDoe@something.com"}))._id;
                savedNoteId = (await NotesModel.findOne({user: userId})).notes[0]._id;
            });
            
            it('should update and return success',async () => {
                const noteToUpdateId = savedNoteId.toString();
                const response = await agent
                                        .put(`/api/notes/${noteToUpdateId}`)
                                        .send({
                                            note: "Parturient inceptos iaculis torquent ultrices facilisi urna congue volutpat volutpat congue dapibus suspendisse.",
                                        });

                expect(response.statusCode).toEqual(200);
                expect(response.text).toMatch('note update success');
            })

            it('should delete note and return success', async () => {
                const noteToDeleteId = savedNoteId.toString();
                const response = await agent.delete(`/api/notes/${noteToDeleteId}`);
                const userNotes = await agent.get(`/api/notes/active`);

                expect(response.statusCode).toEqual(200);
                expect(response.text).toMatch('note delete success');
                expect(userNotes.body.length).toBe(0)
            })

            it('should change note status to archive and return success', async () => {
                let status = 'archive';
                const noteToArchiveId = savedNoteId.toString();
                const response = await agent.patch(`/api/notes/${status}/${noteToArchiveId}`);
                const userNotes = await agent.get(`/api/notes/${status}`);

                expect(response.statusCode).toEqual(200);
                expect(response.text).toMatch('note status update success');
                expect(userNotes.body.length).toBe(1);
            })

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