import { GeneratorBaseObject, mapObjectFields } from '@/generator/utils';

export function generateEntityForm(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
import { DefaultInput } from '@/ui/components/input/input'
import { InputTypes } from '@/ui/components/input/input-map'
import { type Control } from 'react-hook-form'

export const ${entity.pascalCase()}Form = ({ control }: { control: Control<any> }) => {
  return (
    <form>
    ${mapObjectFields(
      obj.model,
      (key, value) => `<DefaultInput
        type={InputTypes.${value.toUpperCase()}}
        name="${key}"
        label="${key}"
        control={control}
      />`,
    ).join('\n  ')}
    </form>
  )
}

`;

  return {
    template,
    path: `modules/${entity.kebabCase()}/components/${entity.kebabCase()}-form.tsx`,
  };
}
