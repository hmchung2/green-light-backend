import client from "../../client";

export default {
    Query: {
        seeProfile: (_, {id}) => {
            return client.user.findUnique({
                where: {
                    id,
                },
                include: {
                    photos: true,
                },
            })
        }
    },
};
