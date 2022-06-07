import express, {Request, Response} from 'express';
import { passportAuthentication } from '../controller/user.controller'
import validateRequest from '../middleware/validateRequest.middleware';
import { forwardAuthentication } from '../middleware/authentication.middleware';
import { createUserSchema, userLoginSchema } from '../schema/user.schema';
import log from '../logger/index';

var router = express.Router();

// Join
router.post('/join', [forwardAuthentication, validateRequest(createUserSchema)], (req: Request, res: Response) => {
    passportAuthentication(req, res, 'join failed.');
});

// login
router.post('/login', [forwardAuthentication, validateRequest(userLoginSchema)], (req: Request, res: Response) =>{
    passportAuthentication(req, res, 'login failed.');
});

// logout
router.get('/logout', (req: Request, res: Response) => {
    try{
        req.logout();
        res.status(200).send('logout success.');
    }catch (error: any) {
        log.error(error)
        res.status(400).send('logout failed. Error occurred!');
    }
});

export default router;