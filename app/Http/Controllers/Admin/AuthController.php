<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\AdminController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;


class AuthController extends AdminController
{
    public function showLoginForm()
    {
        if(auth()->check()){
            return redirect()->route('admin.dashboard');
        }
        return view('auth.login');
    }
    public function sign(Request $request)
    {
        $credentials =  $request->validate([
            'login' => 'required',
            'password' => 'required',
        ]);

        $user = User::query()->where('login', $credentials['login'])->first();
        if(!$user){
            dd('user not');
            return redirect('login')->withErrors('login not');
        }

//        dd($credentials['password']);

        if(Hash::check($credentials['password'], $user->password)){
            Auth::login($user);

            return redirect()->route('admin.dashboard')->withSuccess('logged-in');
        } else {
            dd('false');
            return redirect('login')->withErrors('wrong password');
        }

//        if (Auth::attempt($credentials,true)) {
//            $request->session()->regenerate();
//            dd('success');
//            return redirect()->intended('/admin')
//                ->withSuccess('Logged-in');
//        }
//        return redirect("login")->withErrors('Credentials are wrong.');
    }
    public function logout() {
        Session::flush();
        Auth::logout();
        return Redirect('login');
    }
}

