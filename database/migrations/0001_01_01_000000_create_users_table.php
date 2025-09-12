<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Schema::create('users', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('name');
        //     $table->string('email')->unique();
        //     $table->timestamp('email_verified_at')->nullable();
        //     $table->string('password');
        //     $table->rememberToken();
        //     $table->timestamps();
        // });

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            // core auth
            $table->string('name');                 
            $table->string('email')->unique();                    
            $table->timestamp('email_verified_at')->nullable();  
            $table->string('password');    
            // names
            $table->string('firstname')->unique();                          
            $table->string('lastname')->unique();                           
            $table->string('username')->unique();                              
            // contacts
            $table->string('phone')->nullable();                 
            // organization
            $table->string('institution')->nullable();            
            $table->string('department')->nullable();             
            // location
            $table->text('address')->nullable();                  
            $table->string('city', 100)->nullable();            
            $table->string('country', 100)->nullable();           
            // preferences / profile
            $table->string('lang', 10)->default('en');            
            $table->string('picture')->nullable();              
            $table->boolean('deleted')->default(0);              
            $table->boolean('suspended')->default(0);             
            // profile extras
            $table->unsignedTinyInteger('profile_age')->nullable();                 
            $table->enum('profile_gender', ['Male','Female','Other'])->nullable();  
            $table->string('profile_studentid')->nullable();       
            $table->string('profile_employeeid')->nullable();      
            $table->string('profile_qualification')->nullable();   
            // tokens + timestamps
            $table->rememberToken();                               // existing
            $table->timestamps();                                  // created_at / updated_at
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
