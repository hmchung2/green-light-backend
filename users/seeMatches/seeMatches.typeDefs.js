import { gql } from "graphql-tag";

export default gql`
  type Query {
    seeMatches(lastId: Int): [User]
  }
`;
