import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { transparentize } from 'polished';
import React, { ChangeEvent, FC, useRef } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import useKeypress from 'react-use-keypress';
import Flex from 'src/components/flex';
import { uiStore } from 'src/stores';
import styled from 'styled-components';
import Kbd from './kbd';
interface SearchInputProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  height?: number;
  growOnFocus?: boolean;
  placeHolder?: string;
}
export const SearchInput: FC<SearchInputProps> = ({
  onChange,
  value,
  growOnFocus = false,
  placeHolder,
  ...rest
}) => {
  const { activeModals } = uiStore();

  const isThereOpenModal = activeModals
    .map(m => m.state)
    .filter(m => m === 'expnanded');

  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  useKeypress('/', (ev: KeyboardEvent) => {
    if (
      document.activeElement !== inputRef.current &&
      inputRef.current &&
      !isThereOpenModal.length
    ) {
      ev.preventDefault();
      ev.stopPropagation();
      inputRef.current.focus();
    } else {
      return;
    }
  });

  return (
    <PseudoInput {...rest} growOnFocus={growOnFocus}>
      <Prefix>
        <MagnifyingGlassIcon />
      </Prefix>
      <input
        ref={inputRef}
        defaultValue={value}
        onChange={onChange}
        placeholder={placeHolder || ''}
        tabIndex={0}
        type="text"
      />
      <FakeInput />
      <Kbd>/</Kbd>
    </PseudoInput>
  );
};

const FakeInput = styled.span``;
const PseudoInput = styled.div<{ height?: number; growOnFocus?: boolean }>`
  width: ${p => (p.growOnFocus ? undefined : '100%')};
  display: flex;
  align-items: center;
  padding: 0 6px;

  ${FakeInput} {
    background: ${p => p.theme.background.secondary};
    box-shadow: 0 0 0 1px transparent;
    position: absolute;
    left: 0;
    border-radius: 4px;
    top: 0;
    user-select: none;
    pointer-events: none;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  input {
    margin: 0;
    padding: 0;
    height: ${p => (p.height ? `${p.height}px` : '100%')};
    font-size: 14px;
    color: ${p => p.theme.text.primary};
    background: transparent;
    border: none;
    display: flex;
    align-items: center;
    transition: border 240ms cubic-bezier(0.19, 1, 0.22, 1),
      width 240ms cubic-bezier(0.19, 1, 0.22, 1);
    width: ${p => (p.growOnFocus ? '190px' : '100%')};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    ::placeholder {
      color: ${p => transparentize(0.6, p.theme.text.primary)};
    }

    :hover + ${FakeInput} {
      box-shadow: 0 0 0 1px ${p => p.theme.border.primary};
    }
    :focus {
      width: ${p => (p.growOnFocus ? '300px' : '100%')};
    }
    :focus + ${FakeInput} {
      outline: none;
      box-shadow: 0 0 0 1px ${p => p.theme.border.primary};
    }
  }
`;

const Prefix = styled(Flex)`
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 30px;
`;

export default SearchInput;
