
<li class="dropdown notifications-menu">
    <a href="#dropdownshow" class="dropdown-toggle" data-toggle="dropdown">
        <i class="livicon" data-name="bell" data-loop="true" data-color="#e9573f"
           data-hovercolor="#e9573f" data-size="28"></i>
        @if(count(auth()->user()->unreadNotifications) > 0)
            <span class="label bg-warning">{{ count(auth()->user()->unreadNotifications) }}</span>
        @endif
    </a>
    <ul class=" notifications dropdown-menu drop_notify" >
        <li class="dropdown-title">You have {{ count(auth()->user()->unreadNotifications) }} notifications</li>
        <li>
            <!-- inner menu: contains the actual data -->
            <ul class=" menu remove_hovereffect">
                @foreach(auth()->user()->unreadNotifications as $notification)
                    <li class="dropdown-item">
                        <i class="livicon danger" data-n="timer" data-s="20" data-c="white"
                           data-hc="white"></i>
                        <a href="#">{{ $notification->data['message'] }}</a>
                        <small class="float-right">
                            <span class="livicon p-2" data-n="timer" data-s="10"></span>
                            Just Now
                        </small>
                    </li>
                @endforeach
{{--                <li class="dropdown-item">--}}
{{--                    <i class="livicon bg-aqua" data-n="hand-right" data-s="20" data-c="white"--}}
{{--                       data-hc="white"></i>--}}
{{--                    <a href="#">New friend request</a>--}}
{{--                    <small class="float-right">--}}
{{--                        <span class="livicon p-2" data-n="timer" data-s="10"></span>--}}
{{--                        An hour ago--}}
{{--                    </small>--}}
{{--                </li>--}}
            </ul>
        </li>
        <li class="footer">
            <a href="#">View all</a>
        </li>
    </ul>
</li>
