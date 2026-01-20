import { BaseObject } from "@/types/generatorTypes";

export function generateRecordPage(obj: BaseObject) {
  const { entity, model } = obj;

  const page = `
"use client";

import NiceModal from "@ebay/nice-modal-react";
import React from "react";
import ViewInfoCard from "@/ui/stories/views/registerView/registerViewInfoCard";
import ErrorPage from "@/ui/stories/views/errorView/errorView";
import PageHeader from "@/ui/stories/blocks/pageHeader/pageHeader";
import { PencilIcon } from "lucide-react";
import { useParams } from "next/navigation";
import ComponentAbilityCheck from "@/modules/auth/componentAbilityCheck";

import { ${entity.pascalCase()} } from "@/types/${entity.camelCase()}Types";
import Update${entity.pascalCase()}Modal from "@/modules/${entity.camelCase()}/components/update${entity.pascalCase()}Modal";
import { useGet${entity.pascalCase()} } from "@/modules/${entity.camelCase()}/hooks/useGet${entity.pascalCase()}";

const showUpdate${entity.pascalCase()}Modal = (${entity.camelCase()}: ${entity.pascalCase()}) =>
  NiceModal.show(Update${entity.pascalCase()}Modal, ${entity.camelCase()});

const ${entity.pascalCase()}Page = () => {
  const { id } = useParams();

  if (!id || typeof id !== "string") {
    return (
      <ErrorPage
        error={"Erro ao carregar o ${entity.pascalCase()}, volte para a página de ${entity.pluralPascal()}"}
      />
    );
  }
  const { data, isLoading } = useGet${entity.pascalCase()}({ ${entity.camelCase()}Id: id });

  if ((!data || !data.${entity.camelCase()}) && !isLoading) {
    return <ErrorPage error={"${entity.pascalCase()} não encontrado"} />;
  }

  return (
    <ComponentAbilityCheck role="${entity.pascalCase()}" action="read">
      <PageHeader
        title={data?.${entity.camelCase()}?.name}
        subtitle="Visualize os dados do ${entity.pascalCase()}"
      >
        <ComponentAbilityCheck role="${entity.pascalCase()}" action="update">
          <PageHeader.Button onPress={() => showUpdate${entity.pascalCase()}Modal(data?.${entity.camelCase()})}>
            <PencilIcon className="w-5 h-5" />
          </PageHeader.Button>
        </ComponentAbilityCheck>
      </PageHeader>
      <ViewInfoCard
        isLoading={isLoading}
        info={[${Object.keys(model)
          .map(
            (field) =>
              `{ label: "${field}", value: data?.${entity.camelCase()}?.${field} }`
          )
          .join(",\n")}]}
      />
    </ComponentAbilityCheck>
  );
};

export default ${entity.pascalCase()}Page;
`;
  return page;
}
