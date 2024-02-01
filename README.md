# NODE JS Project + TypeScript

This pre-initialized project has everything you need to work with TypeScript, Express and Rest.


## Installation

1. Clone .env.template to .env and configure the environment variables.
2. Run `npm install` to install the dependencies.
4. Run `npm run dev` to run the project in development mode.

## Prisma CLI Common Commands
1. Create & Apply all migrations `npx prisma migrate dev`
2. Apply all migrations and create a new migration  `npx prisma migrate dev --create-only`
3. Apply all migrations and create a new migration with custom name `npx prisma migrate dev --create-only --name "test"`

4. Apply all pending migrations, and creates the database if it does not exist. Primarily used in non-development environments. `npx prisma migrate deploy`
5. More info at [Prisma Migrate DOCS](https://www.prisma.io/docs/orm/prisma-migrate)
