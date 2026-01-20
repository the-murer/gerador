import { GeneratorBaseObject } from "@/generator/utils";

export function generateListPage(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
  import { DefaultPagination } from '@/ui/components/pagination/pagination'
  import { DefaultTable } from '@/ui/blocks/table'
  import { DefaultPage } from '@/ui/templates/default-page'
  import { useUserColumns } from '../components/user-columns'
  import { useFindUsers } from '../hooks/use-find-users'
  import { useSearchParams } from '@/common/hooks/use-list-search-params'
  import { UsersFilters } from '../components/user-filters'
  import { useModal } from '@ebay/nice-modal-react'
  import { CreateUserDialog } from '../components/create-user-dialog'
  
  export const UsersPage = () => {
    const { search, sort, handlePageChange, setSearchParams } =
      useSearchParams('/admin/users/')
    const { page = 1 } = search
  
    const { data, isLoading, error } = useFindUsers({
      page,
      sort: sort.sortedBy,
      sortOrder: sort.sortOrder,
    })
  
    const columns = useUserColumns()
    const createUserDialog = useModal(CreateUserDialog)
  
    return (
      <DefaultPage action="read" subject="User">
        <DefaultPage.Header
          title="Usuários"
          description="Listagem de usuários cadastrados no sistema"
          onActionClick={createUserDialog.show}
          createPermission={{ action: 'create', subject: 'User' }}
        >
          <UsersFilters search={search} updateSearchParams={setSearchParams} />
        </DefaultPage.Header>
  
        <DefaultTable
          items={data?.items}
          columns={columns}
          sorting={sort}
          loading={isLoading}
          error={error?.message}
        />
  
        <DefaultPagination
          page={page}
          pageSize={10}
          total={data?.metadata.total}
          onPageChange={handlePageChange}
        />
      </DefaultPage>
    )
  }
`;

  return {
    template,
    path: `modules/${entity.kebabCase()}/pages/${entity.kebabCase()}-page.tsx`,
  };
}




