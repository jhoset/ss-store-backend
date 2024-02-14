import { Router } from "express";
import { UserService } from "../../../domain/services";
import { UserController } from "./user.controller";
import { AuthMiddleware, ReqParamsMiddleware } from "../../middlewares";

export class UserRoutes {

    public static get routes(): Router {
        const service = new UserService();
        const controller = new UserController(service);

        const router = Router();
        router.use(AuthMiddleware.validateJWT);
        router.get('/roles', controller.getUsersWithRoles);
        router.post('/roles', controller.createUserWithExistingRoles);
        router.put('/roles', controller.updateUserRoles)
        router.get('/', controller.getUsers);
        router.post('/', controller.createUser);
        router.put('/:id', ReqParamsMiddleware.checkId(), controller.updateUser);
        router.delete('/:id', ReqParamsMiddleware.checkId(), controller.deleteUser);

        return router;
    }



}