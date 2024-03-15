<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>
    
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    <title>
        <?php $__env->startSection('title'); ?>
            | Findsport.uz
        <?php echo $__env->yieldSection(); ?>
    </title>

    <!-- global css -->
    <link href="<?php echo e(asset('css/app.css')); ?>" rel="stylesheet" type="text/css"/>
    <!-- end of global css -->

    <!--page level css-->
    <?php echo $__env->yieldContent('header_styles'); ?>
    <!--end of page level css-->

<body class="skin-josh">
<header class="header">
    <a href="<?php echo e(route('admin.dashboard')); ?>" class="logo">
        <img src="<?php echo e(asset('img/logo.png')); ?>" alt="logo" style="  width: 120px;">
    </a>
    <nav class="navbar navbar-static-top" role="navigation">
        <!-- Sidebar toggle button-->
        <div>
            <a href="#" class="navbar-btn sidebar-toggle" data-toggle="offcanvas" role="button">
                <div class="responsive_nav"></div>
            </a>
        </div>
        <div class="navbar-right toggle">
            <ul class="nav navbar-nav  list-inline">
                <?php echo $__env->make('admin.layouts._messages', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                <?php echo $__env->make('admin.layouts._notifications', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                <li class=" nav-item dropdown user user-menu">
                    <a href="#" class="dropdown-toggle nav-link" data-toggle="dropdown">

                        <?php if(auth()->user()->avatar?->url): ?>
                            <img src="<?php echo e(auth()->user()->avatar?->url); ?>" alt="img" height="35px" width="35px"
                                 class="rounded-circle img-fluid float-left"/>

                        <?php elseif(auth()->user()->gender === "male"): ?>
                            <img src="<?php echo e(asset('images/authors/avatar3.png')); ?>" alt="img" height="35px" width="35px"
                                 class="rounded-circle img-fluid float-left"/>

                        <?php elseif(auth()->user()->gender === "female"): ?>
                            <img src="<?php echo e(asset('images/authors/avatar5.png')); ?>" alt="img" height="35px" width="35px"
                                 class="rounded-circle img-fluid float-left"/>

                        <?php else: ?>
                            <img src="<?php echo e(asset('images/authors/no_avatar.jpg')); ?>" alt="img" height="35px" width="35px"
                                 class="rounded-circle img-fluid float-left"/>
                        <?php endif; ?>
                        <div class="riot">
                            <div>
                                <p class="user_name_max"><?php echo e(auth()->user()->first_name); ?> <?php echo e(auth()->user()->last_name); ?></p>
                                <span>
                                        <i class="caret"></i>
                                    </span>
                            </div>
                        </div>
                    </a>
                    <ul class="dropdown-menu">
                        <!-- User image -->
                        <li class="user-header bg-light-blue">
                            <?php if(auth()->user()->avatar?->url): ?>
                                <img src="<?php echo e(auth()->user()->avatar?->url); ?>" alt="img" height="35px" width="35px"
                                     class="rounded-circle img-fluid float-left"/>

                            <?php elseif(auth()->user()->gender === "male"): ?>
                                <img src="<?php echo e(asset('images/authors/avatar3.png')); ?>" alt="img" height="35px" width="35px"
                                     class="rounded-circle img-fluid float-left"/>

                            <?php elseif(auth()->user()->gender === "female"): ?>
                                <img src="<?php echo e(asset('images/authors/avatar5.png')); ?>" alt="img" height="35px" width="35px"
                                     class="rounded-circle img-fluid float-left"/>
                            <?php else: ?>
                                <img src="<?php echo e(asset('images/authors/no_avatar.jpg')); ?>" alt="img" height="35px" width="35px"
                                     class="rounded-circle img-fluid float-left"/>
                            <?php endif; ?>
                            <p class="topprofiletext"><?php echo e(auth()->user()->first_name); ?> <?php echo e(auth()->user()->last_name); ?></p>
                        </li>
                        <!-- Menu Body -->
                        <li>
                            <a href="<?php echo e(URL::route('admin.users.show',auth()->user()->id)); ?>">
                                <i class="livicon" data-name="user" data-s="18"></i>
                                My Profile
                            </a>
                        </li>
                        <li role="presentation"></li>
                        <li>
                            <a href="<?php echo e(route('admin.users.edit', auth()->user()->id)); ?>">
                                <i class="livicon" data-name="gears" data-s="18"></i>
                                Account Settings
                            </a>
                        </li>
                        <!-- Menu Footer-->
                        <li class="user-footer">
                            <div class="float-left">
                                <a href="<?php echo e(URL::route('lockscreen',auth()->user()->id)); ?>">
                                    <i class="livicon" data-name="lock" data-size="16" data-c="#555555" data-hc="#555555" data-loop="true"></i>
                                    Lock
                                </a>
                            </div>
                            <div class="float-right">
                                <a href="<?php echo e(URL::to('/logout')); ?>">
                                    <i class="livicon" data-name="sign-out" data-s="18"></i>
                                    Logout
                                </a>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>

    </nav>
</header>
<div class="wrapper ">
    <!-- Left side column. contains the logo and sidebar -->
    <aside class="left-side ">
        <section class="sidebar ">
            <div class="page-sidebar  sidebar-nav">
                <div class="nav_icons">
                    <ul class="sidebar_threeicons">
                        <li>
                            <a href="<?php echo e(URL::to('admin/advanced_tables')); ?>">
                                <i class="livicon" data-name="table" title="Advanced tables" data-loop="true"
                                   data-color="#418BCA" data-hc="#418BCA" data-s="25"></i>
                            </a>
                        </li>
                        <li>
                            <a href="<?php echo e(URL::to('admin/tasks')); ?>">
                                <i class="livicon" data-name="list-ul" title="Tasks" data-loop="true"
                                   data-color="#e9573f" data-hc="#e9573f" data-s="25"></i>
                            </a>
                        </li>
                        <li>
                            <a href="<?php echo e(URL::to('admin/gallery')); ?>">
                                <i class="livicon" data-name="image" title="Gallery" data-loop="true"
                                   data-color="#F89A14" data-hc="#F89A14" data-s="25"></i>
                            </a>
                        </li>
                        <li>
                            <a href="<?php echo e(URL::to('admin/users')); ?>">
                                <i class="livicon" data-name="user" title="Users" data-loop="true"
                                   data-color="#6CC66C" data-hc="#6CC66C" data-s="25"></i>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="clearfix"></div>
                <!-- BEGIN SIDEBAR MENU -->
                <?php echo $__env->make('admin.layouts._left_menu', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                <!-- END SIDEBAR MENU -->
            </div>
        </section>
    </aside>
    <aside class="right-side">

        <!-- Notifications -->
        <div id="notific">
        <?php echo $__env->make('notifications', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
        </div>

                <!-- Content -->
        <?php echo $__env->yieldContent('content'); ?>

    </aside>
    <!-- right-side -->
</div>
<a id="back-to-top" href="#" class="btn btn-primary btn-lg back-to-top" role="button" title="Return to top"
   data-toggle="tooltip" data-placement="left">
    <i class="livicon" data-name="plane-up" data-size="18" data-loop="true" data-c="#fff" data-hc="white"></i>
</a>
<!-- global js -->

<script src="<?php echo e(asset('js/admin.js')); ?>" type="text/javascript"></script>




<!-- end of global js -->
<!-- begin page level js -->
<?php echo $__env->yieldContent('footer_scripts'); ?>
        <!-- end page level js -->
</body>
</html>
<?php /**PATH /home/rustam/Downloads/findsport/resources/views/admin/layouts/default.blade.php ENDPATH**/ ?>