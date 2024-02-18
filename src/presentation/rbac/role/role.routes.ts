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
        //TODO: FIX PUT
        router.put('/', controller.updateRole)
        router.delete('/:id', ReqParamsMiddleware.checkId(), controller.deleteRole)
        router.get('/permissions', controller.getRolesWithPermissions);
        router.post('/permissions', controller.createRoleWithPermissions);
        router.put('/permissions', controller.updateRoleWithPermissions);

        return router;

    }

}