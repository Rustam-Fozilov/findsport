<?php

namespace App\Services\Telegram;
use GuzzleHttp\Client as HttpClient;

class TgSendService
{
    public static function sendNotification($text, $chat_id, $options = [])
    {
        $options = array_merge([
            'chat_id' => $chat_id,
            'text' => $text
        ], $options);

        return self::sendMessage($options);
    }

    public static function sendMessage(array $options)
    {
       /* if(app()->environment() !== 'production') {
            logger()->channel('slack')
                ->info(app()->environment().' environment\'s telegram notifications', $options);
            return [];
        }*/

        $request = self::createRequest();
        $response = $request->request('GET', 'sendMessage', [
            'query' => $options
        ]);
        return self::parseResponse($response);
    }


    public static function getUpdates(array $options = [])
    {
        $request = self::createRequest();
        $response = $request->request('GET', 'getUpdates', [
            'query' => $options
        ]);
        return self::parseResponse($response);
    }

    private static function createRequest()
    {
        $url = config('services.telegram.url') . 'bot' . config('services.telegram.bot_token') . '/';
        return new HttpClient([
            'base_uri' => $url,
        ]);
    }

    protected static function parseResponse($response)
    {
        return json_decode($response->getBody()->getContents(), true);
    }
}
