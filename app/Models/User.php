<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Builder;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasRoles, HasFactory, Notifiable;

    protected $guard_name = 'api';
    
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'firstname',
        'lastname',
        'username',
        'phone',
        'institution',
        'department',
        'address',
        'city',
        'country',
        'lang',
        'picture',
        'deleted',
        'suspended',
        'profile_age',
        'profile_gender',
        'profile_studentid',
        'profile_employeeid',
        'profile_qualification',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'deleted'           => 'boolean',
            'suspended'         => 'boolean',
        ];
    }

    // Optional: hide deleted users by default, like SoftDeletes
    protected static function booted(): void
    {
        static::addGlobalScope('not_deleted', function (Builder $builder) {
            $builder->where('deleted', false);
        }); // exclude flagged users unless explicitly opted-in [9][21]
    }

    // Include deleted users when needed
    public function scopeWithDeletedFlag(Builder $query): Builder
    {
        return $query->withoutGlobalScope('not_deleted'); // bypass scope [6][15]
    }

    // Only deleted users
    public function scopeOnlyDeletedFlag(Builder $query): Builder
    {
        return $query->withoutGlobalScope('not_deleted')->where('deleted', true);
    }
}
