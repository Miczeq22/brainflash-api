import { Query } from '@app/processing/query';

export const GET_ALL_TAGS_QUERY = 'tags/get-all';

export class GetAllTagsQuery extends Query {
  constructor() {
    super(GET_ALL_TAGS_QUERY, {});
  }
}
