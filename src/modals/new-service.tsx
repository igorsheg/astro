import set from 'lodash/set';
import React, { FC } from 'react';
import {
  unstable_Form as Form,
  unstable_FormInput as FormInput,
  unstable_FormLabel as FormLabel,
  unstable_FormMessage as FormMessage,
  unstable_FormSubmitButton as FormSubmitButton,
  unstable_useFormState as useFormState,
} from 'reakit/Form';
import Modal from 'src/components/modal';
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
    values: { name: '' },
    validateOnChange: false,
    onValidate: validateWithYup(schema),
  });

  return (
    <div>
      <Modal onRequestClose={onRequestClose} isOpen={isOpen} title={title}>
        <Form {...form}>
          <FormRow>
            <FormLabel {...form} name="name">
              <span>Name</span>
              <FormMessage {...form} name="name" />
            </FormLabel>
            <FormInput
              tabIndex={0}
              {...form}
              name="name"
              placeholder="John Doe"
            />
          </FormRow>
          <FormSubmitButton {...form}>Submit</FormSubmitButton>
        </Form>
      </Modal>
    </div>
  );
};

const FormRow = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 36px;
  max-height: 36px;

  label {
    flex: 0.6;
    display: flex;
    flex-direction: column;
    span {
      line-height: 18px;
      font-size: 14px;
    }
  }

  input {
    flex: 0.4;
    height: 36px;
    border: 1px solid ${p => p.theme.border.primary};
    color: ${p => p.theme.text.primary};
    background: transparent;
    font-size: 14px;
    padding: 0 12px;
    border-radius: 6px;
    :focus {
      border: 1px solid ${p => p.theme.text.secondary};
    }
  }
  div[role='alert'] {
    color: red;
    font-size: 12px;
    line-height: 12px;
    font-weight: 400;
  }
`;

export default NewServiceModal;
