import { GeneratorBaseObject } from '@/generator/utils';

export function generateCreateHook(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '../utils/constants'
import { toaster } from '@/ui/storybook/toaster'
import type { UserBodySerializerType } from '../utils/schemas'

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UserBodySerializerType) =>
      userApi.create(data, { queryClient }),
    onSuccess: () => {
      toaster.success({
        title: 'Usuário criado com sucesso',
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
