import { Request, Response, NextFunction } from "express";
import createError from 'http-errors';
import log from "../logger";

export const ensureAuthentication = 
(req: Request, res: Response, next: NextFunction) => {
    /*
    * Ensure that user is logged in before performing a task
    */

    try {
        log.debug(`is user logged in: ${req.isAuthenticated()}`)
        if(req.isAuthenticated()){
            return next();
        }
        throw createError(403, 'Please login to proceed!')

    } catch (error: any) {
        log.error(error);
        return res.status(error.status).send(error.message);
    }
};

export const forwardAuthentication = 
( req: Request, res: Response, next: NextFunction ) => {
    /*
    * If user wants to join while being logged in, this middleware
    * takes care of that.
    */

    try {
        if(!req.isAuthenticated()){
            return next();
        }

        throw createError(403, 'You are already logged in. Please logout first!')

    } catch (error: any) {
        log.error(error);
        return res.status(error.status).send(error.message);
    }
};