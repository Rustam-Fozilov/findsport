<table class="table table-bordered table-hover" id="playgrounds-table">
    <thead class="thead-light">
    <tr>
        <th>Action</th>
        <th>Title</th>
        <th>Description</th>
        <th>Coating</th>
        <th>Area</th>
        <th>Type</th>
        <th>Region</th>
        <th>Address</th>
        <th>Phone</th>
        <th>Price</th>
        <th>Views</th>
        <th>Active</th>
        {{--<th>Created At</th>
        <th>Updated At</th>--}}
        <th>Position</th>

    </tr>
    </thead>
    <tbody>
    @foreach($playgrounds as $playground)
        <tr>
            <td>
                <a href="{{ route('admin.playgrounds.edit', $playground->id) }}">
                    <i class="livicon" data-name="edit" data-size="18" data-loop="true" data-c="#428BCA"
                       data-hc="#428BCA" title="edit playground"></i>
                </a>
                <a href="{{ route('admin.playgrounds.confirm-delete', $playground->id) }}" data-toggle="modal"
                   data-target="#delete_confirm">
                    <i class="livicon" data-name="remove-alt" data-size="18" data-loop="true" data-c="#f56954"
                       data-hc="#f56954" title="delete playground"></i>
                </a>
            </td>
            <td>{!! $playground->title !!}</td>
            <td>{!! Str::limit($playground->description, 50)!!}</td>
            <td>{!! $playground->coatings->name !!}</td>
            <td>{!! $playground->area !!}</td>
            <td>{!! $playground->type->name !!}</td>
            <td>{!! $playground->district->name_uz !!}</td>
            <td>{!! $playground->address !!}</td>
            <td>{!! $playground->phone[0]['phone'] !!}</td>
            <td>{!! $playground->price !!}</td>
            <td>{!! $playground->views !!}</td>
            <td>{!! $playground->active ? 'Yes':'No' !!}</td>
            <td>{!! $playground->position !!}</td>
            {{--<td>{!! $playground->created_at !!}</td>
            <td>{!! $playground->updated_at !!}</td>--}}
        </tr>
    @endforeach
    </tbody>
</table>
@section('footer_scripts')
    <div class="modal fade" id="delete_confirm" tabindex="-1" role="dialog" aria-labelledby="user_delete_confirm_title"
         aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <a href="{{ route('admin.playgrounds.index') }}" class="btn btn-default" data-dismiss="modal">Cancel</a>
                <a href="{{ route('admin.playgrounds.delete', $playground->id) }}" class="btn btn-danger">Delete</a>
            </div>
        </div>
    </div>
    <script>$(function () {
            $('body').on('hidden.bs.modal', '.modal', function () {
                $(this).removeData('bs.modal');
            });
        });</script>
@stop
