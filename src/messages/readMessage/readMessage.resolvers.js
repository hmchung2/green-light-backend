import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    readMessage: protectedResolver(async (_, { id }, { loggedInUser }) => {
      const message = await client.message.findFirst({
        where: {
          id,
          userId: { not: loggedInUser.id },
          room: { users: { some: { id: loggedInUser.id } } },
        },
        select: {
          id: true,
        },
      });
      if (!message) {
        console.log("this called? , : ", id);
        return {
          ok: false,
          error: "Message Not Found",
        };
      }

      await client.message.update({
        where: {
          id,
        },
        data: {
          read: true,
        },
      });

      return { ok: true };
    }),
  },
};
