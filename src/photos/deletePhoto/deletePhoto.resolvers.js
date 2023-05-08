import client from "../../client";
import { deleteFromS3 } from "../../shared/shared.utils";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    deletePhoto: protectedResolver(async (_, { id }, { loggedInUser }) => {
      const photo = await client.photo.findUnique({
        where: {
          id,
        },
        select: {
          userId: true,
          file: true,
        },
      });

      if (!photo) {
        return {
          ok: false,
          error: "Photo not Found",
        };
      } else if (photo.userId !== loggedInUser.id) {
        return {
          ok: false,
          error: "Not Authorized",
        };
      } else {
        const success = await deleteFromS3(photo.file);
        if (!success) {
          return {
            ok: false,
            error: "Unable to Delete",
          };
        }

        await client.photo.delete({
          where: {
            id,
          },
        });

        return {
          ok: true,
        };
      }
    }),
  },
};
