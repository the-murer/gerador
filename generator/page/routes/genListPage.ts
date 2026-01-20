import { GeneratorBaseObject } from '@/generator/utils';

export function generateListRoute(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
  import { createFileRoute } from '@tanstack/react-router'
  import { ${entity.pluralPascal()}Page } from '@/modules/${entity.kebabCase()}/pages/${entity.pluralKebab()}-page'

export const Route = createFileRoute('/admin/${entity.pluralKebab()}/')({
  component: ${entity.pluralPascal()}Page,
})
`;

  return {
    template,
    path: `routes/admin/${entity.pluralKebab()}/index.tsx`,
  };
}
