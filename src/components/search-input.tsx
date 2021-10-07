import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { transparentize } from 'polished';
import React, { ChangeEvent, FC } from 'react';
import Flex from 'src/components/flex';
import styled from 'styled-components';

interface SearchInputProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  height?: number;
  growOnFocus?: boolean;
}
export const SearchInput: FC<SearchInputProps> = ({
  onChange,
  value,
  growOnFocus = false,
  ...rest
}) => {
  return (
    <PseudoInput {...rest} growOnFocus={growOnFocus}>
      <Prefix>
        <MagnifyingGlassIcon />
      </Prefix>
      <input
        defaultValue={value}
        onChange={onChange}
        placeholder="Search by service name or tags"
        tabIndex={0}
        type="text"
      />
    </PseudoInput>
  );
};

const PseudoInput = styled.div<{ height?: number; growOnFocus?: boolean }>`
  width: ${p => (p.growOnFocus ? undefined : '100%')};
  display: flex;
  align-items: center;

  input {
    margin: 0;
    padding: 0 9px 0 30px;
    border-radius: 4px;
    height: ${p => (p.height ? `${p.height}px` : '100%')};
    font-size: 14px;
    color: ${p => p.theme.text.primary};
    background: ${p => p.theme.background.secondary};
    border: 1px solid transparent;
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

    :hover {
      border: 1px solid ${p => p.theme.border.primary};
    }
    :focus {
      width: ${p => (p.growOnFocus ? '300px' : '100%')};
      outline: none;
      border: 1px solid ${p => p.theme.border.primary};
    }
  }
`;

const Prefix = styled(Flex)`
  position: absolute;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 33px;
`;

export default SearchInput;
