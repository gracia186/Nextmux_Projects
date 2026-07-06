/** @format */

// src/features/events/hooks/useEvenementMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createEvenement,
  updateEvenement,
  deleteEvenement,
} from "@/features/Evènements/api/Evenements.api";

export function useCreateEvenement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEvenement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evenements"] });
    },
  });
}

export function useUpdateEvenement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEvenement,
    onSuccess: (evenementMisAJour) => {
      queryClient.invalidateQueries({ queryKey: ["evenements"] });
      queryClient.invalidateQueries({
        queryKey: ["evenements", evenementMisAJour.id],
      });
    },
  });
}

export function useDeleteEvenement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEvenement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evenements"] });
    },
  });
}
