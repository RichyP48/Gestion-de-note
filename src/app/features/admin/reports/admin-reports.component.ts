import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReportService } from '../../../core/services/report.service';
import { AdminUserService } from '../../../core/services/admin-user.service';
import { UserProfile } from '../../../core/services/user.service';
import { Subject } from '../../../core/services/subject.service';
import { environment } from '../../../../environments/environment';

interface Class {
  id: number;
  name: string;
  subjectName: string;
  teacherFullName: string;
  enrollmentCount: number;
}

interface Semester {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-white text-primary-500">
      <!-- Navbar -->
  

      <!-- Main Content -->
      <main class="py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Header with animation -->
          <header class="mb-10">
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                 <h1 class="text-4xl font-black mb-2 animate-fadeIn">
              <span class="bg-clip-text text-primary-900 ">Report Generation</span>
            </h1>
            <p class=" animate-slideRight">Generate detailed PDF reports for students, classes, and semesters.</p>
              </div>
           
          </header>

          <!-- Report Generation Options -->
          <div class="  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div *ngFor="let option of reportOptions; let i = index" 
                class="backdrop-blur-md shadow-md bg-white  border border-gray-200  rounded-xl p-6 transform transition-all duration-300 hover:scale-102 hover:bg-white/10 cursor-pointer animate-fadeIn"
                [style.animation-delay]="(i * 0.1) + 's'"
                (click)="selectReportType(option.type)">
              <div class=" flex items-center justify-between mb-4">
                <div [ngClass]="[
                  'p-3 rounded-xl',
                  i === 0 ? 'bg-blue-600/30' : '',
                  i === 1 ? 'bg-purple-600/30' : '',
                  i === 2 ? 'bg-green-600/30' : '',
                  i === 3 ? 'bg-amber-600/30' : ''
                ]">
                  <ng-container [ngSwitch]="option.type">
  
                    <svg *ngSwitchCase="'student'" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-school"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M22 9l-10 -4l-10 4l10 4l10 -4v6" /><path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4" /></svg>
                    <svg *ngSwitchCase="'bulk'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 11c1.7 0 3-1.3 3-3S17.7 5 16 5s-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.3 0-7 1.2-7 3.5V20h14v-3.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.7 0-1 .1 1.2.9 2 2.2 2 3.4V20h6v-3.5c0-2.3-4.7-3.5-7-3.5z"/>
                    </svg>
                    <svg *ngSwitchCase="'class'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 6h16v2H4zm0 4h10v2H4zm0 4h10v2H4zm12 0h4v6h-4z"/>
                    </svg>
                    <svg *ngSwitchCase="'semester'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
                    </svg>
                  </ng-container>

                </div>
                <div *ngIf="selectedReportType === option.type" class="h-3 w-3 rounded-full bg-green-400 animate-pulse"></div>
              </div>
              <h3 class="text-lg font-semibold mb-1">{{ option.title }}</h3>
              <p class="text-primary-700 text-sm">{{ option.description }}</p>
            </div>
          </div>

          <!-- Report Configuration -->
          <div class="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 mb-10 animate-fadeIn" style="animation-delay: 0.4s">
            <h2 class="text-xl  font-bold mb-6">{{ getReportTypeTitle() }}</h2>

            <!-- Student Report Form -->
            <form *ngIf="selectedReportType === 'student'" [formGroup]="studentReportForm" (ngSubmit)="generateStudentReport()" class="flex  space-y-6">
              <div class="w-1/2  md:grid-cols-2 gap-6">
                <div class=" w-full">
                  <label class="block text-sm font-medium text-gray-300 mb-1">Select Student</label>
                  <select formControlName="studentId" class="w-full bg-primary-600 border h-12 rounded-md px-3 py-2 text-white">
                    <option value="">Select a student</option>
                    <option *ngFor="let student of students" [value]="student.id">{{ student.firstName }} {{ student.lastName }}</option>
                  </select>
                  <div *ngIf="studentReportForm.get('studentId')?.invalid && studentReportForm.get('studentId')?.touched" class="text-red-400 text-xs mt-1">
                    Please select a student
                  </div>
                </div>
              </div>
              <div class="w-1/2 flex justify-end items-center">
                <button 
                  type="submit"
                  [disabled]="studentReportForm.invalid || isProcessing"
                  [ngClass]="{'opacity-50 cursor-not-allowed': studentReportForm.invalid || isProcessing}"
                  class="text-white h-12 px-6 py-2 rounded-md bg-primary-600 opacity-75 hover:bg-primary-500 transition-colors flex items-center gap-2">
                  <svg *ngIf="isProcessing" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generate Report</span>
                </button>
              </div>
            </form>

            <!-- Bulk Student Report Form -->
            <form *ngIf="selectedReportType === 'bulk'" [formGroup]="bulkReportForm" (ngSubmit)="generateBulkReports()" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Select Students</label>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto bg-black/20 border border-white/10 rounded-lg p-4">
                  <div *ngFor="let student of students" class="flex items-center">
                    <input 
                      type="checkbox"
                      [id]="'student-' + student.id"
                      [value]="student.id"
                      (change)="toggleStudentSelection($event, student.id)"
                      class="mr-2 h-4 w-4 accent-primary-600">
                    <label [for]="'student-' + student.id" class="text-sm cursor-pointer">{{ student.firstName }} {{ student.lastName }}</label>
                  </div>
                </div>
                <div *ngIf="selectedStudents.length === 0 && bulkReportForm.touched" class="text-red-400 text-xs mt-1">
                  Please select at least one student
                </div>
              </div>
              <div class="flex justify-between items-center">
                <div class="text-sm text-gray-300">{{ selectedStudents.length }} students selected</div>
                <button 
                  type="submit"
                  [disabled]="selectedStudents.length === 0 || isProcessing"
                  [ngClass]="{'opacity-50 cursor-not-allowed': selectedStudents.length === 0 || isProcessing}"
                  class="px-6 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 transition-colors flex items-center gap-2">
                  <svg *ngIf="isProcessing" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generate Bulk Reports</span>
                </button>
              </div>
            </form>

            <!-- Class Report Form -->
            <form *ngIf="selectedReportType === 'class'" [formGroup]="classReportForm" (ngSubmit)="generateClassReport()" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">Select Class</label>
                  <select formControlName="classId" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white">
                    <option value="">Select a class</option>
                    <option *ngFor="let class of classes" [value]="class.id">{{ class.name }} ({{ class.subjectName }})</option>
                  </select>
                  <div *ngIf="classReportForm.get('classId')?.invalid && classReportForm.get('classId')?.touched" class="text-red-400 text-xs mt-1">
                    Please select a class
                  </div>
                </div>
              </div>
              <div class="flex justify-end">
                <button 
                  type="submit"
                  [disabled]="classReportForm.invalid || isProcessing"
                  [ngClass]="{'opacity-50 cursor-not-allowed': classReportForm.invalid || isProcessing}"
                  class="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center gap-2">
                  <span *ngIf="isProcessing" class="animate-spin">🔄</span>
                  <span>Generate Class Report</span>
                </button>
              </div>
            </form>

            <!-- Semester Report Form -->
            <form *ngIf="selectedReportType === 'semester'" [formGroup]="semesterReportForm" (ngSubmit)="generateSemesterReport()" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">Select Semester</label>
                  <select formControlName="semesterId" class="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white">
                    <option value="">Select a semester</option>
                    <option *ngFor="let semester of semesters" [value]="semester.id">{{ semester.name }}</option>
                  </select>
                  <div *ngIf="semesterReportForm.get('semesterId')?.invalid && semesterReportForm.get('semesterId')?.touched" class="text-red-400 text-xs mt-1">
                    Please select a semester
                  </div>
                </div>
              </div>
              <div class="flex justify-end">
                <button 
                  type="submit"
                  [disabled]="semesterReportForm.invalid || isProcessing"
                  [ngClass]="{'opacity-50 cursor-not-allowed': semesterReportForm.invalid || isProcessing}"
                  class="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center gap-2">
                  <span *ngIf="isProcessing" class="animate-spin"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-loader-3"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 0 0 9 9a9 9 0 0 0 9 -9a9 9 0 0 0 -9 -9" /><path d="M17 12a5 5 0 1 0 -5 5" /></svg></span>
                  <span>Generate Semester Report</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Recent Reports -->
          <div class="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 animate-fadeIn" style="animation-delay: 0.5s">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold">Recent Reports</h2>
              <button class="text-xs bg-primary-700 bg-opacity-50 hover:bg-primary-700 hover:bg-opacity-70 text-white px-3 py-1 rounded-full transition-colors">
                Clear History
              </button>
            </div>
            
            <div class="space-y-4">
              <div *ngIf="recentReports.length === 0" class="text-center py-8 text-gray-400">
                No recent reports. Generate a report to see it here.
              </div>
              <div *ngFor="let report of recentReports" class="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5">
                <div class="flex items-center">
                  <div class="p-2 rounded-md bg-primary-600 bg-opacity-20 mr-4">
                    <span class="text-xl">📄</span>
                  </div>
                  <div>
                    <p class="font-medium">{{ report.name }}</p>
                    <p class="text-xs text-gray-400">{{ report.date | date:'medium' }}</p>
                  </div>
                </div>
                <button class="p-2 rounded-full bg-primary-600 bg-opacity-20 hover:bg-primary-600 bg-opacity-40 transition-colors">
                  <span>
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-download text-white"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 11l5 5l5 -5" /><path d="M12 4l0 12" /></svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideRight {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    .animate-fadeIn {
      animation: fadeIn 0.5s ease-out forwards;
    }
    
    .animate-slideRight {
      animation: slideRight 0.5s ease-out forwards;
    }
    
    .hover\:scale-102:hover {
      transform: scale(1.02);
    }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `]
})
export class AdminReportsComponent implements OnInit {
  reportOptions = [
    { 
      type: 'student' as const, 
      title: 'Single Student Report', 
      description: 'Generate a detailed PDF report for an individual student',
      icon: '👨‍🎓'
    },
    { 
      type: 'bulk' as const, 
      title: 'Bulk Student Reports', 
      description: 'Generate reports for multiple students as a ZIP file',
      icon: '👥'
    },
    { 
      type: 'class' as const, 
      title: 'Class Report', 
      description: 'Generate a comprehensive report for an entire class',
      icon: '🏫'
    },
    { 
      type: 'semester' as const, 
      title: 'Semester Report', 
      description: 'Generate a complete report for a semester',
      icon: '📆'
    }
  ];

  selectedReportType: 'student' | 'bulk' | 'class' | 'semester' = 'student';
  isProcessing = false;
  
  // Form groups for different report types
  studentReportForm: FormGroup;
  bulkReportForm: FormGroup;
  classReportForm: FormGroup;
  semesterReportForm: FormGroup;
  
  // Data for dropdowns
  students: UserProfile[] = [];
  classes: Class[] = [];
  semesters: Semester[] = [];
  selectedStudents: number[] = [];
  
  // Recent reports
  recentReports: { id: number, name: string, type: string, date: Date }[] = [];

  constructor(
    private reportService: ReportService,
    private adminUserService: AdminUserService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.studentReportForm = this.fb.group({
      studentId: ['', Validators.required]
    });
    
    this.bulkReportForm = this.fb.group({
      studentIds: [[], Validators.required]
    });
    
    this.classReportForm = this.fb.group({
      classId: ['', Validators.required]
    });
    
    this.semesterReportForm = this.fb.group({
      semesterId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRealData();
  }

  private loadMockData(): void {
    // Mock students data
    this.students = [
      { id: 1, username: 'john_doe', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'STUDENT' },
      { id: 2, username: 'mary_smith', firstName: 'Mary', lastName: 'Smith', email: 'mary@example.com', role: 'STUDENT' },
      { id: 3, username: 'robert_brown', firstName: 'Robert', lastName: 'Brown', email: 'robert@example.com', role: 'STUDENT' },
      { id: 4, username: 'laura_wilson', firstName: 'Laura', lastName: 'Wilson', email: 'laura@example.com', role: 'STUDENT' },
      { id: 5, username: 'emma_miller', firstName: 'Emma', lastName: 'Miller', email: 'emma@example.com', role: 'STUDENT' }
    ];
    
    // Mock classes data
    this.classes = [
      { id: 1, name: 'Math 101', subjectName: 'Mathematics', teacherFullName: 'David Johnson', enrollmentCount: 25 },
      { id: 2, name: 'Physics 101', subjectName: 'Physics', teacherFullName: 'Sarah Williams', enrollmentCount: 18 },
      { id: 3, name: 'Chemistry Lab', subjectName: 'Chemistry', teacherFullName: 'Michael Brown', enrollmentCount: 22 },
      { id: 4, name: 'Programming Basics', subjectName: 'Computer Science', teacherFullName: 'Jennifer Davis', enrollmentCount: 30 }
    ];
    
    // Mock semesters data
    this.semesters = [
      { id: 1, name: 'Fall 2024', startDate: '2024-09-01', endDate: '2024-12-15' },
      { id: 2, name: 'Spring 2025', startDate: '2025-01-15', endDate: '2025-05-30' },
      { id: 3, name: 'Summer 2025', startDate: '2025-06-15', endDate: '2025-08-15' }
    ];
    
    // Mock recent reports
    this.recentReports = [
      { id: 1, name: 'John Doe - Fall 2024 Report', type: 'student', date: new Date('2025-05-01') },
      { id: 2, name: 'Math 101 - Class Report', type: 'class', date: new Date('2025-04-28') },
      { id: 3, name: 'Spring 2025 - Semester Report', type: 'semester', date: new Date('2025-04-15') }
    ];
  }

  // Load data from the server
  private loadRealData(): void {
    // Add error handling for API requests
    const handleError = (error: any) => {
      console.error('Error fetching data:', error);
      // Fallback to mock data if server is not available
      this.loadMockData();
    };

    // Load students
    this.adminUserService.getAllUsers('STUDENT').subscribe({
      next: (students) => {
        this.students = students;
      },
      error: handleError
    });
    
    // Load classes (in a real app, this would use a ClassService)
    // This is a placeholder for demonstration purposes
    // In a production app, you would create a proper service for this
    const classesUrl = `${environment.apiUrl}/admin/classes`;
    this.http.get<Class[]>(classesUrl).subscribe({
      next: (classes: Class[]) => {
        this.classes = classes;
      },
      error: handleError
    });
    
    // Load semesters (in a real app, this would use a SemesterService)
    // This is a placeholder for demonstration purposes
    const semestersUrl = `${environment.apiUrl}/admin/semesters`;
    this.http.get<Semester[]>(semestersUrl).subscribe({
      next: (semesters: Semester[]) => {
        this.semesters = semesters;
      },
      error: handleError
    });
    
    // Load recent reports (in a real app, this would use the ReportService)
    // This is a placeholder for demonstration purposes
    const reportsUrl = `${environment.apiUrl}/admin/reports/recent`;
    interface ReportResponse {
      id: number;
      name: string;
      type: string;
      date: string;
    }
    
    this.http.get<ReportResponse[]>(reportsUrl).subscribe({
      next: (reports: ReportResponse[]) => {
        this.recentReports = reports.map(report => ({
          id: report.id,
          name: report.name,
          type: report.type,
          date: new Date(report.date)
        }));
      },
      error: handleError
    });
  }

  selectReportType(type: 'student' | 'bulk' | 'class' | 'semester'): void {
    this.selectedReportType = type;
  }

  getReportTypeTitle(): string {
    switch(this.selectedReportType) {
      case 'student': return 'Single Student Report Configuration';
      case 'bulk': return 'Bulk Student Reports Configuration';
      case 'class': return 'Class Report Configuration';
      case 'semester': return 'Semester Report Configuration';
      default: return 'Report Configuration';
    }
  }

  toggleStudentSelection(event: Event, studentId: number): void {
    const checkbox = event.target as HTMLInputElement;
    
    if (checkbox.checked) {
      this.selectedStudents.push(studentId);
    } else {
      this.selectedStudents = this.selectedStudents.filter(id => id !== studentId);
    }
  }

  generateStudentReport(): void {
    if (this.studentReportForm.valid) {
      this.isProcessing = true;
      const studentId = this.studentReportForm.value.studentId;
      
      // Call the service to generate the student report
      this.reportService.generateStudentReport(studentId).subscribe({
        next: (blob) => {
          // Download the generated PDF file
          this.reportService.downloadFile(blob, `student_report_${studentId}.pdf`);
          
          // Add to report history
          this.addReportToHistory('student', studentId);
          this.isProcessing = false;
        },
        error: (error) => {
          console.error('Error generating student report:', error);
          alert('Failed to generate student report. Please try again.');
          this.isProcessing = false;
        }
      });
    }
  }

  generateBulkReports(): void {
    if (this.selectedStudents.length > 0) {
      this.isProcessing = true;
      
      // Call the service to generate bulk reports
      this.reportService.generateBulkStudentReports(this.selectedStudents).subscribe({
        next: (blob) => {
          // Download the generated ZIP file
          this.reportService.downloadFile(blob, 'bulk_student_reports.zip');
          
          // Add to report history
          this.addReportToHistory('bulk');
          this.isProcessing = false;
        },
        error: (error) => {
          console.error('Error generating bulk reports:', error);
          alert('Failed to generate bulk reports. Please try again.');
          this.isProcessing = false;
        }
      });
    }
  }

  generateClassReport(): void {
    if (this.classReportForm.valid) {
      this.isProcessing = true;
      const classId = this.classReportForm.value.classId;
      
      // Call the service to generate class report
      this.reportService.generateClassReports(classId).subscribe({
        next: (blob) => {
          // Download the generated ZIP file
          this.reportService.downloadFile(blob, `class_report_${classId}.zip`);
          
          // Add to report history
          this.addReportToHistory('class', classId);
          this.isProcessing = false;
        },
        error: (error) => {
          console.error('Error generating class report:', error);
          alert('Failed to generate class report. Please try again.');
          this.isProcessing = false;
        }
      });
    }
  }

  generateSemesterReport(): void {
    if (this.semesterReportForm.valid) {
      this.isProcessing = true;
      const semesterId = this.semesterReportForm.value.semesterId;
      
      // Call the service to generate semester report
      this.reportService.generateSemesterReports(semesterId).subscribe({
        next: (blob) => {
          // Download the generated ZIP file
          this.reportService.downloadFile(blob, `semester_report_${semesterId}.zip`);
          
          // Add to report history
          this.addReportToHistory('semester', semesterId);
          this.isProcessing = false;
        },
        error: (error) => {
          console.error('Error generating semester report:', error);
          alert('Failed to generate semester report. Please try again.');
          this.isProcessing = false;
        }
      });
    }
  }

  private addReportToHistory(type: string, id?: number): void {
    let reportName = '';
    
    switch(type) {
      case 'student':
        if (id) {
          const student = this.students.find(s => s.id === +id);
          if (student) {
            reportName = `${student.firstName} ${student.lastName} - Student Report`;
          }
        }
        break;
      case 'bulk':
        reportName = `Bulk Student Reports (${this.selectedStudents.length} students)`;
        break;
      case 'class':
        if (id) {
          const classItem = this.classes.find(c => c.id === +id);
          if (classItem) {
            reportName = `${classItem.name} - Class Report`;
          }
        }
        break;
      case 'semester':
        if (id) {
          const semester = this.semesters.find(s => s.id === +id);
          if (semester) {
            reportName = `${semester.name} - Semester Report`;
          }
        }
        break;
    }
    
    if (reportName) {
      this.recentReports.unshift({
        id: this.recentReports.length + 1,
        name: reportName,
        type: type,
        date: new Date()
      });
    }
  }
}
