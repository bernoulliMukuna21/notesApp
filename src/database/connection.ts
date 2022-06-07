import mongoose from 'mongoose';
import dotenv from 'dotenv';
import log from '../logger/index';

dotenv.config();

// db
let dbName = process.env.DATABASE_NAME || ''; 

// db for test
//let dbName =  'notes-test';

let dbConnection: any;
try{
    dbConnection = mongoose.createConnection(`${process.env.MONGODB_URI}/${dbName}`);
    log.info('Mongo Connection Established!');
}catch(error: any){
    log.error(error.message);
    process.exit(1);
}

export { dbConnection };