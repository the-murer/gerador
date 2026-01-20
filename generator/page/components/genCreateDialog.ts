import { GeneratorBaseObject } from '@/generator/utils';

export function generateCreateDialog(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { UserForm } from './user-form'
import { DefaultModal } from '@/ui/blocks/modal/default-modal'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userBodySerializer } from '../utils/schemas'
import { useCreateUser } from '../hooks/use-create-user'
import { toaster } from '@/ui/storybook/toaster'

export const CreateUserDialog = NiceModal.create(() => {
  const modal = useModal()
  const { mutateAsync: createUser, isPending } = useCreateUser()
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(userBodySerializer),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      roles: [],
    },
  })

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      await createUser(data)
      modal.hide()
    } catch (error) {
      toaster.error({
        title: 'Erro ao criar usuário',
      })
    }
  })

  return (
    <DefaultModal open={modal.visible} onOpenChange={modal.hide}>
      <DefaultModal.Header title="Criar Usuário" showCloseButton={true} />
      <DefaultModal.Body>
        <UserForm control={control} />
      </DefaultModal.Body>
      <DefaultModal.Confirm
        submit={handleFormSubmit}
        isLoading={isPending}
        onCancel={modal.hide}
      />
    </DefaultModal>
  )
})

`;

  return {
    template,
    path: `modules/${entity.kebabCase()}/components/create-${entity.kebabCase()}-dialog.tsx`,
  };
}
