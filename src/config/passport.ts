import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import * as mongodb from 'mongodb';
import bcrypt from 'bcryptjs';
import log from '../logger/index';
import { UserModel, IUser} from '../model/user.model';
import { createUser, loginUser } from '../controller/user.controller'

type PassportType = typeof passport;

export = function(passport: PassportType){

    // Local Passport Strategy
    passport.use(new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    }, function(req, email, password, done: any) {
        let body = req.body;
        let userIntetion = req.url.substring(1);

        UserModel.findOne({
            email: email
        }).then( async (user: IUser) => {
            if(!user){
                log.info('user not found');
                if(userIntetion === 'join'){
                   
                    let newUser = await createUser({name: body.name, email, password});
                    await loginUser(newUser, req);
                    done(null, newUser, 'login success');
                    
                }else if(userIntetion === 'login'){
                    done(null, body, 'Email not recognised. Please try again!')
                }

            }else{
                log.info('user found');

                if(userIntetion === 'join'){
                    done(null, body, 'Email already registered. Please try another!')

                }else if(userIntetion === 'login'){
                    await loginUser(user, req);
                    done(null, user, 'login success');
                }
            }
            
        }).catch( (error: any) => {
            done(error, body);
        });
    }))

    passport.serializeUser((user: any, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id: mongodb.ObjectId, done) => {
        UserModel.findOne({_id: id}, function (error: any, user: IUser) {
            done(error, user);
        });
    });
}