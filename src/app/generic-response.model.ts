import { LoginResponse } from './login-response.model';

export interface GenericResponse {
  code: number;
  data: string | LoginResponse | any;
}
