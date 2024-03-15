<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdvertisementInfrastructureTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('advertisement_infrastructure', function (Blueprint $table) {
            $table->foreignId('advertisement_id')
                ->nullable()
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('infrastructure_id')
                ->nullable()
                ->constrained()
                ->cascadeOnDelete();
            $table->string('status')->nullable();

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
