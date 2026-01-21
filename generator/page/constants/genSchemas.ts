import { GeneratorBaseObject, mapObjectFields } from '@/generator/utils';

export function generateFrontSchemas(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
import { z } from 'zod'

const ${entity.kebabCase()}Schema = z.object({
  _id: z.string(),
  ${mapObjectFields(obj.model, (key, value) => `${key}: z.${value}(),\n`)}
})

export const ${entity.camelCase()}BodySerializer = ${entity.kebabCase()}Schema.omit({
  _id: true,
})

export const ${entity.camelCase()}UpdateSerializer = ${entity.kebabCase()}Schema.pick({
  ${mapObjectFields(obj.model, (key) => `${key}: true,\n`)}
})

export type ${entity.pascalCase()} = z.infer<typeof ${entity.kebabCase()}Schema>

export type ${entity.pascalCase()}BodySerializerType = z.infer<typeof ${entity.camelCase()}BodySerializer>
export type ${entity.pascalCase()}UpdateSerializerType = z.infer<typeof ${entity.camelCase()}UpdateSerializer>
`;

  return {
    template,
    path: `modules/${entity.kebabCase()}/utils/${entity.kebabCase()}-schemas.ts`,
  };
}
