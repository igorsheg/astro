import * as RadixIcons from "@radix-ui/react-icons";
import debounce from "lodash/debounce";
import isEqual from "lodash/isEqual";
import throttle from "lodash/throttle";
import { transparentize } from "polished";
import React, { ChangeEvent, FC, useState } from "react";
import styled from "styled-components";
import { object, string } from "yup";
import Button from "../components/button";
import Flex from "../components/flex";
import { Input } from "../components/input";
import Modal from "../components/modal";
import Padder from "../components/padder";
import { uiStore } from "../stores";
import {
  Category,
  ModalProps,
  ModalTypes,
  RadixIconTypes,
  SelectOption,
} from "../types";
import { fetcher, useFilteredList, validateForm } from "../utils";
import { useQueryClient } from "react-query";

const schema = object().shape({
  name: string().required("Naming your service is requiered"),
});

const CategoryModal: FC<ModalProps<Category>> = ({ ...modalProps }) => {
  const queryClient = useQueryClient();
  const { onRequestClose, id, draft, label, baseState } = modalProps;
  const setUiStore = uiStore((s) => s.setUiStore);
  const ctxModalIndex = uiStore((s) =>
    s.activeModals.findIndex((m) => m.id === id)
  );

  const [valitationState, setValitationState] = useState<
    { [key in keyof Category]: string } | Record<string, never>
  >({});

  const onIconChangeHandler = (option: SelectOption) => {
    setUiStore((d) => {
      d.activeModals[ctxModalIndex].draft = {
        ...d.activeModals[ctxModalIndex].draft,
        icon: option.id,
      };
    });
  };

  const onFormChange = (ev: ChangeEvent<HTMLFormElement>) => {
    setUiStore((d) => {
      d.activeModals[ctxModalIndex].draft = {
        ...d.activeModals[ctxModalIndex].draft,
        [ev.target.name]: ev.target.value,
      };
    });

    return null;
  };
  const iconList = Object.keys(RadixIcons);
  const [filteredIconList, filter] = useFilteredList({ list: iconList });

  const iconsOptions = filteredIconList.map((x) => ({
    id: x,
    value: x.replace(/([a-z])([A-Z])/g, "$1 $2"),
    icon: x as RadixIconTypes,
  }));

  const submitFormHandler = async (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    ev.preventDefault();
    if (!draft) return;
    const isInEditMode = label === ModalTypes["edit-category"];

    try {
      await validateForm(schema, draft);
    } catch (err: any) {
      setValitationState(err);
      return;
    }

    try {
      await fetcher(["categories", isInEditMode ? draft.id : undefined], {
        data: draft,
        method: isInEditMode ? "PATCH" : "POST",
      });

      onRequestClose({
        ...modalProps,
        closeNotification: {
          type: "success",
          message: `${isInEditMode ? "Updated" : "Created"} '${
            draft.name
          }' category`,
        },
      });
      queryClient.invalidateQueries("categories");
    } catch (err) {
      throw new Error();
    }
  };

  return (
    <Modal collapsable {...modalProps} title={modalProps.title}>
      <form>
        <FormBody>
          <Group>
            <RowContent>
              <Input
                label="Category Name"
                name="name"
                onChange={debounce(onFormChange, 50)}
                placeholder="Home Media"
                aria-errormessage={valitationState["name"]}
                defaultValue={draft?.name}
              />
            </RowContent>
            <Padder y={18} />
            <RowContent>
              <IconsListWrap>
                <label>Category Icon</label>
                <IconListBody>
                  <SearchInput
                    onChange={throttle((ev) => filter(ev.target.value), 50)}
                    placeholder="Search for icons..."
                  />
                  <IconsList>
                    {iconsOptions.map((iconOpt) => (
                      <RowItem
                        key={iconOpt.id}
                        option={iconOpt}
                        {...modalProps}
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
            onClick={() => onRequestClose(modalProps)}
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
            disabled={isEqual(baseState, draft)}
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
interface IconListProps<T> extends ModalProps<T> {
  option: IconOption;
  onIconChangeHandler: (opt: IconOption) => void;
}
const RowItem: FC<IconListProps<Category>> = ({
  option,
  onIconChangeHandler,
  draft,
}) => {
  const IconRender = RadixIcons[option.icon];

  return (
    <IconItem
      selected={draft?.icon === option.id}
      tabIndex={0}
      onClick={() => onIconChangeHandler(option)}
    >
      <Flex align="center" data-icon-content>
        <IconRender />
        {option.value}
      </Flex>
      <Flex data-icon-checkmark>
        {draft?.icon === option.id && <RadixIcons.CheckIcon />}
      </Flex>
    </IconItem>
  );
};
const IconListBody = styled.div`
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.background.secondary};
  border: 1px solid ${(p) => p.theme.border.primary};
`;
const IconsListWrap = styled.div`
  flex-direction: column;
  display: flex;
  label {
    margin: 0 0 12px 0;
    padding: 0;
    font-size: 14px;
    font-weight: 600;
    color: ${(p) => p.theme.text.primary};
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
  background: ${(p) => p.theme.background.secondary};
  color: ${(p) => p.theme.text.primary};
  border: none;
  box-shadow: inset 0 -1px 0 0 ${(p) => p.theme.border.primary};
  border-bottom: 1px ${(p) => p.theme.border.primary};
  font-size: 14px;
  ::placeholder {
    color: ${(p) => transparentize(0.7, p.theme.text.primary)};
  }
`;
const IconsList = styled.div`
  position: relative;
  background: ${(p) => p.theme.background.secondary};
  display: flex;
  height: 300px;
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
  font-weight: ${(p) => (p.selected ? 500 : 400)};
  color: ${(p) => (p.selected ? p.theme.accent.primary : p.theme.text.primary)};
  :focus {
    background: ${(p) => p.theme.background.ternary};
  }
  :hover {
    background: ${(p) => p.theme.background.ternary};
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
    color: ${(p) => p.theme.accent.primary};
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
    content: "";
  }
  :before {
    height: 1px;
    width: calc(100% + 24px);
    bottom: 0;
    background: ${(p) => p.theme.border.primary};
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
  box-shadow: inset 0 1px 0 0 ${(p) => p.theme.border.primary};
  padding: 24px;
`;

export default CategoryModal;
