import { dbConnection } from '../database/connection';

beforeAll(async() => {
    if(!dbConnection._connectionString.includes('notes-test'))
            throw new Error('notes-test DB must be used. Check database connection file!')
})
afterAll(async() => {
    dbConnection.db.dropDatabase();
})