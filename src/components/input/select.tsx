import { CheckIcon } from '@radix-ui/react-icons';
import { invert, transparentize } from 'polished';
import React, { FC, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import {
  unstable_Combobox as Combobox,
  unstable_ComboboxOption as ComboboxOption,
  unstable_ComboboxPopover as ComboboxPopover,
  unstable_useComboboxState as useComboboxState,
  InputProps as ReakitInputProps,
} from 'reakit';
import styled, { css } from 'styled-components';
import { SelectOption } from 'typings';
import { Input } from '.';
import Flex from '../flex';
import Padder from '../padder';

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
    gutter: 3,
  });

  useEffect(() => {
    if (combobox.currentId && combobox.currentValue) {
      onChange({ id: combobox.currentId, value: combobox.currentValue });
    }
  }, [combobox.inputValue]);

  function tpmt(x: number) {
    return (Math.pow(2, -10 * x) - 0.0009765625) * 1.0009775171065494;
  }

  const animationProps = useSpring({
    opacity: combobox.visible ? 1 : 0,
    transform: `translateY(${combobox.visible ? '0px' : '-2px'})`,
    config: {
      duration: 240,
      easing: (t: number) => 1 - tpmt(t),
    },
  });

  return (
    <Flex column auto>
      {label && (
        <>
          <InputLabel>{label}</InputLabel>
          <Padder y={6} />
        </>
      )}
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
          <animated.div style={animationProps}>
            {options.map(option => (
              <ComboboxOption
                key={option.id}
                id={option.id}
                aria-selected={option.id === defaultOptionId}
                value={option.value}
                {...combobox}
              >
                {option.value}
                {option.id === defaultOptionId && <CheckIcon />}
              </ComboboxOption>
            ))}
          </animated.div>
        </ComboboxPopover>
      </StyledSelect>
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
    display: flex;
    justify-content: space-between;

    svg {
      width: 21px;
      height: 21px;
      color: ${p => p.theme.accent.primary};
    }
  }

  &[aria-invalid='true'] {
    border: 1px solid #ff453a;
  }

  [role='combobox']:focus + [role='listbox'] [aria-selected='true'] {
    color: white;
    background: ${p => p.theme.accent.primary};
  }
  [role='option']:hover {
    background: ${p => p.theme.background.ternary};
    cursor: pointer;
  }
`;

export default Select;
