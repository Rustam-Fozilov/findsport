<?php

namespace App\Http\Controllers\Admin\Advertisement;

use App\Http\Controllers\AdminController;
use App\Http\Requests;
use App\Http\Requests\Advertisement\CreateAdvertisementRequest;
use App\Http\Requests\Advertisement\UpdateAdvertisementRequest;
use App\Models\District;
use App\Models\Region;
use App\Models\Sport;
use App\Repositories\Advertisement\AdvertisementRepository;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use App\Models\Advertisement;
use Flash;
use Prettus\Repository\Criteria\RequestCriteria;
use Response;

class AdvertisementController extends AdminController
{

    private $groundRepository;

    public function __construct(AdvertisementRepository $groundRepo)
    {
        $this->groundRepository = $groundRepo;
        $regions=Region::query()->get()->pluck('name_uz')->toArray();
        $districts=District::query()->get()->pluck('name_uz')->toArray();
        $sports=Sport::query()->get();
        $weekdays=[1=>'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
        view()->share([
            'regions'=>$regions,
            'districts'=>$districts,
            'sports'=>$sports,
            'weekdays'=>$weekdays,
        ]);

    }


    public function index(Request $request)
    {

        $this->groundRepository->pushCriteria(new RequestCriteria($request));
        $grounds = $this->groundRepository->all();
        return view('admin.grounds.index')
            ->with('grounds', $grounds);
    }


    public function create()
    {
        return view('admin.grounds.create');
    }


    public function store(CreateAdvertisementRequest $request)
    {
        $input = $request->all();

        $ground = $this->groundRepository->create($input);

        Flash::success('Advertisement saved successfully.');

        return redirect(route('admin.grounds.index'));
    }


    public function show($id)
    {
        $ground = $this->groundRepository->findWithoutFail($id);

        if (empty($ground)) {
            Flash::error('Advertisement not found');

            return redirect(route('grounds.index'));
        }

        return view('admin.grounds.show')->with('ground', $ground);
    }


    public function edit($id)
    {
        $ground = $this->groundRepository->findWithoutFail($id);

        if (empty($ground)) {
            Flash::error('Advertisement not found');

            return redirect(route('grounds.index'));
        }

        $ground->options=array_keys(array_filter($ground->options,function($value){
            return $value;
        }));
        $ground->phone=json_encode($ground->phone);
        return view('admin.grounds.edit')->with('ground', $ground);
    }


    public function update($id, UpdateAdvertisementRequest $request)
    {
        $ground = $this->groundRepository->findWithoutFail($id);
        $arr=$request->all();
        $options=Option::all();
        $option_ids=[];
        foreach ($options as $option){
            if(in_array($option->id,$arr['options'])){
                $option_ids[$option->id]=true;
            }else
                $option_ids[$option->id]=false;
        }
        $arr['options']=$option_ids;
        $arr['phone']=json_decode($arr['phone']);
        unset($arr['work_days'][0]);
        $arr['work_days']=array_map(function($times){
            if (empty($times['start_time']) && empty($times['end_time'])){
                return null;
            }
            return $times;
        },$arr['work_days']);
        $arr['active']=isset($arr['active'])?true:false;
        if (empty($ground)) {
            Flash::error('Advertisement not found');

            return redirect(route('grounds.index'));
        }

        $ground = $this->groundRepository->update($arr, $id);

        Flash::success('Advertisement updated successfully.');

        return redirect(route('admin.grounds.index'));
    }


      public function getModalDelete($id = null)
      {
          $error = '';
          $model = '';
          $confirm_route =  route('admin.grounds.delete',['id'=>$id]);
          return View('admin.layouts/modal_confirmation', compact('error','model', 'confirm_route'));

      }

       public function getDelete($id = null)
       {
           $sample = Advertisement::destroy($id);

           // Redirect to the group management page
           return redirect(route('admin.grounds.index'))->with('success', Lang::get('message.success.delete'));

       }

}
