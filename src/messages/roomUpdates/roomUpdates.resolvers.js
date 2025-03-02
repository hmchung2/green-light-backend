import { withFilter } from "graphql-subscriptions";
import pubsub from "../../pubsub";
import client from "../../client";
import { NEW_MESSAGE } from "../../constant";

export default {
  Subscription: {
    roomUpdates: {
      subscribe: async (root, args, context, info) => {
        console.log("roomUpdates");
        const room = await client.room.findFirst({
          where: {
            id: args.id,
            users: {
              some: {
                id: context.loggedInUser.id,
              },
            },
          },
          select: {
            id: true,
          },
        });
        console.log("happening");
        if (!room) {
          throw new Error("You shall not see this.");
        }
        return withFilter(
            () => pubsub.asyncIterator(NEW_MESSAGE),
            ({ roomUpdates }, { id }) => {
              return roomUpdates.roomId === id;
            }
        )(root, args, context, info);
        // return withFilter(
        //   () => pubsub.asyncIterator(NEW_MESSAGE),
        //   async ({ roomUpdates }, { id }, { loggedInUser }) => {
        //     if (roomUpdates.roomId === id) {
        //       const room = await client.room.findFirst({
        //         where: {
        //           id,
        //           users: {
        //             some: {
        //               id: loggedInUser.id,
        //             },
        //           },
        //         },
        //         select: { id: true },
        //       });
        //       if (!room) {
        //         return false;
        //       }
        //       return true;
        //     }
        //   }
        // )(root, args, context, info);
      },
    },
  },
};
