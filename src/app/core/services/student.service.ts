import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Grade } from './grade.service';
import { Class } from './class.service';

export interface StudentSummary {
  studentId: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  enrolledClasses: EnrolledClass[];
  gradesBySubject: Record<string, Grade[]>;
  overallAverage: number;
}

export interface EnrolledClass {
  classSectionId: number;
  classSectionName: string;
  subjectId: number;
  subjectName: string;
  teacherId: number;
  teacherFullName: string;
  semesterId: number;
  semesterName: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/student`;

  constructor(private http: HttpClient) {}

  /**
   * Get comprehensive student summary including profile, classes, and grades
   * @returns Observable with student summary data
   */
  getStudentSummary(): Observable<StudentSummary> {
    return this.http.get<StudentSummary>(`${this.apiUrl}/info/summary`);
  }
}
