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
                console.log("args : " , args);
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
                        if(mapUpdates.userId == loggedInUser.id){
                            console.log("updated object is the user so returning false")
                            return false;
                        }

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
                            console.log("found unique : " ,userDetailLocation);
                            return true;
                            // if (
                            //     userDetailLocation.lat && userDetailLocation.lon &&
                            //     calculateDistance(
                            //         userDetailLocation.lat,
                            //         userDetailLocation.lon,
                            //         mapUpdates.lat,
                            //         mapUpdates.lon
                            //     ) < 2000000000000000
                            // ) {
                            //     console.log("returning true");
                            //     return true;
                            // }else{
                            //     const utilityDistance =  calculateDistance(
                            //         userDetailLocation.lat,
                            //         userDetailLocation.lon,
                            //         mapUpdates.lat,
                            //         mapUpdates.lon
                            //     );
                            //     console.log(utilityDistance);
                            // }
                        }
                        console.log("returning false");
                        return false;
                    }
                )(root, args, context, info);
            },
        },
    },
};
