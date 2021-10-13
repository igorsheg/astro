import React, { FC } from 'react';
import AreaChart from 'src/components/area-chart';
import Button from 'src/components/button';
import Modal from 'src/components/modal';
import styled from 'styled-components';
import { ModalIdentity } from 'typings';
import { Service } from '../../server/entities';

interface ServiceMonitoryModalProps {
  onRequestClose: <T>(m: ModalIdentity<T>) => void;
  modalIdentity: ModalIdentity<Service>;
}

const ServiceMonitorModal: FC<ServiceMonitoryModalProps> = ({
  onRequestClose,
  modalIdentity,
}) => {
  return (
    <Modal
      onRequestClose={onRequestClose}
      title={modalIdentity.title}
      modalIdentity={modalIdentity}
      collapsable
    >
      <FormBody>
        <AreaChart
          withAreaFill
          withCloumnGrid
          withTooltip
          width={600}
          height={337}
          item={modalIdentity.baseState as Service}
        />
      </FormBody>
      <FormFooter>
        <Button
          role="button"
          tabIndex={0}
          type="submit"
          hierarchy="primary"
          onClick={() => onRequestClose(modalIdentity)}
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
  box-shadow: inset 0 1px 0 0 ${p => p.theme.border.primary};
  padding: 24px;
`;

export default ServiceMonitorModal;
