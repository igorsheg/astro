import * as RadixIcons from '@radix-ui/react-icons';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import { transparentize } from 'polished';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { SAMPLE_CONFIG } from 'server/config/seed-data';
import { Category } from 'server/entities';
import Button from 'src/components/button';
import Flex from 'src/components/flex';
import { Input } from 'src/components/input';
import Modal from 'src/components/modal';
import Padder from 'src/components/padder';
import { configStore, uiStore } from 'src/stores';
import { fetcher, useFilteredList, validateForm } from 'src/utils';
import styled from 'styled-components';
import { ModalIdentity, SelectOption } from 'typings';
import { RadixIconTypes } from 'typings/radixIconsTypes';
import { object, string } from 'yup';

const baseFormState: {
  name: string;
  description: string;
  icon: RadixIconTypes;
} = {
  name: '',
  description: '',
  icon: 'ActivityLogIcon',
};

const schema = object().shape({
  name: string().required('Naming your service is requiered'),
});

interface NewCategoryModalProps {
  onRequestClose: <T>(m: ModalIdentity<T>) => void;
  modalIdentity: ModalIdentity<typeof baseFormState>;
}

const NewCategoryModal: FC<NewCategoryModalProps> = ({
  onRequestClose,
  modalIdentity,
}) => {
  const { data: config, sync: syncConfig } = configStore();
  const ctxModalIndex = uiStore(s => s.activeModals.indexOf(modalIdentity));
  const setUiStore = uiStore(s => s.setUiStore);

  const [valitationState, setValitationState] = useState<
    { [key in keyof typeof baseFormState]: string } | Record<string, never>
  >({});

  const onIconChangeHandler = (option: SelectOption) => {
    setUiStore(d => {
      d.activeModals[ctxModalIndex].data = {
        ...d.activeModals[ctxModalIndex].data,
        icon: option.id,
      };
    });
  };

  const onFormChange = (ev: ChangeEvent<HTMLFormElement>) => {
    setUiStore(d => {
      d.activeModals[ctxModalIndex].data = {
        ...d.activeModals[ctxModalIndex].data,
        [ev.target.name]: ev.target.value,
      };
    });

    return null;
  };
  const iconList = Object.keys(RadixIcons);
  const [filteredIconList, filter] = useFilteredList({ list: iconList });

  const iconsOptions = filteredIconList.map(x => ({
    id: x,
    value: x.replace(/([a-z])([A-Z])/g, '$1 $2'),
    icon: x as RadixIconTypes,
  }));

  const submitFormHandler = async (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    ev.preventDefault();

    if (modalIdentity.data) {
      const { ...formData } = modalIdentity.data;

      try {
        await validateForm(schema, modalIdentity.data);

        const newCategory: Category = {
          config: SAMPLE_CONFIG,
          ...formData,
        };
        await fetcher(['Category'], { data: newCategory });
        syncConfig();
        onRequestClose(modalIdentity);
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
      title={'Create New Category'}
      modalIdentity={modalIdentity}
    >
      <form>
        <FormBody>
          <Group>
            <RowContent>
              <Input
                label="Category Name"
                name="name"
                onChange={debounce(onFormChange, 200)}
                placeholder="Home Media"
                aria-errormessage={valitationState['name']}
              />
            </RowContent>
            <Padder y={18} />
            <RowContent>
              <IconsListWrap>
                <label>Category Icon</label>
                <IconListBody>
                  <SearchInput
                    onChange={throttle(ev => filter(ev.target.value), 200)}
                    placeholder="Search for icons..."
                  />
                  <IconsList>
                    {iconsOptions.map(iconOpt => (
                      <RowItem
                        key={iconOpt.id}
                        option={iconOpt}
                        modalIdentity={modalIdentity}
                        onIconChangeHandler={onIconChangeHandler}
                      />
                    ))}
                  </IconsList>
                </IconListBody>
              </IconsListWrap>
            </RowContent>
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

interface IconOption {
  icon: RadixIconTypes;
  value: string;
  id: string;
}
interface IconListProps {
  option: IconOption;
  modalIdentity: ModalIdentity<typeof baseFormState>;
  onIconChangeHandler: (opt: IconOption) => void;
}
const RowItem: FC<IconListProps> = ({
  option,
  modalIdentity,
  onIconChangeHandler,
}) => {
  const IconRender = RadixIcons[option.icon];

  return (
    <IconItem
      selected={modalIdentity.data?.icon === option.id}
      tabIndex={0}
      onClick={() => onIconChangeHandler(option)}
    >
      <Flex align="center" data-icon-content>
        <IconRender />
        {option.value}
      </Flex>
      <Flex data-icon-checkmark>
        {modalIdentity.data?.icon === option.id && <RadixIcons.CheckIcon />}
      </Flex>
    </IconItem>
  );
};
const IconListBody = styled.div`
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: ${p => p.theme.background.secondary};
  border: 1px solid ${p => p.theme.border.primary};
`;
const IconsListWrap = styled.div`
  flex-direction: column;
  display: flex;
  label {
    margin: 0 0 12px 0;
    padding: 0;
    font-size: 14px;
    font-weight: 600;
    color: ${p => p.theme.text.primary};
  }
`;
const SearchInput = styled.input`
  height: 42px;
  min-height: 42px;
  top: 0;
  width: 100%;
  margin: 0;
  background: transparent;
  padding: 0 12px;
  background: ${p => p.theme.background.secondary};
  color: ${p => p.theme.text.primary};
  border: none;
  box-shadow: inset 0 -1px 0 0 ${p => p.theme.border.primary};
  border-bottom: 1px ${p => p.theme.border.primary};
  font-size: 14px;
  ::placeholder {
    color: ${p => transparentize(0.7, p.theme.text.primary)};
  }
`;
const IconsList = styled.div`
  position: relative;
  background: ${p => p.theme.background.secondary};
  display: flex;
  max-height: calc(100vh - 500px);
  height: 100%;
  width: 100%;
  overflow-y: auto;
  flex-direction: column;
  border-radius: 6px;
  padding: 6px;
`;
const IconItem = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 42px;
  padding: 0 12px;
  font-size: 14px;
  border-radius: 6px;
  font-weight: ${p => (p.selected ? 500 : 400)};
  color: ${p => (p.selected ? p.theme.accent.primary : p.theme.text.primary)};
  :focus {
    background: ${p => p.theme.background.ternary};
  }
  :hover {
    background: ${p => p.theme.background.ternary};
    cursor: pointer;
  }
  [data-icon-content] {
    svg {
      margin: 0 12px 0 0;
    }
  }
  [data-icon-checkmark] {
    width: 21px;
    height: 21px;
    svg {
      height: 21px;
      width: 21px;
    }
    color: ${p => p.theme.accent.primary};
  }
`;

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
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
`;
const RowContent = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  flex-direction: column;
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-shadow: inset 0 1px 0 0 ${p => p.theme.border.primary};
  padding: 24px;
`;

export default NewCategoryModal;
