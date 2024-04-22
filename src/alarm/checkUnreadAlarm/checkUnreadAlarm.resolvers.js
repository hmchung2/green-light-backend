import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    checkUnreadAlarm: protectedResolver(async (_, __, { loggedInUser }) => {
        const unseenCount = await client.alarm.count({
            where : {
                userId : loggedInUser.id,
                seen: false
            }
        })
        return unseenCount > 0;
    }),
  },
};
