import { BaseObject } from '../../../utils';

export function generateFindDto(obj: BaseObject) {
  const { entity, apiPath } = obj;

  const template = `
import { DefaultPaginationDto } from '@app/app/dtos/default-pagination.dto';
import { ${entity.pascalCase()} } from '../${entity.kebabCase()}.schema';

export class Find${entity.pluralPascal()}Dto extends DefaultPaginationDto<${entity.pascalCase()}> {}

  `;
  return {
    template,
    path: `${apiPath}/${entity.kebabCase()}/dto/find-${entity.pluralKebab()}.dto.ts`,
  };
}
