import { BaseObject } from '../../../utils';

export function generateDeleteHandler(obj: BaseObject) {
  const { entity, apiPath } = obj;

  const handler = `
import { Injectable } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { ${entity.pascalCase()} } from '../${entity.pluralKebab()}.schema';
import { ${entity.pascalCase()}Repository } from '../${entity.pluralKebab()}.repository';
import { UniqueIdDto } from '@app/app/dtos/unique-id.dto';

interface Delete${entity.pascalCase()}HandlerInput extends UniqueIdDto {}

type Delete${entity.pascalCase()}HandlerOutput = ${entity.pascalCase()};

@Injectable()
export class Delete${entity.pascalCase()}Handler
  implements
    CommandHandler<Delete${entity.pascalCase()}HandlerInput, Delete${entity.pascalCase()}HandlerOutput>
{
  constructor(private readonly ${entity.camelCase()}Repository: Delete${entity.pascalCase()}Repository) {}

  public async execute({ id }: Delete${entity.pascalCase()}HandlerInput) {
    const ${entity.camelCase()} = await this.${entity.camelCase()}Repository.delete(id);

    return ${entity.camelCase()};
  }
}
`;
  return {
    template: handler,
    path: `${apiPath}/${entity.kebabCase()}/handlers/delete-${entity.kebabCase()}.handler.ts`,
  };
}
