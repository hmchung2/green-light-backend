import client from "../../client";
import bcrypt from "bcrypt";
import { uploadToS3 } from "../../shared/shared.utils";
import {protectedResolver} from "../../users/users.utils";
import {hasDataSourcemap} from "@babel/cli/lib/babel/util";


export default{
    Mutation:{
        createRoom: protectedResolver(async (_, {targetId}, {loggedInUser}) =>{
            const targetUser = await client.user.findUnique({
                where: { id: targetId },
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
            // Check if a room already exists with exactly these two users
            const existingRoom = await client.room.findFirst({
                where: {
                    users: {
                        some: { id: loggedInUser.id },
                        every: {
                            OR: [
                                { id: loggedInUser.id },
                                { id: targetId }
                            ]
                        }
                    }
                },
                include: {
                    users: {
                        select: { id: true } // Select only ids for comparison
                    }
                },
            });
            if (existingRoom && existingRoom.users.length === 2) {
                console.log("room already exists");
                return {
                    ok: true,
                    id: existingRoom.id,
                };
            }
            const newRoom = await client.room.create({
                data: {
                    users: {
                        connect: [
                            { id: loggedInUser.id },
                            { id: targetId }
                        ],
                    },
                },
            });

            return {
                ok : true,
                id : newRoom.id,
            }
        })
    }
}
