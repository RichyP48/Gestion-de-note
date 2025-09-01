import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Class {
  id: number;
  name: string;
  subjectId: number;
  subjectName: string;
  semesterId: number;
  semesterName: string;
  teacherId: number;
  teacherUsername: string;
  teacherFullName: string;
  enrolledStudents: User[];
  enrollmentCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiUrl = `${environment.apiUrl}/teacher/classes`;

  constructor(private http: HttpClient) {}

  getMyClasses(subjectId?: number, semesterId?: number): Observable<Class[]> {
    let url = this.apiUrl;
    const params: Record<string, string | number> = {};
    if (subjectId) params['subjectId'] = subjectId;
    if (semesterId) params['semesterId'] = semesterId;
    return this.http.get<Class[]>(url, { params });
  }

  getClassById(id: number): Observable<Class> {
    return this.http.get<Class>(`${this.apiUrl}/${id}`);
  }

  getStudentsInClass(id: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${id}/students`);
  }
}
