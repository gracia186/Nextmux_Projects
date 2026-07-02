import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // 1 min avant de considérer les données "périmées"
      retry: 1, // évite de spammer le backend en cas d'erreur 4xx/5xx
      refetchOnWindowFocus: false, // évite des refetch intempestifs en dev
      refetchOnMount: true,
    },
  },
});