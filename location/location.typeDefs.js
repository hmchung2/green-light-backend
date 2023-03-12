import { gql } from "graphql-tag";

export default gql`
  type Location {
    user: User!
    lat: Float
    lon: Float
  }
`;
