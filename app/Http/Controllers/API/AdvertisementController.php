<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\ApiController;
use App\Http\Requests\Api\Advertisement\CreateAdvertisementRequest;
use App\Http\Requests\Api\Advertisement\UpdateAdvertisementRequest;
use App\Http\Requests\Api\SearchRequest;
use App\Models\Advertisement;
use App\Models\Infrastructure;
use App\Models\Sport;
use App\Resources\API\PaginationResourceCollection;
use App\Resources\API\v1\AdvertisementResource;
use App\Resources\API\v1\AdvertisementShowResource;
use App\Resources\API\v1\InfrastructureResource;
use App\Resources\API\v1\SearchResource;
use App\Resources\API\v1\SportResource;
use App\Services\Advertisement\AdvertisementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdvertisementController extends ApiController
{
    private $service;

    public function __construct(AdvertisementService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request): JsonResponse
    {
        $advertisements = $this->service->all(
            limit: $request->query('limit', 5),
            listBy: $request->query('listBy', 'latest'),
        );
        return $this->success(__('messages.success'), new PaginationResourceCollection($advertisements, AdvertisementResource::class));
    }

    public function best_ads(Request $request): JsonResponse
    {
        $advertisements = $this->service->all(
            limit: $request->query('limit', 5),
            listBy: $request->query('listBy', 'latest'),
            plan: 1
        );
        return $this->success(__('messages.success'), new PaginationResourceCollection($advertisements, AdvertisementResource::class));
    }

    public function all(Request $request): JsonResponse
    {
        $advertisements = $this->service->all(
            limit: $request->query('limit', 5),
            listBy: $request->query('listBy', 'latest'),
        );

        return $this->success(__('messages.success'),
            new PaginationResourceCollection($advertisements, AdvertisementResource::class),
            [
                'sports' => SportResource::collection(Sport::query()->get()),
                'ads_type' => ['grounds', 'sections', 'clubs']
            ]
        );
    }

    public function grounds(Request $request): JsonResponse
    {
        $advertisements = $this->service->all(
            limit: $request->query('limit', 5),
            listBy: $request->query('listBy', 'latest'),
            search_query: $request->query('search_query'),
            latitude: $request->query('latitude'),
            longitude: $request->query('longitude'),
            ad_type: 'ground'
        );
        return $this->success(__('messages.success'),
            new PaginationResourceCollection($advertisements, AdvertisementResource::class),
            [
                'sports' => SportResource::collection(Sport::query()->get()),
                'infrastructure' => InfrastructureResource::collection(Infrastructure::query()->get())
            ]
        );
    }

    public function sections(Request $request): JsonResponse
    {
        $advertisements = $this->service->all(
            limit: $request->query('limit', 5),
            listBy: $request->query('listBy', 'latest'),
            search_query: $request->query('search_query'),
            latitude: $request->query('latitude'),
            longitude: $request->query('longitude'),
            ad_type: 'sections'
        );
        return $this->success(__('messages.success'), new PaginationResourceCollection($advertisements, AdvertisementResource::class));
    }

    public function clubs(Request $request): JsonResponse
    {
        $advertisements = $this->service->all(
            limit: $request->query('limit', 5),
            listBy: $request->query('listBy', 'latest'),
            search_query: $request->query('search_query'),
            latitude: $request->query('latitude'),
            longitude: $request->query('longitude'),
            ad_type: 'club'
        );
        return $this->success(__('messages.success'), new PaginationResourceCollection($advertisements, AdvertisementResource::class));
    }

    public function getMyClubs(Request $request): JsonResponse
    {
        $advertisements = $this->service->my(
            limit: $request->query('limit', 5),
            listBy: $request->query('listBy', 'latest'),
            search_query: $request->query('search_query'),
            latitude: $request->query('latitude'),
            longitude: $request->query('longitude'),
            ad_type: 'club'
        );
        return $this->success(__('messages.success'), new PaginationResourceCollection($advertisements, AdvertisementResource::class));
    }

    public function like_ads(Request $request): JsonResponse
    {
        $advertisements = $this->service->all(
            limit: $request->query('limit', 5),
            listBy: $request->query('listBy', 'latest'),
            search_query: $request->query('search_query'),
            latitude: $request->query('latitude'),
            longitude: $request->query('longitude'),
            getFavourites: true
        );
        return $this->success(__('messages.success'), new PaginationResourceCollection($advertisements, AdvertisementResource::class));
    }


    public function show(Request $request, Advertisement $advertisement)
    {
//        $advertisement->increment('views');
        $advertisement->with('infrastructure', 'sports', 'ad_items', 'district', 'user');
        return $this->success(__('messages.success'), (new AdvertisementShowResource($advertisement)));
    }

    public function store(CreateAdvertisementRequest $request)
    {
        return $this->success(__('messages.success'), (
        new AdvertisementShowResource($this->service->create($request->validated()))
        ));
    }

    public function update(UpdateAdvertisementRequest $request, Advertisement $advertisement)
    {
        return $this->success(__('messages.success'), (
        new AdvertisementShowResource($this->service->update($request->validated(), $advertisement))
        ));
    }

    public function search(SearchRequest $request)
    {
        $advertisements = $this->service->all(
            search_query: $request->query('keyword'),
        );
        if (auth('sanctum')->check()) {
            $user_id=auth('sanctum')->user()->id;
            $this->service->addHistory($user_id, $request->query('keyword'));
        }
        return $this->success(__('messages.success'), (
        new PaginationResourceCollection($advertisements, AdvertisementResource::class)
        ));
    }

    public function searchHistory()
    {
        $histories = $this->service->searchHistory(auth()?->user()?->id);
        return $this->success(__('messages.success'), (
        [
            'history' => SearchResource::collection($histories)
        ]
        ));
    }
}
