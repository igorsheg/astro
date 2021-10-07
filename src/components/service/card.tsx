import React, { FC, useEffect } from 'react';
import { animated, useSpring, a } from 'react-spring';
import { Service } from 'server/entities';
import Card from 'src/components/card';
import Flex from 'src/components/flex';
import ServiceMenu from 'src/menus/service-menu';
import { uiStore } from 'src/stores';
import styled from 'styled-components';
import Padder from '../padder';

interface CardProps {
  item: Service | null;
}

const ServiceCard: FC<CardProps> = ({ item }) => {
  const { inEditMode } = uiStore();

  const props = useSpring({
    opacity: inEditMode ? '1' : '0',
    display: inEditMode ? 'block' : 'none',
    config: { duration: 120 },
  });

  if (!item) return null;

  return (
    <WrapPadder>
      <a
        onClick={ev => (inEditMode ? ev.preventDefault() : true)}
        href={item.url}
        target={item.target}
      >
        <StyledCard>
          <Title>
            <Flex>
              <Logo>
                <img src={'/logos' + '/' + item.logo} />
              </Logo>
              <Padder x={12} />
              <Description>
                <h4>{item.name}</h4>
                <p>{item.url}</p>
              </Description>
            </Flex>
            <Padder x={12} />
            <animated.div style={props}>
              <ServiceActions item={item} />
            </animated.div>
          </Title>
          <TagList>
            {item.tags &&
              item.tags.length &&
              item.tags.map((tag, index) => <li key={index}>{tag}</li>)}
          </TagList>
          <span />
        </StyledCard>
      </a>
    </WrapPadder>
  );
};

interface ServiceActionsProps {
  item: Service;
}
const ServiceActions: FC<ServiceActionsProps> = ({ item }) => {
  return (
    <Menu>
      <ServiceMenu item={item} />
    </Menu>
  );
};

const Menu = styled.div`
  z-index: 99999991;
`;

const WrapPadder = styled.div`
  width: 100%;
  transform-origin: center 80px;
  max-width: 100%;
`;

const StyledCard = styled(Card)`
  border-radius: 6px;
  padding: 18px;
  position: relative;
  display: flex;
  flex-direction: column;
  :hover {
    transform: translateY(-1px);
  }
`;

const Logo = styled.div`
  height: 42px;
  max-height: 42px;
  max-width: 42px;
  min-height: 42px;
  min-width: 42px;
  width: 42px;
  overflow: hidden;
  border-radius: 12px;
  img {
    display: block;
    height: 100%;
  }
`;
const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  margin: 0 0 18px 0;
  box-shadow: 0 1px 0 0 ${p => p.theme.border.primary};
  padding: 0 0 18px 0;
`;

const Description = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  min-width: 0;

  h4 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 0.2em 0;
    white-space: nowrap;
    overflow: hidden;
    box-orient: vertical;
    text-overflow: ellipsis;
  }
  p {
    line-height: 18px;
    margin: 0;
    font-size: 12px;
    font-weight: 400;
    color: ${p => p.theme.text.secondary};
    white-space: nowrap;
    overflow: hidden;
    box-orient: vertical;
    text-overflow: ellipsis;
  }
`;

const TagList = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  min-height: 24px;
  max-height: 24px;
  overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }

  li {
    :not(:last-child) {
      margin: 0 6px 0 0;
    }
    font-size: 12px;
    margin: 0;
    border-radius: 4px;
    padding: 1px 6px;
    color: ${p => p.theme.text.secondary};
    background: ${p => p.theme.background.secondary};
  }
`;

export default ServiceCard;
