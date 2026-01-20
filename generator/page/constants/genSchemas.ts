import { z } from 'zod'

const userSchema = z.object({
  _id: z.string().optional(),
  active: z.boolean(),
  name: z.string().min(3),
  email: z.string().email(),
  roles: z.array(z.string()),
})


export const userBodySerializer = userSchema.omit({
  _id: true,
  active: true,
})

export const userUpdateSerializer = userSchema.pick({
  name: true,
  email: true,
  roles: true,
})

export type User = z.infer<typeof userSchema>

export type UserBodySerializerType = z.infer<typeof userBodySerializer>
export type UserUpdateSerializerType = z.infer<typeof userUpdateSerializer>

import { GeneratorBaseObject } from '@/generator/utils';

export function generateMainPageFile(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
import { z } from 'zod'

const userSchema = z.object({
  _id: z.string().optional(),
  active: z.boolean(),
  name: z.string().min(3),
  email: z.string().email(),
  roles: z.array(z.string()),
})


export const userBodySerializer = userSchema.omit({
  _id: true,
  active: true,
})

export const userUpdateSerializer = userSchema.pick({
  name: true,
  email: true,
  roles: true,
})

export type User = z.infer<typeof userSchema>

export type UserBodySerializerType = z.infer<typeof userBodySerializer>
export type UserUpdateSerializerType = z.infer<typeof userUpdateSerializer>
`;

  return {
    template,
    path: `modules/${entity.kebabCase()}/utils/schemas.ts`,
  };
}
