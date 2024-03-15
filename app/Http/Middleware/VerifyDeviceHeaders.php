<?php

namespace App\Http\Middleware;



use Closure;
use Illuminate\Http\Request;

class VerifyDeviceHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->hasHeader('lang') && ($request->is('api/*') || $request->is('front/v1/*'))) {
            $lang = $request->header('lang');
            if (!in_array($lang, ['ru','uz','oz'])) {
                $lang = 'uz';
            }
            app()->setLocale($lang);
            //change language by header
            config()->set('app.locale', $lang);
        }

        return $next($request);
    }
}
