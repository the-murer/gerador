import { GeneratorBaseObject } from '@/generator/utils';

export function generateUpdateHook(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toaster } from '@/ui/storybook/toaster'
import { ${entity.camelCase()}Api } from '../utils/${entity.kebabCase()}-constants'
import type { ${entity.pascalCase()}UpdateSerializerType } from '../utils/${entity.kebabCase()}-schemas'

export const useUpdate${entity.pascalCase()} = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ${entity.pascalCase()}UpdateSerializerType }) =>
      ${entity.camelCase()}Api.update(id, data, { queryClient }),
    onSuccess: () => {
      toaster.success({
        title: '${entity} atualizado com sucesso',
      })
    },
  })
}
`;

  return {
    template,
    path: `modules/${entity.kebabCase()}/hooks/use-update-${entity.kebabCase()}.ts`,
  };
}
