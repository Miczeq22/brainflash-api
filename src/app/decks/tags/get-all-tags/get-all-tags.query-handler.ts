import { QueryHandler } from '@app/processing/query-handler';
import { TagRepository } from '@core/decks/tags/tag.repository';
import { TagsCacheRepository } from '@infrastructure/redis/domain/tags/tags.cache-repository';
import { GetAllTagsQuery, GET_ALL_TAGS_QUERY } from './get-all-tags.query';

interface Dependencies {
  tagRepository: TagRepository;
  tagsCacheRepository: TagsCacheRepository;
}

export class GetAllTagsQueryHandler extends QueryHandler<GetAllTagsQuery, string[]> {
  constructor(private readonly dependencies: Dependencies) {
    super(GET_ALL_TAGS_QUERY);
  }

  public async handle() {
    const { tagRepository, tagsCacheRepository } = this.dependencies;

    const cacheKey = 'ALL_TAGS';

    let tagsFromCache = await tagsCacheRepository.getData(cacheKey);

    if (!tagsFromCache || !tagsFromCache.length) {
      const result = (await tagRepository.findAll()).map((tag) => tag.getName());

      await tagsCacheRepository.persistData(cacheKey, result, 60);

      tagsFromCache = await tagsCacheRepository.getData(cacheKey);
    }

    return tagsFromCache;
  }
}
