<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name',64)->nullable();
            $table->string('last_name',64)->nullable();
            $table->date('birthday')->nullable();
            $table->foreignId('district_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->enum('gender',['male','female'])->default('male');
            $table->string('status',20)->default('active');
            $table->string('login',64)->nullable()->unique();
            $table->string('phone',20)->nullable()->unique();
            $table->string('email')->nullable()->unique();
            $table->string('password')->nullable();
            $table->foreignId('role_id')
                ->unsigned()
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->rememberToken();
            $table->timestamp('phone_verified_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
