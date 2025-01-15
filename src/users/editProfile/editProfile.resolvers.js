import client from "../../client";
import { protectedResolver } from "../users.utils";
import { deleteFromS3, uploadToS3 } from "../../shared/s3.utils";

export default {
  Mutation: {
    editProfile: protectedResolver(
      async (
        _,
        { username, description, gender, birthDay, avatar, photos },
        { loggedInUser },
      ) => {
        try {
          let avatarUrl = null;
          if (avatar) {
            avatarUrl = await uploadToS3(avatar, loggedInUser.id, "avatars");
          }
          console.log("photos : " , photos)
          if (photos && photos.length > 0) {
            for (const photo of photos) {
              if (!photo.originalId || photo.id !== photo.originalId) {
                if (photo.originalId) {
                  console.log("removing original id:", photo.originalId);
                  await deleteFromS3(photo.originalFileUrl);
                  await client.photo.delete({
                    where: { id: photo.originalId },
                  });
                }
                if (photo.file) {
                  console.log("inserting new file");
                  const fileUrl = await uploadToS3(
                      photo.file,
                      loggedInUser.id,
                      "uploads"
                  );
                  await client.photo.create({
                    data: {
                      file: fileUrl,
                      user: {
                        connect: {
                          id: loggedInUser.id,
                        },
                      },
                    },
                  });
                }
              }
            }
          }
          const updatedData = {};
          if (username) updatedData.username = username;
          if (description) updatedData.description = description;
          if (gender) updatedData.gender = gender;
          if (birthDay) updatedData.birthDay = birthDay;
          if (avatar) updatedData.avatar = avatarUrl;

          await client.user.update({
            where: { id: loggedInUser.id },
            data: updatedData,
          });
          return {
            ok: true,
          };
        } catch (error) {
          console.error("Error editing profile:", error);
          return {
            ok: false,
            error: "Failed to edit profile.",
          };
        }
      },
    ),
  },
};
