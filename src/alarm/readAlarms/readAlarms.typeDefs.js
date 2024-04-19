import { gql } from "graphql-tag";

export default gql`
  type Query {
    readAlarms(page: Int): [Alarm!]!
  }
`;
