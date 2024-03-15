<table class="table table-bordered table-hover" id="sectionItems-table">
    <thead class="thead-light">
     <tr>
        <th>Section Id</th>
        <th>Region Id</th>
        <th>Club Id</th>
        <th>Active</th>
        <th>Title</th>
        <th>Content</th>
        <th>Sport</th>
        <th>Trainers</th>
        <th>Subscriptions</th>
        <th>Not Forget</th>
        <th>Skill Level</th>
        <th>From Age</th>
        <th>To Age</th>
        <th>From Time</th>
        <th>To Time</th>
        <th>Phone</th>
        <th>Address</th>
        <th>Geo Location</th>
        <th>Position</th>
        <th>Created At</th>
        <th>Updated At</th>
        <th>Action</th>
     </tr>
    </thead>
    <tbody>
    @foreach($sectionItems as $sectionItem)
        <tr>
            <td>{!! $sectionItem->section_id !!}</td>
            <td>{!! $sectionItem->region_id !!}</td>
            <td>{!! $sectionItem->club_id !!}</td>
            <td>{!! $sectionItem->active !!}</td>
            <td>{!! $sectionItem->title !!}</td>
            <td>{!! $sectionItem->content !!}</td>
            <td>{!! $sectionItem->sport !!}</td>
            <td>{!! $sectionItem->trainers !!}</td>
            <td>{!! $sectionItem->subscriptions !!}</td>
            <td>{!! $sectionItem->not_forget !!}</td>
            <td>{!! $sectionItem->skill_level !!}</td>
            <td>{!! $sectionItem->from_age !!}</td>
            <td>{!! $sectionItem->to_age !!}</td>
            <td>{!! $sectionItem->from_time !!}</td>
            <td>{!! $sectionItem->to_time !!}</td>
            <td>{!! $sectionItem->phone !!}</td>
            <td>{!! $sectionItem->address !!}</td>
            <td>{!! $sectionItem->geo_location !!}</td>
            <td>{!! $sectionItem->position !!}</td>
            <td>{!! $sectionItem->created_at !!}</td>
            <td>{!! $sectionItem->updated_at !!}</td>
            <td>
                 <a href="{{ route('admin.sectionItems.sectionItems.show', $sectionItem->id) }}">
                     <i class="livicon" data-name="info" data-size="18" data-loop="true" data-c="#428BCA" data-hc="#428BCA" title="view sectionItem"></i>
                 </a>
                 <a href="{{ route('admin.sectionItems.sectionItems.edit', $sectionItem->id) }}">
                     <i class="livicon" data-name="edit" data-size="18" data-loop="true" data-c="#428BCA" data-hc="#428BCA" title="edit sectionItem"></i>
                 </a>
                 <a href="{{ route('admin.sectionItems.sectionItems.confirm-delete', $sectionItem->id) }}" data-toggle="modal" data-target="#delete_confirm">
                     <i class="livicon" data-name="remove-alt" data-size="18" data-loop="true" data-c="#f56954" data-hc="#f56954" title="delete sectionItem"></i>
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
