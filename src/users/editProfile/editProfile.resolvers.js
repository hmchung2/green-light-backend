import { createWriteStream } from "fs";
import client from "../../client";
import bcrypt from "bcrypt";
import { protectedResolver } from "../users.utils";
import { isFileFromS3, uploadToS3 } from "../../shared/s3.utils";

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
          console.log("avatarUrl : ", avatarUrl);

          if (photos && photos.length > 0) {
            console.log("photos : ", photos);
            const photoUploadPromises = photos.map(async (photo) => {
              if (!photo.id && photo.file) {
                console.log("new photo");
                const fileUrl = await uploadToS3(
                  photo.file,
                  loggedInUser.id,
                  "uploads",
                );
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
              } else if (photo.id && !photo.file) {
                console.log("delete photo");
                const deleted = await deleteFromS3(photo.file);
                if (!deleted) {
                  console.error("failed to delete photo : ", photo.file);
                }
                return client.photo.delete({
                  where: { id: photo.id },
                });
              } else if (photo.id && photo.file) {
                if (!isFileFromS3(photo.file)) {
                  console.log("replace photo");
                  const existingPhoto = await client.photo.findUnique({
                    where: { id: photo.id },
                    select: { file: true },
                  });
                  const deleted = await deleteFromS3(existingPhoto.file);
                  if (!deleted) {
                    console.error("failed to delete photo : ", photo.file);
                  }
                  const fileUrl = await uploadToS3(
                    photo.file,
                    loggedInUser.id,
                    "uploads",
                  );
                  return client.photo.update({
                    where: { id: photo.id },
                    data: { file: fileUrl },
                  });
                }
              } else {
                return null;
              }
            });
            await Promise.all(photoUploadPromises);
          }
          await client.user.update({
            where: { id: loggedInUser.id },
            data: {
              username,
              description,
              sex: gender,
              birthDay,
              ...(avatarUrl && { avatar: avatarUrl }),
            },
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
