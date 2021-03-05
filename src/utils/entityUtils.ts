import axios from 'axios';
import { Category } from 'server/entities';
import { SelectOption } from 'shared/types/internal';

const mapEntityToSelectOptions = (entitiyList: Category[] | undefined) => {
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

const loadLogoRender = (file: File, ref: any) => {
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

export { mapEntityToSelectOptions, loadLogoRender, uploadLogo };
