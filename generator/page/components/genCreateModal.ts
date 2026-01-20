import { BaseObject } from "@/types/generatorTypes";

export function generateCreateModal({ entity, model }: BaseObject) {
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

import ${entity.pascalCase()}Form from "./${entity.camelCase()}Form";
import {
  Create${entity.pascalCase()}Input,
  create${entity.pascalCase()}Resolver,
} from "@/api/${entity.camelCase()}/serializers/create${entity.pascalCase()}Serializer";
import { useCreate${entity.pascalCase()} } from "../hooks/useCreate${entity.pascalCase()}";

const Create${entity.pascalCase()}Modal = NiceModal.create(() => {
  const form = useForm<Create${entity.pascalCase()}Input>({
    resolver: zodResolver(create${entity.pascalCase()}Resolver),
    mode: "onBlur",
  });

  const { mutate: create${entity.pascalCase()}, isPending, error, isSuccess } = useCreate${entity.pascalCase()}();
  const modal = useModal();

  useEffect(() => {
    form.reset();
  }, [modal.visible]);

  useEffect(() => {
    if (isSuccess) {
      modal.hide();
    }
  }, [isSuccess]);

  const handleFormSubmit = form.handleSubmit((data: any) => create${entity.pascalCase()}(data));
  return (
    <Modal isOpen={modal.visible} onClose={() => modal.hide()}>
      <ModalContent>
        <ModalHeader>Criar ${entity.pascalCase()}</ModalHeader>
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
});

export default Create${entity.pascalCase()}Modal;
`;
  return page;
}
