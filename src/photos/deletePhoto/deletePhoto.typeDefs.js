import { gql } from "graphql-tag";

export default gql`
  type Mutation {
    deletePhoto(id: Int!): MutationResponse!
  }
`;
