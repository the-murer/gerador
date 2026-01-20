import { BaseObject } from "@/types/generatorTypes";

export function generateUpdateHook(obj: BaseObject) {
  const { entity } = obj;

  const hook = `
import { Update${entity.pascalCase()}ByIdInput } from "@/api/${entity.camelCase()}/serializers/update${entity.pascalCase()}ByIdSerializer";
import { pageFetcher } from "@/utils/apiUtils";
import { useMutation } from "@tanstack/react-query";

const update${entity.pascalCase()} = async ({ ${entity.camelCase()}Id, ...data }: Update${entity.pascalCase()}ByIdInput) =>
  pageFetcher({ data, endPoint: \`api/${entity.kebabCase()}/\${${entity.camelCase()}Id}\`, method: "PUT" });

export const useUpdate${entity.pascalCase()} = () => {
  return useMutation({
    mutationFn: update${entity.pascalCase()},
  });
};
 `;
  return hook;
}
