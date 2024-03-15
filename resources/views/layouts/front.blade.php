<!DOCTYPE HTML>
<html lang="ru">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="language" content="ru"/>
    <meta name="theme-color" content="#f64866">

@stack('begin')

    <title>@yield('title') FindSport.uz</title>

</head>

<body>
@stack('body-begin')
<div id="header">
    <section class="header">
        <a href="/" class="header__logo logo-marketplace">
            <img class="logo-marketplace__logo" src="/images/findsport-white.svg"
                 alt="FindSport">
        </a>

        <nav class="header__nav header-nav ">
            <a class="header-nav__link {{ $header['playground'] ?? ''}}" href="/playgrounds/">{{__('Площадки')}}</a>
            <a class="header-nav__link {{ $header['section'] ?? ''}}" href="/sections/">{{__('Секции')}}</a>
            <a class="header-nav__link {{ $header['club'] ?? ''}}" href="/clubs/">{{__('Клубы')}}</a>
            <a class="header-nav__link {{ $header['event'] ?? '' }}" href="/events/">{{__('События')}}</a>
        </nav>
        <div class="header__actions">
            <div class="header__action" id="-js-header-region-location">
                <div class="widget-dropdown-region-container -js-widget-header-region-dropdown">
                    <a class="button button_size_s button_theme_linky-secondary button_header_alignment"
                       role="button">
                        {{$regions->find(session('region', 1))->name}} <span
                            class="button__icon button__icon_placement_right icon icon_size_s icon_globe-pin-white"></span>
                    </a>
                    <ul class="dropdown-list dropdown-list_placement_bottom-right dropdown-list_prevent-narrow -js-widget-header-region-dropdown-list">
                        @foreach($regions as $region)
                            @if ($loop->iteration!==(int)(session('region', 1)))
                                <li class="dropdown-list__item">
                                    <a class="dropdown-list__link"
                                       href="/region/{{$region->id}}">{{$region->name}}</a></li>
                            @endif
                        @endforeach
                    </ul>
                </div>
                <div class="widget-clarify-location dropdown-list" id="-js-widget-clarify-location">
                    {{__('Ваш город')}} <b>{{$regions->first()->name}}</b>?
                    <br>
                    <div class="widget-clarify-location__actions">
                        <button class="button button_size_m button_theme_action-primary" type="button"
                                id="clarify-location-ok">{{__('Всё верно')}}
                        </button>
                        <button class="button button_size_m button_theme_linky-primary" type="button"
                                id="clarify-location-choose">{{__('Выбрать город')}}
                        </button>
                    </div>
                </div>
            </div>

            <div class="header__action">
                <a
                    class="button button_size_s button_theme_normal-secondary -js-home-header__link"
                    href="site/playground"
                    data-target="object-add"
                >
                    Добавить объект
                </a>
            </div>


        </div>
    </section>
</div>
<!-- END HEADER -->

<!-- CONTENT -->
@yield('content')
<!-- END CONTENT -->
@stack('body-end')
<!-- FOOTER -->
<div id="footer">
    <div class="container">
        <ul class="menu" id="yw0">
            @foreach($pages as $page)
            <li><a href="/page/{{$page->slug}}">{{$page->name}}</a></li>
            @endforeach
        </ul>
        <div class="howto">
            <span class="info-icon"></span>
            <a class="howto-link" href="/page/howto">{{__('Как это работает')}}</a></div>


        <div style="float:right;">
            <a class="open-feedback" data-toggle="modal" data-target="#problem-modal"
               href="#">{{__('Что-то работает не так?')}}</a></div>
        <div class="clear"></div>
        <span class="site">&copy; 2021 Findsport.uz </span>
        <a href="/admin-manager" class="manager-enter" title="Вход для администраторов"></a>

        <span class="paycards"></span>
        <a class="sitemap-link" href="/">{{__('Карта сайта')}}</a>
        <div class="clear"></div>
    </div>
</div>
<!-- END FOOTER -->
<noindex>
    <div class="old-browser-notification -js-old-browser-notification">
        <div>В вашем браузере <span class="-js-browser-name"></span>страница может отображаться неправильно. <a
                href="/page/update" target="_blank" style="text-decoration:underline">Перейдите</a> для установки
            современного браузера.
        </div>
        <a class="close -js-close" title="Закрыть"></a>
    </div>
</noindex>

<div class="-boobstrap">
    <div class="modal fade" id="problem-modal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-md">
            <div class="preloader"></div>
            <div class="modal-content" style="min-height: 424px;">
                <div class="modal-header" style="background:#fff;padding-bottom:0;margin-bottom:-13px;z-index:1;">
                    <div class="h4 modal-title"></div>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                            aria-hidden="true">&times;</span></button>
                </div>
            </div>
        </div>
    </div>
</div>

<script id="hbs-problem-modal-form" type="text/x-handlebars-template">
    <div class="-js-form">
        <div class="modal-body">
            <div class="form-group">
                <label class="control-label">{{__('message ')}}</label>
                <textarea class="form-control" name="Problem[message]" style="height:200px;"></textarea>
            </div>
            <div class="row">
                <div class="col-6">
                    <div class="form-group">
                        <label class="control-label">{{__('name')}}</label>
                        <input class="form-control" name="Problem[name]" type="text">
                    </div>
                </div>
                <div class="col-6">
                    <div class="form-group">
                        <label class="control-label">{{__('email')}}</label>
                        <input class="form-control" name="Problem[email]" type="email">
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary">Отправить</button>
        </div>
    </div>
    <div class="-js-result hidden">
        <div class="modal-body"
             style="display:flex;align-items:center;justify-content:center;height:300px;text-align:center;width:100%;">
            <p>
                Спасибо!<br>Ваше обращение будет рассмотрено в ближайшее время<br> и ответ придёт на указанный
                email.<br><br>
                <img src="/images/map-current-35x36.png">
            </p>
        </div>
    </div>
</script>

@stack('end')

</body>
</html>
