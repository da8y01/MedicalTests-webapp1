export interface Patient {
  id: number;
  document: string;
  firstName: string;
  lastName: string;
  address?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}
