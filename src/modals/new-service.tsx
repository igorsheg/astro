import set from 'lodash/set';
import { invert, transparentize } from 'polished';
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
  unstable_useFormState as useFormState,
} from 'reakit/Form';
import { ActiveModal } from 'shared/types/internal';
import Button from 'src/components/button';
import Modal from 'src/components/modal';
import Padder from 'src/components/padder';
import { configStore } from 'src/stores';
import styled, { css } from 'styled-components';
import { Asserts, object, string, ValidationError } from 'yup';

interface NewServiceModalProps {
  title: string;
  isOpen: boolean;
  onRequestClose: (m: ActiveModal) => void;
}

const NewServiceModal: FC<NewServiceModalProps> = ({
  title,
  isOpen,
  onRequestClose,
}) => {
  const modalIdentity: ActiveModal = {
    id: 'new-service',
    state: 'closed',
  };
  const { data: config, sync: syncConfig } = configStore();

  useEffect(() => {
    syncConfig();
  }, []);

  const schema = object({
    name: string().required('Naming your service is requiered'),
    url: string().url().required('Linking you service is reqieried'),
    category: string().required('Naming your service is requiered'),
    // category: string().is(['home-media'], 'asdasd').,
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
  });

  useEffect(() => {
    if (combobox.currentId) {
      form.update('category', combobox.currentId);
    }
  }, [combobox.currentId]);

  return (
    <div>
      <Modal
        onRequestClose={() => onRequestClose(modalIdentity)}
        isOpen={isOpen}
        title={title}
      >
        <Form {...form}>
          <FormBody>
            <Row>
              <RowLabel>
                <span>Name</span>
                <FormMessage name="name" {...form} />
              </RowLabel>

              <RowContent>
                <FormInput name="name" {...form} placeholder="E.g. 'Plex'" />
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
                <Select>
                  <Combobox
                    {...combobox}
                    {...form}
                    name="category"
                    type="select"
                    aria-label="Category"
                    placeholder="Select Category"
                  />

                  <ComboboxPopover {...combobox} aria-label="Categories">
                    {config &&
                      config.categories &&
                      config.categories.length &&
                      config.categories.map(category => (
                        <ComboboxOption
                          key={category.id}
                          id={category.id}
                          value={category.name}
                          {...combobox}
                        />
                      ))}
                  </ComboboxPopover>
                </Select>
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
          <FormFooter>
            {/* <Tabbable> */}
            <Button
              tabIndex={0}
              onClick={() => onRequestClose(modalIdentity)}
              hierarchy="secondary"
            >
              Cancel
            </Button>

            <Padder x={12} />

            <Button
              role="button"
              {...form}
              tabIndex={0}
              type="submit"
              hierarchy="primary"
              onClick={() => form.submit()}
            >
              Submit
            </Button>
          </FormFooter>
        </Form>
      </Modal>
    </div>
  );
};

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

const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-shadow: inset 0 1px 0 0 ${p => p.theme.border.primary};
  padding: 18px;
`;

const Select = styled.div`
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
    /* min-height: min-content; */
    /* height: 300px; */
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

  [role='combobox']:focus + [role='listbox'] [aria-selected='true'] {
    color: white;
    background: ${p => p.theme.accent.primary};
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
    color: #ff453a;
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
  padding: 18px;
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
