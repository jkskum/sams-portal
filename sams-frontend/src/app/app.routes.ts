import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { UserCreateEditComponent } from './user/user-create-edit/user-create-edit.component';
import { UserListComponent } from './user/user-list/user-list.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    },
    {
        path: 'auth/login',
        component: LoginComponent
    },
    {
        path: 'user/user-create-edit',
        component: UserCreateEditComponent
    },
    {
        path: 'user/user-create-edit/:id',
        component: UserCreateEditComponent
    },
    {
        path: 'user/user-list',
        component: UserListComponent
    }
];
