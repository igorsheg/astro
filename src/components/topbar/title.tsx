import React, { FC } from 'react';
import { Config } from 'server/entities';
import Flex from 'src/components/flex';
import Padder from 'src/components/padder';
import styled from 'styled-components';

interface HeaderTitleProps {
  activeThemeId: string;
  config: Config;
}

const HeaderTitle: FC<HeaderTitleProps> = ({ activeThemeId, config }) => {
  if (!config) {
    return null;
  }

  return (
    <Flex align="center">
      <LogoIcon activeThemeId={activeThemeId}>
        <img src="/logo.svg" />
      </LogoIcon>
      <Padder x="18" />
      <Title column>
        <h1>{config.title}</h1>
        {config.subtitle && <h5>{config.subtitle}</h5>}
      </Title>
    </Flex>
  );
};

const LogoIcon = styled.div<{ activeThemeId: string }>`
  img {
    filter: ${p => (p.activeThemeId === 'dark' ? 'invert(0)' : 'invert(1)')};
    color: currentColor;
    width: 30px;
    height: 30px;
    display: block;
  }
`;

const Title = styled(Flex)`
  h1 {
    font-size: 20px;
    margin: 0;
  }
  h5 {
    margin: 0.3em 0 0 0;
    font-size: 14px;
  }
`;

export default HeaderTitle;
