import { UploadIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import set from 'lodash/set';
import { invert, transparentize } from 'polished';
import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { Checkbox as ReakitCheckbox } from 'reakit/Checkbox';
import {
  unstable_Combobox as Combobox,
  unstable_ComboboxOption as ComboboxOption,
  unstable_ComboboxPopover as ComboboxPopover,
  unstable_useComboboxState as useComboboxState,
} from 'reakit/Combobox';
import {
  unstable_FormLabel as FormLabel,
  unstable_useFormState as useFormState,
} from 'reakit/Form';
import { Category, Service } from 'server/entities';
import { ModalIdentity } from 'shared/types/internal';
import fetcher from 'shared/utils/fetcher';
import generateUuid from 'shared/utils/generateUuid';
import Button from 'src/components/button';
import Flex from 'src/components/flex';
import Input from 'src/components/input';
import Modal from 'src/components/modal';
import Padder from 'src/components/padder';
import { configStore, uiStore } from 'src/stores';
import styled, { css } from 'styled-components';
import { Asserts, object, string, ValidationError } from 'yup';

const baseFormState = {
  name: '',
  description: '',
  target: true,
  url: '',
  category: '',
  logo: '',
};

interface NewServiceModalProps {
  title: string;
  onRequestClose: (m: ModalIdentity<any>) => void;
  modalIdentity: ModalIdentity<typeof baseFormState>;
}

const schema = object({
  name: string().required('Naming your service is requiered'),
  url: string().url().required('Linking you service is reqieried'),
  category: string().required('Naming your service is requiered'),
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

const NewServiceModal: FC<NewServiceModalProps> = ({
  title,
  onRequestClose,
  modalIdentity,
}) => {
  const { data: config, sync: syncConfig } = configStore();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { activeModals, setUiStore } = uiStore();

  const ctxModalIndex = activeModals.findIndex(m => m.id === modalIdentity.id);

  useEffect(() => {
    syncConfig();
    setUiStore(d => {
      d.activeModals[ctxModalIndex].data = baseFormState;
    });
  }, []);

  const combobox = useComboboxState({
    list: true,
    inline: true,
    autoSelect: true,
    gutter: 0,
  });

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setLogoFile(event.target.files[0]);
      loadLogo(event.target.files[0]);
    }
  };

  const uploadLogo = async (): Promise<string> => {
    const data = new FormData();
    data.append('logo', logoFile as File);
    return axios.post(`/api/upload`, data, {}).then(res => res.data.path);
  };

  const logoRef = useRef<any>();

  const loadLogo = (file: File) => {
    const reader = new FileReader();
    reader.onload = async r => {
      if (r && r.target) {
        if (logoRef && logoRef.current) {
          logoRef.current.src = r.target.result as string;
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const onFormChange = (ev: ChangeEvent<HTMLFormElement>) => {
    const target = ev.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    setUiStore(d => {
      d.activeModals[ctxModalIndex].data = {
        ...d.activeModals[ctxModalIndex].data,
        [target.name]: value,
      };
    });
  };

  useEffect(() => {
    if (combobox.currentId) {
      setUiStore(d => {
        d.activeModals[ctxModalIndex].data = {
          ...d.activeModals[ctxModalIndex].data,
          category: combobox.currentId,
        };
      });
    }
  }, [combobox.currentId]);

  if (!modalIdentity.data) {
    return null;
  }

  const submitFormHandler = async (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    ev.preventDefault();

    if (modalIdentity.data) {
      const logoPath = await uploadLogo();

      setUiStore(d => {
        d.activeModals[ctxModalIndex].data = {
          ...d.activeModals[ctxModalIndex].data,
          logo: logoPath,
        };
      });

      const { target, category, ...formData } = modalIdentity.data;

      const newService: Service = {
        ...formData,
        target: !!target ? '_blank' : '',
        logo: logoPath,
        category: config?.categories.find(c => c.id === category) as Category,
      };
      fetcher(['Service'], { data: newService }).then(() => {
        syncConfig();
        setLogoFile(null);
        onRequestClose(modalIdentity);
      });
    }
  };

  return (
    <Modal
      onRequestClose={onRequestClose}
      title={title}
      modalIdentity={modalIdentity}
    >
      <form onChange={onFormChange}>
        <FormBody>
          <Group>
            <Row>
              <RowContent>
                <Upload>
                  <div role="imagePreview">
                    <img ref={logoRef} src="logos/logoPlaceHolder.png" />
                  </div>
                  <Padder x={12} />
                  <label>
                    <UploadIcon />
                    <Padder x={6} />
                    Upload service logo
                    <input type="file" name="logo" onChange={onChangeHandler} />
                  </label>
                </Upload>
              </RowContent>
            </Row>
            <Padder y={24} />
          </Group>

          <Padder y={24} />

          <Group>
            <h5>General Info</h5>
            <Row>
              <RowContent>
                <Input
                  onChange={() => false}
                  name="name"
                  value={modalIdentity.data.name}
                  placeholder="Service Name"
                />
              </RowContent>

              <Padder x={12} />

              <RowContent>
                <Input
                  name="url"
                  value={modalIdentity.data.url}
                  placeholder="Service Url"
                />
              </RowContent>
            </Row>
            <Padder y={12} />
            <Row>
              <RowContent>
                <Input
                  as="textarea"
                  name="description"
                  value={modalIdentity.data.description}
                  placeholder="Service Description"
                />
              </RowContent>
            </Row>

            <Padder y={12} />

            <Row>
              <RowContent>
                <Select>
                  <Combobox
                    {...combobox}
                    name="category"
                    type="select"
                    as={Input}
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

            <Padder y={24} />
          </Group>

          <Padder y={24} />

          <Group>
            <h5>Settings</h5>

            <Row>
              <RowLabel>
                <Flex align="center">
                  <CheckBoxWrapper>
                    <CheckBox
                      checked={modalIdentity.data.target}
                      name="target"
                    />
                    <CheckBoxLabel name="target" />
                  </CheckBoxWrapper>
                  <Padder x={12} />
                  <span>Should it open in a new tab?</span>
                </Flex>
              </RowLabel>
            </Row>
          </Group>
        </FormBody>
        <FormFooter>
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
            tabIndex={0}
            type="submit"
            hierarchy="primary"
            onClick={submitFormHandler}
          >
            Submit
          </Button>
        </FormFooter>
      </form>
    </Modal>
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
  padding: 24px;
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

  /* input,
  textarea {
    width: 100%;
    height: 48px;
    border: 1px solid ${p => p.theme.border.primary};
    color: ${p => p.theme.text.primary};
    font-size: 14px;
    padding: 0 15px;
    font-weight: 500;
    border-radius: 4px;
    background: ${p => p.theme.background.secondary};
    transition: all 240ms cubic-bezier(0.19, 1, 0.22, 1);

    :hover {
      border: 1px solid ${p => transparentize(0.7, p.theme.text.primary)};
    }
    :focus {
      border: 1px solid ${p => transparentize(0, p.theme.text.primary)};
    }
    ::placeholder {
      color: ${p => transparentize(0.5, p.theme.text.primary)};
    }
  }
  textarea {
    padding: 15px;
    height: 66px;
  }
  div[role='alert'] {
    color: #ff453a;
    font-size: 12px;
    line-height: 12px;
    font-weight: 400;
    margin: 0.2em 0 0 0;
  } */
`;

const Group = styled.div`
  display: flex;
  width: 100%;
  flex: 1;
  flex-direction: column;
  position: relative;

  :not(:last-child):before {
    content: '';
  }
  :before {
    height: 1px;
    width: calc(100% + 24px);
    bottom: 0;
    background: ${p => p.theme.border.primary};
    position: absolute;
  }
  /* :not(:last-child) {
    box-shadow: inset 0 -1px 0 0 ${p => p.theme.border.primary};
  } */

  h5 {
    margin: 0 0 18px 0;
    padding: 0;
    font-size: 14px;
    font-weight: 500;
    color: ${p => p.theme.text.secondary};
  }
`;

const RowContent = styled.div`
  display: flex;
  flex: 1;
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
  padding: 24px;
`;

const CheckBoxWrapper = styled.div`
  position: relative;
  display: flex;
  height: 36px;
  justify-content: flex-start;
  align-items: center;

  input {
    width: 42px;
  }
`;
const CheckBoxLabel = styled.label<{ name: string }>`
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
const CheckBox = styled(ReakitCheckbox)<{ name: string }>`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 42px;
  max-width: 42px;
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

const Upload = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 48px;
  align-items: center;

  div[role='imagePreview'] {
    width: 48px;
    height: 48px;
    min-width: 48px;
    min-height: 48px;
    max-width: 48px;
    max-height: 48px;
    padding: 6px;
    border-radius: 11px;
    align-items: center;
    border: 1px dashed ${p => p.theme.border.primary};
    background: ${p => p.theme.background.secondary};
    display: flex;
    img {
      width: 100%;
      display: block;
    }
  }
  label {
    display: flex;
    align-items: center;
    font-size: 14px;
    :hover {
      text-decoration: underline;
    }

    input {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      font-size: 1;
      width: 100%;
      height: 100%;
      opacity: 0;
      z-index: 1;

      &:hover {
        cursor: pointer;
      }
    }
  }
`;

export default NewServiceModal;
