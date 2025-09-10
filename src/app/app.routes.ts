import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { UserCreateComponent } from './user/user-create/user-create.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';

export const routes: Routes = [
    {
        path: 'auth/login',
        component: LoginComponent
    },
    {
        path: 'user/user-create',
        component: UserCreateComponent
    },
    {
        path: 'user/user-list',
        component: UserListComponent
    },
    {
        path: 'user/user-edit',
        component: UserEditComponent
    }
];
