import { invert, transparentize } from "polished";
import styled, { css } from "styled-components";

const lightStyles = css`
  background: ${(p) => p.theme.background.primary};
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.02),
    0 2px 2px -1px rgba(0, 0, 0, 0.05),
    0 0 0 1px ${(p) => p.theme.border.primary};

  :hover {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.07),
      0 2px 2px -1px rgba(0, 0, 0, 0.05),
      0 0 0 1px ${(p) => p.theme.border.primary};
  }
`;

const darkStyles = css`
  background: ${(p) => p.theme.background.primary};
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0), 0 2px 2px -1px rgba(0, 0, 0, 0),
    0 0 0 1px ${(p) => invert(p.theme.text.primary)},
    0 0 0 1px ${(p) => transparentize(0, p.theme.border.primary)} inset;

  :hover {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.15),
      0 2px 2px -1px rgba(0, 0, 0, 0.3),
      0 0 0 1px ${(p) => invert(p.theme.text.primary)},
      0 0 0 1px ${(p) => transparentize(0, p.theme.border.primary)} inset;
  }
`;

const CardCss = css`
  ${(p) => (p.theme.id === "dark" ? darkStyles : lightStyles)};
  transition: box-shadow 240ms cubic-bezier(0.19, 1, 0.22, 1),
    transform 240ms cubic-bezier(0.19, 1, 0.22, 1);
`;

const Card = styled.div`
  transition: box-shadow 240ms cubic-bezier(0.19, 1, 0.22, 1),
    transform 240ms cubic-bezier(0.19, 1, 0.22, 1);
  ${(p) => (p.theme.id === "dark" ? darkStyles : lightStyles)};
`;

export default Card;
export { CardCss };
