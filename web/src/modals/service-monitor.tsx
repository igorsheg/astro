import React, { FC } from "react";
import styled from "styled-components";
import AreaChart from "../components/area-chart";
import Button from "../components/button";
import Modal from "../components/modal";
import {ModalProps, Service } from "../types";


const ServiceMonitorModal: FC<ModalProps<Service>> = ({
  ...modalProps
}) => {
  const {onRequestClose, baseState} = modalProps;
  return (

    <Modal
      collapsable
  {...modalProps}
    >
      <FormBody>
        <AreaChart
          withAreaFill
          withCloumnGrid
          withTooltip
          width={600}
          height={337}
          item={baseState as Service}
        />
      </FormBody>
      <FormFooter>
        <Button
          role="button"
          tabIndex={0}
          type="submit"
          hierarchy="primary"
          onClick={() => onRequestClose(modalProps)}
        >
          Close
        </Button>
      </FormFooter>
    </Modal>
  );
};

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 999999991;
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-shadow: inset 0 1px 0 0 ${(p) => p.theme.border.primary};
  padding: 24px;
`;

export default ServiceMonitorModal;
