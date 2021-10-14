import { ChevronDownIcon } from '@radix-ui/react-icons';
import { transparentize } from 'polished';
import React, { FC } from 'react';
import { Input as ReakitInput, InputProps as ReakitInputProps } from 'reakit';
import styled from 'styled-components';
import Flex from '../flex';

interface InputProps extends ReakitInputProps {
  as?: 'textarea' | 'file';
  label?: string;
}

const Input: FC<InputProps> = ({ ...props }) => {
  return (
    <Flex column auto>
      {props.label && (
        <>
          <InputLabel>{props.label}</InputLabel>
        </>
      )}
      <InputWrap isTucked={!!props.value}>
        {props.type === 'select' && (
          <Suffix>
            <ChevronDownIcon />
          </Suffix>
        )}
        <StyledInput
          aria-label={props.placeholder}
          aria-invalid={!!props['aria-errormessage']?.length}
          type={props.as}
          {...props}
          placeholder={props.placeholder}
        />
      </InputWrap>
      {props['aria-errormessage']?.length && (
        <ValidationMessage>{props['aria-errormessage']}</ValidationMessage>
      )}
    </Flex>
  );
};

const Suffix = styled.span`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9991;
  width: 42px;
  pointer-events: none;
  right: 0;
  height: 100%;
  color: ${p => p.theme.text.secondary};
  :hover {
    cursor: pointer;
  }
  svg {
    color: currentColor;
  }
`;

const InputLabel = styled.label`
  margin: 0 0 12px 0;
  padding: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${p => p.theme.text.primary};
`;
const InputWrap = styled.div<{ isTucked: boolean }>`
  display: flex;
  flex-direction: column;
  flex: auto;
  position: relative;
  justify-content: center;

  textarea {
    padding: 12px 12px;
  }
`;

const StyledInput = styled(ReakitInput)<InputProps>`
  width: 100%;
  height: 42px;
  border: 1px solid ${p => p.theme.border.primary};
  color: ${p => p.theme.text.primary};
  font-size: 14px;
  padding: 0 12px;
  font-weight: 400;
  border-radius: 4px;
  background: ${p => p.theme.background.secondary};
  transition: all 240ms cubic-bezier(0.19, 1, 0.22, 1);
  position: relative;
  font-family: 'Inter var', sans-serif;

  :hover {
    border: 1px solid ${p => transparentize(0.5, p.theme.text.primary)};
  }
  :focus {
    border: 1px solid ${p => transparentize(0, p.theme.text.primary)};
  }
  ::placeholder {
    color: ${p => transparentize(0.7, p.theme.text.primary)};
  }

  &[aria-invalid='true'] {
    border: 1px solid #ff453a;
  }

  ${p =>
    p.as === 'textarea' &&
    `
    padding: 15px;
    height: 66px;
  
  `}
`;

const ValidationMessage = styled.span`
  font-size: 12px;
  margin: 6px 0 0 0;
  line-height: 16px;
  color: #ff453a;
`;

export default Input;
