import { Cross2Icon, SizeIcon } from "@radix-ui/react-icons";
import { invert, transparentize } from "polished";
import { FC, MutableRefObject, useLayoutEffect, useRef } from "react";
import { a, useSpring, useTransition } from "react-spring";
import Button from "../components/button";
import { uiStore } from "../stores";
import styled, { css } from "styled-components";
import Padder from "./padder";
import Tooltip from "./tooltip";
import { ModalProps, ModalStates } from "../types";

const DOCK_ITEM_WITH = 200;

const Dock: FC = () => {
  const { activeModals, setUiStore } = uiStore();
  const wrapRef = useRef() as MutableRefObject<HTMLDivElement>;
  const tuckedModals = activeModals
    .filter((m) => m.state === "tucked")
    .sort(
      (a, b) => (a.lastInteraction as number) - (b.lastInteraction as number)
    );

  const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  };

  const centerDock =
    getWindowDimensions().width / 2 -
    ((DOCK_ITEM_WITH + 18) * tuckedModals.length) / 2;

  const [{ x }, api] = useSpring(() => ({
    x: centerDock,
    config: {
      tension: 420,
      mass: 0.5,
    },
  }));

  useLayoutEffect(() => {
    if (tuckedModals.length) {
      api.start({
        x: centerDock,
      });
    }
  }, [tuckedModals.length]);

  const transitions = useTransition(tuckedModals, {
    from: { y: 66 },
    enter: { y: 0 },
    delay: 240,
    config: {
      tension: 300,
      friction: 20,
      mass: 0.5,
    },
  });

  const dockItemClickHandler = (
    modal: Omit<ModalProps<unknown>, "onRequestClose">,
    actionType: ModalStates
  ) => {
    const ctxModalIndex = activeModals.findIndex((m) => m.id === modal.id);
    setUiStore((d) => {
      d.activeModals[ctxModalIndex].state = actionType;
    });
    if (actionType === "closed") {
      setTimeout(() => {
        setUiStore((d) => {
          d.activeModals.splice(ctxModalIndex, 1);
        });
      }, 680);
    }
  };

  return (
    <StyledDock>
      <a.div
        ref={wrapRef}
        style={{
          x,
          display: "flex",
          position: "absolute",
          top: "0%",
        }}
      >
        {transitions((style, item) => (
          <DockItem style={style} key={item.id}>
            <div style={{ display: "flex" }}>
              <Tooltip tabIndex={-1} label="Close modal">
                <Button
                  tabIndex={-1}
                  hierarchy="ternary"
                  onClick={() => dockItemClickHandler(item, "closed")}
                >
                  <Cross2Icon />
                </Button>
              </Tooltip>
              <Tooltip tabIndex={-1} label="Hide modal">
                <Button
                  tabIndex={-1}
                  hierarchy="ternary"
                  onClick={() => dockItemClickHandler(item, "expnanded")}
                >
                  <SizeIcon />
                </Button>
              </Tooltip>
            </div>
            <Padder x={6} />
            <p>{item.title}</p>
          </DockItem>
        ))}
      </a.div>
    </StyledDock>
  );
};

const lightStyles = css`
  background: ${(p) => p.theme.background.primary};
  box-shadow: 0 40px 64px 0 rgba(65, 78, 101, 0.1),
    0 24px 32px 0 rgba(65, 78, 101, 0.1), 0 16px 16px 0 rgba(65, 78, 101, 0.1),
    0 8px 8px 0 rgba(65, 78, 101, 0.1), 0 4px 4px 0 rgba(65, 78, 101, 0.1),
    0 2px 2px 0 rgba(65, 78, 101, 0.1);
`;

const darkStyles = css`
  background: ${(p) => p.theme.background.primary};
  box-shadow: 0 0 0 1px ${(p) => invert(p.theme.text.primary)},
    0 0 0 1px ${(p) => transparentize(0, p.theme.border.primary)} inset,
    0 40px 64px 0 rgba(0, 0, 0, 0.2), 0 24px 32px 0 rgba(0, 0, 0, 0.2),
    0 16px 16px 0 rgba(0, 0, 0, 0.2), 0 8px 8px 0 rgba(0, 0, 0, 0.2),
    0 4px 4px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.2);
`;

const DockItem = styled(a.div)`
  ${(p) => (p.theme.id === "dark" ? darkStyles : lightStyles)};
  width: ${DOCK_ITEM_WITH}px;
  height: 42px;
  align-items: center;
  justify-content: flex-start;
  padding: 0 18px 0 6px;
  border-radius: 4px;
  display: flex;

  button {
    padding: 0;
    width: 30px;
    min-width: 30px;
    min-height: 30px;
    height: 30px;
  }
  p {
    margin: 0;
    padding: 0;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
  }
`;
const StyledDock = styled.div`
  position: absolute;
  width: 100vw;
  bottom: 0;
  left: 0;
  height: 66px;
  display: flex;
  align-items: center;
  z-index: 991;

  ${DockItem}:not(:last-child) {
    margin: 0 18px 0 0;
  }
`;
export default Dock;
