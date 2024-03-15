<table class="table table-bordered table-hover" id="events-table">
    <thead class="thead-light">
     <tr>
        <th>Sport Id</th>
        <th>Title</th>
        <th>Slug</th>
        <th>Description</th>
        <th>Region Id</th>
        <th>Metro Id</th>
        <th>Age Min</th>
        <th>Age Max</th>
        <th>Dates</th>
        <th>Tickets</th>
        <th>Address</th>
        <th>Phone</th>
        <th>Geo Location</th>
        <th>Position</th>
        <th>Active</th>
        <th>Created At</th>
        <th>Updated At</th>
        <th>Action</th>
     </tr>
    </thead>
    <tbody>
    @foreach($events as $event)
        <tr>
            <td>{!! $event->sport_id !!}</td>
            <td>{!! $event->title !!}</td>
            <td>{!! $event->slug !!}</td>
            <td>{!! $event->description !!}</td>
            <td>{!! $event->region_id !!}</td>
            <td>{!! $event->metro_id !!}</td>
            <td>{!! $event->age_min !!}</td>
            <td>{!! $event->age_max !!}</td>
            <td>{!! $event->dates !!}</td>
            <td>{!! $event->tickets !!}</td>
            <td>{!! $event->address !!}</td>
            <td>{!! $event->phone !!}</td>
            <td>{!! $event->geo_location !!}</td>
            <td>{!! $event->position !!}</td>
            <td>{!! $event->active !!}</td>
            <td>{!! $event->created_at !!}</td>
            <td>{!! $event->updated_at !!}</td>
            <td>
                 <a href="{{ route('admin.events.events.show', $event->id) }}">
                     <i class="livicon" data-name="info" data-size="18" data-loop="true" data-c="#428BCA" data-hc="#428BCA" title="view event"></i>
                 </a>
                 <a href="{{ route('admin.events.events.edit', $event->id) }}">
                     <i class="livicon" data-name="edit" data-size="18" data-loop="true" data-c="#428BCA" data-hc="#428BCA" title="edit event"></i>
                 </a>
                 <a href="{{ route('admin.events.events.confirm-delete', $event->id) }}" data-toggle="modal" data-target="#delete_confirm">
                     <i class="livicon" data-name="remove-alt" data-size="18" data-loop="true" data-c="#f56954" data-hc="#f56954" title="delete event"></i>
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
