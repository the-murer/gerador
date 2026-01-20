import { BaseObject } from "@/types/generatorTypes";

export function generateCreateHook(obj: BaseObject) {
  const { entity } = obj;

  const hook = `
import { Create${entity.pascalCase()}Input } from "@/api/${entity.camelCase()}/serializers/create${entity.pascalCase()}Serializer";
import { pageFetcher } from "@/utils/apiUtils";
import { useMutation } from "@tanstack/react-query";

const create${entity.pascalCase()} = async (data: Create${entity.pascalCase()}Input) =>
  pageFetcher({ data, endPoint: "api/${entity.kebabCase()}", method: "POST" });

export const useCreate${entity.pascalCase()} = () => {
  return useMutation({
    mutationFn: create${entity.pascalCase()},
  });
};
`;
  return hook;
}
