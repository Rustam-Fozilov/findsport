<?php

/**
 * Created by Maxamadjonov J.
 * User: Jaxongir
 * Date: 21.01.2021
 */

namespace App\Services\Sms;

use GuzzleHttp\Client;

class SendService
{
    public $baseUrl;
    private $token;
    private $tokenLifetime;
    private $client;
    private $email;
    private $password;

    public function __construct()
    {
      /*  $this->loadConfig();
        $this->client = new Client([
            'base_uri' => $this->baseUrl
        ]);
        $this->login();*/
    }

    private function loadConfig()
    {
        $this->baseUrl = config('sms.api_url');
        $this->email = config('sms.email');
        $this->tokenLifetime = config('sms.token_lifetime');
        $this->password = config('sms.password');
        $this->token = config('sms.token');
    }

    private function login()
    {
        $this->token = cache()->remember('sms_auth_token', $this->tokenLifetime, function () {
            $res = $this->sendRequest('POST', 'auth/login', [
                'form_params' => [
                    'email' => $this->email,
                    'password' => $this->password
                ]
            ]);
            return $res['data']['token'];
        });

    }

    private function sendRequest($method, $uri, $options = [])
    {
        if ($this->token) {
            $options['headers']['Authorization'] = "Bearer {$this->token}";
        }

        if (in_array($method, ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'])) {
            $res = $this->client->request($method, $uri, $options);
            if ($res->getStatusCode() === 200) {
                return json_decode($res->getBody()->getContents(), true);
            }
            throw new \Exception('Bad status code on response');
        } else {
            throw new \Exception('Method not found');
        }
    }

    public function sendSMS($phone, $message)
    {
        $res = $this->sendRequest('POST', 'message/sms/send', [
            'form_params' => [
                'mobile_phone' => $phone[0] == '+' ? substr($phone, 1) : $phone,
                'message' => $message,
                //'from' => $this->sender
            ],
        ]);
        $filename = storage_path('app/sms_log.txt');
        if (file_exists($filename))
            $fp = fopen($filename, 'a');
        else {
            $fp = fopen($filename, 'w') or die("Unable to open file!");
            fprintf($fp, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($fp,
                ['ID', 'PHONE', 'DATE', 'MESSAGE']
                , ';');
        }
        fputcsv($fp, [
            $res['message_id'], $res['phone_number'], $res['status_date'], $res['status']], ';');
        fclose($fp);
        return $res;
    }
}
