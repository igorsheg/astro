import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import Flex from 'src/components/flex';
import { transparentize } from 'polished';
import React, { ChangeEvent, FC } from 'react';
import styled from 'styled-components';

interface SearchInputProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
}
export const SearchInput: FC<SearchInputProps> = ({ onChange, value }) => {
  return (
    <PseudoInput>
      <Prefix>
        <MagnifyingGlassIcon />
      </Prefix>
      <input
        value={value}
        onChange={onChange}
        placeholder="Search by service or Link"
        tabIndex={0}
        type="text"
      />
    </PseudoInput>
  );
};

const PseudoInput = styled.div`
  input {
    margin: 0;
    padding: 0 9px 0 30px;
    border-radius: 4px;
    height: 30px;
    font-size: 14px;
    color: ${p => p.theme.text.primary};
    background: ${p => p.theme.background.secondary};
    border: 1px solid transparent;
    display: flex;
    align-items: center;
    transition: border 240ms cubic-bezier(0.19, 1, 0.22, 1),
      width 240ms cubic-bezier(0.19, 1, 0.22, 1);
    width: 190px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    ::placeholder {
      color: ${p => transparentize(0.7, p.theme.text.primary)};
    }

    :hover {
      border: 1px solid ${p => p.theme.border.primary};
    }
    :focus {
      width: 300px;
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
