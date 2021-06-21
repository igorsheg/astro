import * as RadixIcons from '@radix-ui/react-icons';
import React, { FC, FormEvent, useEffect } from 'react';
import { ChangeEvent } from 'react';
import { Input, Select } from 'src/components/input';
import Modal from 'src/components/modal';
import Padder from 'src/components/padder';
import { configStore, uiStore } from 'src/stores';
import styled from 'styled-components';
import { ModalIdentity, SelectOption } from 'typings';
import { RadixIconTypes } from 'typings/radixIconsTypes';

const baseFormState = {
  name: '',
  description: '',
  icon: '',
};

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

  const onIconChangeHandler = (option: SelectOption) => {
    setUiStore(d => {
      d.activeModals[ctxModalIndex].data = {
        ...d.activeModals[ctxModalIndex].data,
        icon: option.id,
      };
    });
  };

  useEffect(() => {
    console.log(modalIdentity);
  }, [modalIdentity]);

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

  const iconsOptions = React.useCallback(
    () =>
      iconList.map(x => ({
        id: x,
        value: x.replace(/([a-z])([A-Z])/g, '$1 $2'),
        icon: x as RadixIconTypes,
      })),
    [iconList],
  );

  return (
    <Modal
      onRequestClose={onRequestClose}
      title={'Create New Category'}
      modalIdentity={modalIdentity}
    >
      <form onChange={onFormChange}>
        <FormBody>
          <Group>
            <RowContent>
              <Input
                label="Category Name"
                name="name"
                placeholder="Home Media"
              />
            </RowContent>
            <Padder y={12} />
            <RowContent>
              <Select
                label="Icon"
                options={iconsOptions()}
                defaultOptionId={modalIdentity.data?.icon || iconList[0]}
                onChange={onIconChangeHandler}
              ></Select>
            </RowContent>
          </Group>
        </FormBody>
      </form>
    </Modal>
  );
};

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
const Row = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;
export default NewCategoryModal;
