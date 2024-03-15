<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMediaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::create('media', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->nullableMorphs('mediable');
            $table->string('type')->nullable();
            $table->string('url');
            $table->string('path');
            $table->string('model');
            $table->string('mime_type');
            $table->unsignedBigInteger('size');
            $table->string('medium_size_url')->nullable();
            $table->string('small_size_url')->nullable();
            $table->string('tg_file_id')->nullable();
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
        Schema::dropIfExists('media');
    }
}
