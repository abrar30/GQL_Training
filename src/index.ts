import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import Express from "express";
import session from "express-session";
import { createConnection } from "typeorm";
import { redis } from "./redis";
import { createAuthorsLoader } from "./utils/authorsLoader";
import { createSchema } from "./utils/createSchema";

const main = async () => {
  await createConnection();

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    //formatError: formatArgumentValidationError,
    context: ({ req, res }: any) => ({
      req,
      res,
      authorsLoader: createAuthorsLoader()
    }),
    validationRules: [ ]
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000"
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis as any
      }),
      name: "qid",
      secret: "aslkdfjoiq12312",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
       // maxAge: 1000 * 60 * 60 * 24 * 1 * 365 // 7 years
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    })
  );

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("server started on http://localhost:4000/graphql");
  });
};

main().catch(err => console.error(err));
