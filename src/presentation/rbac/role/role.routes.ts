import { Router } from "express";
import { RoleService } from "../../../domain/services";
import { RoleController } from "./role.controller";

export class RoleRoutes {


    public static get routes(): Router {

        const router = Router();
        const service = new RoleService();
        const controller = new RoleController(service);

        router.get('/', controller.getRoles)
        router.post('/', controller.createRole)
        router.put('/:id', controller.updateRole)
        router.delete('/:id', controller.deleteRole)

        return router;

    }

}