<table class="table table-bordered table-hover" id="clubs-table">
    <thead class="thead-light">
     <tr>
        <th>Title</th>
        <th>Sub Title</th>
        <th>Description</th>
        <th>Slug</th>
        <th>Address</th>
        <th>Phone</th>
        <th>Sports</th>
        <th>From Time</th>
        <th>To Time</th>
        <th>Work Days</th>
        <th>Metro Id</th>
        <th>Geo Location</th>
        <th>Region Id</th>
        <th>Position</th>
        <th>Active</th>
        <th>Created At</th>
        <th>Updated At</th>
        <th>Price</th>
        <th>Action</th>
     </tr>
    </thead>
    <tbody>
    @foreach($clubs as $club)
        <tr>
            <td>{!! $club->title !!}</td>
            <td>{!! $club->sub_title !!}</td>
            <td>{!! $club->description !!}</td>
            <td>{!! $club->slug !!}</td>
            <td>{!! $club->address !!}</td>
            <td>{!! $club->phone !!}</td>
            <td>{!! $club->sports !!}</td>
            <td>{!! $club->from_time !!}</td>
            <td>{!! $club->to_time !!}</td>
            <td>{!! $club->work_days !!}</td>
            <td>{!! $club->metro_id !!}</td>
            <td>{!! $club->geo_location !!}</td>
            <td>{!! $club->region_id !!}</td>
            <td>{!! $club->position !!}</td>
            <td>{!! $club->active !!}</td>
            <td>{!! $club->created_at !!}</td>
            <td>{!! $club->updated_at !!}</td>
            <td>{!! $club->price !!}</td>
            <td>
                 <a href="{{ route('admin.clubs.show', $club->id) }}">
                     <i class="livicon" data-name="info" data-size="18" data-loop="true" data-c="#428BCA" data-hc="#428BCA" title="view club"></i>
                 </a>
                 <a href="{{ route('admin.clubs.edit', $club->id) }}">
                     <i class="livicon" data-name="edit" data-size="18" data-loop="true" data-c="#428BCA" data-hc="#428BCA" title="edit club"></i>
                 </a>
                 <a href="{{ route('admin.clubs.confirm-delete', $club->id) }}" data-toggle="modal" data-target="#delete_confirm">
                     <i class="livicon" data-name="remove-alt" data-size="18" data-loop="true" data-c="#f56954" data-hc="#f56954" title="delete club"></i>
                 </a>
            </td>
        </tr>
    @endforeach
    </tbody>
</table>
@section('footer_scripts')
    <div class="modal fade" id="delete_confirm" tabindex="-1" role="dialog" aria-labelledby="user_delete_confirm_title" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            </div>
        </div>
    </div>
    <script>$(function () {$('body').on('hidden.bs.modal', '.modal', function () {$(this).removeData('bs.modal');});});</script>
@stop
