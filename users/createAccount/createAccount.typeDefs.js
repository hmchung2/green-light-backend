import { ApolloServer } from "@apollo/server";

export default `#graphql
    type Mutation {
        createAccount(username : String!) : String
    }
`;
