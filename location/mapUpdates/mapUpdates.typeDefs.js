import { gql } from "graphql-tag";

export default gql`
  type Subscription {
    mapUpdates(userId: Int!, generalLat: Float!, generalLon: Float!): Location!
  }
`;
