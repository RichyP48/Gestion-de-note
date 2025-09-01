import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {
  private apiUrl = `${environment.apiUrl}/excel`;

  constructor(private http: HttpClient) {}

  exportStudentGrades(studentId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/student/${studentId}`, {
      responseType: 'blob'
    });
  }

  exportClassGrades(classId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/class/${classId}`, {
      responseType: 'blob'
    });
  }

  exportSubjectGrades(subjectId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/subject/${subjectId}`, {
      responseType: 'blob'
    });
  }

  exportSemesterGrades(semesterId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/semester/${semesterId}`, {
      responseType: 'blob'
    });
  }

  exportAllGrades(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/all`, {
      responseType: 'blob'
    });
  }

  // Helper method to handle Excel file downloads
  downloadExcel(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
