import { Request, Response } from 'express';
import passport from 'passport';
import { UserModel, IUser} from '../model/user.model';
import log from '../logger/index'

export async function loginUser(user: Object, req: Request) {
    req.login(user, function(error){
        if(error){
            throw error;
        }
        log.info('login success');
    })
}

export const createUser = async (userInput: Object) : Promise<Object> => {
    try{
        log.debug(userInput);
        let newUser = new UserModel(userInput);
        let savedUser = await newUser.save();
        log.info('join success');
        return savedUser;

    }catch(error: any){
        throw error;
    }
}

export function passportAuthentication(req: Request, res: Response, errorMessage: any){
    passport.authenticate('local', (err, user, info)=>{

        if(err){
            log.error(err);
            res.status(400).send('login failed.');
            return;
        }    

        res.status(200).send(info);
        
    })(req, res);
}