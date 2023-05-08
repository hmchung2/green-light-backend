import { gql } from "graphql-tag";

export default gql`
  type Mutation {
    freezeMoment(lat: Float!, lon: Float!, maxD: Float): MutationResponse!
  }
`;
