import axios from 'axios';
import { RefObject } from 'react';
import { Category } from 'server/entities';
import { SelectOption } from 'typings';
import { ValidationError, AnySchema } from 'yup';

const mapEntityToSelectOptions = (
  entitiyList: Category[] | undefined,
): SelectOption[] => {
  if (!entitiyList || !entitiyList.length) {
    return [];
  }
  return entitiyList.map(
    category =>
      ({
        id: category.id,
        label: category.name,
        value: category.name,
      } as SelectOption),
  );
};

const uploadLogo = async (file: File): Promise<string> => {
  const data = new FormData();
  data.append('logo', file as File);
  return axios.post(`/api/upload`, data, {}).then(res => res.data.path);
};

const loadLogoRender = (file: File, ref: RefObject<HTMLImageElement>): void => {
  const reader = new FileReader();
  reader.onload = async r => {
    if (r && r.target) {
      if (ref && ref.current) {
        ref.current.src = r.target.result as string;
      }
    }
  };
  reader.readAsDataURL(file);
};

const validateForm = async <T>(
  schema: AnySchema,
  values: T,
): Promise<void | null> => {
  try {
    await schema.validate(values, { abortEarly: false });
    return null;
  } catch (error) {
    if (error.inner.length) {
      throw error.inner.reduce(
        (acc: { [x: string]: string }, curr: { [x: string]: string }) => {
          if (curr.path) {
            acc[curr.path] = curr.message;
          }
          return acc;
        },
        {},
      );
    }
  }
};

export { mapEntityToSelectOptions, loadLogoRender, uploadLogo, validateForm };
