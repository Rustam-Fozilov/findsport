/**
 * "Двойной datepicker"
 *
 * Использует BS Datepicker, расширенный bootstrap.datepicker.custom.js
 *
 * Помимо опций DEFAULTS принимает все стандартные опции BS Datepicker, которые отдаются всем вложенным BS Datepicker'ам (если они не конфликтуют с этим plugin'ом)
 */
+(function ()
{
	'use strict';

	var global = this,
		$ = global.jQuery,
		moment = global.moment,
		_ = global._;

	// Public
	var DatepickerDouble = function(element, options)
	{
		// Общий тип для исключения конфликтов
		this.type       = null;
		// Конфигурация
		this.options    = null;
		// jQuery-селектор
		this.$el   = null;

		// Выбранная дата
		this.date = null;
		// Видимая дата в первом datepicker (следующий - +1 month)
		this.viewDate = null;

		this.init('datepickerdouble', element, options);
	};

	/**
	 * Инициализация DatepickerDouble
	 *
	 * @param {String} type - `datepickerdouble`
	 * @param {Object} element селектор
	 * @param {Object} options конфигурации
	 */
	DatepickerDouble.prototype.init = function (type, element, options)
	{
		var testDate;

		this.enabled  = true;
		this.type     = type;
		this.$el = $(element);

		// Расширяем дефолтную конфигурацию из `data-` или из `options`
		this.options  = this.getOptions(options);
		this._initDefaultDates();
		this._renderTemplate();

		// Сохраняем ссылки на DOM-элементы
		this.$datepickerItems = this.$el.find(this.options.datepickers);
		this.$datepickers = this.$datepickerItems.find(this.options.picker);
		this.$monthlabels = this.$datepickerItems.find(this.options.monthlabel);
		this.$next = this.$el.find(this.options.next);
		this.$prev = this.$el.find(this.options.prev);

		this._initDatepickers();

		this.setViewDate(this.defaultViewDate.toDate());

		// Устанавливаем обработчики событий
		this.$next.on('click', $.proxy(this.onNext, this));
		this.$prev.on('click', $.proxy(this.onPrev, this));
		this.$datepickers.on('changeDate', $.proxy(this.onChangeDate, this));
	};

	/**
	 * Расширяем и возвращаем конфигурацию DatepickerDouble
	 *
	 * @param {Object} options
	 * @return {Object}
	 */
	DatepickerDouble.prototype.getOptions = function (options)
	{
		options = $.extend({}, this.DEFAULTS, this.$el.data(), options);

		return options;
	};

	/**
	 * Инициализация диапазона дат и стартовой даты
	 */
	DatepickerDouble.prototype._initDefaultDates = function()
	{
		var testDate;

		this.defaultViewDate = this._today();
		this.startDate = -Infinity;
		this.endDate = Infinity;

		if (this.options.defaultViewDate)
		{
			testDate = moment(this.options.defaultViewDate);
			if (testDate.isValid())
			{
				this.defaultViewDate = testDate.clone();
			}
		}

		if (this.options.startDate)
		{
			testDate = moment(this.options.startDate);
			if (testDate.isValid())
			{
				this.startDate = testDate.clone();
			}
		}

		if (this.options.endDate)
		{
			testDate = moment(this.options.endDate);
			if (testDate.isValid())
			{
				this.endDate = testDate.clone();
			}
		}

	};

	/**
	 * Сформировать и добавить к this.$el шаблон, на элементы которого будут навешиваться datepicker и события
	 */
	DatepickerDouble.prototype._renderTemplate = function()
	{
		var template = this.options.template,
			items = new Array(this.options.count + 1).join(this.options.templateItem); // http://stackoverflow.com/a/202627
		template = template.replace(this.options.templateItemMask, items);
		template = template.replace(this.options.templateNextMask, this.options.templateNext);
		template = template.replace(this.options.templatePrevMask, this.options.templatePrev);

		this.$el.addClass(this.options.classBase).html(template);
	};

	/**
	 * Инициализировать datepicker'ы с предустановленными опциями
	 */
	DatepickerDouble.prototype._initDatepickers = function()
	{
		// Опции для всех dateicker'ов - пробрасываем options (в т.ч. format, startDate, endDate), некоторые опции корректируем
		var that = this,
			datepickerOptions = _.extend({}, this.options, {
				defaultViewDate: null,
				disableTouchKeyboard: false,
				keyboardNavigation: false,
				minViewMode: 0,
				maxViewMode: 0,
				multidate: false,
				startView: 0
			});

		this.$datepickers.datepicker(datepickerOptions);
		this._hideDatepickerNav();

		// Сохраним индекс каждого datepicker'а в его data для обработчиков событий
		this.$datepickers.each(function(index)
		{
			$(this).data(that.options.dataIndex, index);
		});
	};

	/**
	 * Скрыть стандартную панель показа месяца datepicker (там свои стрелки и переключение в режим месяцы-годы
	 */
	DatepickerDouble.prototype._hideDatepickerNav = function()
	{
		this.$datepickers.find('.datepicker-days table thead tr:first').hide();
	};

	/**
	 * Получить выбранную дату как объект Date
	 *
	 * @returns {Date}
	 */
	DatepickerDouble.prototype.getDate = function()
	{
		return this.date
			? this.date.toDate()
			: null;
	};

	/**
	 * Получить выбранную дату как строку в текущем формате datepicker
	 *
	 * @returns {String}
	 */
	DatepickerDouble.prototype.getFormattedDate = function()
	{
		return this.$el.data(this.options.dataDate);
	};

	/**
	 * Получить выбранную дату как moment
	 *
	 * @returns {moment}
	 */
	DatepickerDouble.prototype.getMomentDate = function()
	{
		return this.date
			? moment(this.date)
			: null;
	};

	/**
	 * Установить выбранную дату
	 *
	 * @param {moment|Date|String} date Новая выбранная дата
	 * @param {Boolean} refresh [optional] Выделить дату в datepicker'ах. По умолчанию: true
	 */
	DatepickerDouble.prototype.setDate = function(date, refresh)
	{
		if (typeof refresh === 'undefined')
		{
			refresh = true;
		}
		this.date = moment(date);
		if (moment.isMoment(date))
		{
			date = date.toDate();
		}
		if (date instanceof Date)
		{
			date = this.$datepickers.first().datepicker('formatDate', date);
		}

		this.$el.data(this.options.dataDate, date);

		if (refresh)
		{
			this.setViewDate(this.date);
		}
	};

	/**
	 * Установить видимую дату в datepicker
	 * Основной метод для прокрутки datepicker'а
	 *
	 * @param {moment|Date|String} viewDate Новая выбранная дата
	 */
	DatepickerDouble.prototype.setViewDate = function(viewDate)
	{
		var that = this,
			date = moment(viewDate),
			selectedDate = this.date;

		// Если viewDate выходит за диапазон, скорректировать
		if (this.endDate.diff(date, 'months') < (this.options.count - 1))
		{
			date = this.endDate.clone().subtract(this.options.count - 1, 'months');
		}
		if (date < this.startDate)
		{
			date = this.startDate.clone();
		}

		this.viewDate = date.clone();

		this.$datepickerItems.each(function()
		{
			var $this = $(this);
			if (selectedDate && selectedDate.isSame(date, 'month'))
			{
				$this.find(that.options.picker).datepicker('setDateSilent', selectedDate.toDate()); // Silent - только что без события, а на выбранный месяц всё равно прокручивается
			}
			else
			{
				$this.find(that.options.picker).datepicker('setViewDate', date.toDate(), true);
			}
			$this.find(that.options.monthlabel).html(date.format(that.options.momentMonthLabelFormat));

			date.add(1, 'months');
		});

		this._updateNavArrows();
	};

	/**
	 * Установить видимость стрелок прокрутки datepicker'а
	 */
	DatepickerDouble.prototype._updateNavArrows = function(){
		var endViewDate = this.viewDate.clone().add(this.options.count - 1, 'months');

		this.$prev.toggleClass(this.options.classDisabled, (this.startDate !== -Infinity
			&& !this.viewDate.isAfter(this.startDate, 'month')));

		this.$next.toggleClass(this.options.classDisabled, (this.endDate !== Infinity
			&& !endViewDate.isBefore(this.endDate, 'month')));
	};

	/**
	 * Событие: выбор даты
	 *
	 * @param {Event} e
	 */
	DatepickerDouble.prototype.onChangeDate = function(e)
	{
		e.preventDefault();
		e.stopPropagation();

		var $target = $(e.currentTarget),
			currentDate = $target.datepicker('getFormattedDate'),
			currentIndex = $target.data(this.options.dataIndex);

		if (currentDate)
		{
			this.setDate(currentDate, false);
		}
		else // Пользователь щёлкнул на уже выбранную дату, оставляем её выбранной
		{
			currentDate = this.date;
		}

		if (currentIndex > 0)
		{
			currentDate = moment(currentDate).subtract(currentIndex, 'months');
		}
		this.setViewDate(currentDate);

		this._trigger(this.CONSTANTS.EVENT_CHANGE_DATE);
	};

	/**
	 * Событие: стрелка "следующий месяц"
	 *
	 * @param {Event} e
	 */
	DatepickerDouble.prototype.onNext = function(e)
	{
		e.preventDefault();

		if (!this.viewDate)
		{
			this.viewDate = this._today();
		}

		this.setViewDate(this.viewDate.add(1, 'months'));
	};

	/**
	 * Событие: стрелка "предыдущий месяц"
	 *
	 * @param {Event} e
	 */
	DatepickerDouble.prototype.onPrev = function(e)
	{
		e.preventDefault();

		if (!this.viewDate)
		{
			this.viewDate = this._today();
		}

		this.setViewDate(this.viewDate.subtract(1, 'months'));
	};

	/**
	 * Возвращает сегодняшний день
	 *
	 * @returns {moment}
	 */
	DatepickerDouble.prototype._today = function()
	{
		return moment().zone(this.options.timezoneOffset).startOf('day');
	};

	/**
	 * Инициировать событие
	 *
	 * @param {String} eventName
	 */
	DatepickerDouble.prototype._trigger = function(eventName)
	{
		this.$el.trigger(eventName);
	};

	/**
	 * Удаляет DatepickerDouble у его объекта
	 */
	DatepickerDouble.prototype.destroy = function ()
	{
		this.hide().$el.off('.' + this.type).removeData('fs.' + this.type);
	};

	var old = $.fn.datepickerdouble;

	/**
	 * Определение плагина
	 *
	 * @param {Object} option конфигурация
	 */
	var plugin = $.fn.datepickerdouble = function (option)
	{
		var args = Array.apply(null, arguments);
		args.shift();
		var returnValue;
		this.each(function ()
		{
			var $this   = $(this);
			var data    = $this.data('fs.datepickerdouble');
			var options = typeof option === 'object' && option;

			if (!data && option === 'destroy')
			{
				return;
			}
			if (!data)
			{
				$this.data('fs.datepickerdouble', (data = new DatepickerDouble(this, options)));
			}
			if (typeof option === 'string' && typeof data[option] === 'function')
			{
				returnValue = data[option].apply(data, args);
				if (typeof returnValue !== 'undefined')
				{
					return false;
				}
			}
		});

		return (typeof returnValue !== 'undefined')
			? returnValue
			: this;
	};

	plugin.Constructor = DatepickerDouble;

	plugin.DEFAULTS = DatepickerDouble.prototype.DEFAULTS =
	{
		// Класс к контейнеру this.$el
		classBase: 'datepickerdouble',
		// Класс к стрелкам, когда по ним нельзя перейти
		classDisabled: 'disabled',
		// Число datepicker'ов
		count: 2,
		// Контейнер для одного для datepicker'а и подписи
		datepickers: '.datepickerdouble-item',
		// Контейнер, на который навешивается BS datepicker
		picker: '.datepickerdouble-picker',
		// Контейнер для вывода названия месяца (не используется стандартный BS, т.к. на него навешаны другие не нужные здесь события)
		monthlabel: '.datepickerdouble-monthlabel',
		// Формат moment для отображения текущего месяца в подписи к datepicker'у
		momentMonthLabelFormat: 'MMMM, YYYY',
		// Стрелка "следующий месяц"
		next: '.datepickerdouble-next',
		// Стрелка "предыдущий месяц"
		prev: '.datepickerdouble-prev',
		// data-атрибут для хранения индекса datepicker'а в наборе
		dataIndex: 'datepickerdouble-index',
		// data-атрибут this.$el для хранения текущей даты
		dataDate: 'datepickerdouble-date',
		// Общий шаблон plugin'а, загружаемый в this.$el
		template: '<div>{{templatePrev}}{{templateItem}}{{templateNext}}</div>',
		// Шаблон контейнера одного datepicker
		templateItem: '<div class="datepickerdouble-item"><div class="datepickerdouble-monthlabel"></div><div class="datepickerdouble-picker"></div></div>',
		// Шаблон стрелки "следующий месяц"
		templateNext: '<div class="datepickerdouble-next icon-arrow-right-sm">&nbsp;</div>',
		// Шаблон стрелки "предыдущий месяц"
		templatePrev: '<div class="datepickerdouble-prev icon-arrow-left-sm">&nbsp;</div>',
		// Маска для шаблона templateItem в общем шаблоне. При render'е меняется на count шаблонов templateItem
		templateItemMask: '{{templateItem}}',
		// Маска для шаблона templateNext в общем шаблоне. При render'е меняется на шаблон templateNext
		templateNextMask: '{{templateNext}}',
		// Маска для шаблона templatePrev в общем шаблоне. При render'е меняется на шаблон templatePrev
		templatePrevMask: '{{templatePrev}}',
		// Смещение временной зоны. Пока используется только для определения "сегодня"
		timezoneOffset: 0
	};

	plugin.CONSTANTS = DatepickerDouble.prototype.CONSTANTS =
	{
		// Событие "выбор даты"
		EVENT_CHANGE_DATE: 'changeDate'
	};

	/**
	 * Исключает конфликты
	 */
	plugin.noConflict = function ()
	{
		$.fn.datepickerdouble = old;
		return this;
	};

}).call(this);
