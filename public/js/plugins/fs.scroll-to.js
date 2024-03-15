+function ($) 
{
	'use strict';
	
	var ScrollTo = function (element, options)
	{
		this.namespace = null;
		this.options = null;
		this.$element = null;
		
		this.init('.fs.scroll-to', element, options);
	};
	
	ScrollTo.prototype = {
		init: function (namespace, element, options)
		{
			// Основная инфа
			this.namespace = namespace;

			this.$element = $(element);
			this.options = this.getOptions(options);

			// Триггер
			this.$element.on('click' + this.namespace, $.proxy(this.onClick, this));
		},

		getOptions: function (options)
		{
			return $.extend({}, this.DEFAULTS, this.$element.data(), options);
		},
		
		getAnimationDuration: function ()
		{
			var time = this.options.time,
				parsed;
			
			if (time in this.ANIMATION_DURATIONS)
			{
				return this.ANIMATION_DURATIONS[time];
			}
			else if (typeof time === 'number' || typeof time === 'string' && !isNaN(time))
			{
				return +time;
			}
			else if (typeof time === 'string' && (parsed = time.match(/^([\d+\.])(m?s)/)))
			{
				switch (parsed[1])
				{
					case 'ms': return 1 * parsed[0];
					case 's': return 1000 * parsed[0];
				}
			}
			
			return this.ANIMATION_DURATIONS.default
		},

		onClick: function (e)
		{
			e.preventDefault();

			var $target = $(this.options.target || $(e.currentTarget).attr('href'));

			if ($target.length)
			{
				$('html,body').animate(
					{scrollTop: $target.offset().top - this.options.gap},
					this.getAnimationDuration(),
					this.options.easing
				);
			}
		},
	};
	
	
	
	// ОБЪЯВЛЕНИЕ ПЛАГИНА
	// ==================
	
	var plugin = $.fn.scrollTo = function (option, args)
	{
		return this.each(function ()
		{
			var $this = $(this);
			var data = $this.data('fs.scroll-to');
			var options = (typeof option === 'object') && option;
			
			if (!data)
			{
				$this.data('fs.scroll-to', (data = new ScrollTo(this, options)));
			}
			
			if (typeof option === 'string' && typeof data[option] === 'function')
			{
				data[option].apply(data, args);
			}
		});
	};
	
	ScrollTo.prototype.ANIMATION_DURATIONS = {
		'fast': 200,
		'default': 400,
		'slow': 600,
	};
	
	plugin.DEFAULTS = ScrollTo.prototype.DEFAULTS = {
		time: 'default',
		easing: 'swing',
		target: null,
		gap: 0, // отступ до позиции
	};
	
	
	// SCROLL-TO AUTO INIT
	// ======================
	
	$(document).ready(function ()
	{
		$('.-js-scroll-to').scrollTo();
	});
	
} (jQuery);