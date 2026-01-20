import { BaseObject } from "@/types/generatorTypes";

export function generateGetHook(obj: BaseObject) {
  const { entity } = obj;

  const hook = `
import { pageFetcher } from "@/utils/apiUtils";
import { useQuery } from "@tanstack/react-query";

const get${entity.pascalCase()}Key = "${entity.camelCase()}";

const get${entity.pascalCase()} = async ({ ${entity.camelCase()}Id }: { ${entity.camelCase()}Id: string }) =>
  pageFetcher({
    endPoint: \`/api/${entity.kebabCase()}/\${${entity.camelCase()}Id}\`,
    method: "GET",
  });

export const useGet${entity.pascalCase()} = ({ ${entity.camelCase()}Id }: { ${entity.camelCase()}Id: string }) => {
  return useQuery({
    queryKey: [get${entity.pascalCase()}Key, ${entity.camelCase()}Id],
    queryFn: () => get${entity.pascalCase()}({ ${entity.camelCase()}Id }),
  });
};
`;
  return hook;
}
