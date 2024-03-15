<?php

namespace App\Http\Controllers\Admin\Infrastructures;

use App\Http\Controllers\AdminController;
use App\Http\Requests;
use App\Http\Requests\Infrastructures\CreateInfrastructureRequest;
use App\Http\Requests\Infrastructures\UpdateInfrastructureRequest;
use App\Repositories\Infrastructures\InfrastructureRepository;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use App\Models\infrastructure;
use Flash;
use Prettus\Repository\Criteria\RequestCriteria;
use Response;

class InfrastructureController extends AdminController
{

    private $inventorieRepository;

    public function __construct(InfrastructureRepository $inventorieRepo)
    {
        $this->inventorieRepository = $inventorieRepo;
    }


    public function index(Request $request)
    {

        $this->inventorieRepository->pushCriteria(new RequestCriteria($request));
        $inventories = $this->inventorieRepository->all();
        return view('admin.inventories.index')
            ->with('inventories', $inventories);
    }


    public function create()
    {
        return view('admin.inventories.create');
    }


    public function store(CreateInfrastructureRequest $request)
    {
        $input = $request->all();

        $inventorie = $this->inventorieRepository->create($input);

        Flash::success('Infrastructure saved successfully.');

        return redirect(route('admin.inventories.index'));
    }


    public function show($id)
    {
        $inventorie = $this->inventorieRepository->findWithoutFail($id);

        if (empty($inventorie)) {
            Flash::error('Infrastructure not found');

            return redirect(route('inventories.index'));
        }

        return view('admin.inventories.show')->with('inventorie', $inventorie);
    }


    public function edit($id)
    {
        $inventorie = $this->inventorieRepository->findWithoutFail($id);

        if (empty($inventorie)) {
            Flash::error('Infrastructure not found');

            return redirect(route('inventories.index'));
        }

        return view('admin.inventories.edit')->with('inventorie', $inventorie);
    }


    public function update($id, UpdateInfrastructureRequest $request)
    {
        $inventorie = $this->inventorieRepository->findWithoutFail($id);



        if (empty($inventorie)) {
            Flash::error('Infrastructure not found');

            return redirect(route('inventories.index'));
        }

        $inventorie = $this->inventorieRepository->update($request->all(), $id);

        Flash::success('Infrastructure updated successfully.');

        return redirect(route('admin.inventories.index'));
    }


      public function getModalDelete($id = null)
      {
          $error = '';
          $model = '';
          $confirm_route =  route('admin.inventories.delete',['id'=>$id]);
          return View('admin.layouts/modal_confirmation', compact('error','model', 'confirm_route'));

      }

       public function getDelete($id = null)
       {
           $sample = Infrastructure::destroy($id);

           // Redirect to the group management page
           return redirect(route('admin.inventories.index'))->with('success', Lang::get('message.success.delete'));

       }

}
