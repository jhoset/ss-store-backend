import { envs } from "./config";
import { AppRoutes } from "./presentation/app.routes";
import { Server } from "./presentation/server";

(async () => {
    main()
})();

function main() {
    const server = new Server({
        port: envs.PORT,
        routes: AppRoutes.routes
    });

    server.start();

}