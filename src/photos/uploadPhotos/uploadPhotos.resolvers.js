import client from "../../client";
import { uploadToS3 } from "../../shared/s3.utils";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    uploadPhotos: protectedResolver(async (_, { ufiles }, { loggedInUser }) => {
      console.log("uploading multiple photos");

      // Check the current count of photos
      const uploadCounts = await client.photo.count({
        where: {
          user: {
            id: loggedInUser.id,
          },
        },
      });

      // Check if adding new photos exceeds the limit
      if (uploadCounts + ufiles.length > 5) {
        return {
          ok: false,
          error: "You have reached the limit of 5 photos.",
        };
      }

      try {
        // Upload each file and store its URL
        const photoUploadPromises = ufiles.map(async (ufile) => {
          const fileUrl = await uploadToS3(ufile, loggedInUser.id, "uploads");
          console.log(fileUrl);
          return client.photo.create({
            data: {
              file: fileUrl,
              user: {
                connect: {
                  id: loggedInUser.id,
                },
              },
            },
          });
        });

        // Execute all upload promises
        await Promise.all(photoUploadPromises);

        return {
          ok: true,
        };
      } catch (error) {
        console.error("Error uploading photos:", error);
        return {
          ok: false,
          error: "Failed to upload photos. Please try again.",
        };
      }
    }),
  },
};
