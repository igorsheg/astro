import { transparentize } from 'polished';
import React, { FC } from 'react';
import { Input as ReakitInput, InputProps as ReakitInputProps } from 'reakit';
import styled, { css } from 'styled-components';
import Flex from '../flex';

interface InputProps extends ReakitInputProps {
  as?: 'textarea' | 'file';
}

const Input: FC<InputProps> = ({ ...props }) => {
  return (
    <Flex column auto>
      <InputWrap isTucked={!!props.value}>
        <StyledInput
          aria-label={props.placeholder}
          aria-invalid={!!props['aria-errormessage']?.length}
          type={props.as}
          {...props}
          placeholder={undefined}
        />
        <div role="placeholder" aria-hidden="true">
          {props.placeholder}
        </div>
      </InputWrap>
      {props['aria-errormessage']?.length && (
        <ValidationMessage>{props['aria-errormessage']}</ValidationMessage>
      )}
    </Flex>
  );
};

const tuckStyles = css`
  transform-origin: bottom left;
  top: 7px;
  transform: scale(0.8);
`;

const InputWrap = styled.div<{ isTucked: boolean }>`
  display: flex;
  flex-direction: column;
  flex: auto;
  justify-content: center;

  div[role='placeholder'] {
    color: ${p => transparentize(0.5, p.theme.text.primary)};
    position: absolute;
    font-size: 14px;
    pointer-events: none;
    left: 15px;
    height: 16px;
    top: 19px;
    line-height: 16px;
    max-width: calc(100% - 16px);
    transition: all 240ms cubic-bezier(0.19, 1, 0.22, 1);
    background: transparent;
    ${p => p.isTucked && tuckStyles}
  }
  input:focus + div[role='placeholder'] {
    ${tuckStyles}
  }
  textarea:focus + div[role='placeholder'] {
    ${tuckStyles}
  }

  textarea {
    padding: 25px 15px 0 15px;
  }
`;

const StyledInput = styled(ReakitInput)<InputProps>`
  width: 100%;
  height: 54px;
  border: 1px solid ${p => p.theme.border.primary};
  color: ${p => p.theme.text.primary};
  font-size: 14px;
  padding: 14px 15px 0 15px;
  font-weight: 500;
  border-radius: 4px;
  background: ${p => p.theme.background.secondary};
  transition: all 240ms cubic-bezier(0.19, 1, 0.22, 1);
  position: relative;

  :hover {
    border: 1px solid ${p => transparentize(0.7, p.theme.text.primary)};
  }
  :focus {
    border: 1px solid ${p => transparentize(0, p.theme.text.primary)};
  }
  ::placeholder {
    color: ${p => transparentize(0.5, p.theme.text.primary)};
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
