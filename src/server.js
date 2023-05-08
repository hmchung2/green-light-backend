require("dotenv").config();
import express from "express";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import logger from "morgan";
import schema from "./schema";
import { getUser } from "./users/users.utils";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.js";
import WebSocket, { WebSocketServer as WSWebSocketServer } from "ws";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { useServer } from "graphql-ws/lib/use/ws";
import cors from "cors";

const PORT = process.env.PORT;

async function startServer() {
  const app = express();
  app.use(logger("tiny"));
  app.use(graphqlUploadExpress());
  // app.use(cors({ origin: "*" }));

  app.use("/static", express.static("uploads"));
  const httpServer = http.createServer(app);

  const WebSocketServer = WebSocket.Server || WSWebSocketServer;
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: "/graphql",
  });

  const getDynamicContext = async (ctx, msg, args) => {
    // ctx is the graphql-ws Context where connectionParams live
    if (ctx.connectionParams.token) {
      console.log("dynamic token found");
      const loggedInUser = await getUser(ctx.connectionParams.token);
      return { loggedInUser };
    }
    console.log("dynamic token not found !!!!!!!");
    // // Otherwise let our resolvers know we don't have a current user
    return { loggedInUser: null };
  };

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx, msg, args) => {
        return getDynamicContext(ctx, msg, args);
      },
      onConnect: async (ctx) => {
        console.log("on connect");
        if (!ctx.connectionParams.token) {
          throw new Error("Auth token missing!");
        }
      },
      onDisconnect(ctx, code, reason) {
        console.log("Disconnected");
      },
      // listen: {
      //   port: PORT,
      //   ip: "0.0.0.0", // bind to all available network interfaces
      // },
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    playground: true,
    introspection: true,
    context: async (ctx) => {
      console.log("http");
      return {
        loggedInUser: await getUser(ctx.req.headers.token),
      };
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              serverCleanup.dispose();
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
