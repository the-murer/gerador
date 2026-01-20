import { GeneratorBaseObject } from '@/generator/utils';

export function generateCreateHook(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
  import { toaster } from '@/ui/storybook/toaster'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ${entity.camelCase()}Api } from '../utils/${entity.kebabCase()}-constants'
import type { ${entity.pascalCase()}BodySerializerType } from '../utils/${entity.kebabCase()}-schemas'

export const useCreate${entity.pascalCase()} = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ${entity.pascalCase()}BodySerializerType) =>
      ${entity.camelCase()}Api.create(data, { queryClient }),
    onSuccess: () => {
      toaster.success({
        title: '${entity} criado com sucesso',
      })
    },
  })
}
`;

  return {
    template,
    path: `modules/${entity.kebabCase()}/hooks/use-create-${entity.kebabCase()}.ts`,
  };
}
