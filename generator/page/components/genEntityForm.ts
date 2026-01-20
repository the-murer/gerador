import { BaseObject } from "@/types/generatorTypes";
import { mapObjectFields } from "../../utils";

export function generateEntityForm({ entity, model }: BaseObject) {
  const page = `
import { UseFormReturn } from "react-hook-form";

import Input from "@/ui/stories/components/input/input";

type ${entity.pascalCase()}FormProps = {
  form: UseFormReturn<any, any, undefined>;
};

const ${entity.pascalCase()}Form = ({ form }: ${entity.pascalCase()}FormProps) => {
  return (
    <div>
      ${mapObjectFields(
        model,
        (key, value) => `
      <Input
        form={form}
        label="${key}"
        placeholder="Digite o ${key} do ${entity.pascalCase()}"
        name="${key}"
        type="${value}"
      />`
      ).join("\n  ")}
    </div>
  );
};

export default ${entity.pascalCase()}Form;
`;
  return page;
}
