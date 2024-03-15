<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdvertisementSportTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('advertisement_sport', function (Blueprint $table) {
            $table->id();
            $table->foreignId('advertisement_id')
                ->nullable()
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('sport_id')
                ->nullable()
                ->constrained()
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('advertisement_items');
    }
}
