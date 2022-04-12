export interface Patient {
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  email2?: string;
  createdAt?: string;
  updatedAt?: string;
  birthdate?: string;
  documentType: string;
  medic?: number;
}
