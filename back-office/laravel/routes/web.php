<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SpotController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get(
    '/api/user',
    [
        UserController::class, 'list'
    ]

);

Route::get(
    '/api/user/{id}',
    [
        UserController::class, 'item'
    ]

);

Route::get(
    '/api/spots',
    [
        SpotController::class, 'list'
    ]
);

Route::get(
    '/api/spots/{id}',
    [
        SpotController::class, 'item'
    ]
);