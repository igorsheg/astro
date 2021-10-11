import React, { FC } from 'react';
import Button from 'src/components/button';
import Modal from 'src/components/modal';
import Padder from 'src/components/padder';
import { categoryStore, serviceStore } from 'src/stores';
import { fetcher } from 'src/utils';
import styled from 'styled-components';
import { ModalIdentity } from 'typings';
import * as Entities from '../../server/entities';

interface BaseState
  extends Pick<Entities.Service, 'id' | 'name'>,
    Pick<Entities.Category, 'id' | 'name'> {
  entityType: keyof typeof Entities;
}

interface DeleteModalProps {
  onRequestClose: <T>(m: ModalIdentity<T>) => void;
  modalIdentity: ModalIdentity<BaseState>;
}

const DeleteModal: FC<DeleteModalProps> = ({
  onRequestClose,
  modalIdentity,
}) => {
  const { sync: syncCategories } = categoryStore();

  const onConfirmHandler = async () => {
    if (modalIdentity.baseState && modalIdentity.baseState.id) {
      await fetcher([modalIdentity.entityType, modalIdentity.baseState.id], {
        data: modalIdentity.baseState,
        method: 'DELETE',
      });
      syncCategories();
      onRequestClose({
        ...modalIdentity,
        closeNotification: {
          type: 'success',
          message: `Deleted '${
            modalIdentity.baseState.name
          }' ${modalIdentity.entityType.toLowerCase()}`,
        },
      });
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
