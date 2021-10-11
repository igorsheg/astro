import { UploadIcon } from '@radix-ui/react-icons';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { Checkbox as ReakitCheckbox } from 'reakit/Checkbox';
import { Service } from 'server/entities';
import Button from 'src/components/button';
import Flex from 'src/components/flex';
import { Input, Select } from 'src/components/input';
import Modal from 'src/components/modal';
import Padder from 'src/components/padder';
import { categoryStore, uiStore } from 'src/stores';
import {
  loadLogoRender,
  mapEntityToSelectOptions,
  uploadLogo,
  validateForm,
} from 'src/utils';
import fetcher from 'src/utils/fetcher';
import styled from 'styled-components';
import { ModalIdentity, ModalTypes, SelectOption } from 'typings';
import { object, string } from 'yup';

const schema = object().shape({
  name: string().required('Naming your service is requiered'),
  url: string().url().required('Linking you service is reqieried'),
});

interface ServiceModalProps {
  onRequestClose: <T>(m: ModalIdentity<T>) => void;
  modalIdentity: ModalIdentity<Service>;
}

const ServiceModal: FC<ServiceModalProps> = ({
  onRequestClose,
  modalIdentity,
}) => {
  const { data: categories, sync: syncCategories } = categoryStore();

  const ctxModalIndex = uiStore(s => s.activeModals.indexOf(modalIdentity));
  const setUiStore = uiStore(s => s.setUiStore);

  const [valitationState, setValitationState] = useState<
    { [key in keyof Service]: string } | Record<string, never>
  >({});

  const logoRenderRef = useRef<any>();
  const logoBlobRef = useRef<any>();
  const categoriesOptions = mapEntityToSelectOptions(categories || []);

  useEffect(() => {
    syncCategories();
    if (logoRenderRef.current) {
      fetch(logoRenderRef.current.src)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'placeholder.png', {
            type: 'image/png',
          });
          logoBlobRef.current = file;
        });
    }
  }, []);

  useEffect(() => {
    console.log(modalIdentity);
  }, [modalIdentity]);

  const onFormChange = (ev: ChangeEvent<HTMLFormElement>) => {
    const target = ev.target;

    if (target.type === 'file') {
      const file = target.files[0];
      logoBlobRef.current = file;
      loadLogoRender(file, logoRenderRef);
    } else if (target.type === 'checkbox') {
      setUiStore(d => {
        d.activeModals[ctxModalIndex].draft = {
          ...d.activeModals[ctxModalIndex].draft,
          target: modalIdentity.draft?.target === '_blank' ? '' : '_blank',
        };
      });
    } else {
      setUiStore(d => {
        d.activeModals[ctxModalIndex].draft = {
          ...d.activeModals[ctxModalIndex].draft,
          [target.name]: target.value,
        };
      });
    }
  };

  const categoryChangeHandler = (option: SelectOption) => {
    console.log(option);

    setUiStore(d => {
      d.activeModals[ctxModalIndex].draft = {
        ...d.activeModals[ctxModalIndex].draft,
        category: categories?.find(c => c.id === option.id),
      };
    });
  };

  const submitFormHandler = async (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    ev.preventDefault();

    if (modalIdentity.draft) {
      const { ...formData } = modalIdentity.draft;

      try {
        await validateForm(schema, modalIdentity.draft);
        const logoPath = await uploadLogo(logoBlobRef.current);

        const newService: Service = {
          ...formData,
          logo: logoPath,
        };

        if (modalIdentity.label === ModalTypes['edit-service']) {
          await fetcher(['Service', newService.id], {
            data: newService,
            method: 'PATCH',
          });
          onRequestClose({
            ...modalIdentity,
            closeNotification: {
              type: 'success',
              message: `Updated '${newService.name}' service`,
            },
          });
        } else {
          await fetcher(['Service'], { data: newService });
          onRequestClose({
            ...modalIdentity,
            closeNotification: {
              type: 'success',
              message: `Created ${modalIdentity.draft.name} service`,
            },
          });
        }
        await syncCategories();
      } catch (err: any) {
        setValitationState(err);
        return;
      }
    }
  };

  return (
    <Modal
      collapsable
      onRequestClose={onRequestClose}
      title={'Create New Service'}
      modalIdentity={modalIdentity}
    >
      <form onChange={debounce(ev => onFormChange(ev), 50)}>
        <FormBody>
          <Group>
            <Row>
              <RowContent>
                <Upload>
                  <div role="imagePreview">
                    <img
                      ref={logoRenderRef}
                      src={'/logos/' + modalIdentity.draft?.logo}
                    />
                  </div>
                  <Padder x={12} />
                  <label>
                    <UploadIcon />
                    <Padder x={6} />
                    Upload service logo
                    <input type="file" name="logo" />
                  </label>
                </Upload>
              </RowContent>
            </Row>
            <Padder y={24} />
          </Group>

          <Padder y={24} />

          <Group>
            <Row>
              <RowContent>
                <Input
                  name="name"
                  label="Service Name"
                  placeholder="Plex Media Server"
                  aria-errormessage={valitationState['name']}
                  defaultValue={modalIdentity.draft?.name}
                />
              </RowContent>

              <Padder x={12} />

              <RowContent>
                <Input
                  label="Service Url"
                  name="url"
                  placeholder="https://plex.example.com"
                  aria-errormessage={valitationState['url']}
                  defaultValue={modalIdentity.draft?.url}
                />
              </RowContent>
            </Row>
            <Padder y={18} />
            <Row>
              <RowContent>
                <Input
                  label="Description"
                  as="textarea"
                  name="description"
                  defaultValue={modalIdentity?.draft?.description}
                  aria-errormessage={valitationState['description']}
                  placeholder="write a bit about your service..."
                />
              </RowContent>
            </Row>

            <Padder y={18} />

            <Row>
              <RowContent>
                {categories && (
                  <Select
                    label="Categories"
                    options={categoriesOptions}
                    aria-errormessage={valitationState['category']}
                    defaultOptionId={modalIdentity.draft?.category.id || ''}
                    onChange={categoryChangeHandler}
                  />
                )}
              </RowContent>
            </Row>

            <Padder y={24} />
          </Group>

          <Padder y={24} />

          <Group>
            <Row>
              <RowLabel>
                <Flex align="center">
                  <CheckBoxWrapper>
                    <CheckBox
                      checked={modalIdentity?.draft?.target === '_blank'}
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
            disabled={isEqual(modalIdentity.baseState, modalIdentity.draft)}
          >
            Submit
          </Button>
        </FormFooter>
      </form>
    </Modal>
  );
};

const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-shadow: inset 0 1px 0 0 ${p => p.theme.border.primary};
  padding: 24px;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

  h5 {
    margin: 0 0 18px 0;
    padding: 0;
    font-size: 14px;
    font-weight: 500;
    color: ${p => p.theme.text.primary};
  }
`;

const RowContent = styled.div`
  display: flex;
  flex: 1;
  position: relative;
`;
const RowLabel = styled.label`
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
    overflow: hidden;
    img {
      border-radius: 7px;
      /* height: 100%; */
      width: 100%;
      height: auto;
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

export default ServiceModal;
