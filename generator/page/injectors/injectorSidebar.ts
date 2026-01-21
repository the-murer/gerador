import { GeneratorBaseObject, injectTemplate } from '@/generator/utils';

const marker = '/* NAV_ITEMS_INJECTOR */';

export function injectSidebarRoute(obj: GeneratorBaseObject) {
  const { entity, frontPath } = obj;
  const filePath = `${frontPath}/ui/blocks/header/admin-header.tsx`;

  const template = `  { title: '${entity.pluralPascal()}', to: '/admin/${entity.pluralKebab()}', icon: LayoutDashboard },\n`;

  injectTemplate({
    template,
    path: filePath,
    marker,
    position: 'before',
  });
}
