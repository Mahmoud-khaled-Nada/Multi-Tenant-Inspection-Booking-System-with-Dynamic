/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from '@tanstack/react-query';
import { usersApi } from '../api';

export const useCreateUserMutation = () => {
  return useMutation({
    mutationKey: ['create-user'],
    mutationFn: async (user: any) => {
      return await usersApi.create(user);
    },
  });
};


export const useUsersAnalysisQuery = () => {
  return useQuery({
    queryKey: ['users-analysis'],
    queryFn: async () => {
      return await usersApi.usersAnalysis();
    },
  })
};