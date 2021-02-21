import { darken, transparentize, invert } from 'polished';
import styled, { css } from 'styled-components';

type ButtonTypes = 'default' | 'toogle';

interface StyledButtonProps {
  skin?: ButtonTypes;
}

const defaultStyles = css``;

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
  margin: 0 0 0 0;

  :hover {
    cursor: pointer;
  }

  ${p => (p.skin === 'toogle' ? tooggleStyles : defaultStyles)}
`;

export default Button;
