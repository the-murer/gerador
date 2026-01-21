import { GeneratorBaseObject, mapObjectFields } from '@/generator/utils';

export function generatePageFilters(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
import {
  PageFilters,
  type DefaultPageFiltersProps,
} from '@/ui/blocks/filters/page-filters'

export const ${entity.pluralPascal()}Filters = ({
  search,
  updateSearchParams,
}: DefaultPageFiltersProps) => {
  return (
    <PageFilters search={search} updateSearchParams={updateSearchParams}>
      <PageFilters.Content>
      ${mapObjectFields(
        obj.model,
        (key) => `<PageFilters.Input label="${key}" name="${key}" />`,
      ).join('\n  ')}
      </PageFilters.Content>
      <PageFilters.Actions />
    </PageFilters>
  )
}
`;

  return {
    template,
    path: `modules/${entity.kebabCase()}/components/${entity.kebabCase()}-filters.tsx`,
  };
}
