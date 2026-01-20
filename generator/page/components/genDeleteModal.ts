import { BaseObject } from "@/types/generatorTypes";

export function generateDeleteModal({ entity, model }: BaseObject) {
  const page = `
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useEffect } from "react";

import { useDelete${entity.pascalCase()} } from "../hooks/useDelete${entity.pascalCase()}";

type Delete${entity.pascalCase()}ModalProps = {
  id: string;
  name: string;
};

const Delete${entity.pascalCase()}Modal = NiceModal.create(
  ({ id: ${entity.camelCase()}Id, name }: Delete${entity.pascalCase()}ModalProps) => {
    const { mutate, error, isSuccess } = useDelete${entity.pascalCase()}();
    const modal = useModal();

    useEffect(() => {
      if (isSuccess) {
        modal.hide();
      }
    }, [isSuccess]);

    return (
      <Modal isOpen={modal.visible} onClose={() => modal.hide()}>
        <ModalContent>
          <ModalHeader>Deletar ${entity.pascalCase()}</ModalHeader>
          <ModalBody>
            {error && <h3 className="text-danger-500">{error.message}</h3>}
            <p>Tem certeza que deseja deletar o registro?</p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={() => modal.hide()}>
              {" "}
              Cancelar
            </Button>
            <Button color="primary" onPress={() => mutate({ ${entity.camelCase()}Id })}>
              {" "}
              Deletar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);

export default Delete${entity.pascalCase()}Modal;
`;
  return page;
}
