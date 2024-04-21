import { gql } from "graphql-tag";


export default gql`
    type Subscription{
        alarmUpdates: Alarm
    }
`;
