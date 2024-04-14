import client from "../../client";
import { protectedResolver } from "../users.utils";

export default {
  Mutation: {
    unfollowUser: protectedResolver(async (_, { id }, { loggedInUser }) => {
      const ok = await client.user.findUnique({ where: { id } });
      if (!ok) {
        return {
          ok: false,
          error: "User does not exist",
        };
      }
      await client.user.update({
        where: { id: loggedInUser.id },
        data: {
          following: {
            disconnect: {
              id,
            },
          },
        },
      });
      return {
        ok: true,
        id,
      };
    }),
  },
};
