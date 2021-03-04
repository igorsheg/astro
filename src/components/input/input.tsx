import { transparentize } from 'polished';
import React, { ComponentClass, FC } from 'react';
import { Input as ReakitInput, InputProps as ReakitInputProps } from 'reakit';
import styled from 'styled-components';

interface InputProps extends ReakitInputProps {
  as?: 'textarea' | 'file';
}

const Input: FC<InputProps> = ({ ...props }) => {
  return <StyledInput type={props.as} {...props} />;
};

const StyledInput = styled(ReakitInput)<InputProps>`
  width: 100%;
  height: 48px;
  border: 1px solid ${p => p.theme.border.primary};
  color: ${p => p.theme.text.primary};
  font-size: 14px;
  padding: 0 15px;
  font-weight: 500;
  border-radius: 4px;
  background: ${p => p.theme.background.secondary};
  transition: all 240ms cubic-bezier(0.19, 1, 0.22, 1);

  :hover {
    border: 1px solid ${p => transparentize(0.7, p.theme.text.primary)};
  }
  :focus {
    border: 1px solid ${p => transparentize(0, p.theme.text.primary)};
  }
  ::placeholder {
    color: ${p => transparentize(0.5, p.theme.text.primary)};
  }

  ${p =>
    p.as === 'textarea' &&
    `
    padding: 15px;
    height: 66px;
  
  `}
`;

export default Input;
