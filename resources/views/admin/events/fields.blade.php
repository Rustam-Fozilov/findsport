<!-- Id Field -->
<div class="form-group col-sm-12">
    {!! Form::label('id', 'Id:') !!}
    {!! Form::number('id', null, ['class' => 'form-control']) !!}
</div>

<!-- Sport Id Field -->
<div class="form-group col-sm-12">
    {!! Form::label('sport_id', 'Sport Id:') !!}
    {!! Form::number('sport_id', null, ['class' => 'form-control']) !!}
</div>

<!-- Title Field -->
<div class="form-group col-sm-12">
    {!! Form::label('title', 'Title:') !!}
    {!! Form::text('title', null, ['class' => 'form-control']) !!}
</div>

<!-- Slug Field -->
<div class="form-group col-sm-12">
    {!! Form::label('slug', 'Slug:') !!}
    {!! Form::text('slug', null, ['class' => 'form-control']) !!}
</div>

<!-- Description Field -->
<div class="form-group col-sm-12">
    {!! Form::label('description', 'Description:') !!}
    {!! Form::text('description', null, ['class' => 'form-control']) !!}
</div>

<!-- Region Id Field -->
<div class="form-group col-sm-12">
    {!! Form::label('region_id', 'Region Id:') !!}
    {!! Form::number('region_id', null, ['class' => 'form-control']) !!}
</div>

<!-- Metro Id Field -->
<div class="form-group col-sm-12">
    {!! Form::label('metro_id', 'Metro Id:') !!}
    {!! Form::number('metro_id', null, ['class' => 'form-control']) !!}
</div>

<!-- Age Min Field -->
<div class="form-group col-sm-12">
    {!! Form::label('age_min', 'Age Min:') !!}
    {!! Form::text('age_min', null, ['class' => 'form-control']) !!}
</div>

<!-- Age Max Field -->
<div class="form-group col-sm-12">
    {!! Form::label('age_max', 'Age Max:') !!}
    {!! Form::text('age_max', null, ['class' => 'form-control']) !!}
</div>

<!-- Dates Field -->
<div class="form-group col-sm-12">
    {!! Form::label('dates', 'Dates:') !!}
    {!! Form::text('dates', null, ['class' => 'form-control']) !!}
</div>

<!-- Tickets Field -->
<div class="form-group col-sm-12">
    {!! Form::label('tickets', 'Tickets:') !!}
    {!! Form::text('tickets', null, ['class' => 'form-control']) !!}
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

<!-- Geo Location Field -->
<div class="form-group col-sm-12 col-lg-12">
    {!! Form::label('geo_location', 'Geo Location:') !!}
    {!! Form::textarea('geo_location', null, ['class' => 'form-control', 'rows' => '5']) !!}
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

<!-- Submit Field -->
<div class="form-group col-sm-12 text-center">
    {!! Form::submit('Save', ['class' => 'btn btn-primary']) !!}
    <a href="{!! route('admin.events.events.index') !!}" class="btn btn-secondary">Cancel</a>
</div>
