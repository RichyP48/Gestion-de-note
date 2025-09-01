# Student Grade Management System - API Documentation

This document provides details for the RESTful API endpoints of the Student Grade Management System backend.

**Base URL:** `/api` (This might change, confirm final base path)

**Authentication:** Bearer Token (JWT) required for most endpoints after login.

---

## Authentication

### Sign In

*   **Endpoint:** `/api/auth/signin`
*   **Method:** `POST`
*   **Description:** Authenticates a user and returns a JWT token upon successful login.
*   **Authentication:** None required.
*   **Request Body:**
    ```json
    {
      "username": "user_login_name",
      "password": "user_password"
    }
    ```
    *   `username` (string, required): The user's registered username.
    *   `password` (string, required): The user's password.
*   **Success Response (200 OK):**
    ```json
    {
      "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImlhdCI6MTcxNDU1NjE4MSwiZXhwIjoxNzE0NjQyNTgxfQ.abcdef...",
      "type": "Bearer",
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "roles": [
        "ROLE_STUDENT"
      ]
    }
    ```
    *   `token` (string): The JWT authentication token.
    *   `type` (string): Always "Bearer".
    *   `id` (number): The user's unique ID.
    *   `username` (string): The user's username.
    *   `email` (string): The user's email address.
    *   `roles` (array of strings): List of roles assigned to the user (e.g., "ROLE_STUDENT", "ROLE_TEACHER", "ROLE_ADMIN").
*   **Failure Response (401 Unauthorized):**
    ```json
    {
      "status": 401,
      "error": "Unauthorized",
      "message": "Bad credentials", // Or other specific authentication error message
      "path": "/api/auth/signin"
    }
    ```
*   **Failure Response (400 Bad Request):** (If request validation fails)
    ```json
    {
        "timestamp": "2025-05-01T09:40:00.123+00:00",
        "status": 400,
        "error": "Bad Request",
        "errors": [ // List of validation errors
             {
                "field": "username",
                "message": "Username cannot be blank"
             }
         ],
        "path": "/api/auth/signin"
    }
    ```
    *(Note: The exact format of validation errors might depend on global exception handling configuration)*

---

## Admin - Subject Management

Base Path: `/api/admin/subjects`

Authentication: Requires `ROLE_ADMIN`.

### Get All Subjects

*   **Endpoint:** `/` (relative to base path)
*   **Method:** `GET`
*   **Description:** Retrieves a list of all subjects in the system.
*   **Success Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "name": "Mathematics",
        "coefficient": 1.5
      },
      {
        "id": 2,
        "name": "Physics",
        "coefficient": 1.0
      }
    ]
    ```
*   **Failure Response:** Standard error responses (e.g., 401 Unauthorized, 403 Forbidden).

### Get Subject by ID

*   **Endpoint:** `/{id}`
*   **Method:** `GET`
*   **Description:** Retrieves details for a specific subject by its ID.
*   **Path Parameters:**
    *   `id` (number, required): The unique ID of the subject.
*   **Success Response (200 OK):**
    ```json
    {
      "id": 1,
      "name": "Mathematics",
      "coefficient": 1.5
    }
    ```
*   **Failure Response (404 Not Found):** If no subject exists with the given ID.
    ```json
    {
        "timestamp": "2025-05-01T09:45:00.123+00:00",
        "status": 404,
        "error": "Not Found",
        "message": "Subject not found with ID: 99",
        "path": "/api/admin/subjects/99"
    }
    ```

### Create Subject

*   **Endpoint:** `/`
*   **Method:** `POST`
*   **Description:** Creates a new subject.
*   **Request Body:**
    ```json
    {
      "name": "Chemistry",
      "coefficient": 1.2
    }
    ```
    *   `name` (string, required, max 100 chars): The name of the subject. Must be unique (case-insensitive).
    *   `coefficient` (number, required, non-negative): The weighting/coefficient for the subject.
*   **Success Response (201 Created):**
    ```json
    {
      "id": 3,
      "name": "Chemistry",
      "coefficient": 1.2
    }
    ```
*   **Failure Response (409 Conflict):** If a subject with the same name already exists.
    ```json
    {
      "message": "Error: Subject with name 'Chemistry' already exists."
    }
    ```
*   **Failure Response (400 Bad Request):** If request validation fails (e.g., missing fields, invalid coefficient).

### Update Subject

*   **Endpoint:** `/{id}`
*   **Method:** `PUT`
*   **Description:** Updates an existing subject's details.
*   **Path Parameters:**
    *   `id` (number, required): The ID of the subject to update.
*   **Request Body:**
    ```json
    {
      "name": "Advanced Chemistry",
      "coefficient": 1.3
    }
    ```
    *   `name` (string, required, max 100 chars): The updated name. Must be unique (case-insensitive) among other subjects.
    *   `coefficient` (number, required, non-negative): The updated coefficient.
*   **Success Response (200 OK):**
    ```json
    {
      "id": 3,
      "name": "Advanced Chemistry",
      "coefficient": 1.3
    }
    ```
*   **Failure Response (404 Not Found):** If the subject with the given ID doesn't exist.
*   **Failure Response (409 Conflict):** If the updated name conflicts with another existing subject.
    ```json
    {
      "message": "Error: Another subject with name 'Advanced Chemistry' already exists."
    }
    ```
*   **Failure Response (400 Bad Request):** If request validation fails.

### Delete Subject

*   **Endpoint:** `/{id}`
*   **Method:** `DELETE`
*   **Description:** Deletes a subject by its ID. (Note: Consider implications if grades are linked to this subject).
*   **Path Parameters:**
    *   `id` (number, required): The ID of the subject to delete.
*   **Success Response (200 OK):**
    ```json
    {
      "message": "Subject deleted successfully!"
    }
    ```
*   **Failure Response (404 Not Found):** If the subject with the given ID doesn't exist.

---

## Admin - User Management

Base Path: `/api/admin/users`

Authentication: Requires `ROLE_ADMIN`.

### Get All Users

*   **Endpoint:** `/`
*   **Method:** `GET`
*   **Description:** Retrieves a list of all users (Students, Teachers, Admins). Can optionally filter by role.
*   **Query Parameters:**
    *   `role` (string, optional): Filter users by role (e.g., `STUDENT`, `TEACHER`, `ADMIN`). If omitted, returns all users.
*   **Success Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "username": "adminuser",
        "firstName": "Admin",
        "lastName": "User",
        "email": "admin@example.com",
        "role": "ADMIN"
      },
      {
        "id": 2,
        "username": "teacher1",
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "jane.doe@example.com",
        "role": "TEACHER"
      },
      {
        "id": 3,
        "username": "student1",
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@example.com",
        "role": "STUDENT"
      }
      // ... more users
    ]
    ```
*   **Failure Response:** Standard error responses (401, 403).

### Get User by ID

*   **Endpoint:** `/{id}`
*   **Method:** `GET`
*   **Description:** Retrieves details for a specific user by their ID.
*   **Path Parameters:**
    *   `id` (number, required): The unique ID of the user.
*   **Success Response (200 OK):**
    ```json
    {
      "id": 3,
      "username": "student1",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@example.com",
      "role": "STUDENT"
    }
    ```
*   **Failure Response (404 Not Found):** If no user exists with the given ID.

### Get User by Username

*   **Endpoint:** `/username/{username}`
*   **Method:** `GET`
*   **Description:** Retrieves details for a specific user by their username.
*   **Path Parameters:**
    *   `username` (string, required): The username of the user.
*   **Success Response (200 OK):** (Same format as Get User by ID)
*   **Failure Response (404 Not Found):** If no user exists with the given username.

### Create User

*   **Endpoint:** `/`
*   **Method:** `POST`
*   **Description:** Creates a new user (Student, Teacher, or Admin).
*   **Request Body:**
    ```json
    {
      "username": "newstudent",
      "password": "password123", // Min length 6 (example)
      "firstName": "New",
      "lastName": "Student",
      "email": "new.student@example.com",
      "role": "STUDENT" // Or TEACHER, ADMIN
    }
    ```
    *   All fields are required. See validation constraints in `UserCreateRequestDto`.
*   **Success Response (201 Created):**
    ```json
    {
      "id": 4,
      "username": "newstudent",
      "firstName": "New",
      "lastName": "Student",
      "email": "new.student@example.com",
      "role": "STUDENT"
    }
    ```
*   **Failure Response (409 Conflict):** If the username or email already exists.
    ```json
    { "message": "Error: Username is already taken!" }
    // or
    { "message": "Error: Email is already in use!" }
    ```
*   **Failure Response (400 Bad Request):** If request validation fails.

### Update User

*   **Endpoint:** `/{id}`
*   **Method:** `PUT`
*   **Description:** Updates an existing user's details (first name, last name, email, role). Username and password cannot be updated via this endpoint.
*   **Path Parameters:**
    *   `id` (number, required): The ID of the user to update.
*   **Request Body:**
    ```json
    {
      "firstName": "UpdatedFirstName",
      "lastName": "UpdatedLastName",
      "email": "updated.email@example.com",
      "role": "TEACHER" // Example: changing role
    }
    ```
    *   All fields are required. See validation constraints in `UserUpdateRequestDto`.
*   **Success Response (200 OK):**
    ```json
    {
      "id": 4,
      "username": "newstudent", // Username remains unchanged
      "firstName": "UpdatedFirstName",
      "lastName": "UpdatedLastName",
      "email": "updated.email@example.com",
      "role": "TEACHER"
    }
    ```
*   **Failure Response (404 Not Found):** If the user with the given ID doesn't exist.
*   **Failure Response (409 Conflict):** If the updated email conflicts with another existing user.
    ```json
    { "message": "Error: Email is already in use by another account!" }
    ```
*   **Failure Response (400 Bad Request):** If request validation fails.

### Delete User

*   **Endpoint:** `/{id}`
*   **Method:** `DELETE`
*   **Description:** Deletes a user by their ID. (Note: Consider implications, e.g., associated grades. Self-deletion might be blocked).
*   **Path Parameters:**
    *   `id` (number, required): The ID of the user to delete.
*   **Success Response (200 OK):**
    ```json
    {
      "message": "User deleted successfully!"
    }
    ```
*   **Failure Response (404 Not Found):** If the user with the given ID doesn't exist.
*   **Failure Response (403 Forbidden):** Potentially if trying to delete self (implementation dependent).

---

## Teacher - Grade Management

Base Path: `/api/teacher/grades`

Authentication: Requires `ROLE_TEACHER` or `ROLE_ADMIN`. (Note: Specific authorization logic might apply within endpoints, e.g., teachers only accessing their own students/subjects).

### Get Grades

*   **Endpoint:** `/`
*   **Method:** `GET`
*   **Description:** Retrieves a list of grades. Can be filtered by student ID and/or subject ID. (Authorization rules apply).
*   **Query Parameters:**
    *   `studentId` (number, optional): Filter grades for a specific student.
    *   `subjectId` (number, optional): Filter grades for a specific subject.
    *   `semesterId` (number, optional): Filter grades for a specific semester.
*   **Success Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "score": 85.5,
        "comments": "Good work on the assignment.",
        "dateAssigned": "2025-04-15",
        "studentId": 3,
        "studentUsername": "student1",
        "studentFullName": "John Smith",
        "subjectId": 1,
        "subjectName": "Mathematics"
      },
      {
        "id": 2,
        "score": 92.0,
        "comments": null,
        "dateAssigned": "2025-04-20",
        "studentId": 3,
        "studentUsername": "student1",
        "studentFullName": "John Smith",
        "subjectId": 2,
        "subjectName": "Physics"
      }
      // ... more grades
    ]
    ```
*   **Failure Response (404 Not Found):** If filtering by a non-existent `studentId` or `subjectId`.
*   **Failure Response:** Standard error responses (401, 403).

### Get Grade by ID

*   **Endpoint:** `/{id}`
*   **Method:** `GET`
*   **Description:** Retrieves details for a specific grade by its ID. (Authorization rules apply).
*   **Path Parameters:**
    *   `id` (number, required): The unique ID of the grade.
*   **Success Response (200 OK):**
    ```json
    {
      "id": 1,
      "score": 85.5,
      "comments": "Good work on the assignment.",
      "dateAssigned": "2025-04-15",
      "studentId": 3,
      "studentUsername": "student1",
      "studentFullName": "John Smith",
      "subjectId": 1,
      "subjectName": "Mathematics"
    }
    ```
*   **Failure Response (404 Not Found):** If no grade exists with the given ID or the user is not authorized to view it.

### Create Grade

*   **Endpoint:** `/`
*   **Method:** `POST`
*   **Description:** Creates a new grade entry for a student in a specific subject. (Authorization rules apply).
*   **Request Body:**
    ```json
    {
      "score": 78.0,
      "comments": "Needs improvement on section 2.",
      "studentId": 4,
      "subjectId": 1
    }
    ```
    *   `score` (number, required, 0-100): The score awarded.
    *   `comments` (string, optional): Teacher's comments.
    *   `studentId` (number, required): The ID of the student.
    *   `subjectId` (number, required): The ID of the subject.
*   **Success Response (201 Created):**
    ```json
    {
      "id": 3,
      "score": 78.0,
      "comments": "Needs improvement on section 2.",
      "dateAssigned": "2025-05-01", // Date assigned by server
      "studentId": 4,
      "studentUsername": "newstudent",
      "studentFullName": "New Student",
      "subjectId": 1,
      "subjectName": "Mathematics"
    }
    ```
*   **Failure Response (400 Bad Request):** If `studentId` or `subjectId` does not exist, or if request validation fails.
    ```json
    { "message": "Error: Student not found with ID: 99" }
    // or validation errors
    ```

### Update Grade

*   **Endpoint:** `/{id}`
*   **Method:** `PUT`
*   **Description:** Updates an existing grade's score and/or comments. (Authorization rules apply).
*   **Path Parameters:**
    *   `id` (number, required): The ID of the grade to update.
*   **Request Body:** (Same format as Create Grade, but `studentId` and `subjectId` are typically ignored or validated carefully if allowed to change).
    ```json
    {
      "score": 81.0,
      "comments": "Improved understanding shown.",
      "studentId": 4, // Usually ignored on update
      "subjectId": 1  // Usually ignored on update
    }
    ```
*   **Success Response (200 OK):** (Returns the updated Grade DTO, similar to Create Grade response)
*   **Failure Response (404 Not Found):** If the grade with the given ID doesn't exist or the user is not authorized.
*   **Failure Response (400 Bad Request):** If request validation fails.

### Delete Grade

*   **Endpoint:** `/{id}`
*   **Method:** `DELETE`
*   **Description:** Deletes a grade by its ID. (Authorization rules apply).
*   **Path Parameters:**
    *   `id` (number, required): The ID of the grade to delete.
*   **Success Response (200 OK):**
    ```json
    {
      "message": "Grade deleted successfully!"
    }
    ```
*   **Failure Response (404 Not Found):** If the grade with the given ID doesn't exist or the user is not authorized.

---

## Student - View Grades

Base Path: `/api/student/grades`

Authentication: Requires `ROLE_STUDENT` or `ROLE_ADMIN`.

### Get My Grades

*   **Endpoint:** `/my`
*   **Method:** `GET`
*   **Description:** Retrieves a list of all grades for the currently authenticated student. Can optionally filter by subject ID and semester ID.
*   **Query Parameters:**
    *   `subjectId` (number, optional): Filter grades for a specific subject.
    *   `semesterId` (number, optional): Filter grades for a specific semester.
*   **Success Response (200 OK):** (Same format as Teacher Get Grades response)
    ```json
    [
      {
        "id": 1,
        "score": 85.5,
        "comments": "Good work on the assignment.",
        "dateAssigned": "2025-04-15",
        "studentId": 3, // Will match authenticated user's ID
        "studentUsername": "student1",
        "studentFullName": "John Smith",
        "subjectId": 1,
        "subjectName": "Mathematics"
      },
      // ... other grades for this student
    ]
    ```
*   **Failure Response (404 Not Found):** If filtering by a non-existent `subjectId`.
*   **Failure Response:** Standard error responses (401 Unauthorized).

### Get My Grade by ID

*   **Endpoint:** `/{id}`
*   **Method:** `GET`
*   **Description:** Retrieves details for a specific grade by its ID, but only if it belongs to the authenticated student.
*   **Path Parameters:**
    *   `id` (number, required): The unique ID of the grade.
*   **Success Response (200 OK):** (Same format as Teacher Get Grade by ID response)
*   **Failure Response (404 Not Found):** If no grade exists with the given ID.
*   **Failure Response (403 Forbidden):** If the grade exists but does not belong to the authenticated student.

---

### Download My Grade Report (PDF)

*   **Endpoint:** `/my/download`
*   **Method:** `GET`
*   **Description:** Generates and downloads a PDF grade report for the currently authenticated student.
*   **Success Response (200 OK):**
    *   **Content-Type:** `application/pdf`
    *   **Content-Disposition:** `inline; filename=grade_report_[studentId].pdf`
    *   **Body:** The binary PDF data.
*   **Failure Response (404 Not Found):** If the authenticated student is not found (should not typically happen).
*   **Failure Response (500 Internal Server Error):** If an error occurs during PDF generation.
*   **Failure Response:** Standard error responses (401 Unauthorized).

---

## Teacher - Class Management

Base Path: `/api/teacher/classes`

Authentication: Requires `ROLE_TEACHER` or `ROLE_ADMIN`.

### Get My Classes

*   **Endpoint:** `/`
*   **Method:** `GET`
*   **Description:** Retrieves a list of all classes assigned to the currently authenticated teacher. Can optionally filter by subject ID and/or semester ID.
*   **Query Parameters:**
    *   `subjectId` (number, optional): Filter classes for a specific subject.
    *   `semesterId` (number, optional): Filter classes for a specific semester.
*   **Success Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "name": "Mathematics 101",
        "subjectId": 1,
        "subjectName": "Mathematics",
        "semesterId": 1,
        "semesterName": "Fall 2024",
        "teacherId": 2,
        "teacherUsername": "teacher1",
        "teacherFullName": "Jane Doe",
        "enrolledStudents": [
          {
            "id": 3,
            "username": "student1",
            "firstName": "John",
            "lastName": "Smith",
            "email": "john.smith@example.com"
          },
          // ... other enrolled students
        ],
        "enrollmentCount": 25
      },
      // ... other classes
    ]
    ```
*   **Failure Response (404 Not Found):** If filtering by a non-existent `subjectId` or `semesterId`.
*   **Failure Response:** Standard error responses (401 Unauthorized, 403 Forbidden).

### Get Class by ID

*   **Endpoint:** `/{id}`
*   **Method:** `GET`
*   **Description:** Retrieves details for a specific class by its ID, but only if it is assigned to the authenticated teacher.
*   **Path Parameters:**
    *   `id` (number, required): The unique ID of the class.
*   **Success Response (200 OK):** (Same format as Get My Classes response, but for a single class)
*   **Failure Response (404 Not Found):** If no class exists with the given ID.
*   **Failure Response (403 Forbidden):** If the class exists but is not assigned to the authenticated teacher.

### Get Students in Class

*   **Endpoint:** `/{id}/students`
*   **Method:** `GET`
*   **Description:** Retrieves a list of all students enrolled in a specific class, but only if the class is assigned to the authenticated teacher.
*   **Path Parameters:**
    *   `id` (number, required): The unique ID of the class.
*   **Success Response (200 OK):**
    ```json
    [
      {
        "id": 3,
        "username": "student1",
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@example.com"
      },
      // ... other enrolled students
    ]
    ```
*   **Failure Response (404 Not Found):** If no class exists with the given ID.
*   **Failure Response (403 Forbidden):** If the class exists but is not assigned to the authenticated teacher.

---

## Admin - Report Generation

Base Path: `/api/admin/reports`

Authentication: Requires `ROLE_ADMIN`.

### Generate Student Report

*   **Endpoint:** `/student/{id}`
*   **Method:** `GET`
*   **Description:** Generates a PDF grade report for a specific student.
*   **Path Parameters:**
    *   `id` (number, required): The ID of the student for whom to generate the report.
*   **Success Response (200 OK):**
    *   **Content-Type:** `application/pdf`
    *   **Content-Disposition:** `inline; filename=grade_report_{id}.pdf`
    *   **Body:** The binary PDF data containing the student's grade report.
*   **Failure Response (404 Not Found):** If the student with the given ID doesn't exist.
    ```json
    {
      "message": "Error: Student not found with ID: 99"
    }
    ```
*   **Failure Response (500 Internal Server Error):** If an error occurs during PDF generation.
    ```json
    {
      "message": "Error generating PDF report: [error details]"
    }
    ```

### Generate Bulk Reports

*   **Endpoint:** `/bulk`
*   **Method:** `POST`
*   **Description:** Generates PDF grade reports for multiple students and returns them as a ZIP archive.
*   **Request Body:**
    ```json
    [1, 2, 3]  // Array of student IDs
    ```
*   **Success Response (200 OK):**
    *   **Content-Type:** `application/octet-stream`
    *   **Content-Disposition:** `attachment; filename=student_reports.zip`
    *   **Body:** The binary ZIP data containing individual PDF reports for each student.
*   **Failure Response (400 Bad Request):** If no student IDs were provided.
    ```json
    {
      "message": "Error: No student IDs provided"
    }
    ```
*   **Failure Response (404 Not Found):** If any student does not exist.
    ```json
    {
      "message": "Error: Student not found with ID: 99"
    }
    ```
*   **Failure Response (500 Internal Server Error):** If an error occurs during PDF or ZIP generation.

### Generate Class Reports

*   **Endpoint:** `/class/{id}`
*   **Method:** `POST`
*   **Description:** Generates PDF grade reports for all students in a specific class and returns them as a ZIP archive.
*   **Path Parameters:**
    *   `id` (number, required): The ID of the class for which to generate reports.
*   **Success Response (200 OK):**
    *   **Content-Type:** `application/octet-stream`
    *   **Content-Disposition:** `attachment; filename=class_{id}_reports.zip`
    *   **Body:** The binary ZIP data containing individual PDF reports for each student in the class.
*   **Failure Response (404 Not Found):** If the class with the given ID doesn't exist.
    ```json
    {
      "message": "Error: Class section not found with ID: 99"
    }
    ```
*   **Failure Response (500 Internal Server Error):** If an error occurs during PDF or ZIP generation.

### Generate Semester Reports

*   **Endpoint:** `/semester/{id}`
*   **Method:** `POST`
*   **Description:** Generates PDF grade reports for all students with grades in a specific semester and returns them as a ZIP archive.
*   **Path Parameters:**
    *   `id` (number, required): The ID of the semester for which to generate reports.
*   **Success Response (200 OK):**
    *   **Content-Type:** `application/octet-stream`
    *   **Content-Disposition:** `attachment; filename=semester_{id}_reports.zip`
    *   **Body:** The binary ZIP data containing individual PDF reports for each student with grades in the semester.
*   **Failure Response (404 Not Found):** If the semester with the given ID doesn't exist.
    ```json
    {
      "message": "Error: Semester not found with ID: 99"
    }
    ```
*   **Failure Response (500 Internal Server Error):** If an error occurs during PDF or ZIP generation.

---

## Excel Export

Base Path: `/api/excel`

Authentication: Varies by endpoint (see individual endpoints).

### Export Student Grades

*   **Endpoint:** `/student/{id}`
*   **Method:** `GET`
*   **Description:** Exports grades for a specific student in Excel format.
*   **Authorization:** Requires `ROLE_ADMIN`, `ROLE_TEACHER`, or the student themselves (`ROLE_STUDENT` with matching ID).
*   **Path Parameters:**
    *   `id` (number, required): The ID of the student.
*   **Success Response (200 OK):**
    *   **Content-Type:** `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
    *   **Content-Disposition:** `attachment; filename=student_grades_{id}.xlsx`
    *   **Body:** The binary Excel file with the student's grades.
*   **Failure Response (404 Not Found):** If the student with the given ID doesn't exist.
    ```json
    {
      "message": "Error: Student not found with ID: 99"
    }
    ```
*   **Failure Response (500 Internal Server Error):** If an error occurs during Excel generation.

### Export Class Grades

*   **Endpoint:** `/class/{id}`
*   **Method:** `GET`
*   **Description:** Exports grades for all students in a specific class in Excel format.
*   **Authorization:** Requires `ROLE_ADMIN` or the teacher assigned to the class (`ROLE_TEACHER` with matching class assignment).
*   **Path Parameters:**
    *   `id` (number, required): The ID of the class.
*   **Success Response (200 OK):**
    *   **Content-Type:** `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
    *   **Content-Disposition:** `attachment; filename=class_grades_{id}.xlsx`
    *   **Body:** The binary Excel file with grades for all students in the class.
*   **Failure Response (404 Not Found):** If the class with the given ID doesn't exist.
    ```json
    {
      "message": "Error: Class section not found with ID: 99"
    }
    ```
*   **Failure Response (500 Internal Server Error):** If an error occurs during Excel generation.

### Export Subject Grades

*   **Endpoint:** `/subject/{id}`
*   **Method:** `GET`
*   **Description:** Exports grades for a specific subject in Excel format.
*   **Authorization:** Requires `ROLE_ADMIN` or `ROLE_TEACHER`.
*   **Path Parameters:**
    *   `id` (number, required): The ID of the subject.
*   **Query Parameters:**
    *   `semesterId` (number, optional): Filter grades by semester.
*   **Success Response (200 OK):**
    *   **Content-Type:** `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
    *   **Content-Disposition:** `attachment; filename=subject_grades_{id}[_semester_{semesterId}].xlsx`
    *   **Body:** The binary Excel file with grades for the subject.
*   **Failure Response (404 Not Found):** If the subject or semester with the given ID doesn't exist.
    ```json
    {
      "message": "Error: Subject not found with ID: 99"
    }
    ```
*   **Failure Response (500 Internal Server Error):** If an error occurs during Excel generation.

### Export Semester Grades

*   **Endpoint:** `/semester/{id}`
*   **Method:** `GET`
*   **Description:** Exports grades for a specific semester in Excel format.
*   **Authorization:** Requires `ROLE_ADMIN` or `ROLE_TEACHER`.
*   **Path Parameters:**
    *   `id` (number, required): The ID of the semester.
*   **Success Response (200 OK):**
    *   **Content-Type:** `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
    *   **Content-Disposition:** `attachment; filename=semester_grades_{id}.xlsx`
    *   **Body:** The binary Excel file with grades for the semester.
*   **Failure Response (404 Not Found):** If the semester with the given ID doesn't exist.
    ```json
    {
      "message": "Error: Semester not found with ID: 99"
    }
    ```
*   **Failure Response (500 Internal Server Error):** If an error occurs during Excel generation.

### Export All Grades

*   **Endpoint:** `/all`
*   **Method:** `GET`
*   **Description:** Exports all grades in the system in Excel format.
*   **Authorization:** Requires `ROLE_ADMIN`.
*   **Success Response (200 OK):**
    *   **Content-Type:** `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
    *   **Content-Disposition:** `attachment; filename=all_grades.xlsx`
    *   **Body:** The binary Excel file with all grades.
*   **Failure Response (500 Internal Server Error):** If an error occurs during Excel generation.

---

## Statistics

Base Path: `/api/statistics`

Authentication: Varies by endpoint (see individual endpoints).

### Get Student Statistics

*   **Endpoint:** `/student/{id}`
*   **Method:** `GET`
*   **Description:** Retrieves statistical analysis of grades for a specific student.
*   **Authorization:** Requires `ROLE_ADMIN`, `ROLE_TEACHER`, or the student themselves (`ROLE_STUDENT` with matching ID).
*   **Path Parameters:**
    *   `id` (number, required): The ID of the student.
*   **Query Parameters:**
    *   `semesterId` (number, optional): Filter statistics by semester.
*   **Success Response (200 OK):**
    ```json
    {
      "averageScore": 85.5,
      "medianScore": 86.0,
      "minScore": 72.0,
      "maxScore": 98.0,
      "standardDeviation": 7.8,
      "totalGrades": 12,
      "totalStudents": 1,
      "totalSubjects": 4,
      "passingGrades": 12,
      "failingGrades": 0,
      "passingRate": 100.0,
      "gradeDistribution": {
        "A": 5,
        "B": 6,
        "C": 1,
        "D": 0,
        "F": 0
      },
      "subjectAverages": {
        "Mathematics": 88.5,
        "Physics": 82.0,
        "Chemistry": 90.0,
        "Biology": 81.5
      },
      "statisticsType": "student",
      "contextId": 1,
      "contextName": "John Smith",
      "semesterId": 2,
      "semesterName": "Spring 2025"
    }
    ```
*   **Failure Response (404 Not Found):** If the student with the given ID doesn't exist.
    ```json
    {
      "message": "Error: Student not found with ID: 99"
    }
    ```
*   **Failure Response (500 Internal Server Error):** If an error occurs during statistics calculation.

### Get Subject Statistics

*   **Endpoint:** `/subject/{id}`
*   **Method:** `GET`
*   **Description:** Retrieves statistical analysis of grades for a specific subject.
*   **Authorization:** Requires `ROLE_ADMIN` or `ROLE_TEACHER`.
*   **Path Parameters:**
    *   `id` (number, required): The ID of the subject.
*   **Query Parameters:**
    *   `semesterId` (number, optional): Filter statistics by semester.
*   **Success Response (200 OK):**
    ```json
    {
      "averageScore": 82.3,
      "medianScore": 84.0,
      "minScore": 55.0,
      "maxScore": 98.0,
      "standardDeviation": 10.2,
      "totalGrades": 45,
      "totalStudents": 25,
      "totalSubjects": 1,
      "passingGrades": 42,
      "failingGrades": 3,
      "passingRate": 93.3,
      "gradeDistribution": {
        "A": 12,
        "B": 18,
        "C": 9,
        "D": 3,
        "F": 3
      },
      "topStudentAverages": {
        "John Smith": 98.0,
        "Jane Doe": 95.5,
        "Alex Johnson": 92.0,
        "Maria Garcia": 91.0,
        "Sam Lee": 90.5
      },
      "statisticsType": "subject",
      "contextId": 1,
      "contextName": "Mathematics",
      "semesterId": 2,
      "semesterName": "Spring 2025"
    }
    ```
*   **Failure Response (404 Not Found):** If the subject with the given ID doesn't exist.
    ```json
    {
      "message": "Error: Subject not found with ID: 99"
    }
    ```
*   **Failure Response (500 Internal Server Error):** If an error occurs during statistics calculation.

### Get Class Statistics

*   **Endpoint:** `/class/{id}`
*   **Method:** `GET`
*   **Description:** Retrieves statistical analysis of grades for a specific class.
*   **Authorization:** Requires `ROLE_ADMIN` or the teacher assigned to the class (`ROLE_TEACHER` with matching class assignment).
*   **Path Parameters:**
    *   `id` (number, required): The ID of the class.
*   **Success Response (200 OK):**
    ```json
    {
      "averageScore": 79.8,
      "medianScore": 81.5,
      "minScore": 58.0,
      "maxScore": 97.0,
      "standardDeviation": 9.7,
      "totalGrades": 30,
      "totalStudents": 30,
      "totalSubjects": 1,
      "passingGrades": 27,
      "failingGrades": 3,
      "passingRate": 90.0,
      "gradeDistribution": {
        "A": 8,
        "B": 12,
        "C": 5,
        "D": 2,
        "F": 3
      },
      "topStudentAverages": {
        "John Smith": 97.0,
        "Jane Doe": 94.0,
        "Alex Johnson": 91.5,
        "Maria Garcia": 89.0,
        "Sam Lee": 87.5
      },
      "statisticsType": "class",
      "contextId": 1,
      "contextName": "Mathematics (Spring 2025)",
      "semesterId": 2,
      "semesterName": "Spring 2025"
    }
    ```
*   **Failure Response (404 Not Found):** If the class with the given ID doesn't exist.
    ```json
    {
      "message": "Error: Class section not found with ID: 99"
    }
    ```
*   **Failure Response (500 Internal Server Error):** If an error occurs during statistics calculation.

### Get Semester Statistics

*   **Endpoint:** `/semester/{id}`
*   **Method:** `GET`
*   **Description:** Retrieves statistical analysis of grades for a specific semester.
*   **Authorization:** Requires `ROLE_ADMIN` or `ROLE_TEACHER`.
*   **Path Parameters:**
    *   `id` (number, required): The ID of the semester.
*   **Success Response (200 OK):**
    ```json
    {
      "averageScore": 80.2,
      "medianScore": 82.0,
      "minScore": 45.0,
      "maxScore": 100.0,
      "standardDeviation": 11.3,
      "totalGrades": 250,
      "totalStudents": 120,
      "totalSubjects": 8,
      "passingGrades": 230,
      "failingGrades": 20,
      "passingRate": 92.0,
      "gradeDistribution": {
        "A": 65,
        "B": 95,
        "C": 50,
        "D": 20,
        "F": 20
      },
      "subjectAverages": {
        "Mathematics": 78.5,
        "Physics": 76.2,
        "Chemistry": 82.4,
        "Biology": 81.7,
        "History": 84.3,
        "Literature": 85.1,
        "Computer Science": 79.8,
        "Art": 88.2
      },
      "topStudentAverages": {
        "John Smith": 96.5,
        "Jane Doe": 95.2,
        "Alex Johnson": 94.8,
        "Maria Garcia": 93.7,
        "Sam Lee": 93.1
      },
      "statisticsType": "semester",
      "contextId": 2,
      "contextName": "Spring 2025",
      "semesterId": 2,
      "semesterName": "Spring 2025"
    }
    ```
*   **Failure Response (404 Not Found):** If the semester with the given ID doesn't exist.
    ```json
    {
      "message": "Error: Semester not found with ID: 99"
    }
    ```
*   **Failure Response (500 Internal Server Error):** If an error occurs during statistics calculation.

### Get Overall Statistics

*   **Endpoint:** `/overall`
*   **Method:** `GET`
*   **Description:** Retrieves overall statistical analysis of all grades in the system.
*   **Authorization:** Requires `ROLE_ADMIN`.
*   **Success Response (200 OK):**
    ```json
    {
      "averageScore": 81.7,
      "medianScore": 83.0,
      "minScore": 35.0,
      "maxScore": 100.0,
      "standardDeviation": 12.1,
      "totalGrades": 1250,
      "totalStudents": 350,
      "totalSubjects": 12,
      "passingGrades": 1175,
      "failingGrades": 75,
      "passingRate": 94.0,
      "gradeDistribution": {
        "A": 325,
        "B": 475,
        "C": 275,
        "D": 100,
        "F": 75
      },
      "subjectAverages": {
        "Mathematics": 79.2,
        "Physics": 77.5,
        "Chemistry": 80.8,
        "Biology": 82.3,
        "History": 83.7,
        "Literature": 84.9,
        "Computer Science": 81.2,
        "Art": 87.5,
        "Physical Education": 90.1,
        "Economics": 78.3,
        "Psychology": 85.2,
        "Foreign Language": 82.9
      },
      "topStudentAverages": {
        "John Smith": 97.2,
        "Jane Doe": 96.8,
        "Alex Johnson": 96.3,
        "Maria Garcia": 95.9,
        "Sam Lee": 95.4
      },
      "statisticsType": "overall",
      "contextId": null,
      "contextName": "Overall System Statistics",
      "semesterId": null,
      "semesterName": null
    }
    ```
*   **Failure Response (500 Internal Server Error):** If an error occurs during statistics calculation.

## User Profile Management

### Get Current User Profile

*   **Endpoint:** `/api/users/profile`
*   **Method:** `GET`
*   **Description:** Returns the profile information of the currently authenticated user.
*   **Authorization:** Requires any authenticated user.
*   **Success Response (200 OK):**
    ```json
    {
      "id": 1,
      "username": "john.doe",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "STUDENT"
    }
    ```
*   **Failure Response (401 Unauthorized):** If the user is not authenticated.
    ```json
    {
      "message": "Error: Not authenticated"
    }
    ```
*   **Failure Response (404 Not Found):** If the user profile cannot be found.
    ```json
    {
      "message": "Error: User not found"
    }
    ```

### Get User Profile by ID

*   **Endpoint:** `/api/users/{id}`
*   **Method:** `GET`
*   **Description:** Returns the profile information of a user by their ID. Only accessible by admins or the user themselves.
*   **Authorization:** Requires `ROLE_ADMIN` or the authenticated user must match the requested user ID.
*   **Path Parameters:**
    *   `id` (number, required): The ID of the user.
*   **Success Response (200 OK):**
    ```json
    {
      "id": 1,
      "username": "john.doe",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "STUDENT"
    }
    ```
*   **Failure Response (403 Forbidden):** If the user is not authorized to view this profile.
    ```json
    {
      "message": "Access Denied"
    }
    ```
*   **Failure Response (404 Not Found):** If the user profile cannot be found.
    ```json
    {
      "message": "Error: User not found"
    }
    ```

### Update User Profile

*   **Endpoint:** `/api/users/{id}`
*   **Method:** `PUT`
*   **Description:** Updates the profile information of a user. Only accessible by admins or the user themselves.
*   **Authorization:** Requires `ROLE_ADMIN` or the authenticated user must match the requested user ID.
*   **Path Parameters:**
    *   `id` (number, required): The ID of the user to update.
*   **Request Body:**
    ```json
    {
      "firstName": "Updated First Name",
      "lastName": "Updated Last Name",
      "email": "updated.email@example.com",
      "role": "STUDENT"
    }
    ```
    *   `firstName` (string, required): The user's updated first name.
    *   `lastName` (string, required): The user's updated last name.
    *   `email` (string, required): The user's updated email address.
    *   `role` (string, required): The user's role (STUDENT, TEACHER, or ADMIN). Note: Role changes may be restricted to admins only.
*   **Success Response (200 OK):**
    ```json
    {
      "id": 1,
      "username": "john.doe",
      "firstName": "Updated First Name",
      "lastName": "Updated Last Name",
      "email": "updated.email@example.com",
      "role": "STUDENT"
    }
    ```
*   **Failure Response (400 Bad Request):** If validation fails or email is already in use.
    ```json
    {
      "message": "Error: Email is already in use by another account!"
    }
    ```
*   **Failure Response (403 Forbidden):** If the user is not authorized to update this profile.
    ```json
    {
      "message": "Access Denied"
    }
    ```
*   **Failure Response (404 Not Found):** If the user profile cannot be found.
    ```json
    {
      "message": "Error: User not found"
    }
    ```

### Change Password

*   **Endpoint:** `/api/users/{id}/change-password`
*   **Method:** `POST`
*   **Description:** Changes the password of a user. Only accessible by admins or the user themselves.
*   **Authorization:** Requires `ROLE_ADMIN` or the authenticated user must match the requested user ID.
*   **Path Parameters:**
    *   `id` (number, required): The ID of the user to change password for.
*   **Request Body:**
    ```json
    {
      "currentPassword": "current-password",
      "newPassword": "new-password",
      "confirmPassword": "new-password"
    }
    ```
    *   `currentPassword` (string, required): The user's current password for verification.
    *   `newPassword` (string, required): The new password to set. Must be at least 8 characters long.
    *   `confirmPassword` (string, required): Confirmation of the new password. Must match `newPassword`.
*   **Success Response (200 OK):**
    ```json
    {
      "message": "Password changed successfully"
    }
    ```
*   **Failure Response (400 Bad Request):** If passwords don't match or current password is incorrect.
    ```json
    {
      "message": "Error: New password and confirm password do not match"
    }
    ```
    Or
    ```json
    {
      "message": "Error: Current password is incorrect or user not found"
    }
    ```
*   **Failure Response (403 Forbidden):** If the user is not authorized to change this user's password.
    ```json
    {
      "message": "Access Denied"
    }
    ```