import client from "../../client";
import { NEW_MESSAGE } from "../../constant";
import pubsub from "../../pubsub";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    sendMessage: protectedResolver(
      async (_, { payload, roomId, userId }, { loggedInUser }) => {
        console.log("whatup");
        let room = null;
        if (userId) {
          const user = await client.user.findUnique({
            where: {
              id: userId,
            },
            select: {
              id: true,
            },
          });
          console.log("here?");
          if (!user) {
            return { ok: false, error: "This user does not exist" };
          }

          room = await client.room.create({
            data: {
              users: {
                connect: [{ id: userId }, { id: loggedInUser.id }],
              },
            },
          });
          console.log("error 1");
          roomId = room.id;
          console.log("error 2");
        } else if (roomId) {
          room = await client.room.findUnique({
            where: {
              id: roomId,
            },
            select: {
              id: true,
            },
          });
          if (!room) {
            return {
              ok: false,
              error: "Room Not found",
            };
          }
        }

        const message = await client.message.create({
          data: {
            payload,
            room: {
              connect: {
                id: roomId,
              },
            },
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
          },
        });

        pubsub.publish(NEW_MESSAGE, { roomUpdates: { ...message } });
        // pubsub.publish("MESSAGE_UPDATES", { messageUpdates: createdMessage });

        console.log("pubsub happend?");
        return { ok: true, id: message.id };
      }
    ),
  },
};
