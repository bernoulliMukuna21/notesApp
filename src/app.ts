import express, { Express, Request, Response } from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import logger from 'morgan';
import dotenv from 'dotenv';
import log from './logger/index';
import passportConfig from './config/passport';
import userRouter from '../src/routes/user.routes'
import notesRouter from '../src/routes/notes.routes'

dotenv.config();

log.info('Personal Notes app started!');

const app: Express = express();

app.use(logger('dev'));
app.use(express.json());

// Express Session Settings
let cookieExpirationTime = parseInt(process.env.COOKIE_EXPIRING_TIME || '');
let sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    dbName: process.env.DATABASE_NAME,
    collectionName: 'users_session'
});

// Express session
app.use(
    session({
      secret: process.env.SESSION_SECRET_ID || '',
      store: sessionStore,
      resave: true,
      saveUninitialized: false,
      rolling: true,
      cookie: { expires : new Date(Date.now() + cookieExpirationTime) }
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport config
passportConfig(passport);

// Routes
app.use('/api/users', userRouter);
app.use('/api/notes', notesRouter);

export{ app };