<div class="card-body">
    <div class="bs-example">
        <ul class="nav nav-tabs" style="margin-bottom: 15px;">
            <li class=" nav-item ">
                <a href="#uz" data-toggle="tab" class="nav-link active">O'zbekcha</a>
            </li>
            <li class="nav-item">
                <a href="#ru" data-toggle="tab" class="nav-link">Русский</a>
            </li>

        </ul>
        <div id="myTabContent" class="tab-content">
            <div class="tab-pane fade show active in" id="uz">
                <!-- Title Field -->
                <div class="form-group col-sm-12">
                    {!! Form::label('title', __('Title:').'[uz]') !!}
                    {!! Form::text('title'.'[uz]', null, ['class' => 'form-control']) !!}
                </div>
                <!-- Description Field -->
                <div class="form-group col-sm-12">
                    {!! Form::label('description', __('Description:').'[uz]') !!}
                    {!! Form::textarea('description'.'[uz]', null, ['class' => 'form-control','id'=>'ckeditor_full']) !!}
                </div>
            </div>
            <div class="tab-pane fade" id="ru">
                <div class="form-group col-sm-12">
                    {!! Form::label('title', __('Title:').'[ru]') !!}
                    {!! Form::text('title'.'[ru]', null, ['class' => 'form-control']) !!}
                </div>
                <div class="form-group col-sm-12">
                    {!! Form::label('description', __('Description:').'[ru]') !!}
                    {!! Form::textarea('description'.'[ru]', null, ['class' => 'form-control','id'=>'ckeditor_full2']) !!}
                </div>
            </div>

        </div>
    </div>
</div>


<!-- Area Field -->
<div class="form-group col-sm-12">
    {!! Form::label('area', __('Area:')) !!}
    {!! Form::text('area', null, ['class' => 'form-control ']) !!}
</div>

<!-- Type  Field -->
<div class="form-group col-sm-12">
    {!! Form::label('type_id', __('Type:')) !!}
    {!! Form::select('type_id',$types, null, ['class' => 'form-control select2']) !!}
</div>

<!-- Coating  Field -->
<div class="form-group col-sm-12">
    {!! Form::label('coating_id', __('Coating:')) !!}
    {!! Form::select('coating_id', $coatings, null, ['class' => 'form-control']) !!}
</div>

<!-- Region  Field -->
<div class="form-group col-sm-12">
    {!! Form::label('region_id', 'Region') !!}
    {!! Form::select('region_id',$regions, null, ['class' => 'form-control']) !!}
</div>

<!-- District  Field -->
<div class="form-group col-sm-12">
    {!! Form::label('district_id', 'District') !!}
    {!! Form::select('district_id',$districts, null, ['class' => 'form-control']) !!}
</div>

<!-- Options Field -->
<div class="form-group col-sm-12">
    {!! Form::label('options', 'Options:') !!}
    {!! Form::select('options[]', $options, null,['class' => 'form-control','multiple'=>'multiple','id'=>'multiselect2']) !!}
</div>


<!-- Address Field -->
<div class="form-group col-sm-12">
    {!! Form::label('address', 'Address:') !!}
    {!! Form::text('address', null, ['class' => 'form-control']) !!}
</div>

<!-- Phone Field -->
<div class="form-group col-sm-12">
    {!! Form::label('phone', 'Phone:') !!}
    {!! Form::textarea('phone', null, ['class' => 'form-control','id'=>"multi_phone"]) !!}
</div>


<!-- Price Field -->
<div class="form-group col-sm-12">
    {!! Form::label('price', 'Price:') !!}
    {!! Form::text('price', null, ['class' => 'form-control','type'=>'number']) !!}
</div>

<!-- Work Days Field -->
<div class="form-group col-sm-12">
    {!! Form::label('work_days', __('Work Days:')) !!}
    <div class="row">
    @foreach($weekdays as $key=>$value)
                    <div class="col-sm-2 padding-15">
                        {!! Form::checkbox('work_days[]', $key,!empty($playground->work_days[$key] )) !!} <span class="text-muted">{{$value}}</span>
                    </div>
                    <div class="col-sm-10 padding-15">
                        <span class="text-muted">
                            <input type="text" class="daytime" name="work_days[{{$key}}][start_time]" style="width: 15%;"
                            @if(isset($playground->work_days[$key]['start_time']))
                                value="{{$playground->work_days[$key]['start_time']}}"
                            @endif
                            /> -
                            <input type="text" class="daytime" name="work_days[{{$key}}][end_time]" style="width: 15%"
                            @if(isset($playground->work_days[$key]['end_time']))
                                value="{{$playground->work_days[$key]['end_time']}}"
                            @endif
                            />
                        </span>
                    </div>
    @endforeach
    </div>
</div>



<!-- Players Field -->
<div class="form-group col-sm-12">
    {!! Form::label('players', __('Players:')) !!}
    {!! Form::number('players', null, ['class' => 'form-control']) !!}
</div>

<!-- Active Field -->
<div class="form-group col-sm-12">
    {!! Form::label('active', 'Active:') !!}
    {!! Form::checkbox('active', null, $playground->active) !!}
</div>

<!-- Position Field -->
<div class="form-group col-sm-12">
    {!! Form::label('position', 'Position:') !!}
    {!! Form::number('position', 0, ['class' => 'form-control']) !!}
</div>

<!-- Geo Location Field -->
<div class="form-group col-sm-12 col-lg-12">
    {!! Form::label('geo_location', 'Geo Location:') !!}
    {{--<input type="text" class="form-control" id="place_coordinates" name="address" placeholder="Full Address" autocomplete="off">--}}

    <input type="hidden" id="place_lat" name="lat" value="48.323586">
    <input type="hidden" id="place_lng" name="lng" value="66.463691">
    <div id="map"></div>

</div>


<!-- Submit Field -->
<div class="form-group col-sm-12 text-center">
    {!! Form::submit('Save', ['class' => 'btn btn-primary']) !!}
    <a href="{!! route('admin.playgrounds.index') !!}" class="btn btn-secondary">Cancel</a>
</div>
