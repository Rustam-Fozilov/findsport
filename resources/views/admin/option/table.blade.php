<table class="table table-bordered table-hover" id="options-table">
    <thead class="thead-light">
     <tr>
        <th>Name</th>
        <th>Active</th>
        <th>Position</th>
        <th>Created At</th>
        <th>Updated At</th>
        <th>Action</th>
     </tr>
    </thead>
    <tbody>
    @foreach($options as $option)
        <tr>
            <td>{!! $option->name !!}</td>
            <td>{!! $option->active !!}</td>
            <td>{!! $option->position !!}</td>
            <td>{!! $option->created_at !!}</td>
            <td>{!! $option->updated_at !!}</td>
            <td>
                 <a href="{{ route('admin.options.show', $option->id) }}">
                     <i class="livicon" data-name="info" data-size="18" data-loop="true" data-c="#428BCA" data-hc="#428BCA" title="view option"></i>
                 </a>
                 <a href="{{ route('admin.options.edit', $option->id) }}">
                     <i class="livicon" data-name="edit" data-size="18" data-loop="true" data-c="#428BCA" data-hc="#428BCA" title="edit option"></i>
                 </a>
                 <a href="{{ route('admin.options.confirm-delete', $option->id) }}" data-toggle="modal" data-target="#delete_confirm">
                     <i class="livicon" data-name="remove-alt" data-size="18" data-loop="true" data-c="#f56954" data-hc="#f56954" title="delete option"></i>
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
