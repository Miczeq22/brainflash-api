export default /* GraphQL */ `
  extend type Query {
    getAllTags: [String!]! @auth
  }
`;
