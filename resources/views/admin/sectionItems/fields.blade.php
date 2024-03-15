<!-- Id Field -->
<div class="form-group col-sm-12">
    {!! Form::label('id', 'Id:') !!}
    {!! Form::number('id', null, ['class' => 'form-control']) !!}
</div>

<!-- Section Id Field -->
<div class="form-group col-sm-12">
    {!! Form::label('section_id', 'Section Id:') !!}
    {!! Form::number('section_id', null, ['class' => 'form-control']) !!}
</div>

<!-- Region Id Field -->
<div class="form-group col-sm-12">
    {!! Form::label('region_id', 'Region Id:') !!}
    {!! Form::number('region_id', null, ['class' => 'form-control']) !!}
</div>

<!-- Club Id Field -->
<div class="form-group col-sm-12">
    {!! Form::label('club_id', 'Club Id:') !!}
    {!! Form::number('club_id', null, ['class' => 'form-control']) !!}
</div>

<!-- Active Field -->
<div class="form-group col-sm-12">
    {!! Form::label('active', 'Active:') !!}
    {!! Form::text('active', null, ['class' => 'form-control']) !!}
</div>

<!-- Title Field -->
<div class="form-group col-sm-12">
    {!! Form::label('title', 'Title:') !!}
    {!! Form::text('title', null, ['class' => 'form-control']) !!}
</div>

<!-- Content Field -->
<div class="form-group col-sm-12">
    {!! Form::label('content', 'Content:') !!}
    {!! Form::text('content', null, ['class' => 'form-control']) !!}
</div>

<!-- Sport Field -->
<div class="form-group col-sm-12">
    {!! Form::label('sport', 'Sport:') !!}
    {!! Form::text('sport', null, ['class' => 'form-control']) !!}
</div>

<!-- Trainers Field -->
<div class="form-group col-sm-12">
    {!! Form::label('trainers', 'Trainers:') !!}
    {!! Form::text('trainers', null, ['class' => 'form-control']) !!}
</div>

<!-- Subscriptions Field -->
<div class="form-group col-sm-12">
    {!! Form::label('subscriptions', 'Subscriptions:') !!}
    {!! Form::text('subscriptions', null, ['class' => 'form-control']) !!}
</div>

<!-- Not Forget Field -->
<div class="form-group col-sm-12">
    {!! Form::label('not_forget', 'Not Forget:') !!}
    {!! Form::text('not_forget', null, ['class' => 'form-control']) !!}
</div>

<!-- Skill Level Field -->
<div class="form-group col-sm-12">
    {!! Form::label('skill_level', 'Skill Level:') !!}
    {!! Form::text('skill_level', null, ['class' => 'form-control']) !!}
</div>

<!-- From Age Field -->
<div class="form-group col-sm-12">
    {!! Form::label('from_age', 'From Age:') !!}
    {!! Form::number('from_age', null, ['class' => 'form-control']) !!}
</div>

<!-- To Age Field -->
<div class="form-group col-sm-12">
    {!! Form::label('to_age', 'To Age:') !!}
    {!! Form::number('to_age', null, ['class' => 'form-control']) !!}
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

<!-- Phone Field -->
<div class="form-group col-sm-12">
    {!! Form::label('phone', 'Phone:') !!}
    {!! Form::text('phone', null, ['class' => 'form-control']) !!}
</div>

<!-- Address Field -->
<div class="form-group col-sm-12">
    {!! Form::label('address', 'Address:') !!}
    {!! Form::text('address', null, ['class' => 'form-control']) !!}
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

<!-- Submit Field -->
<div class="form-group col-sm-12 text-center">
    {!! Form::submit('Save', ['class' => 'btn btn-primary']) !!}
    <a href="{!! route('admin.sectionItems.sectionItems.index') !!}" class="btn btn-secondary">Cancel</a>
</div>
