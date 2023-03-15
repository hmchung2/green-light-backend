require("dotenv").config();
import express from "express";
import http from "http";
import { ApolloServer } from "apollo-server-express";
// import { startStandaloneServer } from "@apollo/server/standalone";
import schema from "./schema";
import { getUser } from "./users/users.utils";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.js";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const PORT = process.env.PORT;

async function startServer() {
  const app = express();
  app.use(graphqlUploadExpress());

  app.use("/static", express.static("uploads"));
  const httpServer = http.createServer(app);

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      async onConnect({ token }, webSocket, context) {
        if (token === undefined) {
          throw new Error("You can't listen.");
        }
        const foundUser = await getUser(token);
        return { loggedInUser: foundUser };
      },
      onDisconnect(webScoket, context) {},
    },
    { server: httpServer, path: "/graphql" }
  );

  const server = new ApolloServer({
    schema,
    playground: true,
    introspection: true,
    context: async (ctx) => {
      return {
        loggedInUser: await getUser(ctx.req.headers.token),
      };
    },
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground,
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });

  await server.start(); // add this line
  server.applyMiddleware({ app });

  httpServer.listen(PORT, () => {
    console.log(`🚀Server is running on http://localhost:${PORT}/graphql ✅`);
  });
}

startServer();

// async function startServer() {
//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     playground: true,
//     context: async (ctx) => {
//       console.log("context");
//       console.log(ctx.req);
//       return {
//         loggedInUser: await getUser(ctx.req.headers.token),
//       };
//     },
//   });

//   const { url } = await startStandaloneServer(server, {
//     listen: { port: PORT },
//   });

//   console.log(`🚀  Server ready at: ${url}`);
// }

// startServer();
