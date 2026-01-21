import { GeneratorBaseObject, injectTemplate } from '@/generator/utils';

const marker = '/* SUBJECT_INJECTOR */';

export function injectRoleSubject(obj: GeneratorBaseObject) {
  const { entity, frontPath } = obj;
  const filePath = `${frontPath}/modules/auth/utils/ability.factory.ts`;
  const template = `'${entity.pascalCase()}' | `;

  injectTemplate({
    template,
    path: filePath,
    marker,
    position: 'before',
  });
}
