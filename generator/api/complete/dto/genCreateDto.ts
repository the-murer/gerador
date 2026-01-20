import { BaseObject, mapObjectFields } from '../../../utils';

export function generateCreateDto(obj: BaseObject) {
  const { entity, apiPath, model } = obj;

  const uniqueValidatos = [
    ...new Set([mapObjectFields(model, (key, value) => value.pascalCase())]),
  ];

  const template = `
import { ${uniqueValidatos
    .map((validator) => `Is${validator}`)
    .join(', ')} } from 'class-validator';

export class Create${entity.pascalCase()}Dto {
 ${mapObjectFields(
   model,
   (key, value) => `
    @Is${value.pascalCase()}()
    ${key}: ${value};
  `,
 ).join('\n  ')}
}
`;
  return {
    template,
    path: `${apiPath}/${entity.kebabCase()}/dto/create-${entity.kebabCase()}.dto.ts`,
  };
}
