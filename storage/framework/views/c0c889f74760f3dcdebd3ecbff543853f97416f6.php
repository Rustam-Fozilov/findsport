<li class="dropdown messages-menu ">
    <a href="#" class="dropdown-toggle" data-toggle="dropdown" id="dropdownMenuLink" aria-haspopup="true" aria-expanded="false"> <i class="livicon"
                                                                   data-name="message-flag"
                                                                   data-loop="true" data-color="#42aaca"
                                                                   data-hovercolor="#42aaca"
                                                                   data-size="28"></i>
        <?php if(!empty($count) && $count>0): ?>
        <span class="label bg-success"><?php echo e($count); ?></span>
            <?php endif; ?>
    </a>


    <ul class="dropdown-menu dropdown-messages mr-auto" aria-labelledby="dropdownMenuLink">
        <?php if(!empty($count) && $count>0): ?>
        <li class="dropdown-title"><?php echo e($count); ?> New Messages</li>
            <?php else: ?>
            <li class="dropdown-title">Nothing to show</li>
        <?php endif; ?>
            <?php if(isset($notifications)): ?>
                <?php $__currentLoopData = $notifications; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $notification): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <?php if(\App\Models\User::where('id',$notification->user_id)->exists()): ?>
                    <li class="unread message dropdown-item">
                        <a href="<?php echo e(URL::to('admin/emails/'.$notification->id )); ?>" class="message"> <i class="float-right" data-toggle="tooltip"
                                                                                                  data-placement="top" title="Mark as Read"><span
                                        class="float-right ol livicon" data-n="adjust" data-s="10"
                                        data-c="#287b0b"></span></i>
                            <?php if($notification->senderName->image->url): ?>
                                <img src="<?php echo $notification->senderName->image->url; ?>"
                                     class="img-fluid rounded-circle message-image" alt="icon">
                            <?php elseif(auth()->user()->gender === "male"): ?>
                                <img src="<?php echo e(asset('images/authors/avatar3.png')); ?>" alt="img" class="img-fluid rounded-circle message-image"/>
                            <?php elseif(auth()->user()->gender === "female"): ?>
                                <img src="<?php echo e(asset('images/authors/avatar5.png')); ?>" alt="img" class="img-fluid rounded-circle message-image"/>

                            <?php else: ?>
                                <img src="<?php echo e(asset('images/authors/no_avatar.jpg')); ?>" alt="img" class="img-fluid rounded-circle message-image"/>
                            <?php endif; ?>

                            <div class="message-body">
                                <strong><?php echo e($notification->senderName->first_name); ?> <?php echo e($notification->senderName->last_name); ?></strong>
                                <br><?php echo e($notification->subject); ?>

                                <br>
                                <small><?php echo e($notification->created_at->diffForHumans()); ?></small>
                            </div>
                        </a>
                    </li>
                    <?php endif; ?>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            <?php endif; ?>
        <li class="footer">
            <a href="<?php echo e(url('admin/emails/inbox')); ?>">View all</a>
        </li>
    </ul>
</li>
<?php /**PATH /home/rustam/Downloads/findsport/resources/views/admin/layouts/_messages.blade.php ENDPATH**/ ?>