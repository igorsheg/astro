import { invert, transparentize } from 'polished';
import React, { FC, useEffect } from 'react';
import { Service } from 'server/entities';
import { configStore, serviceStore, uiStore } from 'src/stores';
import styled, { css } from 'styled-components';

const ManageServiceList: FC = () => {
  const { searchTerm } = uiStore();
  const { data: config } = configStore();

  const {
    data: services,
    mutate: mutateServices,
    sync: syncServices,
  } = serviceStore();

  useEffect(() => {
    syncServices();
  }, []);

  return (
    <StyledList>
      {services?.map(service => (
        <ServiceCard key={service.id} item={service} />
      ))}
    </StyledList>
  );
};

interface ServiceCardProps {
  item: Service;
}

const ServiceCard: FC<ServiceCardProps> = ({ item }) => {
  return <ServiceRow>{item.name}</ServiceRow>;
};

const lightStyles = css`
  background: ${p => p.theme.background.primary};
  box-shadow: 0 1px 2px 0px ${p => transparentize(0.95, p.theme.text.primary)},
    0 0 0 1px ${p => p.theme.border.primary} inset;
`;

const darkStyles = css`
  background: ${p => p.theme.background.primary};
  box-shadow: 0 0 0 1px ${p => invert(p.theme.text.primary)},
    0 0 0 1px ${p => transparentize(0, p.theme.border.primary)} inset;
`;

const ServiceRow = styled.div`
  width: 100%;
  height: 66px;
  min-height: 66px;
  display: flex;
  align-items: center;
  padding: 0 18px;
  position: relative;
  :after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 18px;
    width: calc(100% - 36px);
    height: 1px;
    background: ${p => p.theme.border.primary};
  }
  /* :not(:last-child) {
    box-shadow: inset 0 -1px 0 0 ${p => p.theme.border.primary};
  } */
`;

// Consolidate card styles across app
const StyledList = styled.div`
  max-width: 960px;
  position: relative;
  width: calc(100% - 96px);
  display: flex;
  min-height: min-content;
  flex-direction: column;
  background: ${p => p.theme.background.primary};
  border-radius: 6px;
  ${p => (p.theme.id === 'dark' ? darkStyles : lightStyles)};
`;

export default ManageServiceList;
