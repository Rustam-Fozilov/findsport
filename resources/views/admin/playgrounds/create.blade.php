@extends('admin/layouts/default')

@section('title')
Playground
@parent
@stop
@section('header_styles')
    <link href="{{ asset('vendors/daterangepicker/css/daterangepicker.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('vendors/datetimepicker/css/bootstrap-datetimepicker.min.css') }}" rel="stylesheet"
          type="text/css" />
    <link href="{{ asset('vendors/clockface/css/clockface.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('vendors/jasny-bootstrap/css/jasny-bootstrap.css') }}" rel="stylesheet" type="text/css" />
    <style>
        .ranges li.active {
            color: #fff !important;
        }
        .bootstrap-datetimepicker-widget.dropdown-menu {width: auto;}
    </style>
    <link href="/css/jq.multiinput.min.css" rel="stylesheet">
    <link href="{{ asset('vendors/bootstrap3-wysihtml5-bower/css/bootstrap3-wysihtml5.min.css') }}"  rel="stylesheet" media="screen"/>
    <link href="{{ asset('css/pages/editor.css') }}" rel="stylesheet" type="text/css"/>
    <link type="text/css" href="{{ asset('vendors/bootstrap-multiselect/css/bootstrap-multiselect.css') }}"
          rel="stylesheet"/>
    <link href="{{ asset('vendors/select2/css/select2.min.css') }}" rel="stylesheet"/>
    <link href="{{ asset('vendors/select2/css/select2-bootstrap.css') }}" rel="stylesheet"/>
    <link href="{{ asset('vendors/selectize/css/selectize.css') }}" rel="stylesheet"/>
    <link href="{{ asset('vendors/selectize/css/selectize.bootstrap3.css') }}" rel="stylesheet"/>
    <link href="{{ asset('vendors/iCheck/css/all.css') }}" rel="stylesheet"/>
    <link href="{{ asset('vendors/iCheck/css/line/line.css') }}" rel="stylesheet"/>
    <link href="{{ asset('vendors/bootstrap-switch/css/bootstrap-switch.css') }}" rel="stylesheet"/>
    <link href="{{ asset('vendors/switchery/css/switchery.css') }}" rel="stylesheet"/>
    <link href="{{ asset('css/pages/formelements.css') }}" rel="stylesheet"/>
@stop

@section('content')
@include('common.errors')
<section class="content-header">
    <h1>Playground</h1>
    <ol class="breadcrumb">
        <li>
            <a href="{{ route('admin.dashboard') }}"> <i class="livicon" data-name="home" data-size="16" data-color="#000"></i>
                Dashboard
            </a>
        </li>
        <li>Playgrounds</li>
        <li class="active">Create Playground </li>
    </ol>
</section>
<section class="content">
<div class="container">
<div class="row">
    <div class="col-12">
     <div class="card border-primary">
            <div class="card-header bg-primary text-white">
                <h4 class="card-title"> <i class="livicon" data-name="user" data-size="16" data-loop="true" data-c="#fff" data-hc="white"></i>
                    Create New  Playground
                </h4></div>
            <br />
            <div class="card-body">
            {!! Form::open(['route' => 'admin.playgrounds.store']) !!}

                @include('admin.playgrounds.fields')

            {!! Form::close() !!}
        </div>
      </div>
      </div>
 </div>

</div>
</section>
 @stop
@section('footer_scripts')
    <script src="{{ asset('vendors/moment/js/moment.min.js') }}" type="text/javascript"></script>
    <script src="{{ asset('vendors/daterangepicker/js/daterangepicker.js') }}" type="text/javascript"></script>
    <script src="{{ asset('vendors/datetimepicker/js/bootstrap-datetimepicker.min.js') }}" type="text/javascript"></script>
    <script src="{{ asset('vendors/clockface/js/clockface.js') }}" type="text/javascript"></script>
    <script src="{{ asset('vendors/jasny-bootstrap/js/jasny-bootstrap.js') }}" type="text/javascript"></script>
    <script src="{{ asset('js/pages/datepicker.js') }}" type="text/javascript"></script>
    <script src="/js/jq.multiinput.min.js"></script>

    <script type="text/javascript"
            src="{{ asset('vendors/bootstrap-multiselect/js/bootstrap-multiselect.js') }}"></script>
    <script type="text/javascript" src="{{ asset('vendors/select2/js/select2.js') }}"></script>
    <script type="text/javascript" src="{{ asset('vendors/select2/js/select2.js') }}"></script>

    <script type="text/javascript" src="{{ asset('vendors/sifter/sifter.js') }}"></script>
    <script type="text/javascript"
            src="{{ asset('vendors/microplugin/microplugin.js') }}"></script>
    <script type="text/javascript"
            src="{{ asset('vendors/selectize/js/selectize.min.js') }}"></script>
    <script type="text/javascript" src="{{ asset('vendors/iCheck/js/icheck.js') }}"></script>
    <script type="text/javascript"
            src="{{ asset('vendors/bootstrap-switch/js/bootstrap-switch.js') }}"></script>
    <script type="text/javascript"
            src="{{ asset('vendors/switchery/js/switchery.js') }}"></script>
    <script type="text/javascript"
            src="{{ asset('vendors/bootstrap-maxlength/js/bootstrap-maxlength.js') }}"></script>
    <script type="text/javascript"
            src="{{ asset('vendors/card/js/jquery.card.js') }}"></script>
    <script type="text/javascript" src="{{ asset('js/pages/custom_elements.js') }}"></script>
    <!-- Bootstrap WYSIHTML5 -->
    <script src="{{asset('vendors/ckeditor/js/ckeditor.js')}}" type="text/javascript"></script>

    <script type="text/javascript">
        $(document).ready(function() {
            $("form").submit(function() {
                $('input[type=submit]').attr('disabled', 'disabled');
                return true;
            });
        });
    </script>
    <script>
        // Replace the <textarea id="editor1"> with a CKEditor
        // instance, using default configuration.
        CKEDITOR.replace( 'ckeditor_full' );
        CKEDITOR.replace( 'ckeditor_full2' );

        $('#multi_phone').multiInput({
            input: $('<div class="row inputElement">\n' +
                '    <div class="multiinput-title col-xs-12">Phone <span class="number">1</span>:</div>\n' +
                '    <div class="input-group input-group-merge " style="padding-bottom:10px";>\n' +
                '    <div class="input-group-prepend">\n' +
                '    <span class="input-group-text">' +
                '<svg height="14" version="1.1" width="14" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="overflow: hidden; position: relative; left: -0.421875px; top: -0.796875px;" id="canvas-for-livicon-37"><desc style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">Created with Raphaël 2.3.0</desc><defs style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></defs><path fill="#333333" stroke="none" d="M21.291,21.271C20.116,20.788,19.645,19.452,19.645,19.452S19.116,19.756,19.116,18.908C19.116,18.058,19.645,19.452,20.176,16.179000000000002C20.176,16.179000000000002,21.644,15.753000000000002,21.351999999999997,12.238000000000003H20.997999999999998C20.997999999999998,12.238000000000003,21.880999999999997,8.479000000000003,20.997999999999998,7.206000000000003C20.115999999999996,5.933000000000003,19.763999999999996,5.085000000000003,17.820999999999998,4.477000000000003C15.879999999999997,3.8700000000000028,16.587999999999997,3.991000000000003,15.174999999999997,4.053000000000003C13.762999999999998,4.1140000000000025,12.585999999999997,4.902000000000003,12.585999999999997,5.325000000000003C12.585999999999997,5.325000000000003,11.703999999999997,5.386000000000003,11.351999999999997,5.750000000000003C10.998999999999997,6.1140000000000025,10.410999999999996,7.810000000000002,10.410999999999996,8.235000000000003S10.805999999999996,11.509000000000004,11.099999999999996,12.116000000000003L10.648999999999996,12.237000000000004C10.354999999999995,15.752000000000004,11.824999999999996,16.178000000000004,11.824999999999996,16.178000000000004C12.353999999999996,19.450000000000003,12.883999999999995,18.057000000000006,12.883999999999995,18.907000000000004C12.883999999999995,19.755000000000003,12.353999999999996,19.451000000000004,12.353999999999996,19.451000000000004S11.883999999999995,20.787000000000003,10.707999999999995,21.270000000000003C9.530999999999995,21.755000000000003,3.002999999999995,24.361000000000004,2.471999999999994,24.906000000000002C1.942,25.455,2.002,28,2.002,28H29.997999999999998C29.997999999999998,28,30.058999999999997,25.455,29.526999999999997,24.906C28.996,24.361,22.468,21.756,21.291,21.271Z" stroke-width="0" transform="matrix(0.4375,0,0,0.4375,0,0)" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path></svg>' +
                '</span>\n' +
                '    </div>\n' +
                '    <input class="form-control" type="text"  name="username" > \n' +
                '    </div>\n'+
                '    <div class="input-group input-group-merge">\n' +
                '    <div class="input-group-prepend">\n' +
                '    <span class="input-group-text">' +
                '<svg height="16" version="1.1" width="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="overflow: hidden; position: relative; left: -0.5px; top: -0.296875px;" id="canvas-for-livicon-38"><desc style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">Created with Raphaël 2.3.0</desc><defs style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></defs><path fill="#000000" stroke="none" d="M29,10.5C28.422,10.115,27.221,9.483,26.6,9.2C23.746000000000002,7.895,19.700000000000003,7.3999999999999995,16,7.3999999999999995C12.3,7.3999999999999995,8.254,7.895,5.4,9.2C4.779,9.484,3.578,10.115,3,10.5C2.4,10.9,1.6,11.899000000000001,2.1,13.2L3.5,16L10,12.6L9.324,11.247C9.2,11,9.245,10.707,9.5,10.601C10.7,10.101,12.9,9.301,16,9.301C19.1,9.301,21.299,10.101,22.5,10.601C22.754,10.707,22.799,11.001000000000001,22.676,11.248000000000001L22,12.601L28.5,16.001L29.898,13.201C30.4,11.9,29.6,10.9,29,10.5Z" transform="matrix(0.5,0,0,0.5,0,0)" stroke-width="0" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path><path fill="#000000" stroke="none" d="M23.899,16.601C23.2,15.100999999999999,21.700000000000003,14.200999999999999,20.200000000000003,13.600999999999999V12.501C20.200000000000003,11.401,19.499000000000002,10.901,18.499000000000002,10.901H16H16H13.5C12.5,10.901,11.8,11.401,11.8,12.501V13.600999999999999C10.3,14.200999999999999,8.8,15.100999999999999,8.100000000000001,16.601L6.200000000000001,22.901V26.401C6.200000000000001,27.301,7.000000000000001,28.001,7.800000000000001,28.001H16H16H24.2C24.999,28.001,25.8,27.302,25.8,26.401V22.901L23.899,16.601ZM16,21.301C13.073,21.301,10.7,19.599999999999998,10.7,17.5C10.7,15.402000000000001,13.073,13.701,16,13.701S21.3,15.402000000000001,21.3,17.5C21.3,19.6,18.927,21.301,16,21.301ZM18.3,17.5C18.3,18.494,17.271,19.301,16,19.301C14.73,19.301,13.7,18.494,13.7,17.5C13.7,16.506,14.729999999999999,15.701,16,15.701C17.271,15.701,18.3,16.506,18.3,17.5ZM14.9,19.6C14.624,19.6,14.4,19.825000000000003,14.4,20.1C14.4,20.377000000000002,14.624,20.6,14.9,20.6S15.4,20.377000000000002,15.4,20.1C15.4,19.824,15.176,19.6,14.9,19.6ZM12.9,18.5C12.624,18.5,12.4,18.725,12.4,19S12.624,19.5,12.9,19.5S13.4,19.275,13.4,19S13.176,18.5,12.9,18.5ZM12.2,16.5C11.924,16.5,11.7,16.724,11.7,17C11.7,17.276,11.924,17.5,12.2,17.5S12.7,17.276,12.7,17C12.7,16.725,12.477,16.5,12.2,16.5ZM13.8,14.9C13.524000000000001,14.9,13.3,15.124,13.3,15.4S13.524000000000001,15.9,13.8,15.9S14.3,15.676,14.3,15.4S14.076,14.9,13.8,14.9ZM16,14.219C15.724,14.219,15.5,14.443,15.5,14.719S15.724,15.219,16,15.219S16.5,14.995,16.5,14.719S16.276,14.219,16,14.219ZM16.7,20.1C16.7,20.377000000000002,16.923,20.6,17.201,20.6C17.476,20.6,17.701,20.377000000000002,17.701,20.1C17.701,19.825000000000003,17.476,19.6,17.201,19.6C16.923,19.6,16.7,19.824,16.7,20.1ZM18.701,19C18.701,19.275,18.924,19.5,19.201,19.5C19.476,19.5,19.701,19.275,19.701,19S19.476,18.5,19.201,18.5C18.924,18.5,18.701,18.725,18.701,19ZM19.4,16.9C19.4,17.174999999999997,19.622999999999998,17.4,19.9,17.4C20.174999999999997,17.4,20.4,17.174999999999997,20.4,16.9C20.4,16.624,20.174999999999997,16.4,19.9,16.4C19.623,16.4,19.4,16.625,19.4,16.9ZM17.801,15.4C17.801,15.676,18.023999999999997,15.9,18.301,15.9C18.575999999999997,15.9,18.801,15.676,18.801,15.4S18.575999999999997,14.9,18.301,14.9C18.023,14.9,17.801,15.125,17.801,15.4Z" stroke-width="0" transform="matrix(0.5,0,0,0.5,0,0)" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path></svg>' +
                '</span>\n' +
                '    </div>\n' +
                '    <input class="form-control" type="tel" maxlength="13" pattern="^\\+998[0-9 ]*$" name="phone" value="+998" id="phone">\n' +
                '    </div>\n'),
            // true: generate an HTML form from JSON
            // default: false
            json: true

        });
        $('#multiselect3').multiselect({
            maxHeight: 800,
            buttonWidth: '100%',
            dropUp: true,
            templates: {
                li: '<a class="multiselect-option dropdown-item"><a>' +
                    '<label style="display:inline;"></label>' +
                    '<input type="text" class="daytime"/>' +
                    '</a></a>'
            }
        });
        $('.daytime')
            .datetimepicker({
                format: 'HH:mm',
                locale: 'ru',
                icons: {
                    time: 'fa fa-clock-o',
                    date: 'fa fa-calendar',
                    up: 'fa fa-chevron-up',
                    down: 'fa fa-chevron-down',
                    previous: 'fa fa-chevron-left',
                    next: 'fa fa-chevron-right',
                },
            })
            .parent()
            .css('position :relative');
        function placeMap() {
            let place_lat = parseFloat($("#place_lat").val()) || 48.323586;
            let place_lng = parseFloat($("#place_lng").val()) || 66.463691;

            let map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: place_lat, lng: place_lng },
                zoom: 5,
                mapTypeId: "roadmap",
                mapTypeControl: false,
                fullscreenControl: true,
                streetViewControl: false,
                disableDefaultUI: false,
            });

            // Create marker by lat,lng
            let latLng = new google.maps.LatLng(place_lat, place_lng);
            let marker = new google.maps.Marker({
                position: latLng,
                map: map,
                draggable: true,
            });

            // Create the search box and link it to the UI element.
            let input = document.getElementById("place_coordinates");
            let searchBox = new google.maps.places.SearchBox(input);
            // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            google.maps.event.addListener(marker, "dragend", function (event) {
                let latPosition = this.getPosition().lat();
                let longPosition = this.getPosition().lng();
                const geocoder = new google.maps.Geocoder();
                let data = {
                    lat: latPosition,
                    lng: longPosition,
                };
                geocodeLatLng(geocoder, map, input, data);
                $("#place_lat").val(latPosition);
                $("#place_lng").val(longPosition);
            });

            // Bias the SearchBox results towards current map's viewport.
            map.addListener("bounds_changed", function () {
                searchBox.setBounds(map.getBounds());
            });

            let markers = [marker];
            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBox.addListener("places_changed", function () {
                let places = searchBox.getPlaces();

                if (places.length === 0) {
                    return;
                }

                // Clear out the old markers.
                markers.forEach(function (marker) {
                    marker.setMap(null);
                });
                markers = [];

                // For each place, get the icon, name and location.
                let bounds = new google.maps.LatLngBounds();
                places.forEach(function (place) {
                    if (!place.geometry) {
                        console.log("Returned place contains no geometry");
                        return;
                    }

                    // Create a marker for each place.
                    markers.push(
                        new google.maps.Marker({
                            map: map,
                            title: place.name,
                            position: place.geometry.location,
                            draggable: true,
                        })
                    );

                    if (place.geometry.viewport) {
                        // Only geocodes have viewport.
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }

                    console.log("place:", place);
                    console.log(
                        "latitude: " +
                        place.geometry.location.lat() +
                        ", longitude: " +
                        place.geometry.location.lng()
                    );

                    $("#place_address").val(place.formatted_address);
                    $("#place_lat").val(place.geometry.location.lat());
                    $("#place_lng").val(place.geometry.location.lng());
                    console.log("auf");
                });
                map.fitBounds(bounds);
            });
        }

        function geocodeLatLng(geocoder, map, input, data) {
            geocoder.geocode({ location: data }, (results, status) => {
                if (status === "OK") {
                    if (results[0]) {
                        input.value = results[0].formatted_address;
                    } else {
                        window.alert("No results found");
                    }
                } else {
                    window.alert("Geocoder failed due to: " + status);
                }
            });
        }
    </script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCrXqknwksGyQWqKKzv60ECB2Xk4P-VwAc&libraries=places&callback=placeMap"></script>

@stop
