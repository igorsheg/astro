import * as RadixIcons from "@radix-ui/react-icons";
import React, { FC } from "react";
import { MenuButton, MenuSeparator, useMenuState } from "reakit/Menu";
import { Service, ModalTypes } from "../types";
import Button from "../components/button";
import { ContextMenu, MenuItem } from "../components/menu";
import Tooltip from "../components/tooltip";
import { uiStore } from "../stores";
import generateUuid from "../utils/generateUuid";
import styled from "styled-components";

const ServiceMenu: FC<{ item: Service }> = ({ item }) => {
  const { setUiStore, activeModals } = uiStore();
  const menu = useMenuState({
    animated: 120,
    modal: false,
  });

  const createEditModal = (modalType: ModalTypes) => {
    setUiStore((d) => {
      d.activeModals.push({
        id: item.id as string,
        label: modalType,
        state: "expnanded",
        title: `Edit Service`,
        baseState: item,
        draft: item,
        entityType: "services",
      });
    });
  };
  const createServiceMonitorModal = (modalType: ModalTypes) => {
    setUiStore((d) => {
      d.activeModals.push({
        id: item.id as string,
        label: modalType,
        state: "expnanded",
        title: `Service Uptime Stats`,
        baseState: item,
        draft: item,
        entityType: "services",
      });
    });
  };

  const createDeleteModal = (modalType: ModalTypes) => {
    const existingModalTypeIndex = activeModals.findIndex(
      (d) => d.label === modalType
    );
    const hasExistingModalType = existingModalTypeIndex !== -1;

    if (hasExistingModalType) {
      setUiStore((d) => {
        d.activeModals[existingModalTypeIndex].state = "expnanded";
      });
      return;
    } else {
      setUiStore((d) => {
        d.activeModals.push({
          id: generateUuid(),
          label: modalType,
          state: "expnanded",
          title: `Delete Service`,
          body: `Are you sure you want to delete '${item.name}' service?`,
          entityType: "services",
          baseState: {
            ...item,
            categoryId: item.category_id,
          },
        });
      });
    }
  };

  const hasPingLog = !!item.pings && !!item.pings.length;

  return (
    <>
      <MenuButton {...menu}>
        {(props) => (
          <Tooltip placement="bottom" tabIndex={0} label="Service actions">
            <Button
              style={{ minWidth: "36px" }}
              hierarchy="secondary"
              tabIndex={0}
              aria-label="View Service Menu"
              {...props}
            >
              <RadixIcons.DotsHorizontalIcon />
            </Button>
          </Tooltip>
        )}
      </MenuButton>
      <ContextMenu aria-label="Manage Astro Menu" {...menu}>
        <MenuItem
          {...menu}
          onClick={() => createEditModal(ModalTypes["edit-service"])}
        >
          Edit
        </MenuItem>

        {hasPingLog && (
          <MenuItem
            {...menu}
            onClick={() =>
              createServiceMonitorModal(ModalTypes["service-monitor"])
            }
          >
            Uptime Status
          </MenuItem>
        )}
        <Seperator />
        <MenuItem
          onClick={() => createDeleteModal(ModalTypes["new-delete"])}
          {...menu}
        >
          Remove
        </MenuItem>
      </ContextMenu>
    </>
  );
};

const Seperator = styled(MenuSeparator)`
  height: 12px;
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  position: relative;
  width: 100%;
  display: flex;

  :after {
    content: "";
    height: 1px;
    position: absolute;
    top: 6px;
    left: 12px;
    width: calc(100% - 24px);
    background: ${(p) => p.theme.border.primary};
  }
`;

export default ServiceMenu;
