@extends('admin/layouts/default')

{{-- Page title --}}
@section('title')
    @lang('table/title.typelist')
@parent
@stop

{{-- page level styles --}}
@section('header_styles')
    <link rel="stylesheet" type="text/css" href="{{ asset('vendors/datatables/css/dataTables.bootstrap4.css') }}" />
    <link href="{{ asset('css/pages/tables.css') }}" rel="stylesheet" type="text/css" />
@stop

{{-- Page content --}}
@section('content')
<section class="content-header">
    <h1>@lang('table/title.typelist')</h1>
    <ol class="breadcrumb">
        <li>
            <a href="{{ route('admin.dashboard') }}"> <i class="livicon" data-name="home" data-size="16" data-color="#000"></i>
                @lang('general.dashboard')
            </a>
        </li>
        <li><a href="#">@lang('table/title.type')</a></li>
        <li class="active">@lang('table/title.typelist')</li>
    </ol>
</section>

<!-- Main content -->
<section class="content pr-3 pl-3">
    <div class="row">
        <div class="col-12">
        <div class="card ">
            <div class="card-header bg-primary text-white clearfix">
                <h4 class="card-title float-left"> <i class="livicon" data-name="users" data-size="16" data-loop="true" data-c="#fff" data-hc="white"></i>
                    @lang('table/title.typelist')
                </h4>
                <div class="float-right">
                    <a href="{{ URL::to('admin/types/create') }}" class="btn btn-sm btn-secondary"><span class="fa fa-plus"></span> @lang('button.create')</a>
                </div>
            </div>
            <br />
            <div class="card-body">
                <div class="table-responsive-lg table-responsive-md table-responsive-sm">
                <table class="table table-bordered" id="table">
                    <thead>
                        <tr class="filters">
                            <th>@lang('table/table.id')</th>
                            <th>@lang('table/table.title')</th>
                            <th>@lang('table/table.created_at')</th>
                            <th>@lang('table/table.actions')</th>
                        </tr>
                    </thead>
                    <tbody>
                    @if(!empty($types))
                        @foreach ($types as $type)
                            <tr>
                                <td>{{ $type->id }}</td>
                                <td>{{ $type->name }}</td>
                                <td>{{ $type->created_at->diffForHumans() }}</td>
                                <td>
                                    <a href="{{ URL::to('admin/types/' . $type->id ) }}"><i class="livicon"
                                                                                                     data-name="info"
                                                                                                     data-size="18"
                                                                                                     data-loop="true"
                                                                                                     data-c="#428BCA"
                                                                                                     data-hc="#428BCA"
                                                                                                     title="@lang('table/table.view-type-comment')"></i></a>
                                    <a href="{{ URL::to('admin/types/' . $type->id . '/edit' ) }}"><i class="livicon"
                                                                                                     data-name="edit"
                                                                                                     data-size="18"
                                                                                                     data-loop="true"
                                                                                                     data-c="#428BCA"
                                                                                                     data-hc="#428BCA"
                                                                                                     title="@lang('table/table.update-type')"></i></a>
                                    <a href="{{ URL::to('admin/types/' . $type->id ) }}" data-toggle="modal" data-id="{{$type->id }}"
                                       data-target="#delete_confirm"><i class="livicon" data-name="remove-alt"
                                                                        data-size="18" data-loop="true" data-c="#f56954"
                                                                        data-hc="#f56954"
                                                                        title="@lang('table/table.delete-type')"></i></a>
                                </td>
                            </tr>
                        @endforeach
                    @endif
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    </div>
    </div><!-- row-->
</section>
@stop

{{-- page level scripts --}}
@section('footer_scripts')
    <script type="text/javascript" src="{{ asset('vendors/datatables/js/jquery.dataTables.js') }}"></script>
    <script type="text/javascript" src="{{ asset('vendors/datatables/js/dataTables.bootstrap4.js') }}"></script>

    <script>
        $(document).ready(function() {
            $('#table').DataTable();
        });
    </script>

    <div class="modal fade" id="delete_confirm" tabindex="-1" role="dialog" aria-labelledby="deleteLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="deleteLabel">Delete Blog</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div class="modal-body">
                    Are you sure to delete this type? This operation is irreversible.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <a  type="button" class="btn btn-danger Remove_square">Delete</a>
                    <input type="hidden" value="" name="iddelete" id="iddelete"/>

                </div>
            </div>
            <!-- /.modal-content -->
        </div>
    </div>
<script>
$(function () {
	$('body').on('hidden.bs.modal', '.modal', function () {
		$(this).removeData('bs.modal');
	});
});
var $url_path = '{!! url('/') !!}';
$('#delete_confirm').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget)
    var $recipient = button.data('id');
    $("#iddelete").val($recipient);
})

$("#delete_confirm").click(function(e){
    var id=$("#iddelete").val();

    e.preventDefault();

    $.ajax({
        type: "DELETE",
        url: "{{ Request::url()}}/"+String(id),
        dataType: "JSON",
        error:function () {
            console.log('data');
        },
        success: function(data) {
            $('#delete_confirm').modal('hide');
            window.setTimeout(function(){location.reload()},1000)
        }
    });
});
</script>
@stop
