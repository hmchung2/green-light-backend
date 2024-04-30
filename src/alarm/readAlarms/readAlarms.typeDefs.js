import { gql } from "graphql-tag";

export default gql`
  type ReadAlarmsResponse{
    id : Int!
    alarms: [Alarm!]!
    pageInfo: PageInfo!
  }
  type Query {
    readAlarms(cursor: Int): ReadAlarmsResponse!
  }
`;
