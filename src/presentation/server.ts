import express, { Router } from 'express';
import path from 'path';


interface Options {
    port: number,
    routes: Router,
    publicPath?: string;
}

/**
 * Provide functionality to sets up and starts an Express Server
 * - Configures middleware for request parsing
 * - Serves static files from a public directory
 * - Defines routes for handling incoming requests
 * - Handles requests for unspecified routes in a SPA
 * - Provide a method to gracefully shutdown the server
 */
export class Server {
    private readonly app = express();
    private serverListener?: any;
    private readonly port: number;
    private readonly publicPath: string;
    public readonly routes: Router;

    constructor(serverOptions: Options) {
        const { port, routes, publicPath = 'public' } = serverOptions;
        this.port = port;
        this.routes = routes;
        this.publicPath = publicPath;
    }

    public async start() {
        //* Middlewares Setup
        //* Setting up middleware functions to parse(Analize or Interpret) incomming Request Bodies
        //? "Parse" refers to the process of extracting and understanding data from incomming requests.
        //? Those Middleware Extract the data and populates "req.body" with a JS Object representing that data.
        this.app.use(express.json()); // raw
        this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded
        
        //* Public Directory Serving
        //? Configures Express App -> to serve static files from the specified public directory.
        this.app.use(express.static(this.publicPath));

        //* Routes Setup
        //? This line sets up the routes defined in 'this.routes'
        //? It tells Express App to use these routes for handling incomming requests.
        this.app.use(this.routes);

        //* Single Page Application (SPA) Fallback 
        //* It sends the 'index.html' file located in the Public Directory for any unmatched route.
        //? This Code handles request for routes that are not explicitly defined in out Express App.
        //? It's commonly used in SPAs to serve main HTML file (index.html) for all routes expect API routes.
        this.app.get('*', (req, res) => {
            const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
            res.sendFile(indexPath);
        })

        //* Server Initialization
        //? Starts the Express Server by listening on the specified PORT.
        //? Once the server is running, it logs a message :)
        this.serverListener = this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port} ...`)
        })

    }

    //* Server Shutdown
    //? This method is used to shut down the server.
    //? It stops the server from listening for new connections.
    //? It's typically called when you want to GRACEFULLY shut down the server
    public close() {
        this.serverListener?.close();
    }




}