import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  age: number;
  gender: string;
  phone: string;
  country: string;
  city: string;
  institute: string;
  department: string;
  qualification: string;
  language?: string;
  address?: string;
  profilePicture?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = [
    { id: 1, username: 'jdoe',   name: 'John Doe',    email: 'john@example.com', role: 'admin', age: 30, gender: 'male',   phone: '555-0100', country: 'United States', city: 'New York',    institute: 'MIT',             department: 'Computer Science',     qualification: 'PhD' },
    { id: 2, username: 'asmith', name: 'Alice Smith', email: 'alice@example.co.uk', role: 'student', age: 28, gender: 'female', phone: '555-0101', country: 'United Kingdom', city: 'London',      institute: 'Oxford',          department: 'Mathematics',         qualification: 'MSc' },
    { id: 3, username: 'alice',  name: 'Ben Chan',    email: 'alice.chan@example.com', role: 'student', age: 32, gender: 'male',   phone: '555-0102', country: 'Singapore',      city: 'Singapore',   institute: 'NUS',             department: 'Engineering',         qualification: 'BEng' },
    { id: 4, username: 'mgarcia',name: 'Maria Garcia',email: 'maria.g@example.mx', role: 'student', age: 29, gender: 'female', phone: '555-0103', country: 'Mexico',         city: 'Mexico City', institute: 'UNAM',           department: 'Biology',            qualification: 'BSc' },
    { id: 5, username: 'kpatil', name: 'Kiran Patil', email: 'kiran.patil@example.in', role: 'student', age: 35, gender: 'male',   phone: '555-0104', country: 'India',          city: 'Mumbai',      institute: 'IIT Bombay',      department: 'Electrical Engineering', qualification: 'MTech' },
    { id: 6, username: 'lrossi', name: 'Luca Rossi',  email: 'l.rossi@example.it', role: 'student', age: 31, gender: 'male',   phone: '555-0105', country: 'Italy',          city: 'Rome',        institute: 'Sapienza',        department: 'Architecture',        qualification: 'MArch' },
    { id: 7, username: 'ywang',  name: 'Ying Wang',   email: 'ying.wang@example.cn', role: 'student', age: 27, gender: 'female', phone: '555-0106', country: 'China',          city: 'Shanghai',    institute: 'Fudan University', department: 'Economics',           qualification: 'BA' },
    { id: 8, username: 'oabebe', name: 'Ola Abebe',   email: 'ola.abebe@example.ng', role: 'teacher', age: 33, gender: 'male',   phone: '555-0107', country: 'Nigeria',        city: 'Lagos',       institute: 'UNILAG',          department: 'Business',            qualification: 'MBA' },
    { id: 9, username: 'tnguyen',name: 'Thanh Nguyen',email: 'thanh.nguyen@example.vn', role: 'teacher', age: 26, gender: 'male',   phone: '555-0108', country: 'Vietnam',        city: 'Hanoi',       institute: 'VNU',             department: 'Computer Science',     qualification: 'BSc' },
    { id:10, username: 'sivanov',name: 'Sergei Ivanov',email: 's.ivanov@example.ru', role: 'teacher', age: 34, gender: 'male',   phone: '555-0109', country: 'Russia',         city: 'Moscow',      institute: 'MSU',             department: 'Physics',             qualification: 'PhD' },
    { id:11, username: 'jkim', name: 'Jin Kim', email: 'jin.kim@example.kr', role: 'teacher', age: 29, gender: 'female', phone: '555-0110', country: 'South Korea', city: 'Seoul', institute: 'SNU', department: 'Chemistry', qualification: 'MSc' },
    { id:12, username: 'fdupont', name: 'François Dupont', email: 'francois.dupont@example.fr', role: 'teacher', age: 36, gender: 'male', phone: '555-0111', country: 'France', city: 'Paris', institute: 'Sorbonne', department: 'History', qualification: 'PhD' },
    { id:13, username: 'jwilson', name: 'Jessica Wilson', email: 'jessica.wilson@example.ca', role: 'teacher', age: 31, gender: 'female', phone: '555-0112', country: 'Canada', city: 'Toronto', institute: 'UofT', department: 'Psychology', qualification: 'MA' },
    { id:14, username: 'mfernandez', name: 'Miguel Fernandez', email: 'miguel.fernandez@example.es', role: 'teacher', age: 28, gender: 'male', phone: '555-0113', country: 'Spain', city: 'Madrid', institute: 'UCM', department: 'Law', qualification: 'LLM' },
    { id:15, username: 'hlee', name: 'Hannah Lee', email: 'hannah.lee@example.au', role: 'teacher', age: 27, gender: 'female', phone: '555-0114', country: 'Australia', city: 'Sydney', institute: 'USyd', department: 'Medicine', qualification: 'MBBS' },
    { id:16, username: 'rsmith', name: 'Robert Smith', email: 'robert.smith@example.za', role: 'manager', age: 32, gender: 'male', phone: '555-0115', country: 'South Africa', city: 'Cape Town', institute: 'UCT', department: 'Geology', qualification: 'MSc' },
    { id:17, username: 'lchan', name: 'Linda Chan', email: 'linda.chan@example.hk', role: 'manager', age: 30, gender: 'female', phone: '555-0116', country: 'Hong Kong', city: 'Hong Kong', institute: 'HKU', department: 'Finance', qualification: 'MBA' },
    { id:18, username: 'pnovak', name: 'Petr Novak', email: 'petr.novak@example.cz', role: 'manager', age: 33, gender: 'male', phone: '555-0117', country: 'Czech Republic', city: 'Prague', institute: 'Charles University', department: 'Mathematics', qualification: 'PhD' },
    { id:19, username: 'aali', name: 'Aisha Ali', email: 'aisha.ali@example.pk', role: 'manager', age: 26, gender: 'female', phone: '555-0118', country: 'Pakistan', city: 'Karachi', institute: 'KU', department: 'English', qualification: 'MA' },
    { id:20, username: 'djohnson', name: 'David Johnson', email: 'david.johnson@example.us', role: 'manager', age: 35, gender: 'male', phone: '555-0119', country: 'United States', city: 'Chicago', institute: 'UChicago', department: 'Political Science', qualification: 'PhD' },
    { id:21, username: 'mnguyen', name: 'Minh Nguyen', email: 'minh.nguyen@example.vn', role: 'manager', age: 28, gender: 'male', phone: '555-0120', country: 'Vietnam', city: 'Ho Chi Minh City', institute: 'HCMUT', department: 'Mechanical Engineering', qualification: 'MEng' },
    { id:22, username: 'srodriguez', name: 'Sofia Rodriguez', email: 'sofia.rodriguez@example.ar', role: 'manager', age: 27, gender: 'female', phone: '555-0121', country: 'Argentina', city: 'Buenos Aires', institute: 'UBA', department: 'Sociology', qualification: 'BA' },
    { id:23, username: 'jgreen', name: 'James Green', email: 'james.green@example.ie', role: 'student', age: 34, gender: 'male', phone: '555-0122', country: 'Ireland', city: 'Dublin', institute: 'Trinity College', department: 'Philosophy', qualification: 'PhD' },
    { id:24, username: 'kumar', name: 'Priya Kumar', email: 'priya.kumar@example.in', role: 'student', age: 29, gender: 'female', phone: '555-0123', country: 'India', city: 'Delhi', institute: 'DU', department: 'Physics', qualification: 'MSc' },
    { id:25, username: 'bwhite', name: 'Brian White', email: 'brian.white@example.nz', role: 'student', age: 32, gender: 'male', phone: '555-0124', country: 'New Zealand', city: 'Auckland', institute: 'UoA', department: 'Computer Science', qualification: 'BSc' },
    { id:26, username: 'tgarcia', name: 'Teresa Garcia', email: 'teresa.garcia@example.mx', role: 'student', age: 31, gender: 'female', phone: '555-0125', country: 'Mexico', city: 'Guadalajara', institute: 'ITESO', department: 'Business', qualification: 'MBA' },
    { id:27, username: 'jmartin', name: 'Juan Martin', email: 'juan.martin@example.es', role: 'admin', age: 28, gender: 'male', phone: '555-0126', country: 'Spain', city: 'Barcelona', institute: 'UB', department: 'Architecture', qualification: 'MArch' },
    { id:28, username: 'cwilson', name: 'Carol Wilson', email: 'carol.wilson@example.ca', role: 'admin', age: 27, gender: 'female', phone: '555-0127', country: 'Canada', city: 'Vancouver', institute: 'UBC', department: 'Biology', qualification: 'BSc' },
    { id:29, username: 'rjones', name: 'Rachel Jones', email: 'rachel.jones@example.uk', role: 'admin', age: 30, gender: 'female', phone: '555-0128', country: 'United Kingdom', city: 'Manchester', institute: 'Manchester', department: 'Law', qualification: 'LLB' },
    { id:30, username: 'gschmidt', name: 'Gerd Schmidt', email: 'gerd.schmidt@example.de', role: 'admin', age: 33, gender: 'male', phone: '555-0129', country: 'Germany', city: 'Berlin', institute: 'HU Berlin', department: 'Engineering', qualification: 'Dipl.-Ing.' },
    { id:31, username: 'lpetrov', name: 'Lena Petrov', email: 'lena.petrov@example.ru', role: 'admin', age: 29, gender: 'female', phone: '555-0130', country: 'Russia', city: 'Saint Petersburg', institute: 'SPbU', department: 'History', qualification: 'MA' },
    { id:32, username: 'mcarter', name: 'Mark Carter', email: 'mark.carter@example.us', role: 'admin', age: 34, gender: 'male', phone: '555-0131', country: 'United States', city: 'San Francisco', institute: 'Stanford', department: 'Economics', qualification: 'PhD' },
    { id:33, username: 'snguyen', name: 'Samantha Nguyen', email: 'samantha.nguyen@example.vn', role: 'admin', age: 28, gender: 'female', phone: '555-0132', country: 'Vietnam', city: 'Da Nang', institute: 'DNU', department: 'Chemistry', qualification: 'MSc' },
    { id:34, username: 'jkim2', name: 'Jae Kim', email: 'jae.kim@example.kr', role: 'admin', age: 31, gender: 'male', phone: '555-0133', country: 'South Korea', city: 'Busan', institute: 'PNU', department: 'Computer Science', qualification: 'BSc' },
    { id:35, username: 'mlopez', name: 'Miguel Lopez', email: 'miguel.lopez@example.ar', role: 'admin', age: 32, gender: 'male', phone: '555-0134', country: 'Argentina', city: 'Cordoba', institute: 'UNC', department: 'Medicine', qualification: 'MD' }
  ];

  // Get all users
  getUsers(): Observable<User[]> {
    return of(this.users);
  }

  // Get user by ID
  getUserById(id: number): Observable<User | undefined> {
    const user = this.users.find(u => u.id === id);
    return of(user);
  }

  // Create new user
  createUser(user: Omit<User, 'id'>): Observable<User> {
    const newUser: User = {
      ...user,
      id: Math.max(...this.users.map(u => u.id)) + 1
    };
    this.users.push(newUser);
    return of(newUser);
  }

  // Update existing user
  updateUser(id: number, updates: Partial<User>): Observable<User | null> {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updates };
      return of(this.users[index]);
    }
    return of(null);
  }

  // Delete user
  deleteUser(id: number): Observable<boolean> {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  // Search users by name, username, or email
  searchUsers(query: string): Observable<User[]> {
    if (!query.trim()) {
      return this.getUsers();
    }
    
    const searchTerm = query.toLowerCase().trim();
    const filtered = this.users.filter(u => 
      u.name.toLowerCase().includes(searchTerm) ||
      u.username.toLowerCase().includes(searchTerm) ||
      u.email.toLowerCase().includes(searchTerm)
    );
    
    return of(filtered);
  }
}