import { GeneratorBaseObject, mapObjectFields } from '@/generator/utils';

export function generateColumns(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
  import { Flex } from '@chakra-ui/react'
import { Switch } from '@/ui/components/switch/switch'
import type { ColumnDef } from '@tanstack/react-table'
import { useModal } from '@ebay/nice-modal-react'
import { ColumnsMenu } from '@/ui/blocks/menu/columns-menu'
import { Typography } from '@/ui/components/typography/typography'
import { formatDate } from '@/common/utils/time-utils'
import { useAbility } from '@/modules/auth/stores/auth-user-store'
import type { ${entity.pascalCase()} } from '../utils/${entity.kebabCase()}-schemas'
import { Update${entity.pascalCase()}Dialog } from './update-${entity.kebabCase()}-dialog'

export const use${entity.pascalCase()}Columns = () => {
  const ability = useAbility()
  const edit${entity.pascalCase()}Modal = useModal(Update${entity.pascalCase()}Dialog)
  const canUpdate${entity.pascalCase()} = ability.can('update', '${entity.pascalCase()}')

  return [
    ${mapObjectFields(
      obj.model,
      (key) => `{ accessorKey: '${key}', header: '${key}' },\n`,
    )}
    {
      accessorKey: 'createdAt',
      header: 'Criado em',
      cell: ({ getValue }) => (
        <Typography>{formatDate(getValue() as Date)}</Typography>
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Ações',
      cell: ({ row }) => (
        <ColumnsMenu>
          <ColumnsMenu.EditItem
            disabled={!canUpdate${entity.pascalCase()}}
            onClick={() => edit${entity.pascalCase()}Modal.show({ ${entity.kebabCase()}: row.original })}
          />
        </ColumnsMenu>
      ),
    },
  ] as ColumnDef<${entity.pascalCase()}>[]
}

`;

  return {
    template,
    path: `modules/${entity.kebabCase()}/components/${entity.kebabCase()}-columns.tsx`,
  };
}
