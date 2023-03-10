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
  });

  await server.start(); // add this line

  const app = express();
  app.use(graphqlUploadExpress());
  server.applyMiddleware({ app });
  app.use("/static", express.static("uploads"));
  // app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  const httpServer = http.createServer(app);

  httpServer.listen(PORT, () => {
    console.log(`๐Server is running on http://localhost:${PORT}/graphql โ`);
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

//   console.log(`๐  Server ready at: ${url}`);
// }

// startServer();
