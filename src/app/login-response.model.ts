export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  roles: string[];
  accessToken: string;
}
