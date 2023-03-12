import { gql } from "graphql-tag";

export default gql`
  type Location {
    userId: Int!
    user: User!
    lat: Float
    lon: Float
  }
`;
