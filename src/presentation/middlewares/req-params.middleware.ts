import { NextFunction, Request, Response } from "express";

export class ReqParamsMiddleware {
    //* Can be improved to receive a param of a specific idName of group of id names
    public static checkId() {
        return (req: Request, res: Response, next: NextFunction) => {
            const id = +req.params.id;
            if (isNaN(id) || id <= 0) return res.status(400).json({ error: "Invalid ID Parameter." })
            next();
        }
    }
}