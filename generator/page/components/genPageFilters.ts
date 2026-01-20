import { GeneratorBaseObject } from '@/generator/utils';

export function generatePageFilters(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
import {
  PageFilters,
  type DefaultPageFiltersProps,
} from '@/ui/blocks/filters/page-filters'

export const UsersFilters = ({
  search,
  updateSearchParams,
}: DefaultPageFiltersProps) => {
  return (
    <PageFilters search={search} updateSearchParams={updateSearchParams}>
      <PageFilters.Content>
        <PageFilters.Input label="Nome" name="name" />
        <PageFilters.Input label="Email" name="email" />
        <PageFilters.Input label="Ativo" name="active" />
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
