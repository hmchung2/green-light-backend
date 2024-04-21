import client from "../../client";
import { protectedResolver } from "../users.utils";
import {mutualAlarm} from "../../alarm/alarmUtils/alarm.utils";

export default {
  Mutation: {
    followUser: protectedResolver(async (_, { id }, { loggedInUser }) => {
      const targetUser = await client.user.findUnique({
        where: { id },
        include: {
          following: true  // Include followers to check if mutual follow exists
        }
      });
      if (!targetUser) {
        return {
          ok: false,
          error: "User does not exist",
        };
      }
      console.log("targetUser : " , targetUser);
      // Update loggedInUser's following list to include targetUser
      await client.user.update({
        where: { id: loggedInUser.id },
        data: {
          following: {
            connect: { id }
          }
        }
      });

      //send alarm
      const isMutualFollow = targetUser.following.some(user => user.id === loggedInUser.id);
      console.log('isMutualFollow >>> ', isMutualFollow);
      if(isMutualFollow){
        // send without await
        mutualAlarm(loggedInUser, targetUser).catch(err => {
          console.error("Failed to send mutual follow alarm:", err);
        });
      }
      return {
        id,
        ok: true,
        mutualFollow: isMutualFollow
      };
    }),
  },
};
