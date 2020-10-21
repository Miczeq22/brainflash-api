import { GetAllTagsQuery } from '@app/decks/tags/get-all-tags/get-all-tags.query';
import { ApolloContext } from '../apollo.server';
import { QueryResolvers } from './resolver.types';

const getAllTags: QueryResolvers['getAllTags'] = async (_, __, { queryBus }: ApolloContext) =>
  queryBus.handle(new GetAllTagsQuery());

export const resolvers = {
  Query: {
    getAllTags,
  },
};
