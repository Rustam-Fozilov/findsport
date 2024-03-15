function ymReachGoal(goal)
{
	/*var success = true;

	try
	{
		new YandexMetrika(goal);
	}
	catch (e)
	{
		success = false;
	}
	finally
	{
		//console[success ? 'log' : 'error']('YaMetrika.reachGoal(%s)', goal);
	}*/
}

function gaReachGoal(/* GoogleAnalytics arguments */)
{
	var success = true;

	try
	{
		ga.apply(null, arguments)
	}
	catch (e)
	{
		success = false;
	}
	finally
	{
		//console[success ? 'log' : 'error']('GoogleAnatytics.reachGoal(%s)', Array.prototype.slice.call(arguments, 0).join(', '));
	}
}

$(document).ready(function ()
{
	function stringAssign(string, assign)
	{
		for (var i in assign)
		{
			if (assign.hasOwnProperty(i))
			{
				string = string.replace('{' + i + '}', assign[i]);
			}
		}

		return string;
	}

	// Галерея
	var $gallery = $('.-js-gallery'),
		$images = $gallery.children('li'),
		count = $images.length,
		current = 0;

	$images.hide();
	$images.eq(current).show();

	$('.-js-prev, .-js-next').on('click', function (e)
	{
		e.preventDefault();

		$images.eq(current).hide();

		if ($(this).hasClass('-js-prev'))
		{
			if (0 === current)
			{
				current = count - 1;
			}
			else
			{
				current--;
			}
		}
		else
		{
			current = (current + 1) % count;
		}

		$images.eq(current).show();
	});

	// Сбор метрики
	/*var reachGoalsOnShowPhone = _.once(function ()
	{
		ymReachGoal('showsectionphone');
	});
*/
	$('.-js-show-phone').click(function (e)
	{
		e.preventDefault();

		var $this = $(this);

		if (!$this.next('.-js-popover').is(':visible'))
		{
			//reachGoalsOnShowPhone();

			/*fsMetric.reachGoal('showSectionPhone', {
				objectId: window.sectionData.section.id,
				objectType: 'section'
			});*/
		}
	});

	// Видосы
	var videoEmbedTemplate = '<iframe frameborder="0" height="350" width="100%" src="{url}" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>',
		videoListItemImageTemplate = '<span class="img img-covered -js-video-thumbnail" style="background-image:url(\'{image}\');"></span>',
		videoListItemTemplate = '<li><a class="-js-show-video" data-id="{id}" data-host="{host}">' + videoListItemImageTemplate + '</a></li>',
		$videoWrapper = $('.-section-video'),
		$videoGallery = $('.-section-video-list');

	if (window.sectionData && window.sectionData.videos.length > 1)
	{
		// Формируем список видосов со скринами
		$.each(window.sectionData.videos, function (index, video)
		{
			// Установить скрин - работает на замаканиях
			function setThumbnail(src)
			{
				$videoItem.find('.-js-video-thumbnail').css('background-image', 'url(' + src + ')');
			}

			// Создаём элемент для списка видосов
			var html = stringAssign(videoListItemTemplate, {
					id: video.id,
					host: video.host,
					image: '/images/image-default-80x79.png'
				}),
				$videoItem = $(html);

			// Первое видео уже активно - добавляем активный класс
			if (!index)
			{
				$videoItem.addClass('active');
			}

			// Устанавливаем скриншот

			// У YouTube простое апи - достаточно просто сформировать ссылку
			if (video.host == 'youtube')
			{
				setThumbnail('//img.youtube.com/vi/' + video.id + '/mqdefault.jpg');
			}
			// Для Vimeo необходимо поднятуть данные с их сервера
			else if (video.host == 'vimeo')
			{
				// http://stackoverflow.com/a/4709690 JSONP для совместимости с IE
				$.getJSON('//www.vimeo.com/api/v2/video/' + video.id + '.json?callback=?',
				{
					format: 'json'
				},
				function (data)
				{
					if (data.length && data[0].thumbnail_medium)
					{
						setThumbnail(data[0].thumbnail_medium);
					}
				});
			}
			// Хз что за хостинг
			else
			{
				return;
			}

			// Добавляем этот элемент к общему списку
			$videoGallery.append($videoItem);
		});


		// По клику на видос мы должны поменять видео
		$videoGallery.on('click', '.-js-show-video', function (e)
		{
			e.preventDefault();

			var $target = $(e.currentTarget),
				$item = $target.parent(),
				videoUrl;

			if ($item.hasClass('active'))
			{
				return;
			}

			$videoGallery.find('li').removeClass('active');
			$item.addClass('active');

			switch ($target.data('host'))
			{
				case 'youtube': videoUrl = 'https://www.youtube.com/embed/' + $target.data('id') + '?rel=0'; break;
				case 'vimeo': videoUrl = 'https://player.vimeo.com/video/' + $target.data('id') + '?loop=1'; break;
			}

			$videoWrapper.html(stringAssign(videoEmbedTemplate, {url: videoUrl}));
		});
	}


	// Поповеры
	var $popovers = $('.-js-popover');

	$('body').click(function ()
	{
		$popovers.hide();
	});

	$popovers.click(function (e)
	{
		e.stopPropagation();
		e.preventDefault();
	});

	$('.-js-toggle-popover').click(function (e)
	{
		e.stopPropagation();
		e.preventDefault();

		var $popover = $(this).next('.-js-popover');

		$popover.toggle();
		$popovers.not($popover).hide();
	});

	// Метрика
	/*$('.-js-booking-aside').click(function (e)
	{
		ymReachGoal('booking_click_aside');
		gaReachGoal('send', 'event', 'SectionBookingForm', 'ButtonShowBooking', 'aside');
	});*/

	(function ()
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

		ezPopover = function (selector)
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

		ezPopover('.-js-ez-popover');
		$('[data-toggle="tooltip"]').tooltip();
	})();
});

(function ()
{
	var global = this,
		document = global.document,
		location = global.location,
		Math = global.Math,
		$ = global.jQuery,
		_ = global._,
		Backbone = global.Backbone,
		Mn = global.Mn,
		Handlebars = global.Handlebars,
		moment = global.moment;


	function createMoment(date)
	{
		if (moment.isMoment(date))
		{
			return date.clone();
		}

		if (!isNaN(date))
		{
			return moment.unix(date);
		}

		return moment(date);
	}

	var dateFormats = moment.localeData()._formats;

	var SectionGroupHour = Backbone.Model.extend({

		defaults: {
			id: null,
			date: '',
			start: 0,
			finish: 0,
			timeStart: 0,
			timeFinish: 0,
			note: null
		}

	});

	var SectionGroupHours = Backbone.Collection.extend({
		model: SectionGroupHour
	});

	var SectionScheduleView = global.SectionScheduleView = Backbone.View.extend({
		_date: null,
		_currentWeek: null,

		helpers: {
			timeIsPassed: function (date)
			{
				return createMoment(date).isBefore();
			},

			isWeekend: function (date)
			{
				return createMoment(date).isWeekend();
			}
		},

		events: {
			'click .-js-prev': 'eventPrevClicked',
			'click .-js-next': 'eventNextClicked',
			'click .-js-btn-booking': 'eventShowBooking'
		},

		initialize: function (options)
		{
			//this.template = Handlebars.compile(document.getElementById('hbs-section-schedule').innerHTML);

			//this.sectionId = options.sectionId;
			this.collection = new SectionGroupHours();

			//this._currentWeek = moment().startOf('week');
		},

		getRenderData: function ()
		{
			var dates = this._dateRange(this._date, this._date.clone().add({week: 1})),
				dayGroups = {};

			_.each(dates, function (date)
			{
				dayGroups[date.format(dateFormats.dateStamp)] = [];
			});

			this.collection.each(function (hour)
			{
				if (hour.get('date') in dayGroups)
				{
					dayGroups[hour.get('date')].push(hour.toJSON());
				}
			});

			return {
				sectionId: this.sectionId,
				dates: dates,
				dayGroups: dayGroups,

				noHours: !this.collection.length,

				canLoadPrevWeek: this.canLoadDate(this.getPrevWeekDate()),
				canLoadNextWeek: this.canLoadDate(this.getNextWeekDate())
			};
		},

		getRenderOptions: function ()
		{
			return {helpers: this.helpers};
		},

		getPrevWeekDate: function ()
		{
			return this._date.clone().subtract({week: 1});
		},

		getNextWeekDate: function ()
		{
			return this._date.clone().add({week: 1});
		},

		canLoadDate: function (date)
		{
			if (createMoment(date).isBefore(this._currentWeek))
			{
				return false;
			}

			return true;
		},

		load: function (date)
		{
			var view = this;

			if (!moment.isMoment(date))
			{
				date = createMoment(date);
			}

			if (this._date && this._date.format() === date.format())
			{
				return;
			}

			if (!this.canLoadDate(date))
			{
				return;
			}

			this._load({
				data: {
					dateFrom: date.format(dateFormats.dateStamp)
				},

				success: function ()
				{
					view._date = date;
				}
			});
		},

		loadFirstWeek: function ()
		{
			var view = this;

			this._load({
				success: function ()
				{
					if (view.collection.length)
					{
						view._date = moment(view.collection.at(0).get('date')).startOf('week');
					}
					else
					{
						view._date = moment().startOf('week');
					}
				}
			});
		},

		preloader: function ()
		{
			return this.$('.preloader');
		},

		render: function ()
		{
			this.$el.html(this.template(this.getRenderData(), this.getRenderOptions()));
		},

		eventPrevClicked: function (e)
		{
			e.preventDefault();

			this.load(this.getPrevWeekDate());
		},

		eventNextClicked: function (e)
		{
			e.preventDefault();

			this.load(this.getNextWeekDate());
		},

		eventShowBooking: function (e)
		{
		//	ymReachGoal('booking_click_schedule');
			//gaReachGoal('send', 'event', 'SectionBookingForm', 'ButtonShowBooking', 'schedule');
		},

		_load: function (ajax)
		{
			/*var view = this;

			return this.collection.fetch(_.defaults({
				url: '/section/schedule/' + this.sectionId,

				beforeSend: function ()
				{
					view.preloader().show();
				},

				complete: function ()
				{
					view.preloader().hide();
				},

				success: function ()
				{
					if (ajax.success)
					{
						ajax.success.apply(this, arguments);
					}

					view.render();
				}
			}, ajax));*/
		},

		_dateRange: function (dateFrom, dateTo, step)
		{
			var result = [],
				iteratee;

			if (!moment.isMoment(dateFrom)) dateFrom = createMoment(dateFrom);
			if (!moment.isMoment(dateTo)) dateTo = createMoment(dateTo);
			if (!step) step = {day: 1};

			iteratee = dateFrom.clone();

			while (iteratee.isBefore(dateTo))
			{
				result.push(iteratee.clone());
				iteratee.add(step);
			}

			return result;
		}
	});

	//
	// Жуткий copy-paste из js/frontend/pages.playgroundView/40-marks.js

	var MarkView = global.MarkView = Mn.View.extend({
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
			if (this.ui.message.length) dotdotdot(this.ui.message);
			if (this.ui.answer.length) dotdotdot(this.ui.answer);
		}
	});

	var MarksListView = global.MarksListView = Mn.CollectionView.extend({
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

	var MarksContainerView = global.MarksContainerView = Mn.LayoutView.extend({
		pageSize: 5,

		ui: {
			showMoreButton: '.-js-show-more-marks'
		},

		events: {
			'click @ui.showMoreButton': 'onShowMoreButtonClick'
		},

		render: function ()
		{
			var list = this.list = new MarksListView({el: '#marks-list'});

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

	// COPY-PASTE из ../pages.playgroundView/90-jquery-dotdotdot-custom.js
	var defaultOptions = {
		after: '.-js-read-more-toggler',
		afterElement: '<a class="-new-link -js-read-more-toggler">Читать далее</a>',
		fullClass: '-show-full-text'
	};

	$.fn.dotdotdot.defaultArrays.lastCharacter.remove.push("\n", "\r", "<br>");

	var dotdotdot = function (selector, options)
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
}).call(this);

(function ()
{
	var global = this,
		document = global.document,
		$ = global.jQuery,
		_ = global._,
		Backbone = global.Backbone,
		Handlebars = global.Handlebars;

	var SectionCoachModalView = global.SectionCoachModalView = Backbone.View.extend({

		_coachId: 0,

		events: {
			'show.bs.modal': 'render'
		},

		initialize: function (options)
		{
			this.template = Handlebars.compile(document.getElementById('hbs-section-coach').innerHTML);
			if (options.coachId)
			{
				this.setCoachId(options.coachId);
			}
		},

		getRenderData: function ()
		{
			return _.extend({}, _.findWhere(global.sectionData.coaches, { id: this._coachId }));
		},

		getRenderOptions: function ()
		{
			return {};
		},

		setCoachId: function(id)
		{
			this._coachId = String(id);
		},

		render: function ()
		{
			this.$el.html(this.template(this.getRenderData(), this.getRenderOptions()));
		},

		show: function ()
		{
			this.$el.modal('show');
		},

		hide: function ()
		{
			this.$el.modal('hide');
		},

		toggle: function ()
		{
			this.$el.modal('toggle');
		}
	});
}).call(this);
