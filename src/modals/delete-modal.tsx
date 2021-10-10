import React, { FC } from 'react';
import Button from 'src/components/button';
import Modal from 'src/components/modal';
import Padder from 'src/components/padder';
import { serviceStore } from 'src/stores';
import { fetcher } from 'src/utils';
import styled from 'styled-components';
import { ModalIdentity } from 'typings';
import * as Entities from '../../server/entities';

const baseFormState: {
  entity: keyof typeof Entities;
  item: Entities.Service | Entities.Category | null;
} = {
  entity: 'Service',
  item: null,
};

interface DeleteModalProps {
  onRequestClose: <T>(m: ModalIdentity<T>) => void;
  modalIdentity: ModalIdentity<typeof baseFormState>;
}

const DeleteModal: FC<DeleteModalProps> = ({
  onRequestClose,
  modalIdentity,
}) => {
  const { sync: syncServices } = serviceStore();

  const onConfirmHandler = async () => {
    if (modalIdentity.data && modalIdentity.data.item) {
      await fetcher([modalIdentity.data.entity, modalIdentity.data.item.id], {
        data: modalIdentity.data.item,
        method: 'DELETE',
      });
      syncServices();
      onRequestClose(modalIdentity);
    }
  };

  return (
    <Modal
      onRequestClose={onRequestClose}
      title={modalIdentity.title}
      modalIdentity={modalIdentity}
    >
      <FormBody>{modalIdentity.body}</FormBody>
      <FormFooter>
        <Button
          tabIndex={0}
          onClick={() => onRequestClose(modalIdentity)}
          hierarchy="secondary"
        >
          Cancel
        </Button>

        <Padder x={12} />

        <Button
          role="button"
          tabIndex={0}
          type="submit"
          hierarchy="primary"
          onClick={onConfirmHandler}
        >
          Submit
        </Button>
      </FormFooter>
    </Modal>
  );
};

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-shadow: inset 0 1px 0 0 ${p => p.theme.border.primary};
  padding: 24px;
`;

export default DeleteModal;
