import { Router } from "express";
import { AuthService } from "../../domain/services";
import { AuthController } from "./auth.controller";

export class AuthRoutes {

    public static get routes(): Router {
        const router = Router();
        const service = new AuthService();
        const controller = new AuthController(service);

        router.post('/login', controller.loginUser);
        router.post('/signup', controller.registerUser);
        //TODO router.get('/check-email/:token', controller.validateEmail);

        return router;
    }


}