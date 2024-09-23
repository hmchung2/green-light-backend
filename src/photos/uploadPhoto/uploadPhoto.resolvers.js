import client from "../../client";
import { uploadToS3 } from "../../shared/s3.utils";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    uploadPhoto: protectedResolver(async (_, { ufile }, { loggedInUser }) => {
      console.log("uploading");
      const uploadCounts = await client.photo.count({
        where: {
          user: {
            id: loggedInUser.id,
          },
        },
      });
      if (uploadCounts >= 5) {
        throw new Error("You have reached the limit of 5 photos.");
      }
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
    }),
  },
};
