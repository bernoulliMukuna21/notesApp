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

// tests
describe('get saved notes', () => {

    // - when user is not logged in, return an error (forbidden)
    describe('given the user is not logged in', () => {
        it('should return error code 403 forbidden and message prompting login', async () => {
            const status = "active" || "archive";
            const response = await agent.get(`/api/notes/${status}`);

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

        // when the user does not specify which status of the notes to get.
        describe('given the status is neither active/archive', () => {
            it('should return error 404 or 400', async() => {
                const status = "";
                const response = await agent.get(`/api/notes/${status}`);

                expect(response.statusCode).toEqual(404 || 400);
             })
        });
        
        // User has specified which of the status notes to get but there are no notes saved
        describe('given the user has no saved notes', () => {
            it('should return an empty array notes', async() => { 
                const status = "active" || "archive";
                const response = await agent.get(`/api/notes/${status}`);

                expect(response.statusCode).toEqual(200);
                expect(response.body.length).toBe(0)
             })
        });

        // There are some notes saved
        describe('given the user has some notes', () => {
        
            beforeEach(async () => {
                await NotesModel.deleteMany({});
                await agent.post(`/api/notes`).send(notePayload[0]);
                await agent.post(`/api/notes`).send(notePayload[1]);
            });

            // User has specified which of the status notes to get but there are none for that status
            it('should return empty list of notes if request status is different than of all notes saved',async () => {
                const status = "archive";
                const response = await agent.get(`/api/notes/${status}`);

                expect(response.statusCode).toEqual(200);
                expect(response.body.length).toBe(0)
            })
            
            // there are some notes for the specified status
            it('should return a single list with all the notes that match the specified status',async () => {
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