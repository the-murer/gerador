import { BaseObject, injectTemplate } from '@/generator/utils';

const marker = '/* SUBJECT_INJECTOR */';

export function injectApiRole(obj: BaseObject) {
  const { entity, apiPath } = obj;
  const filePath = `${apiPath}/auth/roles/roles.factory.ts`;
  const template = `'${entity.pascalCase()}' | `;

  injectTemplate({
    template,
    path: filePath,
    marker,
    position: 'before',
  });
}
