import client from "../../client";
import { protectedResolver } from "../users.utils";

export default {
  Mutation: {
    followUser: protectedResolver(async (_, { id }, { loggedInUser }) => {
      console.log("Reached here : " + id);
      const ok = await client.user.findUnique({ where: { id } });
      if (!ok) {
        return {
          ok: false,
          error: "User does not exist",
        };
      }

      await client.user.update({
        where: {
          id: loggedInUser.id,
        },
        data: {
          following: {
            connect: {
              id,
            },
          },
        },
      });

      return {
        ok: true,
      };
    }),
  },
};
