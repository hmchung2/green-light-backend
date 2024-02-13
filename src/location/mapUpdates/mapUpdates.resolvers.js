import {withFilter} from "graphql-subscriptions";
import pubsub from "../../pubsub";
import client from "../../client";
import {NEW_LOCATION} from "../../constant";
import {calculateDistance} from "../../users/users.utils";

export default {
    Subscription: {
        mapUpdates: {
            subscribe: async (root, args, context, info) => {
                console.log("mapUpdates id!!!!!!!!!!!!!!!!!! : " + context.loggedInUser.id);
                const location = await client.location.findFirst({
                    where: {
                        userId: context.loggedInUser.id,
                    },
                    select: {userId: true, lat : true , lon : true},
                });
                console.log(location.userId);
                if (!location || !location.lat || !location.lon) {
                    throw new Error("No Location to be updated");
                }
                return withFilter(
                    () => pubsub.asyncIterator(NEW_LOCATION),
                    async (
                        {mapUpdates},
                        {generalLat, generalLon},
                        {loggedInUser}
                    ) => {
                        if (
                            Math.abs(generalLat - mapUpdates.lat) < 0.05 &&
                            Math.abs(generalLon - mapUpdates.lon) < 0.05
                        ) {
                            console.log("ok closeBy user : " , loggedInUser.id);
                            const userDetailLocation = await client.location.findUnique({
                                where: {
                                    userId: loggedInUser.id,
                                },
                                select: {lat: true, lon: true},
                            });
                            if (
                                userDetailLocation.lat && userDetailLocation.lon &&
                                calculateDistance(
                                    userDetailLocation.lat,
                                    userDetailLocation.lon,
                                    mapUpdates.lat,
                                    mapUpdates.lon
                                ) < 150
                            ) {
                                console.log("returning true");
                                return true;
                            }
                        }
                        console.log("returning false");
                        return false;
                    }
                )(root, args, context, info);
            },
        },
    },
};
