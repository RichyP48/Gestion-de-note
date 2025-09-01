import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Subject {
  id: number;
  name: string;
  coefficient: number;
}

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private apiUrl = `${environment.apiUrl}/admin/subjects`;

  constructor(private http: HttpClient) {}

  getAllSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.apiUrl);
  }

  getSubjectById(id: number): Observable<Subject> {
    return this.http.get<Subject>(`${this.apiUrl}/${id}`);
  }

  createSubject(subject: Omit<Subject, 'id'>): Observable<Subject> {
    return this.http.post<Subject>(this.apiUrl, subject);
  }

  updateSubject(id: number, subject: Omit<Subject, 'id'>): Observable<Subject> {
    return this.http.put<Subject>(`${this.apiUrl}/${id}`, subject);
  }

  deleteSubject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
