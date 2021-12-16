import { CheckIcon } from "@radix-ui/react-icons";
import { transparentize } from "polished";
import React, { FC } from "react";
import { Checkbox as ReakitCheckbox, CheckboxOptions } from "reakit/Checkbox";
import styled from "styled-components";

interface AstroCheckboxProps extends CheckboxOptions {
  name: string;
}
export const AstroCheckbox: FC<AstroCheckboxProps> = ({ name, ...rest }) => {
  return (
    <CheckBoxLabel htmlFor="target" name={name}>
      <CheckBox {...rest} name={name} />
      {rest.checked && <CheckIcon className="checkIcon" />}
    </CheckBoxLabel>
  );
};

const CheckBoxLabel = styled.label<{ name: string }>`
  display: flex;
  justify-content: center;
  align-items: center;


  .checkIcon {
    position: absolute;
    color: currentColor;
    color: ${(p) => p.theme.background.secondary};
    user-select: none;
    pointer-events: none;
  }
`;
const CheckBox = styled(ReakitCheckbox)<{ name: string }>`
  appearance: none;
  border: 1px solid ${(p) => p.theme.border.primary};
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  width: 18px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  background: ${(p) => p.theme.background.secondary};
  transition: all 120ms cubic-bezier(0.19, 1, 0.22, 1);


  :focus{
    outline: none;
    box-shadow: 0 0 0px 2px ${p => transparentize(0.4,p.theme.accent.primary)};
  }

  &:hover {
    border: 1px solid ${(p) => transparentize(0.5, p.theme.text.primary)};
  }

  &:checked {
    background-color: ${(p) => p.theme.text.primary};
    border: 1px solid ${(p) => transparentize(0.5, p.theme.text.primary)};
  }
`;
