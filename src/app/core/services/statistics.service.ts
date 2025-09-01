import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Statistics {
  averageScore: number;
  medianScore: number;
  minScore: number;
  maxScore: number;
  standardDeviation: number;
  totalGrades: number;
  totalStudents: number;
  totalSubjects: number;
  passingGrades: number;
  failingGrades: number;
  passingRate: number;
  gradeDistribution: {
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
  };
  subjectAverages?: { [key: string]: number };
  topStudentAverages?: { [key: string]: number };
  statisticsType: 'student' | 'subject' | 'class' | 'semester' | 'overall';
  contextId: number | null;
  contextName: string;
  semesterId: number | null;
  semesterName: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = `${environment.apiUrl}/statistics`;

  constructor(private http: HttpClient) {}

  getStudentStatistics(id: number, semesterId?: number): Observable<Statistics> {
    let url = `${this.apiUrl}/student/${id}`;
    const params: Record<string, string | number> = {};
    if (semesterId) params['semesterId'] = semesterId;
    return this.http.get<Statistics>(url, { params });
  }

  getSubjectStatistics(id: number, semesterId?: number): Observable<Statistics> {
    let url = `${this.apiUrl}/subject/${id}`;
    const params: Record<string, string | number> = {};
    if (semesterId) params['semesterId'] = semesterId;
    return this.http.get<Statistics>(url, { params });
  }

  getClassStatistics(id: number): Observable<Statistics> {
    return this.http.get<Statistics>(`${this.apiUrl}/class/${id}`);
  }

  getSemesterStatistics(id: number): Observable<Statistics> {
    return this.http.get<Statistics>(`${this.apiUrl}/semester/${id}`);
  }

  getOverallStatistics(): Observable<Statistics> {
    return this.http.get<Statistics>(`${this.apiUrl}/overall`);
  }
}
