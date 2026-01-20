import { GeneratorBaseObject } from '@/generator/utils';

export function generateGetByIdHook(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
import { useQuery } from '@tanstack/react-query'
import { userApi } from '../utils/constants'

export const useGetUser = ({ id }: { id: string }) => {
  return useQuery({
    queryFn: () => userApi.get(id),
    queryKey: userApi.keys.get(id),
  })
}

`;

  return {
    template,
    path: `modules/${entity.kebabCase()}/hooks/use-get-${entity.kebabCase()}.ts`,
  };
}
