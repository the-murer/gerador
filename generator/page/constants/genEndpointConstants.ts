import { GeneratorBaseObject } from '@/generator/utils';

export function generateEndpointConstants(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
import { DefaultEndpoint } from '@/common/api/base-endpoint'
import type { ${entity.pascalCase()} } from './${entity.kebabCase()}-schemas'

class ${entity.pascalCase()}Endpoints extends DefaultEndpoint<${entity.pascalCase()}> {
  constructor() {
    super('${entity.pluralKebab()}', '${entity.kebabCase()}')
  }
}

export const ${entity.camelCase()}Api = new ${entity.pascalCase()}Endpoints()
`;

  return {
    template,
    path: `modules/${entity.kebabCase()}/utils/${entity.kebabCase()}-constants.ts`,
  };
}
