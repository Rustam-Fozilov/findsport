<?php

namespace App\Http\Controllers\Admin\Settings\Option;

use App\Http\Requests;
use App\Http\Requests\Settings\Option\CreateOptionRequest;
use App\Http\Requests\Settings\Option\UpdateOptionRequest;
use App\Repositories\Settings\Option\OptionRepository;
use App\Http\Controllers\AppBaseController as InfyOmBaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use App\Models\Settings\Option\Option;
use Flash;
use Prettus\Repository\Criteria\RequestCriteria;
use Response;

class OptionController extends InfyOmBaseController
{
    /** @var  OptionRepository */
    private $optionRepository;

    public function __construct(OptionRepository $optionRepo)
    {
        $this->optionRepository = $optionRepo;
    }

    /**
     * Display a listing of the Option.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {

        $this->optionRepository->pushCriteria(new RequestCriteria($request));
        $options = $this->optionRepository->all();
        return view('admin.settings\option.options.index')
            ->with('options', $options);
    }

    /**
     * Show the form for creating a new Option.
     *
     * @return Response
     */
    public function create()
    {
        return view('admin.settings\option.options.create');
    }

    /**
     * Store a newly created Option in storage.
     *
     * @param CreateOptionRequest $request
     *
     * @return Response
     */
    public function store(CreateOptionRequest $request)
    {
        $input = $request->all();

        $option = $this->optionRepository->create($input);

        Flash::success('Option saved successfully.');

        return redirect(route('admin.settings\option.options.index'));
    }

    /**
     * Display the specified Option.
     *
     * @param  int $id
     *
     * @return Response
     */
    public function show($id)
    {
        $option = $this->optionRepository->findWithoutFail($id);

        if (empty($option)) {
            Flash::error('Option not found');

            return redirect(route('options.index'));
        }

        return view('admin.settings\option.options.show')->with('option', $option);
    }

    /**
     * Show the form for editing the specified Option.
     *
     * @param  int $id
     *
     * @return Response
     */
    public function edit($id)
    {
        $option = $this->optionRepository->findWithoutFail($id);

        if (empty($option)) {
            Flash::error('Option not found');

            return redirect(route('options.index'));
        }

        return view('admin.settings\option.options.edit')->with('option', $option);
    }

    /**
     * Update the specified Option in storage.
     *
     * @param  int              $id
     * @param UpdateOptionRequest $request
     *
     * @return Response
     */
    public function update($id, UpdateOptionRequest $request)
    {
        $option = $this->optionRepository->findWithoutFail($id);

        

        if (empty($option)) {
            Flash::error('Option not found');

            return redirect(route('options.index'));
        }

        $option = $this->optionRepository->update($request->all(), $id);

        Flash::success('Option updated successfully.');

        return redirect(route('admin.settings\option.options.index'));
    }

    /**
     * Remove the specified Option from storage.
     *
     * @param  int $id
     *
     * @return Response
     */
      public function getModalDelete($id = null)
      {
          $error = '';
          $model = '';
          $confirm_route =  route('admin.settings\option.options.delete',['id'=>$id]);
          return View('admin.layouts/modal_confirmation', compact('error','model', 'confirm_route'));

      }

       public function getDelete($id = null)
       {
           $sample = Option::destroy($id);

           // Redirect to the group management page
           return redirect(route('admin.settings\option.options.index'))->with('success', Lang::get('message.success.delete'));

       }

}
