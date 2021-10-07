import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import React, { FC, useCallback } from 'react';
import { a, useTransition } from 'react-spring';
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

  const filteredData = useCallback(() => {
    return filterServicesItems(items, searchTerm);
  }, [searchTerm, items]);

  function tpmt(x: number) {
    return (Math.pow(2, -10 * x) - 0.0009765625) * 1.0009775171065494;
  }

  const transitions = useTransition(filteredData(), {
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
      duration: searchTerm.length ? 0 : 680,
      easing: (t: number) => 1 - tpmt(t),
    },
    // trail: searchTerm.length ? 0 : 25,
  });

  return (
    <StyledList>
      {filteredData().map((s, i) => (
        <AnimatedCard key={s.id} style={{ zIndex: filteredData()?.length - i }}>
          <ServiceCard item={s} />
        </AnimatedCard>
      ))}
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
