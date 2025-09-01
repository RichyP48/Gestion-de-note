import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Grade {
  id: number;
  score: number;
  comments: string;
  dateAssigned: string;
  studentId: number;
  studentUsername: string;
  studentFullName: string;
  subjectId: number;
  subjectName: string;
}

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Teacher endpoints
  getGrades(studentId?: number, subjectId?: number, semesterId?: number): Observable<Grade[]> {
    let url = `${this.apiUrl}/teacher/grades`;
    const params: Record<string, string | number> = {};
    if (studentId) params['studentId'] = studentId;
    if (subjectId) params['subjectId'] = subjectId;
    if (semesterId) params['semesterId'] = semesterId;
    return this.http.get<Grade[]>(url, { params });
  }

  getGradeById(id: number): Observable<Grade> {
    return this.http.get<Grade>(`${this.apiUrl}/teacher/grades/${id}`);
  }

  createGrade(grade: Omit<Grade, 'id' | 'dateAssigned' | 'studentUsername' | 'studentFullName' | 'subjectName'>): Observable<Grade> {
    return this.http.post<Grade>(`${this.apiUrl}/teacher/grades`, grade);
  }

  updateGrade(id: number, grade: Pick<Grade, 'score' | 'comments'>): Observable<Grade> {
    return this.http.put<Grade>(`${this.apiUrl}/teacher/grades/${id}`, grade);
  }

  deleteGrade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/teacher/grades/${id}`);
  }

  // Student endpoints
  getMyGrades(subjectId?: number, semesterId?: number): Observable<Grade[]> {
    let url = `${this.apiUrl}/student/grades/my`;
    const params: Record<string, string | number> = {};
    if (subjectId) params['subjectId'] = subjectId;
    if (semesterId) params['semesterId'] = semesterId;
    return this.http.get<Grade[]>(url, { params });
  }

  getMyGradeById(id: number): Observable<Grade> {
    return this.http.get<Grade>(`${this.apiUrl}/student/grades/${id}`);
  }

  downloadMyGradeReport(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/student/grades/my/download`, {
      responseType: 'blob'
    });
  }
}
