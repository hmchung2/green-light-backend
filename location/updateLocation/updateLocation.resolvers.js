import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    updateLocation: protectedResolver(
      async (_, { lat, lon }, { loggedInUser }) => {
        try {
          // Update the location record in the database
          await client.location.update({
            where: {
              // Define the conditions to find the location record to update
              // For example, you could use the user ID to identify the location of the user
              userId: loggedInUser.id,
            },
            data: {
              // Update the lat and lon fields with the new values
              lat,
              lon,
            },
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
