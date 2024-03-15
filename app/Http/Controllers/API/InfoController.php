<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\ApiController;
use App\Models\District;

use App\Models\Infrastructure;


use App\Models\Region;

use App\Models\Site;
use App\Models\Sport;
use App\Resources\API\PaginationResourceCollection;
use App\Resources\API\v1\InfrastructureResource;
use App\Resources\API\v1\DistrictResource;
use App\Resources\API\v1\RegionResource;
use App\Resources\API\v1\SportResource;
use App\Services\SCP\SCPService;
use Illuminate\Http\Request;

class InfoController extends ApiController
{
    private $service;

    public function __construct(SCPService $service)
    {
        $this->service = $service;
    }


    public function phoneView(Request $request)
    {
        $phone = $this->service->getPhone(
            $request->query('type'),
            $request->query('id'),

        );

        return $this->success(__('messages.success'), [
            'phone' => $phone,
        ]);

    }

    public function sports()
    {
        $sports = Sport::query()->active()->get();
        return response()->json(['sports' => SportResource::collection($sports)]);
    }


    public function regions()
    {
        $regions = Region::query()->get();
        return response()->json(['regions' => RegionResource::collection($regions)]);
    }

    public function info()
    {
        $info = Site::first();
        return response()->json([
            'title' => $info->name,
            'phone' => $info->phone,
            'email' => $info->email,
            'socials' => $info->socials,
        ]);
    }


    public function infrastructures()
    {
        return response()->json([
            'infrastructures' => InfrastructureResource::collection(infrastructure::query()->active()->get())
        ]);
    }


    public function districts()
    {
        if (\request()->has('region'))
            return response()->json([
                'districts' =>
                    DistrictResource::collection(
                        District::query()->where('region_id', \request()->get('region'))->get()
                    )
            ]);

        return response()->json([
            'regions' => RegionResource::collection(Region::all())
        ]);
    }

}
