import React, { FC } from "react";
import { animated, useSpring } from "react-spring";
import { Service } from "../../types";
import Card from "../../components/card";
import Flex from "../../components/flex";
import ServiceMenu from "../../menus/service-menu";
import { uiStore } from "../../stores";
import styled from "styled-components";
import Padder from "../padder";
import Tooltip from "../tooltip";
import AreaChart from "../../components/area-chart";

interface CardProps {
  item: Service | null;
}

const ServiceCard: FC<CardProps> = ({ item }) => {

  const { inEditMode } = uiStore();

  const props = useSpring({
    opacity: inEditMode ? "1" : "0",
    display: inEditMode ? "block" : "none",
    config: { duration: 120 },
  });

  if (!item) return null;

  const lastPingStatus =
    item &&
    item.pings &&
    item.pings.length &&
    item.pings[item.pings.length - 1].status_code;

  const tooltipData = lastPingStatus === 200 ? `Service Up` : "Service Down";

  return (
    <WrapPadder>
      <a
        onClick={(ev) => (inEditMode ? ev.preventDefault() : true)}
        href={item.url}
        target={item.target}
      >
        <StyledCard>
          <Title>
            <Flex>
              <Logo>
                <img src={"/public/logos" + "/" + item.logo} />
              </Logo>
              <Padder x={12} />
              <Description>
                <h4>{item.name}</h4>
                <p>{item.url}</p>
              </Description>
            </Flex>
            <Padder x={12} />
            <animated.div style={props}>
              <Menu>
                <ServiceMenu item={item} />
              </Menu>
            </animated.div>
          </Title>
          <Flex justify="space-between" align="center">
            <Padder x={42}/>
            <Tooltip placement="top" label={tooltipData} tabIndex={-1}>
              <AreaChart item={item} width={42} height={24} />
            </Tooltip>
          </Flex>
        </StyledCard>
      </a>
    </WrapPadder>
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
  box-shadow: 0 1px 0 0 ${(p) => p.theme.border.primary};
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
    color: ${(p) => p.theme.text.secondary};
    white-space: nowrap;
    overflow: hidden;
    box-orient: vertical;
    text-overflow: ellipsis;
  }
`;


export default ServiceCard;
