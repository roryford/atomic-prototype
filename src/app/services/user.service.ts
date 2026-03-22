import { Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  users = httpResource<User[]>(() => '/api/users');

  userById(id: number) {
    return httpResource<User>(() => `/api/users/${id}`);
  }
}
