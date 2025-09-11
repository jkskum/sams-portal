import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService, User } from '../../service/user-services';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  searchName = '';
  currentPage = 1;
  pageSize = 10;
  users: User[] = [];
  filteredUsers: User[] = [];
  userCount: number = 0;
  userToDelete: User | null = null;
  deletedUserName: string = '';

  // Filter properties
  selectedCountry: string = '';
  selectedDepartment: string = '';
  selectedQualification: string = '';
  selectedInstitute: string = '';

  // Unique values for dropdowns
  uniqueCountries: string[] = [];
  uniqueDepartments: string[] = [];
  uniqueQualifications: string[] = [];
  uniqueInstitutes: string[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.userCount = users.length;
      this.populateFilterOptions();
      this.applyFilter();
    });
  }

  populateFilterOptions() {
    // Extract unique values for filter dropdowns
    this.uniqueCountries = [...new Set(this.users.map(user => user.country).filter(country => country))].sort();
    this.uniqueDepartments = [...new Set(this.users.map(user => user.department).filter(department => department))].sort();
    this.uniqueQualifications = [...new Set(this.users.map(user => user.qualification).filter(qualification => qualification))].sort();
    this.uniqueInstitutes = [...new Set(this.users.map(user => user.institute).filter(institute => institute))].sort();
  }

  applyFilter() {
    let filtered = [...this.users];

    // Apply search filter
    if (this.searchName.trim()) {
      const searchTerm = this.searchName.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }

    // Apply advanced filters
    if (this.selectedCountry) {
      filtered = filtered.filter(user => user.country === this.selectedCountry);
    }
    if (this.selectedDepartment) {
      filtered = filtered.filter(user => user.department === this.selectedDepartment);
    }
    if (this.selectedQualification) {
      filtered = filtered.filter(user => user.qualification === this.selectedQualification);
    }
    if (this.selectedInstitute) {
      filtered = filtered.filter(user => user.institute === this.selectedInstitute);
    }

    this.filteredUsers = filtered;
    this.currentPage = 1; // Reset to first page when filtering
  }

  applyFilters() {
    this.applyFilter();
  }

  clearAllFilters() {
    this.selectedCountry = '';
    this.selectedDepartment = '';
    this.selectedQualification = '';
    this.selectedInstitute = '';
    this.applyFilter();
  }

  hasActiveFilters(): boolean {
    return !!(this.selectedCountry || this.selectedDepartment || this.selectedQualification || this.selectedInstitute);
  }

  onSearchChange() {
    this.applyFilter();
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  setUserToDelete(user: User) {
    this.userToDelete = user;
  }

  confirmDelete() {
    if (this.userToDelete) {
      const userName = this.userToDelete.name;
      this.userService.deleteUser(this.userToDelete.id).subscribe(success => {
        if (success) {
          this.deletedUserName = userName;
          this.showSuccessToast();
          this.loadUsers();
          this.userToDelete = null;
        }
      });
    }
  }

  showSuccessToast() {
    const toastElement = document.getElementById('deleteSuccessToast');
    if (toastElement) {
      const toast = new (window as any).bootstrap.Toast(toastElement);
      toast.show();
    }
  }
}
