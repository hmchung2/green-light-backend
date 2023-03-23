import { withFilter } from "graphql-subscriptions";
import pubsub from "../../pubsub";
import client from "../../client";
import { NEW_LOCATION } from "../../constant";

export default {
  Subscription: {
    mapUpdates: {
      subscribe: async (root, args, context, info) => {
        console.log("mapUpdates");
        const location = await client.location.findFirst({
          where: {
            userId: args.userId,
          },
          select: { userId: true },
        });

        if (!location) {
          throw new Error("No Location to be updated");
        }

        return withFilter(
          () => pubsub.asyncIterator(NEW_LOCATION),
          async ({ mapUpdates }, { userId }, { loggedInUser }) => {
            console.log("filtering");
            if (userId === loggedInUser.id) {
              console.log("map update validated returning true");
              return true;
            } else {
              console.log("returning false");
              return false;
            }
          }
        )(root, args, context, info);
      },
    },
  },
};
