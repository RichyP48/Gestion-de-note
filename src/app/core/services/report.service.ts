import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/admin/reports`;

  constructor(private http: HttpClient) {}

  generateStudentReport(studentId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/student/${studentId}`, {
      responseType: 'blob'
    });
  }

  generateBulkStudentReports(studentIds: number[]): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/bulk`, { studentIds }, {
      responseType: 'blob'
    });
  }

  generateClassReports(classId: number): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/class/${classId}`, null, {
      responseType: 'blob'
    });
  }

  generateSemesterReports(semesterId: number): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/semester/${semesterId}`, null, {
      responseType: 'blob'
    });
  }

  // Helper method to handle file downloads
  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
