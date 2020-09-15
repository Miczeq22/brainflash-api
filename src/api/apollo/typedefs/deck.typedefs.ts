export default /* GraphQL */ `
  type Deck {
    id: ID!
    name: String!
    description: String!
    tags: [String!]!
    deleted: Boolean!
    published: Boolean!
    imageUrl: String
    ownerName: String!
    ownerId: ID!
    createdAt: String!
    cardCount: Int!
  }

  extend type Query {
    getDeck(deckID: ID!): Deck! @auth
    getAllDecks(page: Int, limit: Int): [Deck!]! @auth
  }
`;
