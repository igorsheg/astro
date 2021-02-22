import { SAMPLE_CONFIG } from 'server/config/seed-data';
import { Category, Service } from 'server/entities';

const filterServicesItems = (
  data: Service[] | null,
  term: string,
): Service[] | null => {
  if (!data) {
    return null;
  }

  return data.filter(({ name }) => {
    const searchData = [name].join(' ').toLowerCase();
    const searchQuery = term.trim().toLowerCase();

    if (searchQuery && searchData.indexOf(searchQuery) === -1) {
      return false;
    }
    return true;
  });
};

interface ServiceUtilsReturnProps {
  getAllTabServices: ({ withRest }: { withRest: boolean }) => Category[];
  getActiveServicesTab: (activeTab: Category) => Category;
}

const servicesUtils = (caregories: Category[]): ServiceUtilsReturnProps => {
  const allServicesTab: Category = {
    id: 'all-services',
    name: 'All Services',
    description: 'All services in one list',
    config: SAMPLE_CONFIG,
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

  const getActiveServicesTab = (activeTab: Category): Category => {
    if (activeTab.id === 'all-services') {
      return allServicesTab;
    } else {
      const activeServiceIndex = caregories.findIndex(
        svc => svc.name === activeTab.name,
      );
      return caregories[activeServiceIndex];
    }
  };

  return { getAllTabServices, getActiveServicesTab };
};

export { filterServicesItems, servicesUtils };
