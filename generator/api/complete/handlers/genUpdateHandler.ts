import { BaseObject } from '../../../utils';

export function generateUpdateHandler(obj: BaseObject) {
  const { entity, apiPath } = obj;

  const handler = `
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { ${entity.pluralPascal()}Repository } from '../${entity.pluralKebab()}.repository';
import { Create${entity.pascalCase()}Dto } from '../dto/create-${entity.kebabCase()}.dto';
import { ${entity.pascalCase()} } from '../${entity.kebabCase()}.schema';

interface Update${entity.pascalCase()}HandlerInput extends Partial<Create${entity.pascalCase()}Dto> {
  id: string
}

type Update${entity.pascalCase()}HandlerOutput = ${entity.pascalCase()};

@Injectable()
export class Update${entity.pascalCase()}Handler
  implements CommandHandler<Update${entity.pascalCase()}HandlerInput, Update${entity.pascalCase()}HandlerOutput>
{
  constructor(
    @Inject(${entity.pluralPascal()}Repository)
    private readonly ${entity.pluralKebab()}Repository: ${entity.pluralPascal()}Repository,
  ) {}

  public async execute({ id, ...input }: Update${entity.pascalCase()}HandlerInput) {
    const ${entity.camelCase()} = await this.${entity.pluralKebab()}Repository.updateById(id, input);

    if (!${entity.camelCase()}) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    return ${entity.camelCase()};
  }
}
`;
  return {
    template: handler,
    path: `${apiPath}/${entity.kebabCase()}/handlers/update-${entity.kebabCase()}.handler.ts`,
  };
}
