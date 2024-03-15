<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBotMessagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bot_messages', function (Blueprint $table) {
            $table->bigInteger('from_id')->nullable();
            $table->bigInteger('receiver_id')->nullable();
            $table->bigInteger('forward_from_chat_id')->nullable();
            $table->bigInteger('message_id')->nullable();
            $table->timestamp('date')->nullable();
            $table->timestamp('forward_date')->nullable();
            $table->jsonb('result')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bot_messages');
    }
}
