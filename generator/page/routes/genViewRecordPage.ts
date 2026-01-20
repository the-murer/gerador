import { GeneratorBaseObject } from '@/generator/utils';

export function generateViewRecordRoute(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
import { ${entity.pascalCase()}Page } from '@/modules/${entity.kebabCase()}/pages/${entity.kebabCase()}-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/${entity.pluralKebab()}/$id')({
  component: ${entity.pascalCase()}Page,
})
`;

  return {
    template,
    path: `routes/admin/${entity.pluralKebab()}/$id.tsx`,
  };
}
