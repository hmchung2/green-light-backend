import client from "../../client";
import { protectedResolver } from "../users.utils";

export default {
    Query: {
        seeFollowers: protectedResolver(async (_, { page }, { loggedInUser }) => {

            const followers = await client.user
                .findUnique({
                    where: { id: loggedInUser.id },
                })
                .followers({
                    take: 5,
                    skip: (page - 1) * 5,
                });

            const totalFollowers = await client.user.count({
                where: { following: { some: { id: loggedInUser.id } } },
            });

            return {
                ok: true,
                followers,
                totalPages: Math.ceil(totalFollowers / 5),
            };
        }),
    },
};
