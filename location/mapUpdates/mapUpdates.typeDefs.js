import { gql } from "graphql-tag";

export default gql`
  type Subscription {
    mapUpdates(userId: Int!): [Location]!
  }
`;
