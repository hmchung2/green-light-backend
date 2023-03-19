import { gql } from "graphql-tag";

export default gql`
  type Query {
    searchUsers(keyword: String!, lastId: Int): [User]!
  }
`;
