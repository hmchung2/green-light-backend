import { gql } from "graphql-tag";

export default gql`
  type Query {
    initMap(lat: Float!, lon: Float!): [Location]
  }
`;
