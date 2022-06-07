import request from 'supertest';
import { app } from '../../app';
import { dbConnection } from '../../database/connection';
import { NotesModel } from '../../model/notes.model';
import { UserModel } from '../../model/user.model';

// save notes
// - when the user is not logged in, it should return an error
// - when note is missing, it should return an error
// - when note is less than 60 characters, it should fail to save and return 400 (error)
// - when body is at least 60 characters, it should save note and return 200 (success)


var agent = request.agent(app);

describe('save notes', () => {
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

        describe('given the note body is missing', () => {
            it('should fail to save and return an error 400', async() => {
                const response = await agent
                                        .post(`/api/notes`)
                                        .send({});

                expect(response.statusCode).toEqual(400);
                expect(response.text).toMatch('Note is required');
             })
        });
        
        describe('given the note body is less than 60 characters', () => {
            it('should fail to save and return an error 400', async() => {
                const response = await agent
                                        .post(`/api/notes`)
                                        .send({
                                            note: "Etiam, lectus. Sodales."
                                        });

                expect(response.statusCode).toEqual(400);
                expect(response.text).toMatch('Note is too short - should 60 chars minimum');
             })
        });

        describe('given the note body is at least 60 characters long', () => {
            it('should fail to save and return an error 400', async() => {
                const response = await agent
                                        .post(`/api/notes`)
                                        .send({
                                            note: "Etiam, lectus. Sodales. Etiam risus velit quam, porta morbi adipiscing tempor Sociosqu massa donec sem dictumst luctus."
                                        });

                expect(response.statusCode).toEqual(200);
                expect(response.text).toMatch('note saved');
                console.log(response)
             })
        });
    });
})