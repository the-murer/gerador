import { GeneratorBaseObject } from '@/generator/utils';

export function generateEntityForm(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
import { DefaultInput } from '@/ui/components/input/input'
import { InputTypes } from '@/ui/components/input/input-map'
import { type Control } from 'react-hook-form'

export const UserForm = ({ control }: { control: Control<any> }) => {
  const rolesOptions = [
    { label: 'Administrador', value: 'admin' },
    { label: 'Usuário', value: 'user' },
  ]

  return (
    <form>
      <DefaultInput
        type={InputTypes.TEXT}
        name="name"
        label="Nome"
        control={control}
      />
      <DefaultInput
        type={InputTypes.TEXT}
        name="email"
        label="Email"
        control={control}
      />
      <DefaultInput
        type={InputTypes.MULTI_SELECT}
        name="roles"
        label="Roles"
        placeholder="Selecione as regras"
        control={control}
        options={rolesOptions}
      />
    </form>
  )
}

`;

  return {
    template,
    path: `modules/${entity.kebabCase()}/components/${entity.kebabCase()}-form.tsx`,
  };
}
