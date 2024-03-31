import client from "../../client";
import { NEW_LOCATION } from "../../constant";
import pubsub from "../../pubsub";
import {getUser, protectedResolver} from "../../users/users.utils";

// export default {
//     Mutation: {
//         removeLocation: protectedResolver(
//             async (_, __, { loggedInUser }) => {
//                 console.log("removing locations!!!!!!!!!!!!!!! : "  , lat  , " :  ", lon );
//                 try {
//                     const location = await client.location.update({
//                         where: {
//                             userId: loggedInUser.id,
//                         },
//                         data: {
//                             lat : null,
//                             lon : null,
//                         },
//                     });
//                     pubsub.publish(NEW_LOCATION, {
//                         mapUpdates: { ...location, user: { ...loggedInUser }},
//                     }).catch(e => console.error("Error publishing new location", e));
//                     return { ok: true };
//                 } catch (e) {
//                     console.log("error : ", e);
//                     return { ok: false, error: e };
//                 }
//             }
//         ),
//     },
// };


export default async function removeLocation(token) {
    if(token){
        const loggedInUser = await getUser(token);
        if(loggedInUser.id){
            try {
                console.log(loggedInUser.id);
                const location = await client.location.update({
                    where: {
                        userId: loggedInUser.id,
                    },
                    data: {
                        lat : null,
                        lon : null,
                    },
                });
                pubsub.publish(NEW_LOCATION, {
                    mapUpdates: { ...location, user: { ...loggedInUser }},
                }).catch(e => console.error("Error publishing new location", e));

                console.log("Location removed successfully");
            } catch (e) {
                console.error("Error removing location:", e);
            }
        }
    }
}
