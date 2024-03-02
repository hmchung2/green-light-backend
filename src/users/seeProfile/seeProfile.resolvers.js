import client from "../../client";

export default {
    Query: {
        seeProfile: (_, {id}) => {
            console.log("id : ", id);
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
