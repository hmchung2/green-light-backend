import { gql } from "graphql-tag";

export default gql`
  type Subscription {
    mapUpdates(generalLat: Float!, generalLon: Float!): Location!
  }
`;
