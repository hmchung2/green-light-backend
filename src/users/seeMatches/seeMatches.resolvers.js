import client from "../../client";
import { protectedResolver } from "../users.utils";

export default {
  Query: {
    seeMatches: protectedResolver(async (_, { lastId }, { loggedInUser }) => {
      console.log("loggedInUser.id : ", loggedInUser.id);
      const matches = await client.user.findMany({
        where: {
          AND: [
            {
              id: {
                not: loggedInUser.id,
              },
            },
            {
              followers: {
                some: {
                  id: loggedInUser.id,
                },
              },
            },
            {
              following: {
                some: {
                  id: loggedInUser.id,
                },
              },
            },
          ],
        },
        take: 10,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      });
      return matches;
    }),
  },
};
