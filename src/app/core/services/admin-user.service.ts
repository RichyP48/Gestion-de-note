import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserProfile } from './user.service';

export interface CreateUserRequest {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private apiUrl = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(role?: string): Observable<UserProfile[]> {
    const params: Record<string, string> = {};
    if (role) {
      params['role'] = role;
    }
    return this.http.get<UserProfile[]>(this.apiUrl, { params });
  }

  getUserByUsername(username: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/username/${username}`);
  }

  createUser(user: CreateUserRequest): Observable<UserProfile> {
    return this.http.post<UserProfile>(this.apiUrl, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: number, user: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/${id}`, user);
  }
}
