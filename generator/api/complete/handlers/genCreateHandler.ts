import { mapObjectFields, BaseObject } from '../../../utils';

export function generateCreateHandler(obj: BaseObject) {
  const { entity, model, apiPath } = obj;

  const handler = `
import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { ${entity.pluralPascal()}Repository } from '../${entity.pluralKebab()}.repository';
import { Create${entity.pascalCase()}Dto } from '../dto/create-${entity.kebabCase()}.dto';
import { ${entity.pascalCase()} } from '../${entity.pluralKebab()}.schema';

interface Create${entity.pascalCase()}HandlerInput extends Create${entity.pascalCase()}Dto {}

type Create${entity.pascalCase()}HandlerOutput = ${entity.pascalCase()};

@Injectable()
export class Create${entity.pascalCase()}Handler
  implements CommandHandler<Create${entity.pascalCase()}HandlerInput, Create${entity.pascalCase()}HandlerOutput>
{
  constructor(
    @Inject(${entity.pluralPascal()}Repository)
    private readonly ${entity.camelCase()}Repository: ${entity.pluralPascal()}Repository
  ) {}

  public async execute(input: Create${entity.pascalCase()}HandlerInput) {
    const ${entity.camelCase()} = await this.${entity.camelCase()}Repository.create({
      ${mapObjectFields(model, (key) => `${key}: input.${key},`).join('\n  ')}
    });

    return ${entity.camelCase()};
  }
}
`;
  return {
    template: handler,
    path: `${apiPath}/${entity.kebabCase()}/handlers/create-${entity.kebabCase()}.handler.ts`,
  };
}
