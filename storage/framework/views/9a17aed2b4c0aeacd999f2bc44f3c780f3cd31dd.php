
<li class="dropdown notifications-menu">
    <a href="#dropdownshow" class="dropdown-toggle" data-toggle="dropdown">
        <i class="livicon" data-name="bell" data-loop="true" data-color="#e9573f"
           data-hovercolor="#e9573f" data-size="28"></i>
        <?php if(count(auth()->user()->unreadNotifications) > 0): ?>
            <span class="label bg-warning"><?php echo e(count(auth()->user()->unreadNotifications)); ?></span>
        <?php endif; ?>
    </a>
    <ul class=" notifications dropdown-menu drop_notify" >
        <li class="dropdown-title">You have <?php echo e(count(auth()->user()->unreadNotifications)); ?> notifications</li>
        <li>
            <!-- inner menu: contains the actual data -->
            <ul class=" menu remove_hovereffect">
                <?php $__currentLoopData = auth()->user()->unreadNotifications; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $notification): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <li class="dropdown-item">
                        <i class="livicon danger" data-n="timer" data-s="20" data-c="white"
                           data-hc="white"></i>
                        <a href="#"><?php echo e($notification->data['message']); ?></a>
                        <small class="float-right">
                            <span class="livicon p-2" data-n="timer" data-s="10"></span>
                            Just Now
                        </small>
                    </li>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>









            </ul>
        </li>
        <li class="footer">
            <a href="#">View all</a>
        </li>
    </ul>
</li>
<?php /**PATH /home/rustam/Private/felix/findsport/resources/views/admin/layouts/_notifications.blade.php ENDPATH**/ ?>