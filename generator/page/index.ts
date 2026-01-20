import { writeFile } from "../utils";
import { generateMainPageFile } from "./client/genMainPage";
import { generateRecordPage } from "./client/genRecordPage";
import { generateCreateModal } from "./components/genCreateModal";
import { generateUpdateModal } from "./components/genUpdateModal";
import { generateDeleteModal } from "./components/genDeleteModal";
import { generateEntityForm } from "./components/genEntityForm";
import { generateListFilters } from "./components/genListFilters";
import { generateGetHook } from "./hooks/genGetEntity";
import { generateGetPaginatedHook } from "./hooks/genGetPaginatedEntity";
import { generateCreateHook } from "./hooks/genCreateEntity";
import { generateUpdateHook } from "./hooks/genUpdateEntity";
import { generateDeleteHook } from "./hooks/genDeleteEntity";
import { BaseObject } from "@/types/generatorTypes";

function generateInterfaces(obj: BaseObject) {
  const { entity } = obj;

  writeFile(generateRecordPage(obj), `app/${entity.kebabCase()}/[id]/page.tsx`);
  writeFile(generateMainPageFile(obj), `app/${entity.kebabCase()}/page.tsx`);
}

function generateComponents(obj: BaseObject) {
  const { entity } = obj;

  writeFile(
    generateCreateModal(obj),
    `modules/${entity.camelCase()}/components/create${entity.pascalCase()}Modal.tsx`
  );
  writeFile(
    generateUpdateModal(obj),
    `modules/${entity.camelCase()}/components/update${entity.pascalCase()}Modal.tsx`
  );
  writeFile(
    generateDeleteModal(obj),
    `modules/${entity.camelCase()}/components/delete${entity.pascalCase()}Modal.tsx`
  );
  writeFile(
    generateEntityForm(obj),
    `modules/${entity.camelCase()}/components/${entity.camelCase()}Form.tsx`
  );
  writeFile(
    generateListFilters(obj),
    `modules/${entity.camelCase()}/components/${entity.camelCase()}Filters.tsx`
  );
}

function generateHooks(obj: BaseObject) {
  const { entity } = obj;

  writeFile(
    generateGetHook(obj),
    `modules/${entity.camelCase()}/hooks/useGet${entity.pascalCase()}.ts`
  );
  writeFile(
    generateGetPaginatedHook(obj),
    `modules/${entity.camelCase()}/hooks/useGet${entity.pluralPascal()}Paginated.ts`
  );
  writeFile(
    generateCreateHook(obj),
    `modules/${entity.camelCase()}/hooks/useCreate${entity.pascalCase()}.ts`
  );
  writeFile(
    generateUpdateHook(obj),
    `modules/${entity.camelCase()}/hooks/useUpdate${entity.pascalCase()}.ts`
  );
  writeFile(
    generateDeleteHook(obj),
    `modules/${entity.camelCase()}/hooks/useDelete${entity.pascalCase()}.ts`
  );
}

export function generatePages(obj: BaseObject) {
  generateInterfaces(obj);
  generateComponents(obj);
  generateHooks(obj);
}
