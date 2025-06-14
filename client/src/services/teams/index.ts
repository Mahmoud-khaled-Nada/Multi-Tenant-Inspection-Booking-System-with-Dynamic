/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query";
import { teamsApi } from "../api";

export const useCreateTeamMutation = () => {
  return useMutation({
    mutationKey: ["create-teams"],
    mutationFn: async (user: any) => {
      return await teamsApi.create(user);
    },
  });
};

export const useTeamsQuery = () => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      return await teamsApi.getAll();
    },
  });
};

export const useTeamQuery = (tenant_id) => {
  return useQuery({
    queryKey: ["teams", tenant_id],
    queryFn: () => teamsApi.findByTenant(tenant_id),
    enabled: !!tenant_id,
  });
};

export const useAssignTenantsMutation = () => {
  return useMutation({
    mutationKey: ["assign-tenants"],
    mutationFn: async (data: any) => {
      return await teamsApi.assignTenants(data);
    },
  });
};
