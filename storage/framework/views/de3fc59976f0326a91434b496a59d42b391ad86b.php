<ul id="menu" class="page-sidebar-menu">

    <li <?php echo (Request::is('admin') ? 'class="active"' : '' ); ?>>
        <a href="<?php echo e(route('admin.dashboard')); ?>">
            <i class="livicon" data-name="dashboard" data-size="18" data-c="#418BCA" data-hc="#418BCA" data-loop="true"></i>
            <span class="title">Dashboard</span>
        </a>
    </li>


    <li <?php echo (Request::is('admin/types') || Request::is('admin/options') || Request::is('admin/sports') || Request::is('admin/coatings') || Request::is('admin/inventories')  ? 'class="active"' : '' ); ?>>
        <a href="#">
            <i class="livicon" data-name="wrench" data-size="18" data-c="#6CC66C" data-hc="#6CC66C" data-loop="true"></i>
            <span class="title">Components</span>
            <span class="fa arrow"></span>
        </a>
        <ul class="sub-menu">
            <li <?php echo (Request::is('admin/types') ? 'class="active"' : '' ); ?>>
                <a href="<?php echo e(URL::to('admin/types')); ?>">
                    <i class="fa fa-angle-double-right"></i>
                    Types
                 </a>
            </li>
            <li <?php echo (Request::is('admin/options') ? 'class="active"' : '' ); ?>>
                <a href="<?php echo e(URL::to('admin/options')); ?>">
                    <i class="fa fa-angle-double-right"></i>
                    Infrastructure
                </a>
            </li>
            <li <?php echo (Request::is('admin/sports') ? 'class="active"' : '' ); ?>>
                <a href="<?php echo e(URL::to('admin/sports')); ?>">
                    <i class="fa fa-angle-double-right"></i>
                    Sports
                </a>
            </li>
            <li <?php echo (Request::is('admin/coatings') ? 'class="active"' : '' ); ?>>
                <a href="<?php echo e(URL::to('admin/coatings')); ?>">
                    <i class="fa fa-angle-double-right"></i>
                    Coatings
                </a>
            </li>
            <li <?php echo (Request::is('admin/inventories') ? 'class="active"' : '' ); ?>>
                <a href="<?php echo e(URL::to('admin/inventories')); ?>">
                    <i class="fa fa-angle-double-right"></i>
                    Inventory
                </a>
            </li>
        </ul>
    </li>
    <li <?php echo (Request::is('admin/playgrounds')? 'class="active"' : '' ); ?>>
        <a href="<?php echo e(URL::to('admin/playgrounds')); ?>">
            <i class="livicon" data-name="doc-portrait" data-c="#67C5DF" data-hc="#67C5DF" data-size="18" data-loop="true"></i>
            <span class="title">Playgrounds</span>
        </a>
    </li>
    <li <?php echo (Request::is('admin/sections') ? 'class="active"' : '' ); ?>>
        <a href="<?php echo e(URL::to('admin/sections')); ?>">
            <i class="livicon" data-c="#a46cef" data-hc="#EF6F6C" data-name="list-ul" data-size="18" data-loop="true"></i>
            Sections
        </a>
    </li>
    <li <?php echo (Request::is('admin/clubs') ? 'class="active"' : '' ); ?>>
        <a href="<?php echo e(URL::to('admin/clubs')); ?>">
            <i class="livicon" data-c="#33de78" data-hc="#cbde33" data-name="list-ul" data-size="18" data-loop="true"></i>
            Clubs
        </a>
    </li>

    <li <?php echo ( Request::is('admin/events') ? 'class="active"' : '' ); ?>>
        <a href="<?php echo e(URL::to('admin/events')); ?>">
            <i class="livicon" data-name="table" data-c="#418BCA" data-hc="#418BCA" data-size="18" data-loop="true"></i>
            <span class="title">Events</span>
        </a>
    </li>


    <li <?php echo ( Request::is('admin/site') ? 'class="active"' : '' ); ?>>
        <a href="<?php echo e(URL::to('admin/site')); ?>">
            <i class="livicon" data-name="wrench" data-size="18" data-c="#6CC66C" data-hc="#6CC66C" data-loop="true"></i>
            <span class="title">Site Settings</span>
        </a>
    </li>

    <li <?php echo (Request::is('admin/img-manager') ? 'class="active"' : '' ); ?>>
        <a href="<?php echo e(URL::to('admin/img-manager')); ?>">
            <i class="livicon" data-name="image" data-c="#418BCA" data-hc="#418BCA" data-size="18" data-loop="true"></i>
            <span class="title">Gallery</span>
            <span class="fa arrow"></span>
        </a>
    </li>
    <li <?php echo (Request::is('admin/users') ? 'class="active"' : '' ); ?>>
        <a href="#">
            <i class="livicon" data-name="user" data-size="18" data-c="#6CC66C" data-hc="#6CC66C" data-loop="true"></i>
            <span class="title">Users</span>
            <span class="fa arrow"></span>
        </a>
    </li>

    <li <?php echo (Request::is('admin/pages')  ? 'class="active"' : '' ); ?>>
        <a href="<?php echo e(URL::to('admin/pages')); ?>">
            <i class="livicon" data-name="move" data-c="#a46cef" data-hc="#ef6f6c" data-size="18" data-loop="true"></i>
            <span class="title">Pages</span>
        </a>
    </li>

    <!-- Menus generated by CRUD generator -->
    <?php echo $__env->make('admin/layouts/menu', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
</ul>
<?php /**PATH /home/rustam/Private/felix/findsport/resources/views/admin/layouts/_left_menu.blade.php ENDPATH**/ ?>