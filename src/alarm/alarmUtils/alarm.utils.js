import client from "../../client";
import pubsub from "../../pubsub";
import {NEW_ALARM} from "../../constant";

export const mutualAlarm = async (loggedInUser, targetUser) =>{
    const userAlarm = await client.alarm.create({
        data: {
            msg : "Green Light!",
            detail: "You have a green light with " + targetUser.username,
            user: {
                connect: {
                    id: loggedInUser.id
                }
            },
            alarmType : 1,
            alarmImg : targetUser.avatar,
            targetId : targetUser.id,
        }
    })
    const targetAlarm = await client.alarm.create({
        data: {
            msg : "Green Light!",
            detail: "You have a green light with " + loggedInUser.username,
            user: {
                connect: {
                    id: targetUser.id
                }
            },
            alarmType : 1,
            alarmImg : loggedInUser.avatar,
            targetId : loggedInUser.id,
        }
    })
    console.log("pubsub");
    console.log('userAlarm >>> ', userAlarm);
    console.log('targetAlarm >>> ', targetAlarm);
    pubsub.publish(NEW_ALARM, {alarmUpdates: userAlarm }).catch(err => console.error("Error publishing message:", err));
    pubsub.publish(NEW_ALARM, {alarmUpdates: targetAlarm}).catch(err => console.error("Error publishing message:", err));
}
