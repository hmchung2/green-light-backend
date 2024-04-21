import client from "../../client";
import {withFilter} from "graphql-subscriptions";
import pubsub from "../../pubsub";
import {NEW_ALARM} from "../../constant";

export default {
    Subscription: {
        alarmUpdates: {
            subscribe: async (root, args, context, info) => {
                console.log("Alarm update for user ID: " + context.loggedInUser.id);
                const user = await client.user.findUnique({
                    where: {
                        id: context.loggedInUser.id,
                    }
                });
                if (!user) {
                    throw new Error("No User Found !!!");
                }
                return withFilter(
                    () => pubsub.asyncIterator(NEW_ALARM),
                    async ({ alarmUpdates }, _, { loggedInUser }) => {
                        console.log("Alarm received:", alarmUpdates);
                        return alarmUpdates.userId === loggedInUser.id;
                    }
                )(root, args, context, info);
            }
        }
    }
};
