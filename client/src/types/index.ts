
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'inspector';
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  name: string;
  domain?: string;
  created_at: string;
  updated_at: string;
}

export type Member = {
  id: string;
  name: string;
  domain: string;
  user_id: number;
  user_name: string;
  user_email: string;
  user_role: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
};


export interface Team {
  id: string;
  name: string;
  description?: string;
  tenant_id: string;
  members: Member[];
  created_at: string;
  updated_at: string;
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


export type LoginResponse = {
  user: User;
  tenant: Tenant;
  access_token: string;
  refresh_token: string;
};

export type ProfileResponse = {
  user: User;
  tenant: Tenant;
};

