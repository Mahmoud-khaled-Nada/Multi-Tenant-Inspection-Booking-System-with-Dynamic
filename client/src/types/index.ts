
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'inspector';
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  tenantId: string;
  members: User[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamAvailability {
  id: string;
  teamId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isActive: boolean;
}

export interface Booking {
  id: string;
  teamId: string;
  userId: string;
  tenantId: string;
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  date: string; // YYYY-MM-DD
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  date: string;
  available: boolean;
  teamId: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
