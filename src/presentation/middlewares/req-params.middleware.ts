import { NextFunction } from "express";
import { CustomRequest, CustomResponse } from "../interfaces";

export class ReqParamsMiddleware {
    //* Can be improved to receive a param of a specific idName of group of id names
    public static checkId() {
        return (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
            const id = +req.params.id;
            if (isNaN(id) || id <= 0) return res.status(400).json({ error: "Invalid ID Parameter." })
            next();
        }
    }
}