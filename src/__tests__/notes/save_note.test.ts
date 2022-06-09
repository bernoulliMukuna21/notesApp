import request from 'supertest';
import { app } from '../../app';
import { UserModel } from '../../model/user.model';

var agent = request.agent(app);

let userPayload = {
    name: "joe Doe",
    email: "joeDoe@something.com",
    password: "we12re34",
    passwordConfirmation: "we12re34"
};

let notePayload = {
    note: "Etiam, lectus. Sodales. Etiam risus velit quam, porta morbi adipiscing tempor Sociosqu massa donec sem dictumst luctus."
}

// tests
describe('save notes', () => {

    // - when user is not logged in, return an error (forbidden)
    describe('given the user is not logged in', () => {
        it('should return error code 403 forbidden and message prompting login', async () => {
            const response = await agent.post(`/api/notes`).send(notePayload);

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
 
        // no note passed to the body to save, it should fail
        describe('given the note body is missing', () => {
            it('should fail to save and return an error 400', async() => {
                const response = await agent
                                        .post(`/api/notes`)
                                        .send({});

                expect(response.statusCode).toEqual(400);
                expect(response.text).toMatch('Note is required');
             })
        });
        
        // note passed is less than 60 characters, it should fail
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

        // note passed is more than 60 characters, it should pass
        describe('given the note body is at least 60 characters long', () => {
            it('should fail to save and return an error 400', async() => {
                const response = await agent
                                        .post(`/api/notes`)
                                        .send(notePayload);

                expect(response.statusCode).toEqual(200);
                expect(response.text).toMatch('note saved');
             })
        });
    }); 
})