import { GeneratorBaseObject } from '@/generator/utils';

export function generateGetByIdHook(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
import { useQuery } from '@tanstack/react-query'
import { ${entity.camelCase()}Api } from '../utils/${entity.kebabCase()}-constants'

export const useGet${entity.pascalCase()} = ({ id }: { id: string }) => {
  return useQuery({
    queryFn: () => ${entity.camelCase()}Api.get(id),
    queryKey: ${entity.camelCase()}Api.keys.get(id),
  })
}

`;

  return {
    template,
    path: `modules/${entity.kebabCase()}/hooks/use-get-${entity.kebabCase()}.ts`,
  };
}
