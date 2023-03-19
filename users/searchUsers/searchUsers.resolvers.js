import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    searchUsers: protectedResolver(
      async (_, { keyword, lastId }, { loggedInUser }) => {
        return client.user.findMany({
          where: {
            OR: [
              {
                username: {
                  startsWith: keyword,
                  mode: "insensitive",
                },
              },
              {
                username: {
                  endsWith: keyword,
                  mode: "insensitive",
                },
              },
            ],
            rooms: {
              some: {
                users: {
                  some: {
                    id: loggedInUser.id,
                  },
                },
              },
            },
          },
          take: 5,
          skip: lastId ? 1 : 0,
          ...(lastId && { cursor: { id: lastId } }),
        });
      }
    ),
  },
};
