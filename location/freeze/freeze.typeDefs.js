import { gql } from "graphql-tag";

export default gql`
  type Mutation {
    freeze(lat: Float!, lon: Float!, maxD: Float): MutationResponse!
  }
`;
