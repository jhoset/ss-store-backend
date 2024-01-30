import { Router } from 'express';
import { UserRoutes } from './rbac/user/user.routes';
import { RoleRoutes } from './rbac/role/role.routes';
import { AuthRoutes } from './auth/auth.routes';


export class AppRoutes {

    static get routes(): Router {
        const router = Router();

        router.use('/api/auth', AuthRoutes.routes);
        router.use('/api/users', UserRoutes.routes);
        router.use('/api/roles', RoleRoutes.routes);

        return router;
    }

}