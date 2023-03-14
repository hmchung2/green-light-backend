require("dotenv").config();
import express from "express";
import http from "http";
import { ApolloServer } from "apollo-server-express";
// import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.js";

const PORT = process.env.PORT;

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    introspection: true,
    context: async (ctx) => {
      return {
        loggedInUser: await getUser(ctx.req.headers.token),
      };
    },
    subscriptions: {
      onConnect: async ({ token }) => {
        if (!token) {
          throw new Error("You can't listen.");
        }
        console.log("token~~~~~~~~~");
        console.log(token);
        const loggedInUser = await getUser(token);
        console.log("Logged~~~~~~~~~~~");
        console.log(loggedInUser);
        return {
          loggedInUser,
        };
      },
    },
  });

  await server.start(); // add this line

  const app = express();
  app.use(graphqlUploadExpress());
  server.applyMiddleware({ app });
  app.use("/static", express.static("uploads"));
  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

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
