<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthenticationController;
use App\Http\Controllers\Api\Users\UsersController;
use Spatie\Permission\Models\Permission;

Route::post('register', [AuthenticationController::class, 'register'])->name('register');
Route::post('login', [AuthenticationController::class, 'login'])->name('login');

Route::get('roles', [UsersController::class, 'listRoles'])->name('roles.index');                  // list all roles (id, name) for guard api 
Route::put('users/{id}/roles', [UsersController::class, 'syncUserRoles'])->name('users.roles.sync'); // replace roles by names or IDs 
Route::post('users/{id}/roles', [UsersController::class, 'addUserRoles'])->name('users.roles.add');   // add roles by name(s) 
Route::delete('users/{id}/roles/{role}', [UsersController::class, 'revokeUserRole'])->name('users.roles.revoke'); // remove one role by name 

//Route::get('users', [UsersController::class, 'index'])->name('user.index');
Route::apiResource('users', UsersController::class);
