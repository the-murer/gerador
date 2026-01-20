







import { GeneratorBaseObject } from '@/generator/utils';

export function generateColumns(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
import { Switch } from '@/ui/components/switch/switch'
import type { ColumnDef } from '@tanstack/react-table'
import type { User } from '../utils/constants'
import { useChangeUserActive } from '../hooks/use-change-user-active'
import { useModal } from '@ebay/nice-modal-react'
import { UpdateUserDialog } from './update-user-dialog'
import { ColumnsMenu } from '@/ui/blocks/menu/columns-menu'
import { Typography } from '@/ui/components/typography/typography'
import { formatDate } from '@/common/utils/time-utils'
import { useAbility } from '@/modules/auth/stores/auth-user-store'
import { Flex } from '@chakra-ui/react'
import { getUserBackgroundColor, getUserInitials } from '../utils/user-utils'
import { ImageIcon } from 'lucide-react'
import { UpdateProfilePictureDialog } from './update-profile-picture-dialog'

export const useUserColumns = () => {
  const { mutateAsync: changeUserActive } = useChangeUserActive()
  const ability = useAbility()
  const editUserModal = useModal(UpdateUserDialog)
  const canUpdateUser = ability.can('update', 'User')

  return [
    { accessorKey: 'name', header: 'Nome' },
    { accessorKey: 'email', header: 'Email' },
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
            disabled={!canUpdateUser}
            onClick={() => editUserModal.show({ user: row.original })}
          />
        </ColumnsMenu>
      ),
    },
  ] as ColumnDef<User>[]
}

`;

  return {
    template,
    path: `modules/${entity.kebabCase()}/components/${entity.kebabCase()}-columns.tsx`,
  };
}
