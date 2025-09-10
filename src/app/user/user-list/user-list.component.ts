import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  phone: string;
  country: string;
  city: string;
  institute: string;
  department: string;
  qualification: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  searchName = '';
  // searchEmail = '';

  users: User[] = [
    { id: 1, username: 'jdoe',   name: 'John Doe',    email: 'john@example.com',           age: 30, gender: 'male',   phone: '555-0100', country: 'United States', city: 'New York',    institute: 'MIT',             department: 'Computer Science',     qualification: 'PhD' },
    { id: 2, username: 'asmith', name: 'Alice Smith', email: 'alice@example.co.uk',        age: 28, gender: 'female', phone: '555-0101', country: 'United Kingdom', city: 'London',      institute: 'Oxford',          department: 'Mathematics',         qualification: 'MSc' },
    { id: 3, username: 'alice',  name: 'Ben Chan',    email: 'alice.chan@example.com',       age: 32, gender: 'male',   phone: '555-0102', country: 'Singapore',      city: 'Singapore',   institute: 'NUS',             department: 'Engineering',         qualification: 'BEng' },
    { id: 4, username: 'mgarcia',name: 'Maria Garcia',email: 'maria.g@example.mx',         age: 29, gender: 'female', phone: '555-0103', country: 'Mexico',         city: 'Mexico City', institute: 'UNAM',           department: 'Biology',            qualification: 'BSc' },
    { id: 5, username: 'kpatil', name: 'Kiran Patil', email: 'kiran.patil@example.in',      age: 35, gender: 'male',   phone: '555-0104', country: 'India',          city: 'Mumbai',      institute: 'IIT Bombay',      department: 'Electrical Engineering', qualification: 'MTech' },
    { id: 6, username: 'lrossi', name: 'Luca Rossi',  email: 'l.rossi@example.it',         age: 31, gender: 'male',   phone: '555-0105', country: 'Italy',          city: 'Rome',        institute: 'Sapienza',        department: 'Architecture',        qualification: 'MArch' },
    { id: 7, username: 'ywang',  name: 'Ying Wang',   email: 'ying.wang@example.cn',       age: 27, gender: 'female', phone: '555-0106', country: 'China',          city: 'Shanghai',    institute: 'Fudan University', department: 'Economics',           qualification: 'BA' },
    { id: 8, username: 'oabebe', name: 'Ola Abebe',   email: 'ola.abebe@example.ng',       age: 33, gender: 'male',   phone: '555-0107', country: 'Nigeria',        city: 'Lagos',       institute: 'UNILAG',          department: 'Business',            qualification: 'MBA' },
    { id: 9, username: 'tnguyen',name: 'Thanh Nguyen',email: 'thanh.nguyen@example.vn',    age: 26, gender: 'male',   phone: '555-0108', country: 'Vietnam',        city: 'Hanoi',       institute: 'VNU',             department: 'Computer Science',     qualification: 'BSc' },
    { id:10, username: 'sivanov',name: 'Sergei Ivanov',email: 's.ivanov@example.ru',       age: 34, gender: 'male',   phone: '555-0109', country: 'Russia',         city: 'Moscow',      institute: 'MSU',             department: 'Physics',             qualification: 'PhD' }
  ];

  get filteredUsers(): User[] {
    const name = this.searchName.trim().toLowerCase();
    return this.users.filter(u => {
      const matchesName = !name || u.name.toLowerCase().includes(name) || u.username.toLowerCase().includes(name) || u.email.toLowerCase().includes(name);
      return matchesName;
    });
  }

  onDelete(email: string){
    console.log("userDeleted");
  }
}
