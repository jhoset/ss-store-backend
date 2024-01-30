import { Router } from "express";
import { UserService } from "../../../domain/services";
import { UserController } from "./user.controller";

export class UserRoutes {

    public static get routes(): Router {
        const service = new UserService();
        const controller = new UserController(service);

        const router = Router();

        router.get('/', controller.getUsers)
        router.post('/', controller.createUser)
        router.put('/:id', controller.updateUser)
        router.delete('/:id', controller.deleteUser)

        return router;
    }



}