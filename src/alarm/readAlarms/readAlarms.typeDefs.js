import { gql } from "graphql-tag";

export default gql`
  type ReadAlarmsResponse{
    id : Int!
    endPage : Boolean!
    result: [Alarm!]!
  }
  type Query {
    readAlarms(offset: Int!): ReadAlarmsResponse!
  }
`;
