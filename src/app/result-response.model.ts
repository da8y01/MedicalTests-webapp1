import { Result } from './result.model';

export interface ResultResponse {
  count: number;
  rows: Result[];
}
