import React, { FC } from "react";
import styled from "styled-components";
import Button from "../components/button";
import Modal from "../components/modal";
import Padder from "../components/padder";
import { Category, ModalProps, Service } from "../types";
import { fetcher } from "../utils";
import {useQueryClient} from "react-query";


const DeleteModal: FC<ModalProps<Category | Service>> = ({
  ...modalProps
}) => {
  const {baseState, entityType, onRequestClose, body} = modalProps;
  const queryClient =  useQueryClient();


  const onConfirmHandler = async () => {
    if (baseState && baseState.id) {
      await fetcher([entityType, baseState.id], {
        data: baseState,
        method: "DELETE",
      });
      onRequestClose({
        ...modalProps,
        closeNotification: {
          type: "success",
          message: `Deleted '${
            baseState.name
          }' ${entityType.toLowerCase()}`,
        },
      });
      queryClient.invalidateQueries("categories");
    }
  };

  return (
    <Modal
{...modalProps}
    >
      <FormBody>{body}</FormBody>
      <FormFooter>
        <Button
          tabIndex={0}
          onClick={() => onRequestClose(modalProps)}
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
  box-shadow: inset 0 1px 0 0 ${(p) => p.theme.border.primary};
  padding: 24px;
`;

export default DeleteModal;
