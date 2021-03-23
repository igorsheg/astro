import { darken, transparentize } from 'polished';
import React, { FC } from 'react';
import { Input as ReakitInput, InputProps as ReakitInputProps } from 'reakit';
import styled, { css } from 'styled-components';
import Flex from '../flex';
import Padder from '../padder';

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
          <Padder y={6} />
        </>
      )}
      <InputWrap isTucked={!!props.value}>
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

const InputLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
`;
const InputWrap = styled.div<{ isTucked: boolean }>`
  display: flex;
  flex-direction: column;
  flex: auto;
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

  :hover {
    border: 1px solid ${p => transparentize(0.5, p.theme.text.primary)};
  }
  :focus {
    /* border: 1px solid ${p => transparentize(0.5, p.theme.text.primary)}; */
    /* background: ${p => darken(0.02, p.theme.background.secondary)}; */
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
