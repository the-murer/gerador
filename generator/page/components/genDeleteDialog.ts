import { GeneratorBaseObject } from '@/generator/utils';

export function generateDeleteDialog(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
import { DefaultPage } from '@/ui/templates/default-page'
import { useParams } from '@tanstack/react-router'
import { useGet${entity.pascalCase()} } from '../hooks/use-get-${entity.kebabCase()}'

export const ${entity.pascalCase()}Page = () => {
  const { id } = useParams({ from: '/admin/${entity.kebabCase()}/$id' })

  const { data } = useGet${entity.pascalCase()}({ id })

  return (
    <DefaultPage>
      <DefaultPage.Header
        title={data?.name ?? '${entity.pascalCase()}'}
        description="Visualize e altere as informações do seu ${entity.pascalCase()}"
      />
    </DefaultPage>
  )
}
`;

  return {
    template,
    path: `modules/${entity.kebabCase()}/components/delete-${entity.kebabCase()}-dialog.tsx`,
  };
}
