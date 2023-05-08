import { gql } from "graphql-tag";

export default gql`
  type Photo {
    id: Int!
    user: User!
    file: String!
  }
`;
