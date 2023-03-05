require("dotenv").config();
import express from "express";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";

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
  });

  await server.start(); // add this line

  const app = express();
  server.applyMiddleware({ app });

  const httpServer = http.createServer(app);

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
