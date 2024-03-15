<?php
/**
 * Author Maxamadjonov Jaxongir.
 * https://github.com/jtscorpjaxon
 * Date: 12.08.2021
 * Time: 11:06
 */

namespace App\Traits;

/*
|--------------------------------------------------------------------------
| Api Responser Trait
|--------------------------------------------------------------------------
|
| This trait will be used for any response we sent to clients.
|
*/

use App\Resources\API\PaginationResourceCollection;
use Illuminate\Http\JsonResponse;

trait ApiResponser
{
    /**
     * @param string $message
     * @param mixed|null $data
     * @param mixed|null $append
     * @param int $code
     * @return JsonResponse
     */
    protected function success(string $message = '',  $data = null,  $append = null, int $code = 200): JsonResponse
    {
        $resp = [
            'status' => true,
            'message' => $message,
            'data' => $data ?? new \stdClass(),
            'append' => $append ?? [],
            'errors' => []
        ];

        if ($data instanceof PaginationResourceCollection) {
            $data = $data->toResponse(null)->getData(true);
            unset($data['meta'], $data['links']);
            $resp['data']=$data['objects']['data'];
            unset($data['objects']['data']);
            $resp['append']=array_merge($resp['append'],[
                'pagination'=>$data['objects']
            ]);
        }
        return response()->json($resp, $code);
    }

    /**
     * @param string $message
     * @param mixed|null $errors
     * @param int $code
     * @return JsonResponse
     */
    protected function error(string $message = '', mixed $errors = null, int $code = 404): JsonResponse
    {
        return response()->json([
            'status' => false,
            'message' => $message,
            'data' => new \stdClass(),
            'append' => new \stdClass(),
            'errors' => $errors ?? []
        ], $code);
    }
}
