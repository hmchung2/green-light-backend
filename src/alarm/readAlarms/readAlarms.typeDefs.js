import { gql } from "graphql-tag";

export default gql`
  type ReadAlarmsResponse{
    alarms: [Alarm!]
    pageInfo: PageInfo
  }
  type Query {
    readAlarms(cursor: Int): ReadAlarmsResponse!
  }
`;
