import client from "../../client";
import { NEW_LOCATION } from "../../constant";
import pubsub from "../../pubsub";
import { calculateDistance, protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    updateLocation: protectedResolver(
      async (_, { lat, lon }, { loggedInUser }) => {
        try {
          console.log("requested !!!!!!")
          const location = await client.location.update({
            where: {
              userId: loggedInUser.id,
            },
            data: {
              lat,
              lon,
            },
          });
          pubsub.publish(NEW_LOCATION, {
            mapUpdates: { ...location, user: { ...loggedInUser } },
          });
          return { ok: true };
        } catch (e) {
          console.log("error : ", e);
          return { ok: false, error: e };
        }
      }
    ),
  },
};
