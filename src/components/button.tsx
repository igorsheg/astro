import { darken } from 'polished';
import styled, {
  css,
  DefaultTheme,
  FlattenInterpolation,
  ThemeProps,
} from 'styled-components';

type HierarchyTypes = 'primary' | 'secondary' | 'ternary';

interface StyledButtonProps {
  hierarchy?: HierarchyTypes;
}

const ternary = css`
  background: none;
  border: none;
  color: ${p => p.theme.text.primary};
  transition: background 240ms cubic-bezier(0.19, 1, 0.22, 1);
  :hover {
    background: ${p => p.theme.background.secondary};
  }
`;

const secondary = css`
  background: none;
  box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px;
  border: 1px solid ${p => p.theme.border.primary};
  color: ${p => p.theme.text.primary};

  transition: background 240ms cubic-bezier(0.19, 1, 0.22, 1);
  :hover {
    background: ${p => darken(0.01, p.theme.background.secondary)};
  }
`;

const primary = css`
  background: ${p => p.theme.accent.primary};
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 2px;
  border: none;
  color: white;

  transition: background 240ms cubic-bezier(0.19, 1, 0.22, 1);
  :hover {
    background: ${p => p.theme.accent.secondary};
  }
`;

const hierarchyStyles: {
  [Key in HierarchyTypes]: FlattenInterpolation<ThemeProps<DefaultTheme>>;
} = {
  primary,
  secondary,
  ternary,
};

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
  ${p => hierarchyStyles[p.hierarchy || 'primary']}
`;

export default Button;
