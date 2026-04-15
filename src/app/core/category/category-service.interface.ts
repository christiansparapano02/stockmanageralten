import { Observable } from 'rxjs';
import { Category } from './category.interface';

export interface ICategoryService {
  getCategories(): Observable<Category[]>;
}
