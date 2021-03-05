import { invert, transparentize } from 'polished';
import React, { FC, useEffect } from 'react';
import {
  unstable_Combobox as Combobox,
  unstable_ComboboxOption as ComboboxOption,
  unstable_ComboboxPopover as ComboboxPopover,
  unstable_useComboboxState as useComboboxState,
  InputProps as ReakitInputProps,
} from 'reakit';
import { SelectOption } from 'shared/types/internal';
import styled, { css } from 'styled-components';
import { Input } from '.';
import Flex from '../flex';

interface SelectProps extends Pick<ReakitInputProps, 'aria-errormessage'> {
  options: SelectOption[];
  label: string;
  onChange: (option: SelectOption) => void;
  defaultOptionId: SelectOption['id'];
}

const Select: FC<SelectProps> = ({
  options,
  label,
  onChange,
  defaultOptionId,
  ...props
}) => {
  const combobox = useComboboxState({
    list: true,
    inline: true,
    autoSelect: true,
    gutter: 3,
    currentId: defaultOptionId,
    values: options.map(op => op.value),
  });

  useEffect(() => {
    if (combobox.currentId && combobox.currentValue) {
      onChange({ id: combobox.currentId, value: combobox.currentValue });
    }
  }, [combobox.inputValue]);

  return (
    <Flex column auto>
      <StyledSelect>
        <Combobox
          {...combobox}
          name="category"
          type="select"
          as={Input}
          aria-label={label}
          placeholder="Select Category"
          aria-invalid={!!props['aria-errormessage']?.length}
        />

        <ComboboxPopover {...combobox} aria-label={label}>
          {options.map(option => (
            <ComboboxOption
              key={option.id}
              id={option.id}
              value={option.value}
              {...combobox}
            />
          ))}
        </ComboboxPopover>
      </StyledSelect>
      {props['aria-errormessage']?.length && (
        <ValidationMessage>{props['aria-errormessage']}</ValidationMessage>
      )}
    </Flex>
  );
};

const ValidationMessage = styled.span`
  font-size: 12px;
  margin: 6px 0 0 0;
  line-height: 16px;
  color: #ff453a;
`;

const lightStyles = css`
  background: ${p => p.theme.background.primary};
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0.1) 0px 4px 8px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px;
`;

const darkStyles = css`
  background: ${p => p.theme.background.secondary};
  box-shadow: 0 0 0 1px ${p => invert(p.theme.text.primary)},
    0 0 0 1px ${p => transparentize(0, p.theme.border.primary)} inset;
`;

const StyledSelect = styled.div`
  display: flex;
  width: 100%;

  [role='listbox'] {
    ${p => (p.theme.id === 'dark' ? darkStyles : lightStyles)};
    width: 100%;
    border-radius: 6px;
    z-index: 991;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    box-sizing: border-box;

    padding: 6px;
    position: relative;
  }

  [role='option'] {
    height: 36px;
    min-height: 36px;
    max-height: 36px;
    padding: 0 12px;
    font-size: 14px;
    display: flex;
    align-items: center;
    position: relative;
    border-radius: 4px;
  }

  [role='option']:hover {
    color: white;
    background: ${p => p.theme.accent.primary};
    cursor: pointer;
  }

  &[aria-invalid='true'] {
    border: 1px solid #ff453a;
  }

  [role='combobox']:focus + [role='listbox'] [aria-selected='true'] {
    color: white;
    background: ${p => p.theme.accent.primary};
  }
`;

export default Select;
