<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDistrictsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('districts', function (Blueprint $table) {
            $table->id();
            $table->string('name_uz');
            $table->string('name_oz');
            $table->string('name_ru');
            $table->foreignId('region_id')->constrained();//->nullOnDelete();
            $table->unsignedBigInteger('position')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
        Schema::create('quarters', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('district_id')->constrained();//->nullOnDelete();
            $table->timestamps();
        });
        Schema::create('villages', function (Blueprint $table) {
            $table->id();
            $table->string('name_uz');
            $table->string('name_oz');
            $table->string('name_ru');
            $table->foreignId('district_id')->constrained();//->nullOnDelete();
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
        Schema::dropIfExists('districts');
    }
}
