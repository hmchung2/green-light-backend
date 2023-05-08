import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    deleteFreeze: protectedResolver(async (_, { id }, { loggedInUser }) => {
      const freeze = await client.freeze.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          freezerId: true,
        },
      });

      if (!freeze) {
        return {
          ok: false,
          error: "Freeze Not found",
        };
      } else if (freeze.freezerId !== loggedInUser.id) {
        return {
          ok: false,
          error: "Not Authorized",
        };
      }

      await client.freeze.delete({
        where: {
          id,
        },
      });
      return {
        ok: true,
      };
    }),
  },
};
