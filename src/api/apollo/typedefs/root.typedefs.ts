export default /* GraphQL */ `
  directive @auth on FIELD | FIELD_DEFINITION

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }

  type EmptyResponse {
    _: Boolean
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;
