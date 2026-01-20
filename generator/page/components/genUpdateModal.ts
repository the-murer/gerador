import { BaseObject } from "@/types/generatorTypes";
import { mapObjectFields } from "../../utils";

export function generateUpdateModal({ entity, model }: BaseObject) {
  const page = `
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitButton from "@/ui/stories/components/submitButton/submitButton";

import {
  Update${entity.pascalCase()}ByIdInput,
  update${entity.pascalCase()}ByIdResolver,
} from "@/api/${entity.camelCase()}/serializers/update${entity.pascalCase()}ByIdSerializer";
import ${entity.pascalCase()}Form from "./${entity.camelCase()}Form";
import { useUpdate${entity.pascalCase()} } from "../hooks/useUpdate${entity.pascalCase()}";

type Update${entity.pascalCase()}ModalProps = {
  id: string;
  ${mapObjectFields(model, (key, value) => `${key}: ${value}`).join(",\n  ")}
};

const Update${entity.pascalCase()}Modal = NiceModal.create(
  ({ id, ...rest }: Update${entity.pascalCase()}ModalProps) => {
    const form = useForm<Update${entity.pascalCase()}ByIdInput>({
      defaultValues: {
        ${entity.camelCase()}Id: id,
        ...rest
      },
      resolver: zodResolver(update${entity.pascalCase()}ByIdResolver),
      mode: "onBlur",
    });

    const { mutate, isPending, error, isSuccess } = useUpdate${entity.pascalCase()}();
    const modal = useModal();

    useEffect(() => {
      form.reset();
    }, [modal.visible]);

    useEffect(() => {
      if (isSuccess) {
        modal.hide();
      }
    }, [isSuccess]);

    const handleFormSubmit = form.handleSubmit((data: any) => mutate(data));

    return (
      <Modal isOpen={modal.visible} onClose={() => modal.hide()}>
        <ModalContent>
          <ModalHeader>Atualizar ${entity.pascalCase()}</ModalHeader>
          <ModalBody>
            {error && <h3 className="text-danger-500">{error.message}</h3>}
            <${entity.pascalCase()}Form form={form} />
          </ModalBody>
          <ModalFooter>
            <SubmitButton
              isPending={isPending}
              handleFormSubmit={handleFormSubmit}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);

export default Update${entity.pascalCase()}Modal;
`;
  return page;
}
