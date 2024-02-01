import jwt from 'jsonwebtoken';
import { envs } from './envs';
import { ITokenPayload } from '../domain/interfaces';

const JWT_SECRET_KEY = envs.JWT_SECRET_KEY;

export class JwtAdapter {

    public static async generateToken(payload: ITokenPayload, duration: string = '2h') {
        return new Promise((resolve) => {
            jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: duration }, (error, generatedToken) => {
                if ( error ) return resolve(null);
                return resolve(generatedToken)
            })
        })
    }

    public static validateToken<T>(token: string): Promise<T | null> {
        return new Promise((resolve) => {
            jwt.verify(token, JWT_SECRET_KEY, (error, decoded) => {
                if (error) return resolve(null);
                resolve(decoded as T);
            })
        })
    }

}