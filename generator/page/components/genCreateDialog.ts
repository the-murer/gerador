import { GeneratorBaseObject, mapObjectFields } from '@/generator/utils';

export function generateCreateDialog(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { toaster } from '@/ui/storybook/toaster'
import { DefaultModal } from '@/ui/blocks/modal/default-modal'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ${entity.pascalCase()}Form } from './${entity.kebabCase()}-form'
import { ${entity.camelCase()}BodySerializer } from '../utils/${entity.kebabCase()}-schemas'
import { useCreate${entity.pascalCase()} } from '../hooks/use-create-${entity.kebabCase()}'

export const Create${entity.pascalCase()}Dialog = NiceModal.create(() => {
  const modal = useModal()
  const { mutateAsync: create${entity.pascalCase()}, isPending } = useCreate${entity.pascalCase()}()
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(${entity.camelCase()}BodySerializer),
    mode: 'onBlur',
    defaultValues: {
      ${mapObjectFields(obj.model, (key) => `${key}: '',`).join('\n')}
    },
  })

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      await create${entity.pascalCase()}(data)
      modal.remove()
    } catch (error) {
      toaster.error({
        title: 'Erro ao criar ${entity}',
      })
    }
  })

  return (
    <DefaultModal open={modal.visible} onOpenChange={modal.remove}>
      <DefaultModal.Header title="Criar ${entity}" showCloseButton={true} />
      <DefaultModal.Body>
        <${entity.pascalCase()}Form control={control} />
      </DefaultModal.Body>
      <DefaultModal.Confirm
        submit={handleFormSubmit}
        isLoading={isPending}
        onCancel={modal.remove}
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
