import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    checkUnreadAlarm: protectedResolver(async (_, __, { loggedInUser }) => {
        const unreadCount = await client.alarm.count({
            where : {
                userId : loggedInUser.id,
                read: false
            }
        })
        return unreadCount > 0;
    }),
  },
};
