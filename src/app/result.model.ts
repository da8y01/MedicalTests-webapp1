export interface Result {
  id: number;
  name: string;
  link: string;
  patient: number;
  reading?: Result;
  createdAt: string;
  updatedAt: string;
}
