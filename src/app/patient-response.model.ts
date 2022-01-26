import { Patient } from './patient.model';

export interface PatientResponse {
  count: number;
  rows: Patient[];
}
