import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { ITokenPayload } from "../../domain/interfaces";
import { dbClient } from "../../data";
import { CurrentUserDto } from "../../domain/dtos/auth";


export class AuthMiddleware {


    public static async validateJWT(req: Request, res: Response, next: NextFunction) {
        const authorization = req.headers.authorization;
        if (!authorization) return res.status(401).json({ error: "No Authorization header provided" });
        if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: "Invalid Bearer Token" });

        const token = authorization.split(' ').at(1) || '';
        try {
            const payload = await JwtAdapter.validateToken<ITokenPayload>(token);
            if (!payload) return res.status(401).json({ error: 'Invalid Token' });
            // TODO: Call User Service to Get User By Id
            const userDb = await dbClient.user.findUnique({ where: { id: payload.user.id } });
            if (!userDb) return res.status(400).json({ error: 'Invalid User Token' });

            // TODO: Implemente Mail Service to Verify Acccount
            // if (!userDb.verifiedEmail) return res.status(401).json({ error: 'Unverified Account' });
            req.body.currentUser = CurrentUserDto.mapFrom(userDb);
            next();
        } catch (error) {
            console.log(`Auth Middleware Error: ${error}`);
            res.status(500).json({ error: 'Internal Server Error' });
        }

    }

}