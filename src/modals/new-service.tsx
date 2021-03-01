import set from 'lodash/set';
import { transparentize } from 'polished';
import React, { FC, useEffect } from 'react';
import {
  unstable_Combobox as Combobox,
  unstable_ComboboxOption as ComboboxOption,
  unstable_ComboboxPopover as ComboboxPopover,
  unstable_useComboboxState as useComboboxState,
} from 'reakit/Combobox';
import {
  unstable_Form as Form,
  unstable_FormCheckbox as FormCheckbox,
  unstable_FormInput as FormInput,
  unstable_FormLabel as FormLabel,
  unstable_FormMessage as FormMessage,
  unstable_FormSubmitButton as FormSubmitButton,
  unstable_useFormState as useFormState,
} from 'reakit/Form';
import Modal from 'src/components/modal';
import Padder from 'src/components/padder';
import styled from 'styled-components';
import { Asserts, object, string, ValidationError } from 'yup';

interface NewServiceModalProps {
  title: string;
  isOpen: boolean;
  onRequestClose: () => void;
}

const NewServiceModal: FC<NewServiceModalProps> = ({
  title,
  isOpen,
  onRequestClose,
}) => {
  const schema = object({
    name: string().required('Naming your service is requiered'),
    url: string().url().required('Linking you service is reqieried'),
  });

  function validateWithYup(yupSchema: typeof schema) {
    return (values: Asserts<typeof schema>) =>
      yupSchema
        .validate(values, { abortEarly: false })
        .then(() => null)
        .catch((error: ValidationError) => {
          if (error.inner.length) {
            throw error.inner.reduce(
              (acc, curr) => set(acc, curr.path as string, curr.message),
              {},
            );
          }
        });
  }

  const form = useFormState({
    values: {
      name: '',
      description: '',
      url: '',
      target: true,
      category: '',
    },
    validateOnChange: false,
    onValidate: validateWithYup(schema),
  });

  const combobox = useComboboxState({
    list: true,
    inline: true,
    autoSelect: true,
    gutter: 8,
    // if you comment the next line, positioning is always OK
    // minValueLength: 0,
  });

  useEffect(() => {
    if (combobox.currentValue) {
      form.values.category = combobox.currentValue;
    }
  }, [combobox.currentValue]);

  return (
    <div>
      <Modal onRequestClose={onRequestClose} isOpen={isOpen} title={title}>
        <Form {...form}>
          <FormBody>
            <Row>
              <RowLabel>
                <span>Name</span>
                <FormMessage name="name" {...form} />
              </RowLabel>

              <RowContent>
                <FormInput
                  name="name"
                  tabIndex={0}
                  {...form}
                  placeholder="E.g. 'Plex'"
                />
              </RowContent>
            </Row>
            <Padder y={18} />
            <Row>
              <RowLabel>
                <span>Description</span>
                <FormMessage name="description" {...form} />
              </RowLabel>

              <RowContent>
                <FormInput
                  as="textarea"
                  name="description"
                  tabIndex={0}
                  {...form}
                  placeholder="E.g. 'My home media server'"
                />
              </RowContent>
            </Row>

            <Padder y={18} />

            <Row>
              <RowLabel>
                <span>Url</span>
                <FormMessage name="url" {...form} />
              </RowLabel>

              <RowContent>
                <FormInput
                  name="url"
                  tabIndex={0}
                  {...form}
                  placeholder="E.g. https://www.plex.tv"
                />
              </RowContent>
            </Row>

            <Padder y={18} />

            <Row>
              <RowLabel>
                <span>Category</span>
                <FormMessage name="category" {...form} />
              </RowLabel>

              <RowContent>
                <Select
                  {...combobox}
                  name="category"
                  aria-label="Fruit"
                  placeholder="Enter a fruit"
                />
                <ComboboxPopover {...combobox} aria-label="Fruits">
                  <ComboboxOption
                    {...form}
                    {...combobox}
                    key="asdasd"
                    value={'asdasdas'}
                  />
                </ComboboxPopover>

                {/* <MenuButton {...menu}>
                  {props => (
                    <FormInput
                      name="category"
                      tabIndex={0}
                      {...form}
                      {...props}
                      placeholder="E.g. https://www.plex.tv"
                    />
                  )}
                </MenuButton>
                <ContextMenu aria-label="Manage Astro Menu" {...menu}>
                  <MenuItem {...menu}>New Service</MenuItem>
                  <MenuItem {...menu}>New Category</MenuItem>
                  <MenuItem {...menu}>New Note</MenuItem>




                </ContextMenu> */}

                {/* <FormInput
                  type="select"
                  name="category"
                  tabIndex={0}
                  {...form}
                  placeholder="E.g. https://www.plex.tv"
                >
                  <option value="asdas">asdasdasd</option>
                  <option value="asdas2">asdasdasdasdas</option>
                </FormInput> */}
              </RowContent>
            </Row>

            <Padder y={18} />

            <Row>
              <RowLabel>
                <span>Should it open in a new tab?</span>
              </RowLabel>
              <RowContent>
                <CheckBoxWrapper>
                  <CheckBox {...form} name="target" />
                  <CheckBoxLabel {...form} name="target" />
                </CheckBoxWrapper>
              </RowContent>
            </Row>
          </FormBody>
          <FormSubmitButton {...form}>Submit</FormSubmitButton>
        </Form>
      </Modal>
    </div>
  );
};

const Select = styled(Combobox)`
  [role='combobox'] {
    font-family: var(--font-family);
    font-size: var(--font-size);
    background-color: var(--combobox-background);
    color: var(--combobox-color);
    border: 1px solid var(--combobox-border);
    border-radius: 4px;
    height: 2.5em;
    padding: 0 1em;
    outline: 0;
    width: 250px;
    box-sizing: border-box;
  }

  [role='combobox']:focus {
    border-color: var(--combobox-border-focus);
    box-shadow: 0 0 0 1px var(--combobox-border-focus);
  }

  [role='listbox'] {
    font-family: var(--font-family);
    font-size: var(--font-size);
    background-color: var(--listbox-background);
    color: var(--listbox-color);
    width: 250px;
    z-index: 999;
    padding: 1em;
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 0 8px var(--listbox-shadow-50),
      0 10px 10px -5px var(--listbox-shadow-50),
      0 20px 25px -5px var(--listbox-shadow-100);
  }

  [role='option'] {
    cursor: default;
    padding: 0.5em;
    margin: 0 -0.5em;
    border-radius: 4px;
  }

  [role='option']:first-child {
    margin-top: -0.5em;
  }

  [role='option']:last-child {
    margin-bottom: -0.5em;
  }

  [role='option']:hover {
    background-color: var(--option-background-hover);
  }

  [role='combobox']:focus + [role='listbox'] [aria-selected='true'] {
    background-color: var(--option-background-focus);
  }
`;
const Row = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  input,
  textarea {
    width: 100%;
    height: 36px;
    border: 1px solid ${p => p.theme.border.primary};
    color: ${p => p.theme.text.primary};
    background: transparent;
    font-size: 14px;
    padding: 0 12px;
    border-radius: 6px;
    background: ${p => p.theme.background.secondary};
    transition: all 240ms cubic-bezier(0.19, 1, 0.22, 1);

    :hover {
      border: 1px solid ${p => transparentize(0.7, p.theme.text.primary)};
    }
    :focus {
      border: 1px solid ${p => transparentize(0.3, p.theme.text.primary)};
    }
  }
  textarea {
    padding: 12px;
    height: 72px;
  }
  div[role='alert'] {
    color: #ff1a1a;
    font-size: 12px;
    line-height: 12px;
    font-weight: 400;
    margin: 0.2em 0 0 0;
  }
`;

const RowContent = styled.div`
  display: flex;
  flex: 0.5;
  position: relative;
`;
const RowLabel = styled(FormLabel)`
  flex: 0.5;
  display: flex;
  flex-direction: column;
  height: 36px;
  justify-content: center;
  span {
    line-height: 18px;
    font-size: 14px;
  }
`;

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const CheckBoxWrapper = styled.div`
  position: relative;
  display: flex;
  height: 36px;
  justify-content: flex-start;
  align-items: center;
`;
const CheckBoxLabel = styled(FormLabel)<{ name: string }>`
  position: absolute;
  left: 0;
  width: 42px;
  max-height: 24px;
  border-radius: 15px;
  background: ${p => p.theme.background.secondary};
  box-shadow: 0 0 0 1px ${p => p.theme.border.secondary};

  cursor: pointer;
  &::after {
    content: '';
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    background: ${p => p.theme.text.secondary};
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: all 240ms cubic-bezier(0.19, 1, 0.22, 1);
  }
  :hover::after {
    background: ${p => p.theme.text.primary};
  }
`;
const CheckBox = styled(FormCheckbox)<{ name: string }>`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 42px;
  max-height: 24px;

  &:checked + ${CheckBoxLabel} {
    background: ${p => p.theme.text.primary};
    &::after {
      content: '';
      display: block;
      background: ${p => p.theme.background.primary};
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 21px;
      transition: all 240ms cubic-bezier(0.19, 1, 0.22, 1);
    }
  }
`;

export default NewServiceModal;
