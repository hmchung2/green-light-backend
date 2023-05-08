import { gql } from "graphql-tag";

export default gql`
  type Mutation {
    deleteAlarm(id: Int!): MutationResponse!
  }
`;
