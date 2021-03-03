import React, { FC, useCallback, useEffect, useState } from 'react';
import { animated, useTransition } from 'react-spring';
import { Service } from 'server/entities';
import { uiStore } from 'src/stores';
import { filterServicesItems } from 'src/utils';
import styled from 'styled-components';
import ServiceCard from './card';

interface ServiceListProps {
  items: Service[];
}
const ServiceList: FC<ServiceListProps> = ({ items }) => {
  const { searchTerm } = uiStore();
  const [localData, setLocalData] = useState(items);

  // useEffect(() => {
  //   const filteredData = filterServicesItems(items, searchTerm);
  //   setLocalData(!searchTerm.length ? items : filteredData || []);
  // }, [searchTerm]);

  const filteredData = useCallback(() => {
    return filterServicesItems(items, searchTerm);
  }, [searchTerm, items]);

  const transitions = useTransition(filteredData(), item => item.name, {
    from: { transform: 'translate3d(0,15px,0)', opacity: 0 },
    enter: {
      transform: 'translate3d(0,0px,0)',
      opacity: 1,
    },
    leave: {
      transform: 'translate3d(0,-15px,0)',
      opacity: 0,
    },
    config: {
      tension: 500,
      friction: 30,
      duration: searchTerm.length ? 0 : undefined,
    },
    trail: searchTerm.length ? 0 : 20,
  });

  return (
    <StyledList>
      {transitions.map(({ item, props, key }, index) => (
        <AnimatedCard index={index} key={key} style={props}>
          <ServiceCard item={item} />
        </AnimatedCard>
      ))}
    </StyledList>
  );
};

const StyledList = styled.section`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const AnimatedCard = styled(animated.div)<{ index: number }>`
  flex: 1;
  display: flex;
  width: 25%;
  min-width: 25%;
  max-width: 25%;
  :not(:nth-child(4n)) {
    padding: 0 18px 18px 0;
  }
`;
export default ServiceList;
