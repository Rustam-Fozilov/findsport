/**
 * @module frontend.pages.placeView
 * 
 * @param {Marionette.Module} module
 * @param {Marionette.Application} app
 * @param {Backbone} Bb
 * @param {Marionette} Mn
 * @param {jQuery} $
 * @param {_} _
 */
application.module('pages.placeView', function (module, app, Bb, Mn, $, _, YandexMap)
{
	/**
	 * @param {Marionette.Module} module
	 * @param {Marionette.Application} app
	 * @param {Backbone} Bb
	 * @param {Marionette} Mn
	 * @param {jQuery} $
	 * @param {_} _
	 */
	(function (module, app, Bb, Mn, $, _)
	{
		module.Place = Bb.Model.extend({});
	})(module, app, Bb, Mn, $, _);
	/**
	 * @param {Marionette.Module} module
	 * @param {Marionette.Application} app
	 * @param {Backbone} Bb
	 * @param {Marionette} Mn
	 * @param {jQuery} $
	 * @param {_} _
	 */
	(function (module, app, Bb, Mn, $, _)
	{
		// COPY-PASTE из ../pages.playgroundView/90-jquery-dotdotdot-custom.js
		var defaultOptions = {
			after: '.-js-read-more-toggler',
			afterElement: '<a class="-new-link -js-read-more-toggler">Читать далее</a>',
			fullClass: '-show-full-text'
		};
		
		$.fn.dotdotdot.defaultArrays.lastCharacter.remove.push("\n", "\r", "<br>");
		
		module.dotdotdot = function (selector, options)
		{
			options = $.extend({}, defaultOptions, options);
			
			$(selector).each(function ()
			{
				var $el = $(this);
				var $originalContent = $('<div />').html($el.html());
				
				if (options.afterElement)
				{
					$el.append(options.afterElement);
				}
				
				$el.dotdotdot(options);
				
				if (options.after)
				{
					if ($el.hasClass('is-truncated'))
					{
						$originalContent.find(options.after).remove();
						$el.one('click', options.after, function (e)
						{
							e.preventDefault();
	
							$el.html($originalContent.html());
	
							if (options.fullClass)
							{
								$el.addClass(options.fullClass);
							}
						});
					}
					else
					{
						$el.find(options.after).remove();
					}
				}
			});
		};
	})(module, app, Bb, Mn, $, _);
	/**
	 * @param {Marionette.Module} module
	 * @param {Marionette.Application} app
	 * @param {Backbone} Bb
	 * @param {Marionette} Mn
	 * @param {jQuery} $
	 * @param {_} _
	 */
	(function (module, app, Bb, Mn, $, _)
	{
		// COPY-PASTE из ../pages.playgroundView/90-ez-popover.js
		var PLUGIN_DATA_ATTRIBUTE = 'plugin-ezPopover';
		
		var ObjectPool = Mn.extend.call(Array, {
			remove: function (obj)
			{
				var index = this._pool.indexOf(obj);
				
				if (-1 != index)
				{
					this._pool.splice(index, 1);
				}
				
				return this;
			}
		});
		
		
		function Handler(el)
		{
			this.$el = $(el);
			this.init();
		}
		
		Handler.prototype = {
			init: function ()
			{
				this.$popover = $(this.$el.data('target'));
				
				this.$el.on('click', $.proxy(this.onToggleElementClicked, this));
				this.$popover.on('click', $.proxy(this.onPopoverElementClicked, this));
				
				missClickClosePool.push(this);
			},
			
			hide: function ()
			{
				this.$popover.addClass('hidden');
			},
			
			show: function ()
			{
				this.$popover.removeClass('hidden');
			},
			
			toggle: function ()
			{
				this.$popover.toggleClass('hidden');
			},
			
			isVisible: function ()
			{
				return !this.$popover.hasClass('hidden');
			},
			
			destroy: function ()
			{
				missClickClosePool.remove(this);
			},
			
			onToggleElementClicked: function (e)
			{
				e.preventDefault();
				missClickClosePool.exceptHandler = this;
				this.toggle();
			},
			
			onPopoverElementClicked: function (e)
			{
				missClickClosePool.exceptHandler = this;
			}
		};
		
		module.ezPopover = function (selector)
		{
			$(selector).each(function ()
			{
				var $el = $(this),
					data = $el.data(PLUGIN_DATA_ATTRIBUTE);
				
				if (!data)
				{
					$el.data(PLUGIN_DATA_ATTRIBUTE, new Handler(this));
				}
			});
		};
		
		var missClickClosePool = new ObjectPool();
		$(document).on('click', function ()
		{
			missClickClosePool.forEach(function (handler, index, pool)
			{
				if (pool.exceptHandler !== handler)
				{
					handler.hide();
				}
			});
			missClickClosePool.exceptHandler = null;
		});
	})(module, app, Bb, Mn, $, _);
	/**
	 * @param {Marionette.Module} module
	 * @param {Marionette.Application} app
	 * @param {Backbone} Bb
	 * @param {Marionette} Mn
	 * @param {jQuery} $
	 * @param {_} _
	 */
	(function (module, app, Bb, Mn, $, _)
	{
		module.views = module.views || {};
		
		module.views.VideoLayoutView = Mn.ItemView.extend({
			template: false,
			
			ui: {
				thumbnail: '.-js-video-thumbnail',
			},
			
			events: {
				'click @ui.thumbnail': 'onThumbnailClick',
			},
			
			onRender: function ()
			{
				this.ui.thumbnail.filter('[data-host="vimeo"]').each(function ()
				{
					var $thumbnail = $(this);
					
					// http://stackoverflow.com/a/4709690 JSONP для совместимости с IE
					$.getJSON('https://www.vimeo.com/api/v2/video/' + $thumbnail.data('videoid') + '.json?callback=?',
					{
						format: 'json'
					},
					function (data)
					{
						if (data.length && data[0].thumbnail_medium)
						{	
							$thumbnail.css('background-image', 'url(' + data[0].thumbnail_medium + ')');
						}
					});
				});
			},
			
			onThumbnailClick: function(e)
			{
				var $target = $(e.target),
					$current = $target.closest('li');
				$target.closest('ul').find('li').not($current).removeClass('active');
				$current.addClass('active');
			},
			
		});
	})(module, app, Bb, Mn, $, _);
	/**
	 * @param {Marionette.Module} module
	 * @param {Marionette.Application} app
	 * @param {Backbone} Bb
	 * @param {Marionette} Mn
	 * @param {jQuery} $
	 */
	(function (module, app, Bb, Mn, $, _)
	{
		module.views = module.views || {};
	
		var MarkView = module.views.MarkView = Mn.View.extend({
			ui: {
				message: '.-js-mark-message',
				answer: '.-js-mark-answer'
			},
	
			initialize: function ()
			{
				this.bindUIElements();
	
				if (this.isVisible())
				{
					this.attachPlugins();
				}
			},
	
			isVisible: function ()
			{
				return !this.isHidden();
			},
	
			isHidden: function ()
			{
				return this.$el.hasClass('hidden');
			},
	
			show: function ()
			{
				this.$el.removeClass('hidden');
				this.attachPlugins();
			},
	
			attachPlugins: function ()
			{
				if (this.ui.message.length) module.dotdotdot(this.ui.message);
				if (this.ui.answer.length) module.dotdotdot(this.ui.answer);
			}
		});
	
		var MarkListView = module.views.MarksListView = Mn.CollectionView.extend({
			childView: MarkView,
	
			showNext: function (count)
			{
				var hiddenMarks = this.children.filter(function (markView)
				{
					return markView.isHidden();
				});
	
				hiddenMarks.slice(0, count).forEach(function (markView)
				{
					markView.show();
				});
	
				return (hiddenMarks.length < count) ? 0 : hiddenMarks.length - count;
			}
		});
	
		var MarksContainerView = module.views.MarksContainerView = Mn.LayoutView.extend({
			pageSize: 5,
	
			ui: {
				showMoreButton: '.-js-show-more-marks'
			},
	
			events: {
				'click @ui.showMoreButton': 'onShowMoreButtonClick'
			},
	
			render: function ()
			{
				var list = this.list = new module.views.MarksListView({el: '#marks-list'});
	
				list.$el.children('li').each(function ()
				{
					list.children.add(new MarkView({el: this}));
				});
	
				this.bindUIElements();
				this.delegateEvents();
	
				return this;
			},
	
			showNext: function (count)
			{
				return this.list.showNext(count);
			},
	
			onShowMoreButtonClick: function (e)
			{
				e.preventDefault();
	
				if (this.showNext(this.getOption('pageSize')) === 0)
				{
					this.ui.showMoreButton.remove();
				}
			}
		});
	})(module, app, Bb, Mn, $, _);
	
	module.create = function (options)
	{
		var place = new module.Place(options.place);
		
		module.dotdotdot('.-js-read-more');
		module.ezPopover('.-js-ez-popover');
		$('.-js-scroll-to').scrollTo({time: 200});
		$('[data-toggle="tooltip"]').tooltip();

		// Поповеры
		var $popovers = $('.-js-popover');
		$('body').click(function () {
			$popovers.hide();
		});

		$popovers.click(function (e) {
			e.stopPropagation();
			e.preventDefault();
		});

		$('.-js-toggle-popover').click(function (e) {
			e.stopPropagation();
			e.preventDefault();

			var $popover = $(this).next('.-js-popover');

			$popover.toggle();
			$popovers.not($popover).hide();
		});

		YandexMap.init({
			coordinates: [place.get('coordY'), place.get('coordX')], // дада, всё наоборот
			address: place.escape('address'),
		});
		
		(new module.views.VideoLayoutView({
			el: '.-js-layout-video'
		})).render();

		(new module.views.MarksContainerView({
			el: '#marks',
			pageSize: 5
		})).render();
	};
}, YandexMap);