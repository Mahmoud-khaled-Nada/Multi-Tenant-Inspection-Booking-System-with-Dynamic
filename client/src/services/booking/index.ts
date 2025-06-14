/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query";
import { bookingsApi } from "../api";

export const useCreateBookingMutation = () => {
  return useMutation({
    mutationKey: ["create-bookings"],
    mutationFn: async (data: any) => {
      return await bookingsApi.create(data);
    },
  });
};
