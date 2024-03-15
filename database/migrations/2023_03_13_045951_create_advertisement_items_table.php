<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdvertisementItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('advertisement_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('advertisement_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('degree_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->string('ground_size')->nullable();//Длина × Ширина × Высота (м)
            $table->tinyInteger('ground_season_type')->nullable();//Тип
            $table->unsignedSmallInteger('age_begin')->nullable();
            $table->unsignedSmallInteger('age_end')->nullable();
            $table->jsonb('steps')->nullable();
            $table->jsonb('items')->nullable();
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
        Schema::dropIfExists('advertisement_items');
    }
}
