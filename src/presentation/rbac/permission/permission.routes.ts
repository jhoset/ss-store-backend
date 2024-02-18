import { Router } from "express";
import { AuthMiddleware, ReqParamsMiddleware } from "../../middlewares";
import { PermissionController } from "./permission.controller";
import { PermissionService } from "../../../domain/services";

export class PermissionRoutes {

    public static get routes(): Router {
        const router = Router();
        const service = new PermissionService();
        const controller = new PermissionController(service);

        router.use(AuthMiddleware.validateJWT);
        router.get('/', controller.getPermissions);
        router.post('/', controller.createPermission);
        router.put('/', controller.updatePermission);
        router.delete('/:id', ReqParamsMiddleware.checkId(), controller.deletePermission)


        return router;
    }
}