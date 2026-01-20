import { BaseObject } from "@/types/generatorTypes";

export function generateDeleteHook(obj: BaseObject) {
  const { entity } = obj;

  const hook = `
import { Delete${entity.pascalCase()}ByIdInput } from "@/api/${entity.camelCase()}/serializers/delete${entity.pascalCase()}ByIdSerializer";
import { pageFetcher } from "@/utils/apiUtils";
import { useMutation } from "@tanstack/react-query";

const delete${entity.pascalCase()} = async ({ ${entity.camelCase()}Id }: Delete${entity.pascalCase()}ByIdInput) =>
  pageFetcher({
    endPoint: \`api/${entity.kebabCase()}/\${${entity.camelCase()}Id}\`,
    method: "DELETE",
  });

export const useDelete${entity.pascalCase()} = () => {
  return useMutation({
    mutationFn: delete${entity.pascalCase()},
  });
};

`;
  return hook;
}
