import { transparentize } from 'polished';
import styled, { CSSProperties } from 'styled-components';

const Panel = styled.nav<{ height: CSSProperties['height'] }>`
  height: ${p => p.height};
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  background: ${p => transparentize(0.2, p.theme.background.primary)};
  backdrop-filter: saturate(180%) blur(20px);
  box-shadow: inset 0 -1px 0 ${p => p.theme.border.primary};
`;

export default Panel;
