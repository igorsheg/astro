import { useState } from 'react';
import { SAMPLE_CONFIG } from 'server/config/seed-data';
import { Category, Service } from 'server/entities';
import { ALL_SERVICES_TAB, BASE_STATE } from 'src/consts/entityBaseState';

const filterServicesItems = (
  data: Service[] | [],
  term: string,
): Service[] | [] => {
  if (!data) {
    return [];
  }

  return data.filter(({ name, tags }) => {
    const searchData = [name, tags].join(' ').toLowerCase();
    const searchQuery = term.trim().toLowerCase();

    if (searchQuery && searchData.indexOf(searchQuery) === -1) {
      return false;
    }
    return true;
  });
};

const useFilteredList = ({
  list,
}: {
  list: string[];
}): [string[], (term: string) => void] => {
  const [filteredList, setFilteredList] = useState(list);
  const filter = (term: string) =>
    setFilteredList(() => {
      return list.filter(key => {
        const searchData = [key].join(' ').toLowerCase();
        const searchQuery = term.split(' ').join('').trim().toLowerCase();

        if (searchQuery && searchData.indexOf(searchQuery) === -1) {
          return false;
        }
        return true;
      });
    });
  return [filteredList, filter];
};

const filterList = (data: string[], term: string): string[] => {
  return data.filter(key => {
    const searchData = [key].join(' ').toLowerCase();
    const searchQuery = term.split(' ').join('').trim().toLowerCase();

    if (searchQuery && searchData.indexOf(searchQuery) === -1) {
      return false;
    }
    return true;
  });
};

interface ServiceUtilsReturnProps {
  getAllTabServices: ({ withRest }: { withRest: boolean }) => Category[];
  getActiveServicesTab: (activeTab: Category['id']) => Category;
}

const servicesUtils = (caregories: Category[]): ServiceUtilsReturnProps => {
  const allServicesTab: Category = {
    ...ALL_SERVICES_TAB,
    services: caregories
      .map(category => category.services)
      .reduce((prev, current) => {
        if (prev && current) {
          return [...prev, ...current];
        }
      }),
  };

  const getAllTabServices = ({ withRest }: { withRest: boolean }) => {
    return withRest ? [allServicesTab, ...caregories] : [allServicesTab];
  };

  const getActiveServicesTab = (activeTab: Category['id']) => {
    if (activeTab === ALL_SERVICES_TAB.id) {
      return allServicesTab;
    } else {
      const activeServiceIndex = caregories.findIndex(
        svc => svc.id === activeTab,
      );
      return caregories[activeServiceIndex];
    }
  };

  return { getAllTabServices, getActiveServicesTab };
};

export { filterServicesItems, servicesUtils, filterList, useFilteredList };
