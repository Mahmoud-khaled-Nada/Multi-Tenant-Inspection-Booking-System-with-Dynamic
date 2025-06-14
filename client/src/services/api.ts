/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  User,
  Tenant,
  Team,
  TeamAvailability,
  Booking,
  TimeSlot,
  LoginResponse,
  ProfileResponse,
} from "@/types";
import API from "./axios-client";

// Mock API base URL - in real app this would be your backend
const API_BASE = "https://api.inspectionbook.com";

// Mock authentication state
let currentUser: User | null = null;
let authToken: string | null = null;

// Mock data
const mockTenants: Tenant[] = [
  {
    id: "1",
    name: "Acme Inspections",
    domain: "acme",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@acme.com",
    name: "John Admin",
    role: "admin",
    tenant_id: "1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "manager@acme.com",
    name: "Jane Manager",
    role: "manager",
    tenant_id: "1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

const mockTeams: Team[] = [
  {
    id: "1",
    name: "Building Inspectors",
    description: "Specialized in residential and commercial building inspections",
    tenant_id: "1",
    members: mockUsers,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

const mockAvailability: TeamAvailability[] = [
  { id: "1", teamId: "1", dayOfWeek: 1, startTime: "09:00", endTime: "17:00", isActive: true },
  { id: "2", teamId: "1", dayOfWeek: 2, startTime: "09:00", endTime: "17:00", isActive: true },
  { id: "3", teamId: "1", dayOfWeek: 3, startTime: "09:00", endTime: "17:00", isActive: true },
  { id: "4", teamId: "1", dayOfWeek: 4, startTime: "09:00", endTime: "17:00", isActive: true },
  { id: "5", teamId: "1", dayOfWeek: 5, startTime: "09:00", endTime: "17:00", isActive: true },
];

let mockBookings: Booking[] = [];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authApi = {
  register: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await API.post("/auth/register", { email, password });
    return response.data;
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data: response } = await API.post("/auth/login", { email, password });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await API.post("/auth/logout");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },

  getCurrentUser: async (): Promise<ProfileResponse | null> => {
    const response = await API.get("/auth/profile");
    return response.data;
  },
};

export const tenantsApi = {
  getAll: async (): Promise<Tenant[]> => {
    await delay(500);
    return mockTenants;
  },

  getById: async (id: string): Promise<Tenant> => {
    await delay(300);
    const tenant = mockTenants.find((t) => t.id === id);
    if (!tenant) throw new Error("Tenant not found");
    return tenant;
  },
};

export const availabilityApi = {
  getByTeam: async (teamId: string): Promise<TeamAvailability[]> => {
    await delay(400);
    return mockAvailability.filter((a) => a.teamId === teamId);
  },

  update: async (availability: TeamAvailability[]): Promise<TeamAvailability[]> => {
    await delay(600);
    // Update mock data
    return availability;
  },
};

export const slotsApi = {
  generateSlots: async (teamId: string, startDate: string, endDate: string): Promise<TimeSlot[]> => {
    await delay(700);

    const team = mockTeams.find((t) => t.id === teamId);
    if (!team) throw new Error("Team not found");

    const availability = mockAvailability.filter((a) => a.teamId === teamId && a.isActive);
    const bookings = mockBookings.filter((b) => b.teamId === teamId);

    const slots: TimeSlot[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      const dayAvailability = availability.find((a) => a.dayOfWeek === dayOfWeek);

      if (dayAvailability) {
        const [startHour, startMinute] = dayAvailability.startTime.split(":").map(Number);
        const [endHour, endMinute] = dayAvailability.endTime.split(":").map(Number);

        for (let hour = startHour; hour < endHour; hour++) {
          const slotStart = new Date(date);
          slotStart.setHours(hour, startMinute, 0, 0);

          const slotEnd = new Date(slotStart);
          slotEnd.setHours(hour + 1, startMinute, 0, 0);

          const dateStr = date.toISOString().split("T")[0];

          // Check if slot conflicts with existing bookings
          const isBooked = bookings.some((booking) => {
            const bookingStart = new Date(booking.startTime);
            const bookingEnd = new Date(booking.endTime);
            return (
              booking.date === dateStr &&
              ((slotStart >= bookingStart && slotStart < bookingEnd) ||
                (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
                (slotStart <= bookingStart && slotEnd >= bookingEnd))
            );
          });

          slots.push({
            startTime: slotStart.toISOString(),
            endTime: slotEnd.toISOString(),
            date: dateStr,
            available: !isBooked,
            teamId,
          });
        }
      }
    }

    return slots;
  },
};

export const usersApi = {
  create: async (user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<LoginResponse> => {
    const response = await API.post("/auth/register", user);
    return response.data;
  },

  usersAnalysis: async () => {
    const response = await API.get("/users-analysis");
    return response.data;
  },
};

export const teamsApi = {
  getAll: async (): Promise<Team[]> => {
    const res = await API.get("/teams");
    return res.data.data;
  },

  getById: async (id: string): Promise<Team> => {
    const res = await API.get(`/team/${id}`);
    return res.data;
  },

  findByTenant: async (tenantId: string): Promise<Team> => {
    const res = await API.get(`/team/${tenantId}/tenant`);
    return res.data;
  },

  create: async (team: Omit<Team, "id" | "created_at" | "updated_at">): Promise<Team> => {
    const res = await API.post("/teams", team);
    return res.data;
  },

  assignTenants: async (data): Promise<Team> => {
    const res = await API.post(`teams/${data.teamId}/tenants`, {
      tenant_id: data.tenantId,
    });
    return res.data;
  },
};

export const bookingsApi = {
  getAll: async (tenantId: string): Promise<Booking[]> => {
    await delay(500);
    return mockBookings.filter((b) => b.tenantId === tenantId);
  },

  create: async (booking: Omit<Booking, "id" | "created_at" | "updated_at">): Promise<Booking> => {
    const res = await API.post("/bookings", booking);
    return res.data;
  },
};
