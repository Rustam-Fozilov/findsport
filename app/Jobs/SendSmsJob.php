<?php

namespace App\Jobs;

use App\Models\SmsConfirm;
use App\Services\Sms\SendService;
use App\Services\Telegram\TgSendService;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Throwable;

class SendSmsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public SmsConfirm $smsConfirm;
    public $type;
    public int $tries = 3;

    /**
     * Create a new job instance.
     *
     * @param SmsConfirm $smsConfirm
     */
    public function __construct(SmsConfirm $smsConfirm, $type = 'sms')
    {
        $this->smsConfirm = $smsConfirm;
        $this->type = $type;
    }

    /**
     * Execute the job.
     *
     * @param SendService $smsService
     * @return void
     */
    public function handle(SendService $smsService,TgSendService $tgSendService): void
    {
        $message='Findsport:Ваш код - ' . $this->smsConfirm->code . PHP_EOL;
           // . '.Код действителен до ' . $this->smsConfirm->expired_at->format('Y-m-d H:i') . PHP_EOL
           // . 'В случае возникновения вопросов, свяжитесь пожалуйста по номеру +998781488008';
        if ($this->type === 'sms') {
            $smsService->sendSMS($this->smsConfirm->phone, $message);
        }else
        {
            $tgSendService->sendNotification($message,$this->smsConfirm->chat_id);
        }
    }
}
