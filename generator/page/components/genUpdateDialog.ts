import { GeneratorBaseObject } from '@/generator/utils';

export function generateUpdateDialog(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { toaster } from '@/ui/storybook/toaster'
import { useEffect } from 'react'
import { DefaultModal } from '@/ui/blocks/modal/default-modal'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ${entity.pascalCase()} } from '../utils/${entity.kebabCase()}-constants'
import { ${entity.pascalCase()}Form } from './${entity.kebabCase()}-form'
import { ${entity.camelCase()}UpdateSerializer } from '../utils/${entity.kebabCase()}-schemas'
import { useUpdate${entity.pascalCase()} } from '../hooks/use-update-${entity.kebabCase()}'

export const Update${entity.pascalCase()}Dialog = NiceModal.create(({ ${entity.camelCase()} }: { ${entity.kebabCase()}: ${entity.pascalCase()} }) => {
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(${entity.camelCase()}UpdateSerializer),
    mode: 'onBlur',
    defaultValues: ${entity.camelCase()},
  })
  const { mutateAsync: update${entity.pascalCase()}, isPending } = useUpdate${entity.pascalCase()}()

  const modal = useModal()

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      await update${entity.pascalCase()}({ id: ${entity.kebabCase()}._id, data })
      modal.hide()
    } catch (error) {
      toaster.error({
        title: 'Erro ao atualizar ${entity}',
      })
    }
  })

  useEffect(() => {
    reset(${entity.kebabCase()})
  }, [${entity.kebabCase()}._id])

  return (
    <DefaultModal open={modal.visible} onOpenChange={modal.hide}>
      <DefaultModal.Header
        title={\`Editar ${entity} \${${entity.kebabCase()}.name}\`}
        showCloseButton={true}
      />
      <DefaultModal.Body>
        <${entity.pascalCase()}Form control={control} />
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
    path: `modules/${entity.kebabCase()}/components/update-${entity.kebabCase()}-dialog.tsx`,
  };
}
