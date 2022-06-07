import { AnySchema } from "yup";
import { Request, Response, NextFunction } from "express";
import log from "../logger";

const validateRequest = (schema: AnySchema) => async (
  req: Request, res: Response, next: NextFunction) => {
      try {
          await schema.validate({
              body: req.body,
              query: req.query,
              params: req.params
            });
            return next();

        } catch (error: any) {
            log.error(error);
            return res.status(400).send(error.message);
        }
    };

export default validateRequest;