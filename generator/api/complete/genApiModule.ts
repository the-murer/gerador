import { BaseObject } from '../../utils';

export function generateApiModule(obj: BaseObject) {
  const { entity, apiPath } = obj;

  const template = `
import { Module } from '@nestjs/common';
import { ${entity.pluralPascal()}Controller } from './${entity.pluralKebab()}.controller';
import { Create${entity.pascalCase()}Handler } from './handlers/create-${entity.kebabCase()}.handler';
import { MongooseModule } from '@nestjs/mongoose';
import { ${entity.pascalCase()}, ${entity.pascalCase()}Schema } from './${entity.kebabCase()}.schema';
import { ${entity.pluralPascal()}Repository } from './${entity.pluralKebab()}.repository';
import { Find${entity.pascalCase()}ByIdHandler } from './handlers/find-${entity.kebabCase()}-by-id.handler';
import { Find${entity.pluralPascal()}Handler } from './handlers/find-${entity.pluralKebab()}.handler';
import { Update${entity.pascalCase()}Handler } from './handlers/update-${entity.kebabCase()}.handler';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ${entity.pascalCase()}.name, schema: ${entity.pascalCase()}Schema }]),
  ],
  controllers: [${entity.pluralPascal()}Controller],
  providers: [
    ${entity.pluralPascal()}Repository,
    Create${entity.pascalCase()}Handler,
    Find${entity.pascalCase()}ByIdHandler,
    Find${entity.pluralPascal()}Handler,
    Update${entity.pascalCase()}Handler,
    Find${entity.pluralPascal()}Handler,
  ],
  exports: [${entity.pluralPascal()}Repository],
})
export class ${entity.pluralPascal()}Module {}

  `;
  return {
    template,
    path: `${apiPath}/${entity.kebabCase()}/${entity.pluralKebab()}.module.ts`,
  };
}
