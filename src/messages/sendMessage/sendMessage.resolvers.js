import client from "../../client";
import { CHAT_LIST_UPDATES, NEW_MESSAGE } from "../../constant";
import pubsub from "../../pubsub";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    sendMessage: protectedResolver(
      async (_, { payload, roomId, userId }, { loggedInUser }) => {
        let room = null;
        let userList = [];

        if (userId) {
          console.log("userId available");
          const user = await client.user.findUnique({
            where: {
              id: userId,
            },
            select: {
              id: true,
            },
          });
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
          roomId = room.id;
          userList = [userId];
        } else if (roomId) {
          console.log("roomId available");
          room = await client.room.findUnique({
            where: {
              id: roomId,
            },
            select: {
              id: true,
              users: {
                select: {
                  id: true,
                },
              },
            },
          });
          if (!room) {
            return {
              ok: false,
              error: "Room Not found",
            };
          }
          userList = room.users.map((user) => user.id);
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
        console.log("User List for Notification:", userList);
        console.log("now firing pubsub to users");
        userList.forEach((userId) => {
          pubsub.publish(CHAT_LIST_UPDATES, {
            chatListUpdates: {
              roomId,
              id: userId, // Each user gets their own event
              lastMessage: message,
            },
          });
        });

        pubsub.publish(NEW_MESSAGE, { roomUpdates: { ...message } }).catch((err) => console.error("Error publishing message:", err));
        // pubsub.publish("MESSAGE_UPDATES", { messageUpdates: createdMessage });
        return { ok: true, id: message.id };
      },
    ),
  },
};
