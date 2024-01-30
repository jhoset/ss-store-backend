import { envs } from "./config";
import { AppRoutes } from "./presentation/app.routes";
import { Server } from "./presentation/server";
import { bcryptAdapter } from "./config/bcrypt.adapter";

(async () => {
    main()
})();

async function main() {
    const server = new Server({
        port: envs.PORT,
        routes: AppRoutes.routes
    });

    bcryptAdapter.hash("Hola123")

    server.start();

}