import { UploadIcon } from "@radix-ui/react-icons";
import debounce from "lodash/debounce";
import isEqual from "lodash/isEqual";
import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { object, string } from "yup";
import Button from "../components/button";
import { AstroCheckbox } from "../components/checkbox";
import Flex from "../components/flex";
import { Input, Select } from "../components/input";
import Modal from "../components/modal";
import Padder from "../components/padder";
import { uiStore } from "../stores";
import {
  Category,
  ModalProps,
  ModalTypes,
  SelectOption,
  Service,
} from "../types";
import {
  fetcher,
  loadLogoRender,
  mapEntityToSelectOptions,
  uploadLogo,
  validateForm,
} from "../utils";
import { useQuery, useQueryClient, useMutation } from "react-query";

const schema = object().shape({
  name: string().required("Naming your service is requiered"),
  url: string().required("Linking you service is reqieried"),
});

const ServiceModal: FC<ModalProps<Service>> = ({ ...modalProps }) => {
  const queryClient = useQueryClient();

  const { id, onRequestClose, draft, baseState, label } = modalProps;
  
  const { data: categories } = useQuery("categories", () =>
    fetcher<Category[]>(["categories"])
  );
  const isInEditMode = label === ModalTypes["edit-service"];

  const mutation = useMutation(
    (updatedService: Service) => {
      return fetcher(
        ["services", isInEditMode ? updatedService.id : undefined],
        {
          data: updatedService,
          method: isInEditMode ? "PATCH" : "POST",
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
      },
    }
  );

  const ctxModalIndex = uiStore((s) =>
    s.activeModals.findIndex((m) => m.id === id)
  );
  const setUiStore = uiStore((s) => s.setUiStore);

  const [valitationState, setValitationState] = useState<
    { [key in keyof Service]: string } | Record<string, never>
  >({});

  const logoRenderRef = useRef<any>();
  const logoBlobRef = useRef<any>();
  const categoriesOptions = mapEntityToSelectOptions(categories || []);

  useEffect(() => {
    if (logoRenderRef.current) {
      fetch(logoRenderRef.current.src)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "placeholder.png", {
            type: "image/png",
          });
          logoBlobRef.current = file;
        });
    }
  }, []);

  const onFormChange = (ev: ChangeEvent<HTMLFormElement>) => {
    const target = ev.target;

    if (target.type === "file") {
      const file = target.files[0];

      logoBlobRef.current = file;
      loadLogoRender(file, logoRenderRef);

      setUiStore((d) => {
        d.activeModals[ctxModalIndex].draft = {
          ...d.activeModals[ctxModalIndex].draft,
          logo: file.name,
        };
      });
    } else if (target.type === "checkbox") {
      setUiStore((d) => {
        d.activeModals[ctxModalIndex].draft = {
          ...d.activeModals[ctxModalIndex].draft,
          target: draft?.target === "_blank" ? "" : "_blank",
        };
      });
    } else {
      setUiStore((d) => {
        d.activeModals[ctxModalIndex].draft = {
          ...d.activeModals[ctxModalIndex].draft,
          [target.name]: target.value,
        };
      });
    }
  };

  const categoryChangeHandler = (option: SelectOption) => {
    setUiStore((d) => {
      d.activeModals[ctxModalIndex].draft = {
        ...d.activeModals[ctxModalIndex].draft,
        category_id: option.id,
      };
    });
  };

  const submitFormHandler = async (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    ev.preventDefault();

    if (!draft || !baseState) return;

    try {
      await validateForm(schema, draft);
    } catch (err: any) {
      setValitationState(err);
      return;
    }

    const draftData = draft;
    const baseData = baseState;

    let logoPath: string;
    let isFormChanged = !isEqual(draftData, baseData);
    let closeMessage = `${isInEditMode ? "Updated" : "Created"} '${
      draftData.name
    }' service`;

    logoPath = isFormChanged
      ? await uploadLogo(logoBlobRef.current)
      : draftData.logo;

    try {
      //   await fetcher(["services", isInEditMode ? draftData.id : undefined], {
      //     data: { ...draftData, logo: logoPath },
      //     method: isInEditMode ? "PATCH" : "POST",
      //   });

      mutation.mutate({ ...draftData, logo: logoPath });

      onRequestClose({
        ...modalProps,
        closeNotification: {
          type: "success",
          message: closeMessage,
        },
      });
      // syncServices();
    } catch (err) {
      return err;
    }
  };

  return (
    <Modal collapsable {...modalProps}>
      <form onChange={debounce((ev) => onFormChange(ev), 50)}>
        <FormBody>
          <Group>
            <Row>
              <RowContent>
                <Upload>
                  <div role="imagePreview">
                    <img
                      ref={logoRenderRef}
                      src={"/public/logos/" + draft?.logo}
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
                  aria-errormessage={valitationState["name"]}
                  defaultValue={draft?.name}
                />
              </RowContent>

              <Padder x={12} />

              <RowContent>
                <Input
                  label="Service Url"
                  name="url"
                  placeholder="https://plex.example.com"
                  aria-errormessage={valitationState["url"]}
                  defaultValue={draft?.url}
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
                  defaultValue={draft?.description}
                  aria-errormessage={valitationState["description"]}
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
                    defaultOptionId={draft?.category_id || ""}
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
                    <AstroCheckbox
                      name="target"
                      checked={draft?.target === "_blank"}
                    />
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

const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-shadow: inset 0 1px 0 0 ${(p) => p.theme.border.primary};
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
    content: "";
  }
  :before {
    height: 1px;
    width: calc(100% + 24px);
    bottom: 0;
    background: ${(p) => p.theme.border.primary};
    position: absolute;
  }

  h5 {
    margin: 0 0 18px 0;
    padding: 0;
    font-size: 14px;
    font-weight: 500;
    color: ${(p) => p.theme.text.primary};
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
  justify-content: center;
  align-items: center;
`;

const Upload = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 48px;
  align-items: center;

  div[role="imagePreview"] {
    width: 48px;
    height: 48px;
    min-width: 48px;
    min-height: 48px;
    max-width: 48px;
    max-height: 48px;
    padding: 6px;
    border-radius: 11px;
    align-items: center;
    border: 1px dashed ${(p) => p.theme.border.primary};
    background: ${(p) => p.theme.background.secondary};
    display: flex;
    overflow: hidden;
    img {
      border-radius: 7px;
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
