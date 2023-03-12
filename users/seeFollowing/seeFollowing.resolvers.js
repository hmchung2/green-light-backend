import client from "../../client";
import { protectedResolver } from "../users.utils";

export default {
  Query: {
    seeFollowing: protectedResolver(async (_, { page }, { loggedInUser }) => {
      const following = await client.user
        .findUnique({
          where: { id: loggedInUser.id },
        })
        .following({
          take: 5,
          skip: (page - 1) * 5,
        });

      const totalFollowing = await client.user.count({
        where: { followers: { some: { id: loggedInUser.id } } },
      });

      return {
        ok: true,
        following,
        totalPages: Math.ceil(totalFollowing / 5),
      };
    }),
  },
};
