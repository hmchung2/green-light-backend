require("dotenv").config();
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";

const PORT = process.env.PORT;

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    context: async (ctx) => {
      console.log("context");
      console.log(ctx.req);
      return {
        loggedInUser: await getUser(ctx.req.headers.token),
      };
    },
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
  });

  console.log(`🚀  Server ready at: ${url}`);
}

startServer();
