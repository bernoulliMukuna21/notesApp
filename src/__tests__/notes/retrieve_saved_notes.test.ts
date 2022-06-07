import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { dbConnection } from '../../database/connection';

var agent = request.agent(app);

describe('get saved notes', () => {
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

        describe('given the status is neither active/archive', () => {
            it('should return error 404', async() => {
                const status = "";
                const response = await agent.get(`/api/notes/${status}`);

                expect(response.statusCode).toEqual(404 || 400);
             })
        });
        
        describe('given the user has no saved notes', () => {
            it('should return an empty array notes', async() => { 
                const status = "active" || "archive";
                const response = await agent.get(`/api/notes/${status}`);

                expect(response.statusCode).toEqual(200);
                expect(response.body.length).toBe(0)
             })
        });

        describe('given the user has some notes', () => {
            let notePayload = [
                {
                    note: "some note. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.some note. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
                    status: "active"
                },
                {
                    note: "some note 2. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.some note. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
                    status: "active"
                }
            ];

            beforeEach(async () => {
                await dbConnection.collections.notesmodels.deleteMany({});
                await agent.post(`/api/notes`).send(notePayload[0]);
                await agent.post(`/api/notes`).send(notePayload[1]);
            });

            it('should return empty list of notes if request status is different than of all notes saved',async () => {
                const status = "archive";
                const response = await agent.get(`/api/notes/${status}`);

                expect(response.statusCode).toEqual(200);
                expect(response.body.length).toBe(0)
            })
            
            it('should return empty list of notes',async () => {
                const status = "active";
                const response = await agent.get(`/api/notes/${status}`);

                expect(response.body.length).toBe(1)
                expect(response.body[0]).toMatchObject({
                    "_id": expect.any(String),
                    "notes": expect.arrayContaining([expect.any(String)])
                  });
            })
        });
    });
})