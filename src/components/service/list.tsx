import dynamic from 'next/dynamic';
import React, { FC, useCallback } from 'react';
import { a } from 'react-spring';
import { Service } from 'server/entities';
import { uiStore } from 'src/stores';
import { filterServicesItems } from 'src/utils';
import styled from 'styled-components';
import ServiceCard from './card';
import ServiceEmptyState from './empty-state';

interface ServiceListProps {
  items: Service[];
}
const ServiceList: FC<ServiceListProps> = ({ items }) => {
  const { searchTerm } = uiStore();

  const filteredData = useCallback(() => {
    return filterServicesItems(items, searchTerm);
  }, [searchTerm, items]);

  return (
    <StyledList>
      {!filteredData().length ? (
        <ServiceEmptyState />
      ) : (
        filteredData().map((s: Service, i: number) => (
          <AnimatedCard
            key={s.id}
            style={{ zIndex: filteredData()?.length - i }}
          >
            <ServiceCard item={s} />
          </AnimatedCard>
        ))
      )}
    </StyledList>
  );
};

const StyledList = styled(a.section)`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const AnimatedCard = styled(a.div)`
  flex: 1;
  display: flex;
  position: relative;
  width: 25%;
  min-width: 25%;
  max-width: 25%;
  :not(:nth-child(4n)) {
    padding: 0 18px 18px 0;
  }
`;
export default ServiceList;
