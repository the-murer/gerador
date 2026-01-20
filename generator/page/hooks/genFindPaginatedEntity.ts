import { GeneratorBaseObject } from '@/generator/utils';

export function generateFindPaginatedHook(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
import { useQuery } from '@tanstack/react-query'
import type { PaginatedParams } from '@/common/api/api-types'
import { ${entity.camelCase()}Api } from '../utils/${entity.kebabCase()}-constants'

export const useFind${entity.pluralPascal()} = ({
  page,
  limit = 10,
  sort,
  sortOrder,
}: PaginatedParams) => {
  return useQuery({
    queryFn: () => ${entity.camelCase()}Api.find({ page, limit, sort, sortOrder }),
    queryKey: ${entity.camelCase()}Api.keys.find({ page, limit, sort, sortOrder }),
  })
}
`;

  return {
    template,
    path: `modules/${entity.kebabCase()}/hooks/use-find-${entity.pluralKebab()}.ts`,
  };
}
