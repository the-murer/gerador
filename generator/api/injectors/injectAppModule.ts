import { BaseObject, injectTemplate } from '@/generator/utils';

const marker = '/* MODULES_INJECTOR */';
/* MODULES_INJECTOR */

export function injectAppModule(obj: BaseObject) {
  const { entity, apiPath } = obj;
  const filePath = `${apiPath}/app/app.module.ts`;

  // Injeta o import do módulo antes do @Module (depois do último import)
  const importTemplate = `import { ${entity.pluralPascal()}Module } from '../${entity.kebabCase()}/${entity.pluralKebab()}.module';
`;

  injectTemplate({
    template: importTemplate,
    path: filePath,
    marker: '@Module({',
    position: 'before',
  });

  // Injeta o módulo na lista de imports antes do marcador
  const moduleTemplate = `    ${entity.pluralPascal()}Module,
`;

  injectTemplate({
    template: moduleTemplate,
    path: filePath,
    marker,
    position: 'before',
  });
}
