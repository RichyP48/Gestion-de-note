import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../core/services/report.service';
import { ClassService, Class, User } from '../../../core/services/class.service';

@Component({
  selector: 'app-teacher-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
template: `
  <div class="min-h-screen flex bg-white">
    <!-- Sidebar -->
    <aside class="w-60 bg-gradient-to-r from-[#2dd4bf] to-[#1f2937] text-white flex flex-col py-6 px-4 min-h-screen sticky top-0 left-0 z-30"
      style="height: 100vh; position: sticky; top: 0; overflow-y: auto;">
      <style>
        ::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
          background-color: #f5f5f5;
        }
        ::-webkit-scrollbar {
          width: 3px;
          background-color: #f5f5f5;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
          background-color: #f5f5f5;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #32b9a9;
        }
      </style>
      <div class="mb-8 flex items-center gap-2">
        <span class="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">Grade48</span>
      </div>
      <nav class="flex-1 hide-scrollbar" style="overflow-y: auto;">
        <ul class="space-y-2">
          <li>
            <a routerLink="/teacher" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#32b9a9]/30 transition-colors font-medium">
              <span>🏠</span> <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a routerLink="/teacher/grades" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#32b9a9]/30 transition-colors font-medium">
              <span>📝</span> <span>Grades</span>
            </a>
          </li>
          <li>
            <a routerLink="/teacher/reports" class="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#32b9a9]/40 font-semibold transition-colors">
              <span>📊</span> <span>Reports</span>
            </a>
          </li>
        </ul>
      </nav>
      <div class="mt-auto">
        <button class="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 transition-colors font-medium">
          <span>🚪</span> <span>Logout</span>
        </button>
      </div>
    </aside>
    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-slate-900 text-white">
      <!-- Navbar -->
      <nav class="bg-black/30 backdrop-blur-lg border-b border-teal-500/30 sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <span class="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                Grade48</span>
            </div>
            <div class="flex items-center space-x-4">
              <a routerLink="/teacher" class="px-4 py-2 rounded-md bg-teal-700 hover:bg-teal-600 transition-all">
                <span>Dashboard</span>
              </a>
            </div>
          </div>
        </div>
      </nav>
      
      <!-- Main Content -->
      <main class="py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Header with animation -->
          <header class="mb-10">
            <h1 class="text-4xl font-black mb-2 animate-fadeIn">
              <span class="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-400">Report Generation</span>
            </h1>
            <p class="text-gray-300 animate-slideRight">Create and download various reports for your classes and students.</p>
          </header>

          <!-- Report Generation Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Student Report Card -->
            <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-glow">
              <h2 class="text-xl font-bold mb-4">Student Report Card</h2>
              <p class="text-gray-300 mb-4">Generate a detailed report card for an individual student.</p>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">Select Class</label>
                  <select [(ngModel)]="selectedClassForStudent" class="w-full bg-black/30 border border-teal-500/30 rounded-md px-3 py-2 text-white">
                    <option [ngValue]="null">Choose a class</option>
                    <option *ngFor="let class of classes" [ngValue]="class.id">{{ class.name }}</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">Select Student</label>
                  <select [(ngModel)]="selectedStudentId" class="w-full bg-black/30 border border-teal-500/30 rounded-md px-3 py-2 text-white">
                    <option [ngValue]="null">Choose a student</option>
                    <option *ngFor="let student of getStudentsForClass(selectedClassForStudent)" [ngValue]="student.id">{{ student.name }}</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">Report Period</label>
                  <select class="w-full bg-black/30 border border-teal-500/30 rounded-md px-3 py-2 text-white">
                    <option value="current">Current Semester</option>
                    <option value="previous">Previous Semester</option>
                    <option value="year">Full Academic Year</option>
                  </select>
                </div>
                
                <div class="flex items-center space-x-2 pt-2">
                  <input type="checkbox" id="includeComments" class="rounded bg-black/30 border-teal-500/30 text-teal-600 focus:ring-teal-500">
                  <label for="includeComments" class="text-sm text-gray-300">Include teacher comments</label>
                </div>
                
                <div class="flex items-center space-x-2">
                  <input type="checkbox" id="includeAttendance" class="rounded bg-black/30 border-teal-500/30 text-teal-600 focus:ring-teal-500">
                  <label for="includeAttendance" class="text-sm text-gray-300">Include attendance record</label>
                </div>
                
                <button [disabled]="isProcessing || !selectedStudentId" (click)="generateStudentReport()" class="w-full mt-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-md transition-all flex items-center justify-center" [class.opacity-50]="!selectedStudentId">
                  <span *ngIf="isProcessing" class="animate-spin mr-2">⟳</span>
                  <span>{{ isProcessing ? 'Generating...' : 'Generate Report' }}</span>
                </button>
              </div>
            </div>
            
            <!-- Class Performance Report -->
            <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-glow">
              <h2 class="text-xl font-bold mb-4">Class Performance Report</h2>
              <p class="text-gray-300 mb-4">Generate a comprehensive report for an entire class.</p>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">Select Class</label>
                  <select [(ngModel)]="selectedClassForReport" class="w-full bg-black/30 border border-teal-500/30 rounded-md px-3 py-2 text-white">
                    <option [ngValue]="null">Choose a class</option>
                    <option *ngFor="let class of classes" [ngValue]="class.id">{{ class.name }}</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">Report Type</label>
                  <select class="w-full bg-black/30 border border-teal-500/30 rounded-md px-3 py-2 text-white">
                    <option value="summary">Summary Report</option>
                    <option value="detailed">Detailed Report</option>
                    <option value="analytics">Analytics Report</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">Report Period</label>
                  <select class="w-full bg-black/30 border border-teal-500/30 rounded-md px-3 py-2 text-white">
                    <option value="current">Current Semester</option>
                    <option value="previous">Previous Semester</option>
                    <option value="year">Full Academic Year</option>
                  </select>
                </div>
                
                <div class="flex items-center space-x-2 pt-2">
                  <input type="checkbox" id="includeCharts" class="rounded bg-black/30 border-teal-500/30 text-teal-600 focus:ring-teal-500">
                  <label for="includeCharts" class="text-sm text-gray-300">Include performance charts</label>
                </div>
                
                <div class="flex items-center space-x-2">
                  <input type="checkbox" id="includeComparison" class="rounded bg-black/30 border-teal-500/30 text-teal-600 focus:ring-teal-500">
                  <label for="includeComparison" class="text-sm text-gray-300">Include historical comparison</label>
                </div>
                
                <button [disabled]="isProcessing || !selectedClassForReport" (click)="generateClassReport()" class="w-full mt-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-md transition-all flex items-center justify-center" [class.opacity-50]="!selectedClassForReport">
                  <span *ngIf="isProcessing" class="animate-spin mr-2">⟳</span>
                  <span>{{ isProcessing ? 'Generating...' : 'Generate Report' }}</span>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Recent Reports & Bulk Actions -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Recent Reports -->
            <div class="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-glow">
              <h2 class="text-xl font-bold mb-4">Recent Reports</h2>
              
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Report Name</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Generated</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-700 bg-black/20">
                    <tr *ngFor="let report of recentReports" class="hover:bg-white/5 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap">{{ report.name }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span [ngClass]="{
                          'bg-blue-500/20 text-blue-400': report.type === 'student',
                          'bg-teal-500/20 text-teal-400': report.type === 'class',
                          'bg-indigo-500/20 text-indigo-400': report.type === 'custom'
                        }" class="px-2 py-1 rounded-full text-xs">
                          {{ report.type }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ report.date }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button (click)="downloadReport(report)" class="text-teal-400 hover:text-teal-300 mr-3">Download</button>
                        <button (click)="viewReport(report)" class="text-gray-400 hover:text-gray-300">View</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- Bulk Actions -->
            <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-glow">
              <h2 class="text-xl font-bold mb-4">Bulk Actions</h2>
              
              <div class="space-y-4">
                <div class="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all cursor-pointer">
                  <div class="flex items-start gap-4">
                    <div class="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                      <span class="text-xl">📊</span>
                    </div>
                    <div>
                      <h3 class="font-medium">Batch Generate</h3>
                      <p class="text-sm text-gray-300">Create reports for multiple students at once</p>
                    </div>
                  </div>
                </div>
                
                <div class="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all cursor-pointer">
                  <div class="flex items-start gap-4">
                    <div class="p-3 rounded-lg bg-teal-500/20 text-teal-400">
                      <span class="text-xl">📧</span>
                    </div>
                    <div>
                      <h3 class="font-medium">Email Reports</h3>
                      <p class="text-sm text-gray-300">Send reports directly to students or parents</p>
                    </div>
                  </div>
                </div>
                
                <div class="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-all cursor-pointer">
                  <div class="flex items-start gap-4">
                    <div class="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
                      <span class="text-xl">📅</span>
                    </div>
                    <div>
                      <h3 class="font-medium">Schedule Reports</h3>
                      <p class="text-sm text-gray-300">Set up automatic report generation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
`

})
export class TeacherReportsComponent implements OnInit {
  // UI state
  isProcessing: boolean = false;
  
  // Data
  classes: Class[] = [];
  students: StudentInfo[] = [];
  recentReports: Report[] = [];
  
  // Selected values
  selectedClassForStudent: number | null = null;
  selectedStudentId: number | null = null;
  selectedClassForReport: number | null = null;
  selectedReportType: string = 'summary';
  selectedReportPeriod: string = 'current';
  
  // Options
  includeComments: boolean = false;
  includeAttendance: boolean = false;
  includeCharts: boolean = false;
  includeComparison: boolean = false;

  constructor(
    private reportService: ReportService,
    private classService: ClassService
  ) {}

  ngOnInit(): void {
    // Load real data from the server
    this.loadClasses();
    this.loadRecentReports();
  }

  // Load classes taught by the current teacher
  loadClasses(): void {
    this.classService.getMyClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
        
        // For each class, load its students
        classes.forEach(classItem => {
          this.classService.getStudentsInClass(classItem.id).subscribe({
            next: (students) => {
              students.forEach(student => {
                if (!this.students.some(s => s.id === student.id)) {
                  this.students.push({
                    id: student.id,
                    name: `${student.firstName} ${student.lastName}`,
                    classId: classItem.id,
                    className: classItem.name
                  });
                }
              });
            },
            error: (error) => {
              console.error(`Error loading students for class ${classItem.id}:`, error);
            }
          });
        });
      },
      error: (error) => {
        console.error('Error loading classes:', error);
      }
    });
  }

  // Load recent reports
  loadRecentReports(): void {
    // In a real application, we would fetch this from the server
    // For now, we'll use mock data but formatted as if it came from the server
    this.recentReports = [
      { 
        id: 1,
        name: 'John Smith - Physics Report', 
        type: 'student', 
        date: '2 days ago',
        studentId: 1,
        classId: 2,
        url: 'reports/student_1_physics.pdf'
      },
      { 
        id: 2,
        name: 'Mathematics 101 - Class Summary', 
        type: 'class', 
        date: 'Yesterday',
        classId: 1,
        url: 'reports/math_101_summary.pdf'
      },
      { 
        id: 3,
        name: 'Emma Johnson - Progress Report', 
        type: 'student', 
        date: 'Today',
        studentId: 2,
        classId: 3,
        url: 'reports/student_2_progress.pdf'
      },
      { 
        id: 4,
        name: 'Computer Science - Performance Analysis', 
        type: 'class', 
        date: 'Today',
        classId: 3,
        url: 'reports/cs_performance.pdf'
      },
      { 
        id: 5,
        name: 'Semester Overview', 
        type: 'custom', 
        date: '1 week ago',
        url: 'reports/semester_overview.pdf'
      }
    ];
  }

  // Get students for a specific class
  getStudentsForClass(classId: number | null): StudentInfo[] {
    if (!classId) return [];
    return this.students.filter(student => student.classId === classId);
  }

  // Generate a student report
  generateStudentReport(): void {
    if (!this.selectedStudentId) return;
    
    this.isProcessing = true;
    
    this.reportService.generateStudentReport(this.selectedStudentId).subscribe({
      next: (blob) => {
        // Get student name
        const student = this.students.find(s => s.id === this.selectedStudentId);
        if (student) {
          const filename = `${student.name.replace(' ', '_')}_Report.pdf`;
          this.reportService.downloadFile(blob, filename);
          
          // Add to recent reports
          const now = new Date();
          this.recentReports.unshift({
            id: this.recentReports.length + 1,
            name: `${student.name} - Progress Report`,
            type: 'student',
            date: 'Just now',
            studentId: student.id,
            classId: student.classId,
            url: filename
          });
        }
        this.isProcessing = false;
      },
      error: (error) => {
        console.error('Error generating student report:', error);
        this.isProcessing = false;
      }
    });
  }

  // Generate a class report
  generateClassReport(): void {
    if (!this.selectedClassForReport) return;
    
    this.isProcessing = true;
    
    this.reportService.generateClassReports(this.selectedClassForReport).subscribe({
      next: (blob) => {
        // Get class name
        const classItem = this.classes.find(c => c.id === this.selectedClassForReport);
        if (classItem) {
          const filename = `${classItem.name.replace(' ', '_')}_Report.pdf`;
          this.reportService.downloadFile(blob, filename);
          
          // Add to recent reports
          this.recentReports.unshift({
            id: this.recentReports.length + 1,
            name: `${classItem.name} - ${this.selectedReportType} Report`,
            type: 'class',
            date: 'Just now',
            classId: classItem.id,
            url: filename
          });
        }
        this.isProcessing = false;
      },
      error: (error) => {
        console.error('Error generating class report:', error);
        this.isProcessing = false;
      }
    });
  }

  // Download a report
  downloadReport(report: Report): void {
    // In a real application, we would fetch the report from the server
    // For now, we'll just simulate a download
    alert(`Downloading report: ${report.name}`);
  }

  // View a report
  viewReport(report: Report): void {
    // In a real application, we would open the report in a viewer
    // For now, we'll just show an alert
    alert(`Viewing report: ${report.name}`);
  }
}

// Interfaces
interface StudentInfo {
  id: number;
  name: string;
  classId: number;
  className: string;
}

interface Report {
  id: number;
  name: string;
  type: string;
  date: string;
  studentId?: number;
  classId?: number;
  url: string;
}
