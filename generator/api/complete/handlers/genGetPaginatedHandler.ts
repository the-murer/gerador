import { BaseObject } from '../../../utils';

export function generateGetPaginatedHandler(obj: BaseObject) {
  const { entity, apiPath } = obj;

  const handler = `
import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler } from 'src/utils/command-handler';
import { ${entity.pluralPascal()}Repository } from '../${entity.pluralKebab()}.repository';
import { ${entity.pascalCase()} } from '../${entity.kebabCase()}.schema';
import { Find${entity.pluralPascal()}Dto } from '../dto/find-${entity.pluralKebab()}.dto';
import { DefaultPaginationResponse } from '@app/app/dtos/default-pagination.dto';

interface Find${entity.pluralPascal()}HandlerInput extends Find${entity.pluralPascal()}Dto {}

type Find${entity.pluralPascal()}HandlerOutput = DefaultPaginationResponse<${entity.pascalCase()}>;

@Injectable()
export class Find${entity.pluralPascal()}Handler
  implements CommandHandler<Find${entity.pluralPascal()}HandlerInput, Find${entity.pluralPascal()}HandlerOutput>
{
  constructor(
    @Inject(${entity.pluralPascal()}Repository)
    private readonly ${entity.camelCase()}Repository: ${entity.pluralPascal()}Repository
  ) {}

  public async execute({
    page,
    limit,
    sort = 'createdAt',
    sortOrder,
  }: Find${entity.pluralPascal()}HandlerInput) {
    const { items, metadata } = await this.${entity.camelCase()}Repository.findPaginated(
      page,
      limit,
      sort,
      sortOrder,
    );

    return {
      metadata,
      items,
    };
  }
}

  `;
  return {
    template: handler,
    path: `${apiPath}/${entity.kebabCase()}/handlers/find-${entity.pluralKebab()}.handler.ts`,
  };
}
