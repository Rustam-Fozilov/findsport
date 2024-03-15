<?php

namespace App\Http\Controllers\Admin\Sports;

use App\Http\Controllers\AdminController;
use App\Http\Requests;
use App\Http\Requests\Sports\CreateSportRequest;
use App\Http\Requests\Sports\UpdateSportRequest;
use App\Repositories\Sports\SportRepository;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use App\Models\Sport;
use Flash;
use Prettus\Repository\Criteria\RequestCriteria;
use Response;

class SportController extends AdminController
{

    private $sportRepository;

    public function __construct(SportRepository $sportRepo)
    {
        $this->sportRepository = $sportRepo;
    }


    public function index(Request $request)
    {

        $this->sportRepository->pushCriteria(new RequestCriteria($request));
        $sports = $this->sportRepository->all();
        return view('admin.sports.index')
            ->with('sports', $sports);
    }


    public function create()
    {
        return view('admin.sports.create');
    }


    public function store(CreateSportRequest $request)
    {
        $input = $request->all();

        $sport = $this->sportRepository->create($input);

        Flash::success('Sport saved successfully.');

        return redirect(route('admin.sports.index'));
    }


    public function show($id)
    {
        $sport = $this->sportRepository->findWithoutFail($id);

        if (empty($sport)) {
            Flash::error('Sport not found');

            return redirect(route('sports.index'));
        }

        return view('admin.sports.show')->with('sport', $sport);
    }


    public function edit($id)
    {
        $sport = $this->sportRepository->findWithoutFail($id);

        if (empty($sport)) {
            Flash::error('Sport not found');

            return redirect(route('sports.index'));
        }

        return view('admin.sports.edit')->with('sport', $sport);
    }


    public function update($id, UpdateSportRequest $request)
    {
        $sport = $this->sportRepository->findWithoutFail($id);



        if (empty($sport)) {
            Flash::error('Sport not found');

            return redirect(route('sports.index'));
        }

        $sport = $this->sportRepository->update($request->all(), $id);

        Flash::success('Sport updated successfully.');

        return redirect(route('admin.sports.index'));
    }


      public function getModalDelete($id = null)
      {
          $error = '';
          $model = '';
          $confirm_route =  route('admin.sports.delete',['id'=>$id]);
          return View('admin.layouts/modal_confirmation', compact('error','model', 'confirm_route'));

      }

       public function getDelete($id = null)
       {
           $sample = Sport::destroy($id);

           // Redirect to the group management page
           return redirect(route('admin.sports.index'))->with('success', Lang::get('message.success.delete'));

       }

}
