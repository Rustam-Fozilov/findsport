<?php

namespace App\Http\Requests\Api\Advertisement;

use App\Enums\SeasonEnum;
use App\Rules\FileRule;
use App\Rules\PhoneRule;
use Illuminate\Foundation\Http\FormRequest;
use App\Models\Advertisement;
use Illuminate\Validation\Rules\Enum;

class CreateAdvertisementRequest extends FormRequest
{

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    protected function prepareForValidation()
    {

    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules = Advertisement::$rules;
        $rules = array_diff_key($rules, array_flip(['position','status','begin_date','end_date']));
        $rules=array_merge($rules,[
            "phone"=>["required_without:phones",new PhoneRule()],
            "phones.*.name"=>"required_without:phone|string",
            "phones.*.phone"=>["required_without:phone",new PhoneRule()],
            "medias.*"=>['nullable',new FileRule()]
        ]);
        if (in_array($this->ad_type, ['section', 'ground', 'club'])) {
            switch ($this->ad_type) {
                case  'ground':
                    $rules = array_merge($rules,
                        [
                            'infrastructure.*' => 'required|exists:infrastructures,id',
                            'season'=>'required|between:0,2',
                            'area'=>'required|string|max:255'
                        ]
                    );
                    break;
                case 'section':
                    unset($rules['price']);
                    $rules = array_merge($rules,
                        [
                            'infrastructure.*' => 'required|exists:infrastructures,id',
                            'prices.*.price'=>'required|numeric|min:0',
                            'prices.*.description'=>'required|string|max:255',
                            'degree'=>'required||exists:degrees,id',
                            'age_begin'=>'required|number',
                            'age_end'=>'required|number',
                            'trainer.name'=>'required|string',
                            'trainer.image'=>['required',new FileRule()],
                            'trainer.description'=>'required',
                            'season'=>[new Enum(SeasonEnum::class)],
                            'area'=>'required|string|max:255',
                        ]
                    );
                    break;

            }
        }
        return $rules;
    }
}
