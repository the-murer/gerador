import { BaseObject } from '../../../utils';

export function generateGetByIdHandler(obj: BaseObject) {
  const { entity, apiPath } = obj;

  const handler = `
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { ${entity.pluralPascal()}Repository } from '../${entity.pluralKebab()}.repository';
import { ${entity.pascalCase()} } from '../${entity.pluralKebab()}.schema';
import { UniqueIdDto } from '@app/app/dtos/unique-id.dto';

interface Find${entity.pascalCase()}ByIdHandlerInput extends UniqueIdDto {}

type Find${entity.pascalCase()}ByIdHandlerOutput = ${entity.pascalCase()};

@Injectable()
export class Find${entity.pascalCase()}ByIdHandler
  implements CommandHandler<Find${entity.pascalCase()}ByIdHandlerInput, Find${entity.pascalCase()}ByIdHandlerOutput>
{
  constructor(
    @Inject(${entity.pluralPascal()}Repository)
    private readonly ${entity.camelCase()}Repository: ${entity.pluralPascal()}Repository
  ) {}

  public async execute({ id }: Find${entity.pascalCase()}ByIdHandlerInput) {
    const ${entity.camelCase()} = await this.${entity.camelCase()}Repository.findById(id);

    if (!${entity.camelCase()}) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    return ${entity.camelCase()};
  }
}
`;
  return {
    template: handler,
    path: `${apiPath}/${entity.kebabCase()}/handlers/find-${entity.kebabCase()}-by-id.handler.ts`,
  };
}
