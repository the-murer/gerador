import { mapObjectFields, BaseObject } from '../../utils';

export function generateApiRepository(obj: BaseObject) {
  const { entity, model, apiPath } = obj;

  const template = `
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ${entity.pascalCase()} } from './${entity.pluralKebab()}.schema';
import { Model } from 'mongoose';
import { BaseRepository } from '@app/utils/database/base.repository';

@Injectable()
export class ${entity.pluralPascal()}Repository extends BaseRepository<${entity.pascalCase()}> {
  constructor(@InjectModel(${entity.pascalCase()}.name) model: Model<${entity.pascalCase()}>) {
    super(model);
  }

}

  `;
  return {
    template,
    path: `${apiPath}/${entity.kebabCase()}/${entity.pluralKebab()}.repository.ts`,
  };
}
