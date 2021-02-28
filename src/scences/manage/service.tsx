import { invert, transparentize } from 'polished';
import React, { FC, useEffect } from 'react';
import { Service } from 'server/entities';
import Flex from 'src/components/flex';
import ManageMenu from 'src/menus/manage-menu';
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
  return (
    <ServiceRow>
      <Flex align="center">
        <img src={item.logo} alt={`${item.name} icon`} />
        <ServiceDescription>
          <p>{item.name}</p>
          <h5>{item.description}</h5>
        </ServiceDescription>
      </Flex>
      <ManageMenu onChange={() => false} />
    </ServiceRow>
  );
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
  height: 72px;
  min-height: 66px;
  display: flex;
  align-items: center;
  padding: 0 18px;
  position: relative;
  justify-content: space-between;

  img {
    height: 30px;
    max-height: 30px;
    max-width: 30px;
    min-height: 30px;
    min-width: 30px;
    width: 30px;
    margin: 0 12px 0 0;
  }
  :after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 18px;
    width: calc(100% - 36px);
    height: 1px;
    background: ${p => p.theme.border.primary};
  }
`;

const ServiceDescription = styled.div`
  p {
    margin: 0;
    padding: 0;
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    margin: 0 0 0.3em 0;
  }
  h5 {
    margin: 0;
    padding: 0;
    font-size: 12px;
    font-weight: 400;
    color: ${p => p.theme.text.secondary};
  }
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
