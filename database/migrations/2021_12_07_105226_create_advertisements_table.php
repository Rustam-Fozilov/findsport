<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdvertisementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('advertisements', function (Blueprint $table) {
            $table->id();
            $table->uuid('ad_id')->nullable();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->string('title_uz')->nullable();
            $table->string('title_ru')->nullable();
            $table->string('title_en')->nullable();
            $table->text('description_uz')->nullable();
            $table->text('description_ru')->nullable();
            $table->text('description_en')->nullable();
            $table->string('ad_type')->nullable();//Maydon,Klub, Seksiyaa
            $table->foreignId('plan_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();;
            $table->string('slug')->nullable();
            $table->unsignedFloat('rate')->nullable();//Рейтинг
            $table->string('location')->nullable();//Геолокация
            $table->text('landmark')->nullable();//Ориентир
            $table->foreignId('district_id')->nullable()->constrained();//Регион
            $table->unsignedBigInteger('price')->nullable();//Цена
            $table->unsignedBigInteger('old_price')->nullable();//Старая цена
            $table->unsignedBigInteger('views')->default(0);//Просмотры
            $table->unsignedBigInteger('calls')->default(0);
            $table->unsignedBigInteger('favorites')->default(0);
            $table->string('status')->default('pending');
            $table->unsignedBigInteger('position')->default(0);
            $table->dateTime('begin_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->string('source')->nullable();
            $table->string('telegram_post_id')->nullable();
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
        Schema::dropIfExists('grounds');
    }
}
