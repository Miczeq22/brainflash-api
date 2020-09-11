export default /* GraphQL */ `
  type Deck {
    id: ID!
    name: String!
    description: String!
    tags: [String!]!
    deleted: Boolean!
    published: Boolean!
    imageUrl: String
    owner: String!
    createdAt: String!
    cardCount: Int!
  }

  extend type Query {
    getDeck(deckID: ID!): Deck! @auth
  }
`;
