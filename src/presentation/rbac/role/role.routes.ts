import { Router } from "express";
import { RoleService } from "../../../domain/services";
import { RoleController } from "./role.controller";
import { AuthMiddleware, ReqParamsMiddleware } from "../../middlewares";

export class RoleRoutes {


    public static get routes(): Router {

        const router = Router();
        const service = new RoleService();
        const controller = new RoleController(service);
        router.use(AuthMiddleware.validateJWT);
        router.get('/', controller.getRoles)
        router.post('/', controller.createRole)
        router.put('/:id', ReqParamsMiddleware.checkId(), controller.updateRole)
        router.delete('/:id', ReqParamsMiddleware.checkId(), controller.deleteRole)

        return router;

    }

}