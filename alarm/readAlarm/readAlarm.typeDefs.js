import { gql } from "graphql-tag";

export default gql`
  type Mutation {
    readAlarm(id: Int!): MutationResponse!
  }
`;
