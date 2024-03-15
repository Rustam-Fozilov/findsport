<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\ApiController;


use App\Services\Favorite\FavoriteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends ApiController
{
    private $service;

    public function __construct(FavoriteService $service)
    {
        $this->service = $service;
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        if ($request->has('advertisement_ids') && is_array($request->advertisement_ids)) {
            foreach ($request->advertisement_ids as $id) {
                $this->service->add([
                    'favorite_type' => 'advertisements',
                    'favorite_id' => $id,
                ]);
            }
            return $this->success(__('messages.success'));
        }

        $data = $request->validate([
            'advertisement_id' => 'required|integer',
        ]);

        $this->service->add([
            'favorite_type' => 'advertisements',
            'favorite_id' => $data['favorite_id'],
        ]);
        return $this->success(__('messages.success'));
    }

    public function delete(Request $request): JsonResponse
    {
        if ($request->has('advertisement_ids') && is_array($request->advertisement_ids)) {
            foreach ($request->advertisement_ids as $id) {
                $this->service->delete([
                    'favorite_type' => 'advertisements',
                    'favorite_id' => $id,
                ]);
            }
            return $this->success(__('messages.success'));
        }

        $data = $request->validate([
            'favorite_id' => 'required|integer',
        ]);

        $this->service->delete([
            'favorite_type' => 'advertisements',
            'favorite_id' => $data['favorite_id'],
        ]);
        return $this->success(__('messages.success'));
    }


}
