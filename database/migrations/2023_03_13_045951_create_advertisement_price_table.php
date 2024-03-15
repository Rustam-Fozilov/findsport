<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdvertisementPriceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('advertisement_price', function (Blueprint $table) {
            $table->id();
            $table->foreignId('advertisement_id')
                ->nullable()
                ->constrained()
                ->cascadeOnDelete();
            $table->string('name')->nullable();
            $table->unsignedBigInteger('price')->nullable();
            $table->unsignedBigInteger('old_price')->nullable();
            $table->foreignId('price_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->string('status',20)->nullable();
            $table->unsignedBigInteger('position')->default(0);
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
