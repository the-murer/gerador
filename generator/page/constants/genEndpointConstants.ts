import { GeneratorBaseObject } from '@/generator/utils';

export function generateEndpointConstants(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
import { DefaultEndpoint } from '@/common/api/base-endpoint'

export type User = {
  _id: string
  active: boolean
  name: string
  email: string
  profilePictureUrl?: string
  roles: string[]
  createdAt: string
  updatedAt: string
}

class UserEndpoints extends DefaultEndpoint<User> {
  constructor() {
    super('users', 'user')
  }
}

export const userApi = new UserEndpoints()
`;

  return {
    template,
    path: `modules/${entity.kebabCase()}/utils/constants.ts`,
  };
}
