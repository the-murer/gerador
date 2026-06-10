import { GeneratorBaseObject, mapObjectFields } from '@/generator/utils';

export function generateFrontSchemas(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
  import {
    defaultEmailValidation,
    defaultStringValidation,
  } from '@/common/utils/validation-utils'
  import { z } from 'zod'
  import { defaultSchema } from '@/common/api/api-types'

export const ${entity.camelCase()}Serializer = ${entity.kebabCase()}Schema.omit({
  ${mapObjectFields(obj.model, (key, value) => `${key}: z.${value}(),`).join(
    '\n  ',
  )}
})

export const ${entity.camelCase()}UpdateSerializer = ${entity.kebabCase()}Schema.pick({
  ${mapObjectFields(obj.model, (key) => `${key}: true,`).join('\n  ')}
})

export type ${entity.pascalCase()} = z.infer<typeof ${entity.camelCase()}BodySerializer> & z.infer<typeof defaultSchema>

export type ${entity.pascalCase()}BodySerializerType = z.infer<typeof ${entity.camelCase()}BodySerializer>
export type ${entity.pascalCase()}UpdateSerializerType = z.infer<typeof ${entity.camelCase()}UpdateSerializer>
`;

  return {
    template,
    path: `modules/${entity.kebabCase()}/utils/${entity.kebabCase()}-schemas.ts`,
  };
}
