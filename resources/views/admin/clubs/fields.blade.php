<!-- Id Field -->
<div class="form-group col-sm-12">
    {!! Form::label('id', 'Id:') !!}
    {!! Form::number('id', null, ['class' => 'form-control']) !!}
</div>

<!-- Title Field -->
<div class="form-group col-sm-12">
    {!! Form::label('title', 'Title:') !!}
    {!! Form::text('title', null, ['class' => 'form-control']) !!}
</div>

<!-- Sub Title Field -->
<div class="form-group col-sm-12">
    {!! Form::label('sub_title', 'Sub Title:') !!}
    {!! Form::text('sub_title', null, ['class' => 'form-control']) !!}
</div>

<!-- Description Field -->
<div class="form-group col-sm-12">
    {!! Form::label('description', 'Description:') !!}
    {!! Form::text('description', null, ['class' => 'form-control']) !!}
</div>

<!-- Slug Field -->
<div class="form-group col-sm-12">
    {!! Form::label('slug', 'Slug:') !!}
    {!! Form::text('slug', null, ['class' => 'form-control']) !!}
</div>

<!-- Address Field -->
<div class="form-group col-sm-12">
    {!! Form::label('address', 'Address:') !!}
    {!! Form::text('address', null, ['class' => 'form-control']) !!}
</div>

<!-- Phone Field -->
<div class="form-group col-sm-12">
    {!! Form::label('phone', 'Phone:') !!}
    {!! Form::text('phone', null, ['class' => 'form-control']) !!}
</div>

<!-- Sports Field -->
<div class="form-group col-sm-12">
    {!! Form::label('sports', 'Sports:') !!}
    {!! Form::text('sports', null, ['class' => 'form-control']) !!}
</div>

<!-- From Time Field -->
<div class="form-group col-sm-12">
    {!! Form::label('from_time', 'From Time:') !!}
    {!! Form::text('from_time', null, ['class' => 'form-control']) !!}
</div>

<!-- To Time Field -->
<div class="form-group col-sm-12">
    {!! Form::label('to_time', 'To Time:') !!}
    {!! Form::text('to_time', null, ['class' => 'form-control']) !!}
</div>

<!-- Work Days Field -->
<div class="form-group col-sm-12">
    {!! Form::label('work_days', 'Work Days:') !!}
    {!! Form::text('work_days', null, ['class' => 'form-control']) !!}
</div>

<!-- Metro Id Field -->
<div class="form-group col-sm-12">
    {!! Form::label('metro_id', 'Metro Id:') !!}
    {!! Form::number('metro_id', null, ['class' => 'form-control']) !!}
</div>

<!-- Geo Location Field -->
<div class="form-group col-sm-12 col-lg-12">
    {!! Form::label('geo_location', 'Geo Location:') !!}
    {!! Form::textarea('geo_location', null, ['class' => 'form-control', 'rows' => '5']) !!}
</div>


<!-- Region Id Field -->
<div class="form-group col-sm-12">
    {!! Form::label('region_id', 'Region Id:') !!}
    {!! Form::number('region_id', null, ['class' => 'form-control']) !!}
</div>

<!-- Position Field -->
<div class="form-group col-sm-12">
    {!! Form::label('position', 'Position:') !!}
    {!! Form::number('position', null, ['class' => 'form-control']) !!}
</div>

<!-- Active Field -->
<div class="form-group col-sm-12">
    {!! Form::label('active', 'Active:') !!}
    {!! Form::text('active', null, ['class' => 'form-control']) !!}
</div>


<!-- Price Field -->
<div class="form-group col-sm-12">
    {!! Form::label('price', 'Price:') !!}
    {!! Form::number('price', null, ['class' => 'form-control']) !!}
</div>

<!-- Submit Field -->
<div class="form-group col-sm-12 text-center">
    {!! Form::submit('Save', ['class' => 'btn btn-primary']) !!}
    <a href="{!! route('admin.clubs.index') !!}" class="btn btn-secondary">Cancel</a>
</div>
