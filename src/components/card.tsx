import { invert, transparentize } from 'polished';
import styled, { css } from 'styled-components';

const lightStyles = css`
  background: ${p => p.theme.background.primary};
  box-shadow: 0 1px 2px 0px ${p => transparentize(0.95, p.theme.text.primary)},
    0 0 0 1px ${p => p.theme.border.primary} inset;

  :hover {
    box-shadow: 0 2px 9px 0px ${p => transparentize(0.95, p.theme.text.primary)},
      0 0 0 1px ${p => p.theme.border.primary} inset;
  }
`;

const darkStyles = css`
  background: ${p => p.theme.background.primary};
  box-shadow: 0 0 0 1px ${p => invert(p.theme.text.primary)},
    0 0 0 1px ${p => transparentize(0, p.theme.border.primary)} inset;

  :hover {
    box-shadow: 0 3px 12px 0px ${p => invert(p.theme.text.primary)},
      0 0 0 1px ${p => transparentize(0, p.theme.border.primary)} inset;
  }
`;

const Card = styled.div`
  transition: box-shadow 240ms cubic-bezier(0.19, 1, 0.22, 1),
    transform 240ms cubic-bezier(0.19, 1, 0.22, 1);
  ${p => (p.theme.id === 'dark' ? darkStyles : lightStyles)};
`;

export default Card;
