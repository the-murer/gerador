import { GeneratorBaseObject } from '@/generator/utils';

export function generateListPage(obj: GeneratorBaseObject) {
  const { entity } = obj;

  const template = `
  import { DefaultPagination } from '@/ui/components/pagination/pagination'
  import { DefaultTable } from '@/ui/blocks/table'
  import { DefaultPage } from '@/ui/templates/default-page'
  import { useSearchParams } from '@/common/hooks/use-list-search-params'
  import { useModal } from '@ebay/nice-modal-react'
  import { use${entity.pascalCase()}Columns } from '../components/${entity.kebabCase()}-columns'
  import { useFind${entity.pluralPascal()} } from '../hooks/use-find-${entity.pluralKebab()}'
  import { ${entity.pluralPascal()}Filters } from '../components/${entity.kebabCase()}-filters'
  import { Create${entity.pascalCase()}Dialog } from '../components/create-${entity.kebabCase()}-dialog'
  
  export const ${entity.pluralPascal()}Page = () => {
    const { search, sort, handlePageChange, setSearchParams } =
      useSearchParams('/admin/${entity.pluralKebab()}/')
    const { page = 1 } = search
  
    const { data, isLoading, error } = useFind${entity.pluralPascal()}({
      page,
      sort: sort.sortedBy,
      sortOrder: sort.sortOrder,
    })
  
    const columns = use${entity.pascalCase()}Columns()
    const create${entity.pascalCase()}Dialog = useModal(Create${entity.pascalCase()}Dialog)
  
    return (
      <DefaultPage action="read" subject="${entity.pascalCase()}">
        <DefaultPage.Header
          title="${entity}s"
          description="Listagem de ${entity}s cadastrados no sistema"
          onActionClick={create${entity.pascalCase()}Dialog.show}
          createPermission={{ action: 'create', subject: '${entity.pascalCase()}' }}
        >
          <${entity.pluralPascal()}Filters search={search} updateSearchParams={setSearchParams} />
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
    path: `modules/${entity.kebabCase()}/pages/${entity.pluralKebab()}-page.tsx`,
  };
}
