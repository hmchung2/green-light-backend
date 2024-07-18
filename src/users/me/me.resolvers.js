import client from "../../client";
import { protectedResolver } from "../users.utils";

export default {
  Query: {
    me: protectedResolver((_, __, { loggedInUser }) =>
      client.user.findUnique({
        where: { id: loggedInUser.id },
        include: {
          photos: true, // Assuming 'photos' is the name of the relation in your schema
        },
      })
    ),
  },
};
