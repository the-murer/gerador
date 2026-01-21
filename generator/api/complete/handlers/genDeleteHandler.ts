import { BaseObject } from '../../../utils';

export function generateDeleteHandler(obj: BaseObject) {
  const { entity, apiPath } = obj;

  const handler = `
import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { UniqueIdDto } from '@app/app/dtos/unique-id.dto';
import { ${entity.pascalCase()} } from '../${entity.kebabCase()}.schema';
import { ${entity.pluralPascal()}Repository } from '../${entity.pluralKebab()}.repository';

interface Delete${entity.pascalCase()}HandlerInput extends UniqueIdDto {}

type Delete${entity.pascalCase()}HandlerOutput = ${entity.pascalCase()};

@Injectable()
export class Delete${entity.pascalCase()}Handler
  implements
    CommandHandler<Delete${entity.pascalCase()}HandlerInput, Delete${entity.pascalCase()}HandlerOutput>
{
  constructor(private readonly ${entity.camelCase()}Repository: ${entity.pluralPascal()}Repository) {}

  public async execute({ id }: Delete${entity.pascalCase()}HandlerInput) {
    const ${entity.camelCase()} = await this.${entity.camelCase()}Repository.delete(id);

    if (!${entity.camelCase()}) {
      throw new NotFoundException('${entity.pascalCase()} nao encontrado');
    }

    return ${entity.camelCase()};
  }
}
`;
  return {
    template: handler,
    path: `${apiPath}/${entity.kebabCase()}/handlers/delete-${entity.kebabCase()}.handler.ts`,
  };
}
