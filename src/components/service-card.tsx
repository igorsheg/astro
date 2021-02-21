import React, { FC } from 'react';
import { Service } from 'server/entities';
import styled from 'styled-components';
import Card from './card';

interface CardProps {
  item: Service;
}

const ServiceCard: FC<CardProps> = ({ item }) => {
  return (
    <WrapPadder>
      <a href={item.url} target={item.target ? item.target : ''}>
        <StyledCard>
          <Title>
            <img src={item.logo} />
            <Description>
              <h4>{item.name}</h4>
              <p>{item.description}</p>
            </Description>
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

const WrapPadder = styled.div`
  width: 100%;
  max-width: 100%;
`;

const StyledCard = styled(Card)`
  :hover {
    transform: translateY(-1px);
  }
`;

const Title = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  margin: 0 0 18px 0;
  box-shadow: 0 1px 0 0 ${p => p.theme.border.primary};
  padding: 0 0 18px 0;

  img {
    height: 42px;
    max-height: 42px;
    max-width: 42px;
    min-height: 42px;
    min-width: 42px;
    width: 42px;
    margin: 0 12px 0 0;
  }
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
