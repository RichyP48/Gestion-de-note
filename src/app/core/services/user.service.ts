import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from './class.service';

export interface UserProfile extends User {
  role: string;
  password?: string; // Optional password field for updates
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getCurrentUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile`);
  }

  getUserProfile(id: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${id}`);
  }

  updateUserProfile(id: number, profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/${id}`, profile);
  }

  changePassword(id: number, passwords: PasswordChange): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/change-password`, passwords);
  }
}
