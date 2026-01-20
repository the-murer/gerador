import { mapObjectFields, BaseObject } from '../../utils';

export function generateApiSchema(obj: BaseObject) {
  const { entity, model, apiPath } = obj;

  const template = `
import { TimestampSchema } from '@app/utils/database/schema-utils';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class ${entity.pascalCase()} extends TimestampSchema {
  ${mapObjectFields(
    model,
    (key, type) => `@Prop({ required: true, type: ${type} })
  ${key}: ${type.toLowerCase()};`,
  ).join('\n  ')}
}

export type ${entity.pascalCase()}Document = HydratedDocument<${entity.pascalCase()}>;
export const ${entity.pascalCase()}Schema = SchemaFactory.createForClass(${entity.pascalCase()});
`;
  return {
    template,
    path: `${apiPath}/${entity.kebabCase()}/${entity.kebabCase()}.schema.ts`,
  };
}
