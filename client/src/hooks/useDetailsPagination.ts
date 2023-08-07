import { useState, useMemo } from 'react';

export type InfoTab = 'personal' | 'basic' | 'other' | 'preferences';

export const useDetailsPagination = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const currentInfoTab: InfoTab = useMemo(() => {
    switch (currentTabIndex) {
      case 0:
        return 'personal';
      case 1:
        return 'basic';
      case 2:
        return 'other';
      case 3:
        return 'preferences';
      default:
        return 'personal';
    }
  }, [currentTabIndex]);

  const nextTab = () => {
    setCurrentTabIndex((prev) => {
      if (prev === 3) return prev;
      return prev + 1;
    });
  };

  const prevTab = () => {
    setCurrentTabIndex((prev) => {
      if (prev === 0) return prev;
      return prev - 1;
    });
  };

  return { currentInfoTab, nextTab, prevTab };
};
