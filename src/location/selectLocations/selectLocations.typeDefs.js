import { gql } from "graphql-tag";

export default gql`
  type Query {
    selectLocations(lat: Float!, lon: Float!): [Location!]
  }
`;
