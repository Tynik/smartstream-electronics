import { useQuery } from '@tanstack/react-query';

import { getCategories } from '~/api';

export const useCategories = () => {
  const {
    data: categories,
    isFetching: isCategoriesLoading,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  return {
    categories,
    isCategoriesLoading,
    isCategoriesError,
    refetchCategories,
  };
};
