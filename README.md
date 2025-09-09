# Student Administration Management System (SAMS)

SAMS is a **comprehensive Student Administration Management System** integrated with **Moodle LMS** for eLearning capabilities.  
The project follows a **modular architecture** and consists of two main components:

- **SAMS-Frontend** → Angular-based UI for students, teachers, and administrators.
- **SAMS-Backend** → Laravel-based API backend with secure authentication and role-based access.

---

# **Project Structure**
```

SAMS/
│── SAMS-Frontend/    # Angular application
│── SAMS-Backend/     # Laravel API backend

````

---

##  **Technologies Used**

### **Frontend (SAMS-Frontend)**
- **Angular CLI**: `19.2.7`
- **Node.js**: `22.17.1`
- **Package Manager (npm)**: `10.9.2`
- **UI Framework**: Angular Material / TailwindCSS (Optional)
- **API Integration**: REST API with JWT Authentication

### **Backend (SAMS-Backend)**
- **Laravel Framework**: `12.28.1`
- **Authentication**: Laravel Passport (OAuth2)
- **Role & Permission Management**: Spatie Laravel Permission
- **Database**: MySQL
- **API**: RESTful API endpoints for SAMS modules (Students, Courses, Attendance, Fees, etc.)
- **Optional**: LDAP for enterprise authentication

---

## ⚙ **System Requirements**
- **PHP**: 8.2+
- **Composer**: Latest version
- **MySQL**: 8.0+
- **Node.js**: v22+
- **NPM**: v10+
- **Angular CLI**: 19+
- **Web Server**: Apache or Nginx
- **OS**: Linux/Windows/Mac

---

## 🚀 **Installation & Setup**

### 1️⃣ **Clone the Repository**
```bash
git clone https://your-repo-url.git
cd SAMS
````

---

### 2️⃣ **Frontend Setup (Angular)**

```bash
cd SAMS-Frontend
npm install
```

#### **Start Development Server**

```bash
ng serve --open
```

> The app will run on: `http://localhost:4200`

---

### 3️⃣ **Backend Setup (Laravel)**

```bash
cd SAMS-Backend
composer install
```

#### **Create Environment File**

```bash
cp .env.example .env
```

Update `.env` with:

```
DB_DATABASE=samsdb
DB_USERNAME=root
DB_PASSWORD=yourpassword
```

#### **Run Migrations**

```bash
php artisan migrate
```

---

### 4️⃣ **Authentication Setup (Passport)**

```bash
php artisan passport:install
```

Add `Passport::routes();` in `AuthServiceProvider.php`.

---

### 5️⃣ **Role & Permission Setup (Spatie)**

```bash
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan migrate
```

Create roles and permissions using a seeder:

```bash
php artisan db:seed --class=RolePermissionSeeder
```

---

### 6️⃣ **Run Laravel Server**

```bash
php artisan serve
```

> API will run on: `http://127.0.0.1:8000`

---

## 🔐 **Authentication Flow**

* **Login API** issues an **OAuth2 access token** via Laravel Passport.
* Angular stores token in **local storage** and uses it for API calls.
* **Role-based access control** is implemented using Spatie.

---

## 🔗 **Integration with Moodle**

* SAMS will communicate with Moodle using **Moodle Web Services API**.
* Sync **students, courses, and enrollment** data between SAMS and Moodle.

---

## 📚 **Modules**

* **Student Management**
* **Course Management**
* **Batch & Attendance**
* **Fees & Finance**
* **Role Management (Admin, Teacher, Student)**
* **Reports & Analytics**
* **Integration with LMS (Moodle)**

---

## 🛡 **Security**

* **OAuth2 Authentication (Passport)**
* **Role-Based Access Control (Spatie)**
* **CSRF & XSS Protection**
* **Optional LDAP Authentication**

---
