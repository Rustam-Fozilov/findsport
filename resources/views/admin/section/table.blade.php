<table class="table table-bordered table-hover" id="sections-table">
    <thead class="thead-light">
     <tr>
        <th>Name</th>
        <th>Slug</th>
        <th>Active</th>
        <th>Position</th>
        <th>Created At</th>
        <th>Updated At</th>
        <th>Action</th>
     </tr>
    </thead>
    <tbody>
    @foreach($sections as $section)
        <tr>
            <td>{!! $section->name !!}</td>
            <td>{!! $section->slug !!}</td>
            <td>{!! $section->active !!}</td>
            <td>{!! $section->position !!}</td>
            <td>{!! $section->created_at !!}</td>
            <td>{!! $section->updated_at !!}</td>
            <td>
                 <a href="{{ route('admin.sections.show', $section->id) }}">
                     <i class="livicon" data-name="info" data-size="18" data-loop="true" data-c="#428BCA" data-hc="#428BCA" title="view section"></i>
                 </a>
                 <a href="{{ route('admin.sections.edit', $section->id) }}">
                     <i class="livicon" data-name="edit" data-size="18" data-loop="true" data-c="#428BCA" data-hc="#428BCA" title="edit section"></i>
                 </a>
                 <a href="{{ route('admin.sections.confirm-delete', $section->id) }}" data-toggle="modal" data-target="#delete_confirm">
                     <i class="livicon" data-name="remove-alt" data-size="18" data-loop="true" data-c="#f56954" data-hc="#f56954" title="delete section"></i>
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
