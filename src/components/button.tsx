import { darken, transparentize, invert } from 'polished';
import styled, { css } from 'styled-components';

type ButtonTypes = 'default' | 'toogle';
type HierarchyTypes = 'primary' | 'secondary';

interface StyledButtonProps {
  skin?: ButtonTypes;
  hierarchy?: HierarchyTypes;
}

const secondaryStyles = css`
  background: none;

  box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px;
  border: 1px solid ${p => p.theme.border.primary};
  color: ${p => p.theme.text.primary};
  font-size: 14px;
  height: 30px;
  transition: background 240ms cubic-bezier(0.19, 1, 0.22, 1);
  :hover {
    background: ${p => darken(0.01, p.theme.background.secondary)};
  }
`;

const primaryStyles = css`
  background: ${p => p.theme.accent.primary};
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 2px;
  border: none;
  color: white;
  font-size: 14px;
  height: 30px;
  transition: background 240ms cubic-bezier(0.19, 1, 0.22, 1);
  :hover {
    background: ${p => p.theme.accent.secondary};
  }
`;

const defaultStyles = css<StyledButtonProps>`
  ${p => (p.hierarchy === 'secondary' ? secondaryStyles : primaryStyles)}
`;

const tooggleStyles = css`
  background: none;
  border: none;

  color: ${p => p.theme.text.primary};
  :hover {
    background: ${p =>
      transparentize(0.6, darken(0.2, invert(p.theme.text.primary)))};
  }
`;

const Button = styled.button<StyledButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 9px;
  border-radius: 4px;
  height: 30px;
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  overflow: hidden;
  position: relative;
  :hover {
    cursor: pointer;
  }

  ${p => (p.skin === 'toogle' ? tooggleStyles : defaultStyles)}
`;

export default Button;
