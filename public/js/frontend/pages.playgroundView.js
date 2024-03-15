/**
 * @param {Marionette.Module} module
 * @param {Marionette.Application} app
 * @param {Backbone} Bb
 * @param {Marionette} Mn
 * @param {jQuery} $
 * @param {_} _
 */
application.module('pages.playgroundView', function (module, app, Bb, Mn, $, _)
{
	module.ymReachGoal = function (goal)
	{
		var success = true;

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
			console[success ? 'log' : 'error']('YaMetrika.reachGoal(%s)', goal);
		}
	};

	module.createServerUrl = function (route, params)
	{
		var url = '/' + _.str.trim(route, '/');

		if (_.has(params, 'id'))
		{
			url += '/' + params.id;
		}

		return url + _.reduce(params, function (params, value, param)
		{
			if (param !== 'id')
			{
				params += (params ? '&' : '?') + encodeURIComponent(param) + '=' + encodeURIComponent(value);
			}

			return params;
		}, '');
	};
});
/**
 * @param {Marionette.Module} module
 * @param {Marionette.Application} app
 * @param {Backbone} Bb
 * @param {Marionette} Mn
 * @param {jQuery} $
 * @param {_} _
 */
application.module('pages.playgroundView', function (module, app, Bb, Mn, $, _)
{
	module.PlaygroundScheduleLayoutView = Mn.LayoutView.extend({
		priceManager: null,
		weight: 12,

		regions: {
			schedule: '.-js-playground-schedule-region',
			scheduleWeights: '.-js-playground-schedule-weights-region',
			basketPanel: '.-js-playground-basket_panel-region'
		},

		events: {
			'click [data-set-weight]': 'onSetWeight',
		},

		initialize: function (options)
		{
			_.extend(this, _.pick(options, ['theme', 'basket', 'playground', 'priceManager', 'weight', 'user', 'userRole', 'schedules']));
			this.listenTo(this.basket, this.basket.EVENT_SYNC, this.onBasketSync);
		},

		render: function ()
		{
			if (this.playground.hasWeights())
			{
				var scheduleWeights = new module.ScheduleWeightsView({
					playground: this.playground,
					weight: this.weight
				});
				this.showChildView('scheduleWeights', scheduleWeights);
			}


			var basketPanel = new module.BasketPanelView({
				basket: this.basket,
				userRole: this.userRole,
				user: this.user,
				theme: this.theme
			});
			this.showChildView('basketPanel', basketPanel);


			var schedule = new module.ScheduleView({
				theme: this.theme,
				basket: this.basket,
				priceManager: this.priceManager,
				basketPanel: basketPanel, // for crutch
				playground: this.playground,
				weight: this.weight,
				userRole: this.userRole,
				schedules: this.schedules
			});
			this.showChildView('schedule', schedule);


			schedule.loadToday();


			return this;
		},

		/**
		 * Событие: установить долю площадки
		 *
		 * @param {jQuery.Event} e
		 */
		onSetWeight: function (e)
		{
			e.preventDefault();

			var oldWeight = this.weight;
			var weight = +$(e.currentTarget).data('set-weight');

			if (oldWeight != weight)
			{
				this.weight = weight;
				this.basket.changeWeight(weight);

				_.each(this.getRegions(), function (region)
				{
					region.currentView.weight = weight;
					region.currentView.render();
				});
			}
		},

		onBasketSync: function ()
		{
			this.getChildView('basketPanel').onBasketSync();
			this.getChildView('schedule').onBasketSync();
		}
	});
});
/**
 * @param {Marionette.Module} module
 * @param {Backbone} Bb
 * @param {Marionette} Mn
 * @param {jQuery} $
 * @param {_} _
 * @param {moment} moment
 */
application.module('pages.playgroundView', function (module, app, Bb, Mn, $, _, moment)
{
	var momentFormats = momentFormats = moment.localeData()._formats;

	// crutch MSS-1126
	var fixGteWin8IeBug = (function()
	{
		var winNtVersion = navigator.appVersion.match(/Windows NT ([\d\.]+)/);

		var isMSIE = navigator.appName == 'Microsoft Internet Explorer'
			|| navigator.appName == 'Netscape' && /Trident\/|Edge\//.test(navigator.appVersion);

		return winNtVersion && winNtVersion[1] > 6.1 && isMSIE; // 6.1 = Windows 7
	})();

	module.ScheduleWeightsView = Mn.ItemView.extend({
		template: 'scheduleWeight',
		className: '-playground-schedule-weight-container',

		playground: null,
		weight: 12,

		initialize: function (options)
		{
			this.playground = options.playground;
			this.weight = options.weight;
		},

		serializeData: function ()
		{
			var weight = this.weight;

			var weightLabels = _.map(this.playground.getWeightLabels(), function (label)
			{
				label.active = label.value == weight;
				return label;
			});

			return {
				weights: weightLabels
			};
		}
	});

	module.ScheduleView = Mn.ItemView.extend({
		template: 'scheduleView',
		className: '-schedule-container schedule__container',

		basket: null,
		playground: null,
		priceManager: null,
		weight: 12,
		schedules: null,

		date: null,
		bookedMap: null,
		hourMap: null,
		timeStep: null,
		blockedTimeBooking: null,
		theme: null,

		userRole: 'guest',
		ROLE_GUEST: 'guest',
		ROLE_USER: 'user',
		ROLE_PLAYGROUND: 'playground',
		ROLE_EMPLOYEE: 'employee',

		events: {
			'click [data-navigate-to]': 'onNavigateTo',
			'click [data-datetime]': 'onTimeClick',
			'change [data-calendar]': 'onCurrentDateChange',
			'blur [data-calendar]': 'onCurrentDateBlur'
		},

		ui: {
			preloader: '.-playground-schedule-preloader',
			header: '.-playground-schedule-header',
		},

		/**
		 * Инициализация объекта
		 *
		 * @param {Object} options
		 */
		initialize: function (options)
		{
			_.extend(this, _.pick(options, ['theme', 'basket', 'basketPanel', 'playground', 'priceManager', 'weight', 'userRole', 'schedules']));

			this.date = this._today();
			this.timeStep = this.playground.getRangeDuration();
			this.blockedTimeBooking = this.playground.get('blockedTimeBooking');
			this.bookedMap = {};

			this.listenTo(this.basket, 'add', this.render);
			this.listenTo(this.basket, 'remove', this.render);
			this.listenTo(this.basket, 'resolve', this.render);
			this.listenTo(this.basket, 'error:add', this.onBasketError);
			this.listenTo(this.basket, 'error:check', this.onBasketError);
			this.listenTo(this.basket, 'error:remove', this.onBasketError);
			this.listenTo(this.basket, 'error:resolve', this.onBasketError);
		},

		/**
		 * Подготовить данные для рендера
		 * @returns {Object}
		 */
		serializeData: function ()
		{
			var prevPeriod = this.date.clone().subtract(1, this.getDatePeriodString()),
				nextPeriod = this.date.clone().add(1, this.getDatePeriodString()),
				showPrevPeriod = (this._correctLoadingDate(prevPeriod) < this.date),
				showNextPeriod = (this._correctLoadingDate(nextPeriod) > this.date),
				weight = this.weight,
				weightLabels = _.map(this.playground.getWeightLabels(), function (label)
				{
					label.active = label.value == weight;
					return label;
				});

			return {
				playground: this.playground.toJSON(),
				workingHours: this.getWorkingHours(),
				dates: this.getDates(),
				hourMap: this.getHourMap(true),
				prevWeek: showPrevPeriod && prevPeriod.format(momentFormats.dateStamp),
				nextWeek: showNextPeriod && nextPeriod.format(momentFormats.dateStamp),
				weights: weightLabels,
				minDate: this.getLimitDate(),
				maxDate: this.getLimitDate().add(1, 'year')
			};
		},

		/**
		 * Получить временной период, по которому ориентируется пользователь
		 *
		 * @returns {string}
		 */
		getDatePeriodString: function () {
			return this.theme && this.theme == 'mobile' ? 'day' : 'week';
		},

		/**
		 * Получить временной период, по которому ориентируется пользователь
		 *
		 * @returns {string}
		 */
		getDatePeriodNumber: function () {
			return this.theme && this.theme == 'mobile' ? 1 : 7;
		},

		/**
		 * Отображаемые даты
		 *
		 * @param {Moment} dateStart [optional] Начальная дата. По умолчанию: this.date
		 * @returns {Array} Массив объектов moment
		 */
		getDates: function (dateStart)
		{
			if (dateStart)
			{
				return moment.range(dateStart, this.getDatePeriodNumber(), 'P1D');
			}
			return this._dates || (this._dates = moment.range(this.date, this.getDatePeriodNumber(), 'P1D'));
		},

		/**
		 * Отображаемые даты
		 *
		 * @param {Moment} dateStart [optional] Начальная дата
		 * @returns {Array} Массив строк YYYY-MM-DD
		 */
		getDateStamps: function(dateStart)
		{
			return _.map(this.getDates(dateStart), function (date)
			{
				return date.format(momentFormats.dateStamp);
			});
		},

		/**
		 * Рабочие часы площадки
		 *
		 * @returns {Object} В формате "оффсет: время"
		 */
		getWorkingHours: function ()
		{
			if (!this._workingHours)
			{
				this._workingHours = this.playground.getWorkingRange();
			}

			return this._workingHours;
		},

		/**
		 * Карта часов для выбранной недели
		 *
		 * @param {Boolean} refresh [optional] Построить карту заново?
		 * @returns {Object}
		 */
		getHourMap: function (refresh)
		{
			if (!this.hourMap || refresh)
			{
				this.hourMap = this.makeHourMap();
			}
			return this.hourMap;
		},

		/**
		 * Построить карту часов для выбранной недели
		 *
		 * @returns {Object}
		 */
		makeHourMap: function ()
		{
			var map = this._createHourMap();

			if (this.timeStep < 3600)
			{
				map = this._rejectSmallHours(map);
			}

			return map;
		},

		/**
		 * Создать карту часов, заполняет занятое и прошедшее время
		 */
		_createHourMap: function ()
		{
			var isInBasket = _.bind(function (date, offset)
			{
				return this.basket.isInBasket(date, offset);
			}, this);

			var isTimePassed = _.bind(function (tzo, date, time, limitDate)
			{
				return moment.zone(date + 'T' + time, tzo) < limitDate;
			}, null, this.playground.get('timezoneOffset'));

			var isBooked = _.bind(function (bookedMap, date, time, weight, schedulesLength) {
				var result = false,
					endCycle = false;

				if ((_.has(bookedMap, date) && _.has(bookedMap[date], time))) {
					_.each(bookedMap[date][time], function (scheduleWeight) {
						if (result === false && endCycle === false) {
							result = (12 - scheduleWeight < weight);
							if (result === false) {
								endCycle = true;
							}
						}
					});
					if (Object.keys(bookedMap[date][time]).length < schedulesLength) {
						result = false;
					}
				}

				return result;
			}, this);

			var weight = this.weight,
				bookedMap = this.bookedMap,
				limitDate = this.getLimitDate(),
				dates = this.getDateStamps(),
				timeStep = +this.playground.getRangeDuration(),
				priceManager = this.priceManager,
				schedulesLength = this.schedules.length;

			this.priceManager.selectPart(+this.weight);
			return _.reduce(this.getWorkingHours(), function (hours, time, offset)
			{
				hours[offset] = _.reduce(dates, function (cols, date)
				{
					var timeStart = +offset,
						timeFinish = timeStart + timeStep,
						isWorking = priceManager.worksIn(date, timeStart, timeFinish),
						price = isWorking && priceManager.calculatePrice(date, timeStart, timeFinish).outer,
						isTimeBooked = isBooked(bookedMap, date, time, weight, schedulesLength);

					cols.push({
						date: date,
						time: time,
						timeFinish: moment.utc(timeFinish * 1000).format('HH:mm'),
						offset: +offset,
						visible: isWorking && !isTimeBooked && !isTimePassed(date, time, limitDate),
						active: isInBasket(date, +offset),
						isWorking: isWorking,
						price: price
					});

					return cols;
				}, []);

				return hours;
			}, {});
		},

		/**
		 * Делает недоступными для бронирования маленькие диапазоны времени
		 *
		 * @param {Object} map
		 * @returns {Object} Отфильтрованная карта часов
		 */
		_rejectSmallHours: function (map)
		{
			function reject(stack, start, finish)
			{
				if (stack.length && finish - start < 3600)
				{
					_.each(stack, function (cell)
					{
						cell.visible = false;
					});
				}
			}

			for (var colNum = 0; colNum < this.getDatePeriodNumber(); colNum++)
			{
				var stack = [],
					start = null,
					finish = null;

				_.each(map, function (row, offset)
				{
					var cell = row[colNum];

					finish = +offset;

					if (cell.visible)
					{
						if (start === null) start = +offset;
						stack.push(cell);
					}
					else if (stack.length)
					{
						reject(stack, start, finish);

						stack = [];
						start = null;
					}
				});

				reject(stack, start, finish + this.timeStep);
			}

			return map;
		},

		/**
		 * Загрузить календарь на 7 дней начиная с указанной даты
		 *
		 * @param {moment|Date|String|Number} date
		 */
		load: function (date)
		{
			function onSuccess(isCached)
			{
				var that = this;
				this.date = date;
				this._dates = null;
				this.hourMap = this.makeHourMap();

				if (!isCached && this.basketHasConflict())
				{
					this._disableUI();
					this.basket.resolveConflict()
						.always(function()
						{
							that.basket.openMessage({
								code: 1,
								header: 'Выбранное вами время успели забронировать',
								message: 'Мы удалили только занятое время из корзины.<br>Выберите другое время для занятий.',
								btnOk: 'Хорошо, найду свободное время'
							}, 'pg_msg_1');
						});
				}
				else
				{
					this.render();
				}
			}

			date = this._ensureMoment(date);
			date = this._correctLoadingDate(date);

			var dates = this.getDateStamps(date);

			if (this._inCache(dates))
			{
				onSuccess.call(this, true);
			}
			else
			{
				$.ajax({
					context: this,
					url: '/playground/schedule/' + this.playground.id,

					data: {
						date: date.format(momentFormats.dateStamp)
					},

					beforeSend: function () { this.ui.preloader.show(); },
					complete: function () { this.ui.preloader.hide(); },

					success: function (data)
					{
						_.extend(this.bookedMap, data);
						onSuccess.call(this);
					}
				});
			}
		},

		/**
		 * Проверяет наличие указанных дат в кэше часов.
		 *
		 * @param {Array} dates Массив дат в формате "%Y-%m-%d"
		 * @returns {Boolean}
		 */
		_inCache: function (dates)
		{
			for (var i = 0; i < dates.length; i++)
			{
				if (!(dates[i] in this.bookedMap))
				{
					return false;
				}
			}

			return true;
		},

		/**
		 * Очищает указанные даты из кэша часов.
		 *
		 * @param {Array} dates Массив дат в формате "%Y-%m-%d"
		 */
		_clearCache: function (dates)
		{
			for (var i = 0; i < dates.length; i++)
			{
				if (dates[i] in this.bookedMap)
				{
					delete this.bookedMap[dates[i]];
				}
			}
		},

		/**
		 * Есть ли конфликты между занятым временем в hourMap и выбранным временем в корзине?
		 *
		 * @returns {Boolean}
		 */
		basketHasConflict: function ()
		{
			return _.some(this.hourMap, function(week)
			{
				return _.some(week, function(hour)
				{
					return hour.active && !hour.visible;
				});
			});
		},

		/**
		 * Получить moment, с которого разрешено бронирование
		 *
		 * @returns {moment}
		 */
		getLimitDate: function ()
		{
			if (this.blockedTimeBooking !== null) {
				return moment().add(this.blockedTimeBooking, 'seconds');
			} else {
				return moment().add(3600, 'seconds');
			}
		},

		/**
		 * Загрузить календарь с текущего дня
		 *
		 * @returns {undefined}
		 */
		loadToday: function ()
		{
			this.load(this._today());
		},

		/**
		 * Привести дату в правильный формат
		 *
		 * @param {moment|Date|String|Number} date
		 * @returns {moment}
		 */
		_ensureMoment: function (date)
		{
			if (moment.isMoment(date))
			{
				return date;
			}
			else if (_.isNumeric(date))
			{
				return moment().unix(date).zone(this.playground.get('timezoneOffset'));
			}
			else
			{
				return moment.zone(date, this.playground.get('timezoneOffset'));
			}
		},

		/**
		 * Исправить загружаемую дату.
		 * Проверяет на выход даты за возможный диапазон времени (сегодня - год вперёд)
		 *
		 * @param {moment} date
		 * @returns {moment}
		 */
		_correctLoadingDate: function (date)
		{
			var today = this._today(),
				yearLater = today.clone().add(1, 'year'),
				maxScroll = yearLater.clone().subtract(1, this.getDatePeriodString());

			if (date.isBefore(today))
			{
				return today;
			}

			if (date.isAfter(maxScroll))
			{
				return maxScroll;
			}

			return date;
		},

		/**
		 * Возвращает сегодняшний день
		 *
		 * @returns {moment}
		 */
		_today: function ()
		{
			return moment().zone(this.playground.get('timezoneOffset')).startOf('day');
		},

		/**
		 * Вызывается из `PlaygroundScheduleLayoutView`
		 */
		onBasketSync: function ()
		{
			this.updatePlugins();
		},

		/**
		 * Событие: ошибки корзины
		 *
		 * @param {Number} error Код ошибки (см. константы Basket)
		 * @param {Object} data карта часов зафейлиного времени
		 */
		onBasketError: function(error, data)
		{
			if (this.date)
			{
				if (_.isEmpty(data))
				{
					var dates = this.getDateStamps();
					this._clearCache(dates);
				}
				else
				{
					_.deepExtend(this.bookedMap, data);
				}

				this.load(this.date);
			}
		},

		/**
		 * Событие: перейти к дате
		 *
		 * @param {jQuery.Event} e
		 */
		onNavigateTo: function (e)
		{
			e.preventDefault();

			this.load($(e.currentTarget).data('navigate-to'));
		},

		/**
		 * Событие: клик по времени в расписании
		 *
		 * @param {jQuery.Event} e
		 */
		onTimeClick: function (e)
		{
			e.preventDefault();

            module.ymReachGoal('CALENDARCLICK');

			var that = this,
				userRole = this.getOption('userRole');

			if (userRole !== this.ROLE_GUEST && userRole !== this.ROLE_USER)
			{
				var playgroundUserId = parseInt(this.playground.attributes.uid);
				var currentUserId = parseInt(this.basket.options.user.id);

				if (userRole === this.ROLE_PLAYGROUND && playgroundUserId !== currentUserId) {
					this.basket.openMessage({
						header: 'Вы открыли расписание для клиентов',
						message: 'Чтобы оформить заказ, необходимо выйти из-под профиля <i>администратора</i> площадок и попробовать ещё раз.',
						btnOk: null,
					});
					return;
				}

				if (userRole === this.ROLE_EMPLOYEE) {
					var moderatedPlaygrounds = this.basket.options.user['moderatedPlaygrounds'];
					var playgroundId = this.playground.attributes.id;
					if (moderatedPlaygrounds.indexOf(playgroundId) === -1) { // Если employee открывает НЕ свою площадку
						this.basket.openMessage({
							header: 'Вы открыли расписание для клиентов',
							message: 'Чтобы оформить заказ, необходимо выйти из-под профиля <i>сотрудника</i> площадок и попробовать ещё раз.',
							btnOk: null,
						});
						return;
					}
				}

				this.basket.openMessage({
					code: 2,
					header: 'Вы открыли расписание для клиентов',
					message: 'Для оформления заказов воспользуйтесь <i>расписанием в панели управления</i>.',
					btnOk: 'Перейти в расписание'
				}, 'pg_msg_2').done(function()
				{
					window.location.href = '/manage.php/playground/schedule/' + that.playground.id;
				});
				return;
			}

			var $target = $(e.currentTarget),
				dateTime = this._ensureMoment($target.data('datetime')),
				date = dateTime.format(momentFormats.dateStamp),
				offset = dateTime.hour() * 3600 + dateTime.minute() * 60,
				timeSteps,
				promise;

			if ($target.hasClass('active'))
			{
				timeSteps = this._getTimeStepsToRemove(date, offset);
				if (timeSteps.length)
				{
					promise = this.basket.removeTime(timeSteps);
					promise && promise.fail(function()
					{
						that.basket.openMessage({
							code: 3,
							header: 'Не получилось удалить выбранное время',
							message: 'Попробуйте позже...'
						}, 'pg_msg_3');
					});
					$target.removeClass('active');
				}
			}
			else
			{
				timeSteps = this._getTimeStepsToAdd(date, offset);
				if (timeSteps.length)
				{
					var limitDate = this.getLimitDate(),
						tzo = this.playground.get('timezoneOffset'),
						timeIsPassed = _.some(timeSteps, function(timeStep)
						{
							return moment.zone(date, tzo).add(timeStep.start, 'seconds') < limitDate;
						}, this);

					if (timeIsPassed)
					{
						this.basket.openMessage({
							code: 4,
							header: 'Это время уже прошло или недоступо',
							message: 'Выберите другое время.'
						}, 'pg_msg_4');
						this.render();
						return;
					}

					promise = this.basket.addTime(timeSteps);
					promise && promise.fail(function()
					{
						that.basket.openMessage({
							code: 5,
							header: 'Это время уже успели забронировать',
							message: 'Кто-то успел это сделать раньше. Выберите другое время.'
						}, 'pg_msg_5');
					});
					$target.addClass('active');
				}
			}
		},

		/**
		 * Событие: изменение даты в шапке расписания на мобильных устройствах
		 *
		 * @param {jQuery.Event} e
		 */
		onCurrentDateBlur: function (e)
		{
			if (!this._isIOS()) return;

			e.preventDefault();
			this.load($(e.currentTarget)[0].value);
		},

		/**
		 * Событие: изменение даты в шапке расписания на мобильных устройствах
		 *
		 * @param {jQuery.Event} e
		 */
		onCurrentDateChange: function (e)
		{
			if (this._isIOS()) return;

			e.preventDefault();
			this.load($(e.currentTarget)[0].value);
		},

		/**
		 * Является ли устройство IOS?
		 *
		 * @returns {WorkerNavigator | Navigator | * | boolean}
		 * @private
		 */
		_isIOS: function ()
		{
			return navigator && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
		},

		/**
		 * Получить элемент календаря
		 *
		 * @param {String} date Дата YYYY-MM-DD
		 * @param {Number} offset Число секунд с начала дня
		 * @returns {Object|Null}
		 */
		_getHour: function(date, offset)
		{
			if (!this.hourMap) return null;

			if (offset in this.hourMap)
			{
				var week = this.hourMap[offset];
				for (var i = 0; i < week.length; i++)
				{
					if (week[i].date === date)
					{
						return week[i];
					}
				}
			}
			return null;
		},

		/**
		 * Получить следующий элемент календаря
		 *
		 * @param {String} date Дата YYYY-MM-DD
		 * @param {Number} offset Число секунд с начала дня
		 * @returns {Object|Null}
		 */
		_getHourAfter: function(date, offset)
		{
			return this._getHour(date, offset + this.timeStep);
		},

		/**
		 * Получить предыдущий элемент календаря
		 *
		 * @param {String} date Дата YYYY-MM-DD
		 * @param {Number} offset Число секунд с начала дня
		 * @returns {Object|Null}
		 */
		_getHourBefore: function(date, offset)
		{
			return this._getHour(date, offset - this.timeStep);
		},

		/**
		 * Сформировать интервалы времени для добавления в корзину
		 *
		 * @param {String} date Дата YYYY-MM-DD
		 * @param {Number} offset Число секунд с начала дня
		 * @returns {Array}
		 */
		_getTimeStepsToAdd: function(date, offset)
		{
			var basketTimeSteps = [{
				date: date,
				start: offset,
				finish: offset + this.timeStep
			}];
			if (this.timeStep >= 3600) {
				return basketTimeSteps;
			}

			// Проверки интервалов менее часа

			// Есть рядом время в корзине
			if (this.basket.hasTimeNear(basketTimeSteps[0])) {
				return basketTimeSteps;
			}

			var added = false;
			var neededIntervals = (this.playground.get('minBookingInterval') / this.timeStep) - 1;
			var offsets = [offset];

			if (neededIntervals === 0) {
				return basketTimeSteps;
			}

			for (var i = 0; i < neededIntervals; i++) {
				offsets.push(offsets[i] + this.timeStep);
			}

			for (var timeAfter of offsets) {
				if (neededIntervals === 0) break;

				var intervalAfter = this._getHourAfter(date, timeAfter);
				if (intervalAfter && this._isValidToAdd(intervalAfter)) {
					this._pushTimeStep(basketTimeSteps, intervalAfter);
					added = true;
					neededIntervals--;
				}
			}
			for (var timeBefore of offsets) {
				if (neededIntervals === 0) break;

				var intervalBefore = this._getHourBefore(date, timeBefore);
				if (intervalBefore && this._isValidToAdd(intervalBefore)) {
					this._pushTimeStep(basketTimeSteps, intervalBefore);
					added = true;
					neededIntervals--;
				}
			}

			if (added) {
				return basketTimeSteps;
			}

			// Не добавлять ничего
			return [];
		},

		/**
		 * Сформировать интервалы времени для удаления из корзину
		 *
		 * @param {String} date Дата YYYY-MM-DD
		 * @param {Number} offset Число секунд с начала дня
		 * @returns {Array}
		 */
		_getTimeStepsToRemove: function(date, offset)
		{
			var basketTimeSteps = [{
					date: date,
					start: offset,
					finish: offset + this.timeStep
			}];

			if (this.timeStep >= 3600)
			{
				return basketTimeSteps;
			}

			// Проверки интервалов менее часа

			// Нет рядом времени в корзине
			if (!this.basket.hasTimeNear(basketTimeSteps[0]))
			{
				return basketTimeSteps;
			}

			// У интервала есть соседи?
			var neededIntervals = (this.playground.get('minBookingInterval') / this.timeStep);
			var nextOffsets = [];
			var previousOffset = [];
			var nextOffsetsIsValid = true;
			var previousOffsetsIsValid = true;

			for (var i = 0; i < neededIntervals; i++) {
				var intervalNext = this._getHourAfter(date, offset + (i * this.timeStep));
				var intervalPrevious = this._getHourBefore(date, offset - (i * this.timeStep));
				if (nextOffsetsIsValid && intervalNext && this._isValidToRemove(intervalNext)) {
					nextOffsets.push(intervalNext);
				} else {
					nextOffsetsIsValid = false;
				}
				if (previousOffsetsIsValid && intervalPrevious && this._isValidToRemove(intervalPrevious)) {
					previousOffset.push(intervalPrevious);
				} else {
					previousOffsetsIsValid = false;
				}
			}

			if (nextOffsets.length > 0 && nextOffsets.length < neededIntervals) {
				for (var next of nextOffsets) {
					this._pushTimeStep(basketTimeSteps, next);
				}
			}

			if (previousOffset.length > 0 && previousOffset.length < neededIntervals) {
				for (var previous of previousOffset) {
					this._pushTimeStep(basketTimeSteps, previous);
				}
			}

			return basketTimeSteps;
		},

		/**
		 * Нужно ли добавить этот интервал к корзине?
		 *
		 * @param {Object} scheduleHour Элемент календаря
		 * @returns {Boolean}
		 */
		_isValidToAdd: function(scheduleHour)
		{
			return scheduleHour.visible
				&& !this.basket.isInBasket(scheduleHour.date, scheduleHour.offset);
		},

		/**
		 * Нужно ли удалить этот интервал из корзины?
		 *
		 * @param {Object} scheduleHour Элемент календаря
		 * @param {Object} scheduleHourNext Соседний элемент календаря
		 * @returns {Boolean}
		 */
		_isValidToRemove: function(scheduleHour, scheduleHourNext)
		{
			if (!this.basket.isInBasket(scheduleHour.date, scheduleHour.offset))
			{
				return false;
			}
			if (!scheduleHourNext)
			{
				return true;
			}
			return !this.basket.isInBasket(scheduleHourNext.date, scheduleHourNext.offset);
		},

		/**
		 * Добавить интервал в массив добавляемых интервалов
		 *
		 * @param {Array} basketTimeSteps Куда добавляем
		 * @param {Object} scheduleHour Что добавляем
		 */
		_pushTimeStep: function(basketTimeSteps, scheduleHour)
		{
			basketTimeSteps.push({
				date: scheduleHour.date,
				start: scheduleHour.offset,
				finish: scheduleHour.offset + this.timeStep
			});
			this._disableUI();
		},

		/**
		 * Блокировать пользовательский ввод (из-за получасовых интервалов)
		 */
		_disableUI: function()
		{
			this.ui.preloader.show(); // По событию render скроется
		},

		onBeforeRender: function ()
		{
			if (this.isRendered)
			{
				this.detachPlugins();
			}
		},

		onDomRefresh: function ()
		{
			this.attachPlugins();

			// crutch MSS-1126
			if (fixGteWin8IeBug)
			{
				this._fixGteWin8IeHoverBug();
			}
		},

		attachPlugins: function ()
		{
			if (this.theme == 'mobile') {
				var $header = $('.page__header_position_fixed');
				this.ui.header.trueFixer({
					related: '.-playground-schedule-and-basket_panel-container',
					gap: $header.length ? $header.outerHeight() : 0
				});
				this.$el.css({'padding-top': this.ui.header.outerHeight()});
			} else {
				this.ui.header.trueFixer({
					related: '.-playground-schedule-and-basket_panel-container',
					startOffset: 'current',
					gap: this.basketPanel.getHeight()
				});
			}
		},

		detachPlugins: function ()
		{
			if (this.theme == 'mobile') {
				this.$el.css({'padding-top': this.ui.header.outerHeight()});
			}

			this.ui.header.trueFixer('destroy');
			this.ui.header.data('trueFixer', null);
		},

		updatePlugins: function ()
		{
			this.detachPlugins();
			this.attachPlugins();
		},

		/**
		 * @crutch MSS-1126 В IE/Edge в Win8+ иногда после рендера расписания "зависает" псевдо-класс :hover на кнопке,
		 * сбрасывается только если снова навести курсор на эту кнопку
		 */
		_fixGteWin8IeHoverBug: function ()
		{
			if (this.theme == 'mobile') return;

			var $targets = this.$('.-playground-schedule-row, .-btn-schedule').addClass('-msie-win8-hover-fix');

			setTimeout(function ()
			{
				$targets.one('mouseenter', function ()
				{
					$(this).removeClass('-msie-win8-hover-fix');
				});
			}, 500); // Если задать ~100 - уже не работает!
		}
	});
}, moment);
/**
 * @param {Marionette.Module} module
 * @param {Marionette.Application} app
 * @param {Backbone} Bb
 * @param {Marionette} Mn
 * @param {jQuery} $
 * @param {_} _ underscore
 */
application.module('pages.playgroundView', function (module, app, Bb, Mn, $, _)
{
	var BasketPanelHour = Bb.Model.extend({
		duration: function ()
		{
			return this.get('finish') - this.get('start');
		},

		hourDuration: function ()
		{
			return this.duration();
		}
	});
	var BasketPanelHourCollection = Bb.Collection.extend({
		model: BasketPanelHour,

		getTotalPrice: function ()
		{
			return this.reduce(function (totalPrice, hour)
			{
				return totalPrice + hour.get('price').total;
			}, 0);
		}
	});


	var BasketPanelHourBehavior = Mn.Behavior.extend({
		ui: {
			repeatButton: '.-js-repeat-hour',
			removeButton: '.-js-remove-hour',
		},

		events: {
			'click @ui.repeatButton': 'onRepeatButtonClick',
			'click @ui.removeButton': 'onRemoveButtonClick',
		},

		onRepeatButtonClick: function (e)
		{
			e.preventDefault();

			this.view.getOption('basket').openRepeat(this.view.model.get('bid'), {
				userRole: this.view.userRole,
				user: this.view.user
			});
		},

		onRemoveButtonClick: function (e)
		{
			e.preventDefault();

			this.view.getOption('basket').removeTime([{ bid: this.view.model.get('bid') }]);
		}
	});
	var BasketPanelHourView = Mn.ItemView.extend({
		behaviors: {
			document: {
				behaviorClass: BasketPanelHourBehavior
			}
		},

		serializeData: function ()
		{
			return this.model;
		}
	});


	var BasketPanelBehavior = Mn.Behavior.extend({
		ui: {
			showMoreButton: '.-js-show-more-hours',
			submitButton: '.-js-goto-checkout',
			clearButton: '.-js-clear-basket'
		},

		events: {
			'click @ui.showMoreButton': 'onShowMoreButtonClick',
			'click @ui.submitButton': 'onSubmitButtonClick',
			'click @ui.clearButton': 'onClearBasket'
		},

		onClearBasket: function (e)
		{
			e.preventDefault();

			this.view.basket.clearBasket();
		},

		onShowMoreButtonClick: function (e)
		{
			e.preventDefault();

			this.view.basket.openInfo({
				userRole: this.view.userRole,
				user: this.view.user,
			});
		},

		onSubmitButtonClick: function (e)
		{
			e.preventDefault();

			module.ymReachGoal('pg_book_click');

			this.recheckBasket().then(
				_.bind(this.locateToCheckout, this),
				_.bind(this.showSyncError, this)
			);
		},

		recheckBasket: function ()
		{
			return this.view.basket.resolveConflict();
		},

		locateToCheckout: function ()
		{
			var user = this.view.user,
				isGuest = this.view.userRole === 'guest',
				basket = this.view.basket,
				route = isGuest || (user && (user.phone_verified === 0 || !user.email))
					? 'playground/auth'
					: 'playground/checkout';

			location.href = module.createServerUrl(route, {
				id: basket.playground.id,
				weight: basket.data.config.weight
			});
		},

		showSyncError: function ()
		{
			this.view.basket.openMessage({
				code: 10,
				message: 'Обновите расписание и выберите интересующеее время заново.',
				btnOk: 'Обновить расписание',
				subMessage:
					'<br>Ошибка могла произойти по нескольким причинам:' +
					'<br>Выбранное время забронировал кто-то другой' +
					'<br>Выбранное время прошло'
			}, 'pg_msg_10');
		}
	});
	module.BasketPanelView = Mn.CompositeView.extend({
		VIEW_LIMIT: 3,

		className: '-playground-basket_panel-container playground-basket__container',

		template: 'playgroundBasketPanel',

		childView: BasketPanelHourView,
		childViewContainer: '.-playground-basket_panel-hours',

		behaviors: {
			document: {
				behaviorClass: BasketPanelBehavior
			}
		},

		initialize: function (options)
		{
			this.basket = options.basket;
			this.userRole = options.userRole;
			this.user = options.user;
			this.theme = options.theme;

			this.collection = new BasketPanelHourCollection();
			this.updateCollection();
		},

		childViewOptions: function ()
		{
			return {
				basket: this.basket
			};
		},

		viewComparator: function (basketHour)
		{
			return +basketHour.get('timeStart');
		},

		updateCollection: function ()
		{
			var hours = _.filter(this.basket.data.time, function (hour)
			{
				return 1 == hour.state; // доступно для бронирования
			});

			this.collection.reset(hours);
		},

		/**
		 * Вызывается из `PlaygroundScheduleLayoutView`
		 */
		onBasketSync: function ()
		{
			this.updateCollection();
			this.render(); // CRUTCH CompositeView.noAutoRender
		},

		_initialEvents: function ()
		{
			// CRUTCH CompositeView.noAutoRender

			// Пришлось отключить автообновление при прослушке коллекции
			// из-за того что при collection:reset отрабатывает только _renderChildren
			// в итоге при удалении последнего часа ругалось на отсутствие контейнера для childView
		},

		_renderChildren: function (containerView, childView)
		{
			// CRUTCH CompositeView.noAutoRender

			if (!this.isEmpty())
			{
				return Mn.CompositeView.prototype._renderChildren.apply(this, arguments);
			}
		},


		isEmpty: function ()
		{
			return 0 === this.collection.length;
		},

		_filteredSortedModels: function ()
		{
			var models = Mn.CompositeView.prototype._filteredSortedModels.apply(this, arguments);

			if (this._showMoreButton(models.length))
			{
				models = models.slice(0, this.VIEW_LIMIT - 1);
			}

			return models;
		},

		_showMoreButton: function (count)
		{
			if (arguments.length === 0)
			{
				count = this.basket.data.time.length;
			}

			return count > this.VIEW_LIMIT;
		},


		serializeData: function ()
		{
			return {
				totalPrice: this.collection.getTotalPrice(),
				totalCount: this.collection.length,
				total: this.basket.getTotal(),
				showMoreButton: this._showMoreButton()
			};
		},

		getHeight: function ()
		{
			return this.$el.outerHeight();
		},

		onDomRefresh: function ()
		{
			this.attachPlugins();
		},

		attachPlugins: function ()
		{
			if (this.theme == 'desktop') {
				this.$el.trueFixer({
					related: '.-playground-schedule-and-basket_panel-container',
					startOffset: 'current'
				});
			}
			if (this.theme == 'mobile') {
				this.$el.show();
			}
			this.$('[data-toggle="tooltip"]').tooltip({
				container: this.$el
			});
		},

		detachPlugins: function ()
		{
			if (this.theme == 'desktop') {
				this.$el.trueFixer('destroy');
				this.$el.data('trueFixer', null);
			}
			if (this.theme == 'mobile') {
				this.$el.hide();
			}
		},

		updatePlugins: function ()
		{
			this.detachPlugins();
			this.attachPlugins();
		}
	});
});

/**
 * Модуль корзины
 */
application.module('pages.playgroundView', function (module, app, Bb, Mn, $, _)
{
	'use strict';

	/**
	 * Карта интервалов времени в корзине для расписания
	 * {
	 *		'YYYY-MM-DD' : [
	 *			{
	 *				start: Integer, // Число секунд с начала дня
	 *				finish: Integer // Число секунд с начала дня
	 *			},
	 *			{...}
	 *		],
	 *		'YYYY-MM-DD' : [...]
	 * }
	 */
	module.PlaygroundBasketTimeMap = Mn.Object.extend({
		basket: null,
		_timeMap: {},

		initialize: function(options)
		{
			this.basket = options.basket;
		},

		add: function(date, start, finish)
		{
			if (this._add(date, start, finish))
			{
				this.trigger('basketTimeAdd', {
					date: date,
					start: start,
					finish: finish
				});
			}
		},

		clearMap: function()
		{
			this._timeMap = {};
		},

		get: function(date, start)
		{
			var timeId = this._getIndex(date, start);
			return timeId > -1 ?
				this._timeMap[date][timeId]
				: null;
		},

		getMap: function()
		{
			return this._timeMap;
		},

		has: function(date, start)
		{
			return (this._getIndex(date, start) > -1);
		},

		hasDate: function(date)
		{
			return !!this._timeMap[date];
		},

		hasNear: function(date, start, finish)
		{
			if (this._timeMap[date])
			{
				var dateMap = this._timeMap[date];
				for (var i = 0; i < dateMap.length; i++)
				{
					if (dateMap[i].finish < start || finish < dateMap[i].start)
					{
						continue;
					}

					return true;
				}
			}
			return false;
		},

		hasNearId: function(date, id)
		{
			if (this._timeMap[date] && this._timeMap[date][id])
			{
				var dateMap = this._timeMap[date],
					start = dateMap[id].start,
					finish = dateMap[id].finish;
				for (var i = 0; i < dateMap.length; i++)
				{
					if (i == id || dateMap[i].finish < start || finish < dateMap[i].start)
					{
						continue;
					}

					return true;
				}
			}
			return false;
		},

		isEmpty: function()
		{
			return _.isEmpty(this._timeMap);
		},

		rejectFailed: function(basketHours)
		{
			var mapIndexes, mapHour;
			for (var i = 0, hourLength = basketHours.length; i < hourLength; i++)
			{
				if (basketHours[i].state != this.basket.HOUR_STATE_OK)
				{
					this._remove(basketHours[i].date, +basketHours[i].start, +basketHours[i].finish);
				}
			}
		},

		remove: function(date, start, finish)
		{
			if (this._remove(date, start, finish))
			{
				this.trigger('basketTimeRemove', {
					date: date,
					start: start,
					finish: finish
				});
			}
		},

		removeOrphanedHalfhours: function()
		{
			var orphanedBasketHours = [];
			_.each(this._timeMap, function(dateMap, date)
			{
				for (var i = dateMap.length - 1; i >= 0; i--) // Чтобы при удалении элемента не сбивался индекс
				{
					if (dateMap[i].finish - dateMap[i].start < 3600
						&& !this.hasNearId(date, i))
					{
						orphanedBasketHours.push({
							date: date,
							start: dateMap[i].start,
							finish: dateMap[i].finish
						});
						this._remove(date, dateMap[i].start, dateMap[i].finish);
					}
				}
			}, this);
			return orphanedBasketHours;
		},

		setMap: function(basketHours)
		{
			this.clearMap();
			for (var i = 0, hourLength = basketHours.length; i < hourLength; i++)
			{
				if (basketHours[i].state != this.basket.HOUR_STATE_OK) continue;

				this._add(basketHours[i].date, +basketHours[i].start, +basketHours[i].finish);
			}
		},

		_add: function(date, start, finish)
		{
			var timeItem = {
				start: start,
				finish: finish,
			};
			// Сначала очистим этот интервал, чтобы не было наложений
			this._remove(date, start, finish);

			if (this._timeMap[date])
			{
				this._timeMap[date].push(timeItem);
			}
			else
			{
				this._timeMap[date] = [timeItem];
			}
			return true;
		},

		_remove: function(date, start, finish)
		{
			var existingIds = this._getIndexRange(date, start, finish),
				existingItem, newFinish;

			for (var i = existingIds.length - 1; i >=0 ; i--)
			{
				existingItem = this._timeMap[date][existingIds[i]];
				newFinish = existingItem.finish;
				if (existingItem.start < start)
				{
					existingItem.finish = start;
				}
				else
				{
					this._timeMap[date].splice(existingIds[i], 1);
				}

				if (newFinish > finish)
				{
					this._add(date, finish, newFinish);
				}

				if (!this._timeMap[date].length)
				{
					delete this._timeMap[date];
				}
			}

			return (existingIds.length > 0);
		},

		_getIndex: function(date, start)
		{
			if (this._timeMap[date])
			{
				var dateMap = this._timeMap[date];
				for (var i = 0; i < dateMap.length; i++)
				{
					if (dateMap[i].start <= start && start < dateMap[i].finish) {
						return i;
					}
				}
			}
			return -1;
		},

		_getIndexRange: function(date, start, finish)
		{
			var found = [];
			if (this._timeMap[date])
			{
				var dateMap = this._timeMap[date];
				for (var i = 0; i < dateMap.length; i++)
				{
					if (dateMap[i].finish <= start || finish <= dateMap[i].start)
					{
						continue;
					}
					found.push(i);
				}
			}
			return found;
		}

	});

});

/**
 * Модуль корзины
 */
application.module('pages.playgroundView', function (module, app, Bb, Mn, $, _, main)
{
	'use strict';

	/**
	 * Вид для вывода сообщений корзины. пока только ошибки
	 */
	module.PlaygroundBasketMessageView = main.ModalItemView.extend({
		el: '#basket-message-modal',
		template: 'basketMessage',

		events: {
			'click .-js-basket-message-ok': 'onBtnOkClick'
		},

		defaults: {
			btnOk: 'Хорошо',
			header: 'Бронирование не удалось',
			message: 'Произошла ошибка. Попробуйте позже...',
			subMessage: null,
			code: 0
		},

		onBtnOkClick: function(e)
		{
			e.preventDefault();
			this.setModalResolve();
		},

		show: function(data)
		{
			this.setData(data);

			this.render();
			this.$el.modal("show");

			return this.getModalPromise();
		},

		serializeData: function(){
			return {
				btnOk: this.getOption('btnOk'),
				header: this.getOption('header'),
				message: this.getOption('message'),
				subMessage: this.getOption('subMessage'),
				code: this.getOption('code')
			};
		},

		setData: function(data)
		{
			if (!_.isObject(data))
			{
				data = { message: data };
			}
			_.defaults(data, this.defaults);
			this.mergeOptions(data, _.keys(this.defaults));
		}
	});

}, application.module('main'));

/**
 * Модуль корзины
 */
application.module('pages.playgroundView', function (module, app, Bb, Mn, $, _)
{
	'use strict';

	/**
	 * Вид для вывода общей информации по корзине
	 */
	module.PlaygroundBasketHeaderView = Mn.ItemView.extend({
		template: 'basketHeader',
		basket: null,

		initialize: function(options)
		{
			this.basket = options.basket;

			this.listenTo(this.basket, this.basket.EVENT_SYNC, this.render);
		},

		serializeData: function()
		{
			return {
				playground: {
					name: this.basket.playground.get('name'),
					address: this.basket.playground.get('address')
				},
				weight: this.basket.getWeightLabel(),
				isEmpty: this.basket.isEmpty()
			};
		}
	});
});

/**
 * Модуль корзины
 */
application.module('pages.playgroundView', function (module, app, Bb, Mn, $, _, moment, Math)
{
	'use strict';

	/**
	 * Вид для вывода таблицы часов коризны
	 */
	module.PlaygroundBasketRepeatItemView = Mn.ItemView.extend({
		template: 'basketRepeatItem',
		basket: null,
		bid: null,
		repeatData: null,
		displayedColumns: 6,

		initialize: function(options)
		{
			this.basket = options.basket;
			this.bid = options.bid;
			this.userRole = options.userRole;
		},

		serializeData: function()
		{
			return {
				columnSize: this._getColumnSize(),
				repeatMap: this._makeRepeatMap(this.repeatData)
			};
		},

		setData: function(data)
		{
			this.repeatData = data;
		},

		/**
		 * Получить размер колонки для сетки bootstrap
		 * @returns {Number} 1, 2, 3, 4, 6, 12
		 */
		_getColumnSize: function()
		{
			var size = Math.floor(12 / this.displayedColumns);
			if (size > 12) size = 12;
			return size > 0 ? size : 1;
		},

		/**
		 * Получить число колонок для сетки bootstrap
		 * @returns {Number}
		 */
		_getMaxColumns: function()
		{
			return this.displayedColumns <= 12 ? this.displayedColumns : 12;
		},

		_makeRepeatMap: function(repeatData)
		{
			var repeatMap = {},
				repeatDataItem,
				dateParts,
				date,
				key,
				currentYear = '',
				currentColumn = 1,
				maxColumns = this._getMaxColumns(),
				firstInRow = true,
				dayMap;
			for (var i = 0; i < repeatData.length; i++)
			{
				repeatDataItem = repeatData[i];
				date = moment.zone(repeatDataItem.date, repeatDataItem.timezoneOffset);

				dateParts = repeatDataItem.date.split('-', 3); // YYYY-MM-DD
				key = dateParts[0] + '-' + dateParts[1];

				dayMap = {
					day: date.date(),
					isBusy: !!repeatDataItem.state
				};

				if (key in repeatMap)
				{
					repeatMap[key].days.push(dayMap);
				}
				else
				{
					repeatMap[key] = {
						year: date.year(),
						showYear: firstInRow || currentYear != dateParts[0],
						month: date.format('MMMM'),
						dayweek: date.format('dd'),
						days: [dayMap],
						startNewRow: (currentColumn % maxColumns) == 0,
					};
					currentColumn++;
					firstInRow = repeatMap[key].startNewRow;
				}
				currentYear = dateParts[0];
			}
			return repeatMap;
		}

	});

}, moment, Math);

/**
 * Модуль корзины
 */
application.module('pages.playgroundView', function (module, app, Bb, Mn, $, _, moment)
{
	'use strict';

	/**
	 * Вид для вывода таблицы часов коризны
	 */
	module.PlaygroundBasketTableView = Mn.ItemView.extend({
		template: 'basketTable',
		basket: null,

		readOnly: false,
		modalView: false,
		limit: 0,
		bid: -1,
		channel: null,

		COMMAND_SETBID: 'setBid',

		ui: {
			'popover': '.-js-popover',
			'tooltip': '[data-toggle="tooltip"]'
		},

		events: {
			'click [data-removehour]': 'onRemove',
			'click [data-repeathour]': 'onRepeat',
			'click .-js-open-basket-info': 'onOpenBasketInfo'
		},

		initialize: function (options)
		{
			this.basket = options.basket;
			this.timezoneOffset = this.basket.playground.get('timezoneOffset');
			this.userRole = options.userRole;
			this.user = options.user;
			this._hasTaxes = !!this.basket.playground.get('taxHour');

			this.listenTo(this.basket, this.basket.EVENT_SYNC, this.render);
			if (options.channel)
			{
				this.channel = options.channel;
				this.channel.vent.on(this.COMMAND_SETBID, _.bind(function(bid)
				{
					this.bid = bid;
				}, this));
			}
		},

		serializeData: function ()
		{
			var hours = this.getBasketHours(),
				limit = this.getOption('limit'),
				limitExceeded = 0,
				endDate = this._today().add(1, 'year').subtract(1, 'week');

			if (limit && limit < hours.length)
			{
				limitExceeded = hours.length - limit;
				hours = hours.slice(0, limit);
			}

			hours = _.map(hours, function(hour)
			{
				return _.extend(hour, {
					showRepeat: moment.zone(hour.date, this.timezoneOffset) < endDate
				});
			}, this);

			return {
				hours: hours,
				readOnly: this.getOption('readOnly'),
				isEmpty: this.basket.isEmpty(),
				limitExceeded: limitExceeded,
				hasTaxes: this._hasTaxes
			};
		},

		onBeforeRender: function()
		{
			if (this.ui.tooltip.tooltip)
			{
				this.ui.tooltip.tooltip('destroy');
			}
		},

		onRender: function()
		{
			var that = this;
			this.ui.tooltip.tooltip({
				delay: {
					show: 1000,
					hide: 0
				}
			});
			this.ui.popover.popover({
				template: '<div class="popover">'
					+ '<div class="popover-inner">'
						+ '<button type="button" class="close pull-right" data-dismiss="popover">'
							+'<span aria-hidden="true">×</span>'
						+'</button>'
						+ '<div class="popover-content"></div>'
					+'</div>'
				+ '</div>',
				placement: this.getOption('taxPopoverBottom') ? 'bottom' : 'top',
				onShown: function()
				{
					if (that.getOption('modalView')) // Скрыть popover при scroll
					{
						var popover = this;
						that.$el.parents('.modal-body')
							.off('scroll.fs.basket.taxhour')
							.one('scroll.fs.basket.taxhour', function() {
								if (popover.isShown())
								{
									popover.toggle();
								}

							});
					}
				},
				onHidden: function()
				{
					if (that.getOption('modalView'))
					{
						that.$el.parents('.modal-body')
							.off('scroll.fs.basket.taxhour');
					}
				}
			});
		},

		onRemove: function (e)
		{
			e.preventDefault();

			var bid = $(e.currentTarget).data('removehour');
			this.basket.removeTime([{ bid: bid }]);
		},

		onRepeat: function (e)
		{
			e.preventDefault();

			var bid = $(e.currentTarget).data('repeathour');

			if (this.getOption('modalView'))
			{
				this.$el.parents('.modal').modal('hide');
			}

			this.basket.openRepeat(bid, { userRole: this.userRole, user: this.user });
		},

		onOpenBasketInfo: function (e)
		{
			e.preventDefault();
			this.basket.openInfo({ userRole: this.userRole, user: this.user });
		},

		getBasketHours: function ()
		{
			var bid = this.getOption('bid');
			if (bid > -1)
			{
				var hour = this.basket.getDataHourById(bid);
				return hour
					? [ this._getHourData(hour) ]
					: [];
			}
			// .reverse() => последние брони сверху
			return _.map(this.basket.getDataHoursOk().reverse(), this._getHourData, this);
		},

		_getHourData: function (hour)
		{
			return {
				bid: hour.bid,
				date: hour.date,
				start: hour.start,
				finish: hour.finish,
				hourCount: hour.finish - hour.start,
				price: this.basket.getHourPrice(hour),
				taxHour: this.basket.getHourTax(hour)
			};
		},

		/**
		 * Возвращает сегодняшний день
		 *
		 * @todo Это копипаст из schedule
		 *
		 * @returns {moment}
		 */
		_today: function ()
		{
			return moment().zone(this.timezoneOffset).startOf('day');
		}
	});

}, moment);

/**
 * Модуль корзины
 */
application.module('pages.playgroundView', function (module, app, Bb, Mn, $, _, moment)
{
	'use strict';

	/**
	 * Вид для вывода итога коризны
	 */
	module.PlaygroundBasketFooterView = Mn.ItemView.extend({
		template: 'basketFooter',
		basket: null,

		initialize: function(options)
		{
			this.basket = options.basket;

			this.listenTo(this.basket, this.basket.EVENT_SYNC, this.render);
		},

		serializeData: function()
		{
			return {
				total: this.getTotal(),
				isEmpty: this.basket.isEmpty()
			};
		},

		getTotal: function()
		{
			var totals = this.basket.getTotal();
			return {
				dateCount: totals.dates,
				hourCount: totals.hours,
				secoundCount: this.basket.getTotalTime().seconds,
				price: totals.price,
				taxHour: totals.taxHour
			};
		}

	});

}, moment);

/**
 * Окно "Ваш заказ"
 */
application.module('pages.playgroundView', function (module, app, Bb, Mn, $, _, main)
{
	'use strict';

	module.PlaygroundBasketInfoLayout = main.ModalLayoutView.extend({
		el: '#basket-info-modal',
		template: 'basketInfo',

		ui: {
			preloader: '.preloader',
			checkoutButton: '.-js-checkout-btn'
		},

		regions: {
			basketHeader: '.basket-header',
			basketHours: '.basket-hours',
			basketFooter: '.basket-footer'
		},

		events: {
			'click @ui.checkoutButton': 'onGotoCheckoutFromInfo'
		},

		basket: null,

		initialize: function(options)
		{
			this.basket = options.basket;
			this.userRole = options.userRole;
			this.user = options.user;
			this.listenTo(this.basket, this.basket.EVENT_BEFORE_SYNC, this.onBeforeBasketSync);
			this.listenTo(this.basket, this.basket.EVENT_SYNC, this.onBasketSync);
		},

		isVisible: function()
		{
			// http://stackoverflow.com/a/19674741
			return this.$el.hasClass('in');
		},

		show: function()
		{
			if (!this.isRendered)
			{
				this.render();
			}

			this.$el.modal('show');
			this.$el.find('.modal-body').scrollTop(0);

			return this.getModalPromise();
		},

		onRender: function ()
		{
			this.showChildView('basketHeader', new module.PlaygroundBasketHeaderView({ basket: this.basket }));
			this.showChildView('basketHours', new module.PlaygroundBasketTableView({ basket: this.basket, modalView: true, taxPopoverBottom: true, userRole: this.userRole, user: this.user }));
			this.showChildView('basketFooter', new module.PlaygroundBasketFooterView({ basket: this.basket }));
		},

		onBeforeBasketSync: function()
		{
			this.ui.preloader.show();
		},

		onBasketSync: function()
		{
			this.ui.preloader.hide();
		},

		onCheckPassedFromInfo: function()
		{
			var route = (this.userRole == 'guest') ? 'playground/auth' : 'playground/checkout';

			location.href = module.createServerUrl(route, {
				id: this.basket.playground.id,
				weight: this.basket.data.config.weight
			});
		},

		onCheckFailFromInfo: function(xhr, status)
		{
			this.$el.modal('hide');

			this.basket.openMessage({
				code: 7,
				message: 'Обновите расписание и выберите интересующеее время заново.',
				btnOk: 'Обновить расписание',
				subMessage:
					'<br>Ошибка могла произойти по нескольким причинам:' +
					'<br>Выбранное время забронировал кто-то другой' +
					'<br>Выбранное время прошло'
			}, 'pg_msg_7');
		},

		onGotoCheckoutFromInfo: function (e)
		{
			e.preventDefault();
			module.ymReachGoal('pg_book_click');

            this.resolveConflicts();
		},

		resolveConflicts: function(){
			this.basket.resolveConflict()
				.done($.proxy(this.onCheckPassedFromInfo, this))
				.fail($.proxy(this.onCheckFailFromInfo, this));
		}
	});
}, application.module('main'));

/**
 * Модуль корзины
 */
application.module('pages.playgroundView', function (module, app, Bb, Mn, $, _, moment)
{
	'use strict';

	/**
	 * Вид для вывода таблицы часов коризны
	 */
	module.PlaygroundBasketRepeatCheckoutView = Mn.CompositeView.extend({
		template: 'basketRepeatCheckout',
		childView: module.PlaygroundBasketRepeatItemView,
		childViewContainer: '.-js-repeat-table',

		basket: null,
		bid: -1,
		channel: null,
		dateFinish: null,
		RepeatCollection: Bb.Collection.extend({}),

		COMMAND_SETBID: 'setBid',

		events: {
			'click .-js-repeat-datepicker': 'onGotoDatepickerClick'
		},

		initialize: function(options)
		{
			this.collection = new this.RepeatCollection();
			this.basket = options.basket;
			this.bid = options.bid;
			this.userRole = options.userRole;

			if (options.channel)
			{
				this.channel = options.channel;
				this.channel.vent.on(this.COMMAND_SETBID, _.bind(function(bid)
				{
					this.bid = bid;
				}, this));
			}
		},

		buildChildView: function(child, ChildViewClass, childViewOptions)
		{
			var view = new ChildViewClass(childViewOptions);
			view.setData(this._fetchAttributes(child));

			return view;
		 },

		serializeData: function()
		{
			var eachDayOfWeek = _.bind(function()
			{
				var dataHour = this.basket.getDataHourById(this.bid),
					day = moment(dataHour.date).day();

				switch (day)
				{
					case 0:
						return 'каждое <span class="-repeat-each-dow">воскресенье</span>';
					case 1:
						return 'каждый <span class="-repeat-each-dow">понедельник</span>';
					case 2:
						return 'каждый <span class="-repeat-each-dow">вторник</span>';
					case 3:
						return 'каждую <span class="-repeat-each-dow">среду</span>';
					case 4:
						return 'каждый <span class="-repeat-each-dow">четверг</span>';
					case 5:
						return 'каждую <span class="-repeat-each-dow">пятницу</span>';
					case 6:
						return 'каждую <span class="-repeat-each-dow">субботу</span>';
					default:
						return '<span class="-repeat-each-dow">каждую неделю</span>';
				}
			}, this);

			return {
				dateFinish: this.dateFinish,
				eachDow: eachDayOfWeek()
			};
		},

		setData: function(dateFinish, repeatData)
		{
			this.dateFinish = dateFinish;

			this.collection.reset([repeatData]);
		},

		onGotoDatepickerClick: function(e)
		{
			e.preventDefault();
			this.trigger('goto:datepicker:basketrepeat', this.dateFinish);
		},

		_fetchAttributes: function(repeatModel)
		{
			// Костыль: в attributes модели массив данных по повтору брони сохранен как объект с числовыми "свойствами"
			// нужно получить обратно этот массив.
			// Массив не сделан как collection из-за хитрой логики render'а в PlaygroundRepeatItemView
			return _.values(repeatModel.attributes);
		}

	});

	module.PlaygroundBasketRepeatNoPlacesView = Mn.ItemView.extend({
		template: 'basketRepeatNoPlaces',

		basket: null,
		bid: -1,
		channel: null,
		dateFinish: null,

		COMMAND_SETBID: 'setBid',

		initialize: function(options)
		{
			this.basket = options.basket;
			this.bid = options.bid;

			if (options.channel)
			{
				this.channel = options.channel;
				this.channel.vent.on(this.COMMAND_SETBID, _.bind(function(bid)
				{
					this.bid = bid;
				}, this));
			}
		},

		serializeData: function()
		{
			var dataHour = this.basket.getDataHourById(this.bid);
			if (!dataHour) return {};

			var eachDayOfWeek = _.bind(function()
			{
				var dataHour = this.basket.getDataHourById(this.bid),
					day = moment(dataHour.date).day();

				switch (day)
				{
					case 0:
						return 'По&nbsp;<span class="-repeat-each-dow">воскресеньям</span>';
					case 1:
						return 'По&nbsp;<span class="-repeat-each-dow">понедельникам</span>';
					case 2:
						return 'По&nbsp;<span class="-repeat-each-dow">вторникам</span>';
					case 3:
						return 'По&nbsp;<span class="-repeat-each-dow">средам</span>';
					case 4:
						return 'По&nbsp;<span class="-repeat-each-dow">четвергам</span>';
					case 5:
						return 'По&nbsp;<span class="-repeat-each-dow">пятницам</span>';
					case 6:
						return 'По&nbsp;<span class="-repeat-each-dow">субботам</span>';
					default:
						return '<span class="-repeat-each-dow">В&nbsp;этот день недели</span>';
				}
			}, this);

			return {
				dateFinish: this.dateFinish,
				eachDow: eachDayOfWeek(),
				start: dataHour.start,
				finish: dataHour.finish
			};
		},

		setData: function(dateFinish)
		{
			this.dateFinish = dateFinish;
		}

	});

}, moment);

/**
 * Модуль корзины
 */
application.module('pages.playgroundView', function (module, app, Bb, Mn, $, _, moment)
{
	'use strict';

	/**
	 * Вид для вывода таблицы часов коризны
	 */
	module.PlaygroundBasketRepeatDatepickerView = Mn.ItemView.extend({
		template: 'basketRepeatDatepicker',
		basket: null,
		bid: -1,
		channel: null,
		defaultViewDate: null,

		COMMAND_SETBID: 'setBid',

		initialize: function(options)
		{
			this.basket = options.basket;
			this.bid = options.bid;

			if (options.channel)
			{
				this.channel = options.channel;
				this.channel.vent.on(this.COMMAND_SETBID, _.bind(function(bid)
				{
					this.bid = bid;
				}, this));
			}
		},

		ui: {
			datepicker: '.-js-repeat-date'
		},

		serializeData: function()
		{
			var eachDayOfWeek = _.bind(function()
			{
				var dataHour = this.basket.getDataHourById(this.bid),
					day = moment(dataHour.date).day();

				switch (day)
				{
					case 0:
						return 'каждое <span class="-repeat-each-dow">воскресенье</span>';
					case 1:
						return 'каждый <span class="-repeat-each-dow">понедельник</span>';
					case 2:
						return 'каждый <span class="-repeat-each-dow">вторник</span>';
					case 3:
						return 'каждую <span class="-repeat-each-dow">среду</span>';
					case 4:
						return 'каждый <span class="-repeat-each-dow">четверг</span>';
					case 5:
						return 'каждую <span class="-repeat-each-dow">пятницу</span>';
					case 6:
						return 'каждую <span class="-repeat-each-dow">субботу</span>';
					default:
						return '<span class="-repeat-each-dow">каждую неделю</span>';
				}
			}, this);

			return {
				eachDow: eachDayOfWeek()
			};

		},

		setDefaultViewDate: function(date)
		{
			this.defaultViewDate = date
				? moment.zone(date, this.basket.playground.get('timezoneOffset'))
				: null;
		},

		getDateFinish: function()
		{
			return this.ui.datepicker.datepickerdouble('getFormattedDate');
		},

		onRender: function()
		{
			var dataHour = this.basket.getDataHourById(this.bid);

			var startDate = dataHour
					? moment.zone(dataHour.date, this.basket.playground.get('timezoneOffset'))
					: this._today(),
				endDate = this._today().add(1, 'year').subtract(1, 'day');

			startDate.add(1, 'week');

			var defaultViewDate = this.defaultViewDate ? this.defaultViewDate : startDate;

			this.ui.datepicker.datepickerdouble({
				format: 'yyyy-mm-dd',
				language: 'ru',
				startDate: startDate.format('YYYY-MM-DD'),
				endDate: endDate.format('YYYY-MM-DD'),
				defaultViewDate: defaultViewDate
			}).on('changeDate', $.proxy(this.onChangeDate, this));
		},

		onChangeDate: function()
		{
			this.trigger('valid:step:basketrepeat', !!this.getDateFinish());
		},

		/**
		 * Возвращает сегодняшний день
		 *
		 * @todo Это копипаст из schedule
		 *
		 * @returns {moment}
		 */
		_today: function ()
		{
			return moment().zone(this.basket.playground.get('timezoneOffset')).startOf('day');
		}

	});

}, moment);

/**
 * Модуль корзины
 */
application.module('pages.playgroundView', function (module, app, Bb, Mn, $, _, moment)
{
	'use strict';

	/**
	 * Вид для вывода таблицы часов коризны
	 */
	module.PlaygroundBasketRepeatFooterView = Mn.ItemView.extend({
		template: 'basketRepeatFooter',
		basket: null,
		bid: -1,
		channel: null,
		parent: null,
		repeatData: null,
		visible: true,

		COMMAND_SETBID: 'setBid',
		STATE_INTERVAL_BUSY: 1,

		triggers: {
			'click .-js-repeat-next-btn': 'click:step:basketrepeat'
		},

		initialize: function(options)
		{
			this.bid = options.bid;
			this.basket = options.basket;
			this.parent = options.parent;

			if (options.channel)
			{
				this.channel = options.channel;
				this.channel.vent.on(this.COMMAND_SETBID, _.bind(function(bid)
				{
					this.bid = bid;
				}, this));
			}
		},

		serializeData: function()
		{
			return {
				isVisible: this.visible,
				isValid: this.parent.isValid,
				hasBusy: this._hasBusyDays(this.repeatData),
				total: this._getTotal(this.repeatData)
			};
		},

		setData: function(repeatData)
		{
			this.repeatData = repeatData;
		},

		resetData: function()
		{
			this.repeatData = null;
		},

		_getTotal: function(repeatData)
		{
			var dataHour = this.basket.getDataHourById(this.bid);
			if (!repeatData || !dataHour) return null;

			var totals = this.basket.getTotal(),
				hourPrice = this.basket.getHourPrice(dataHour),
				hourTax = this.basket.getHourTax(dataHour),
				hourCount = this.basket.getHourCount(dataHour);

			// Начинаем с 1, т.к. первый интервал - это текущая повторяемая бронь (она уже сохранена в корзине)
			for (var i = 1; i < repeatData.length; i++)
			{
				if (repeatData[i].state == this.STATE_INTERVAL_BUSY) continue;

				// Чтобы не усложнять, на этом этапе не склеиваем повторяющиеся брони. Цену и время копируем из повторяемой брони. Расчёт наценки за час может быть завышен
				totals.price += hourPrice;
				totals.taxHour += hourTax;
				totals.hours += hourCount;
				if (!this.basket.isDateInBasket(repeatData[i].date)) // Эта проверка не такая сложная и сильнее заметна
				{
					totals.dates ++;
				}
			}
			return {
				dateCount: totals.dates,
				hourCount: totals.hours,
				price: totals.price,
				taxHour: totals.taxHour
			};
		},

		_hasBusyDays: function(repeatData)
		{
			if (!repeatData) return false;
			return !!_.findWhere(repeatData, { state: this.STATE_INTERVAL_BUSY });
		}

	});

}, moment);

/**
 * Окно "Повтор брони"
 */
application.module('pages.playgroundView', function (module, app, Bb, Mn, $, _, main)
{
	'use strict';

	module.PlaygroundBasketRepeatLayout = main.ModalLayoutView.extend({
		el: '#basket-repeat-modal',
		template: 'basketRepeat',

		STATE_INTERVAL_BUSY: 1,

		ui: {
			preloader: '.preloader'
		},

		regions: {
			basketRepeatHeader: '.basket-repeat-header',
			basketRepeatBody: '.basket-repeat-body',
			basketRepeatFooter: '.basket-repeat-footer'
		},

		CHANNEL_BASKETREPEAT: 'basketRepeat',
		COMMAND_SETBID: 'setBid',
		STEP_DATEPICKER: 0,
		STEP_NOPLACES: 1,
		STEP_CHECKOUT: 2,

		basket: null,
		bid: null,
		step: 0,
		repeatChannel: null,
		repeatData: null,
		isValid: false,
		dateFinish: null,

		views: {
			header: null,
			datepicker: null,
			checkout: null,
			footer: null,
			noplaces: null
		},

		initialize: function(options)
		{
			this.basket = options.basket;
			this.bid = options.bid;
			this.userRole = options.userRole;
			this.user = options.user;
			this.repeatChannel = Bb.Wreqr.radio.channel(this.CHANNEL_BASKETREPEAT);

			var childOptions = {
				basket: this.basket,
				bid: this.bid,
				channel: this.repeatChannel,

				user: this.user,
				userRole: this.userRole
			};

			this.views.header = new module.PlaygroundBasketTableView(_.extend({}, childOptions, { readOnly: true }));
			this.views.datepicker = new module.PlaygroundBasketRepeatDatepickerView(childOptions);
			this.views.footer = new module.PlaygroundBasketRepeatFooterView(_.extend({}, childOptions, { parent: this }));
			this.views.checkout = new module.PlaygroundBasketRepeatCheckoutView(childOptions);
			this.views.noplaces = new module.PlaygroundBasketRepeatNoPlacesView(childOptions);

			this.listenTo(this.views.datepicker, 'valid:step:basketrepeat', this.onStepValid);
			this.listenTo(this.views.footer, 'click:step:basketrepeat', this.onStepClick);
			this.listenTo(this.views.checkout, 'goto:datepicker:basketrepeat', this._showDatepicker);
			this.listenTo(this.basket, this.basket.EVENT_BEFORE_SYNC, this.onBeforeBasketSync);
			this.listenTo(this.basket, this.basket.EVENT_SYNC, this.onBasketSync);
		},

		show: function(bid)
		{
			this.setBid(bid);
			if (!this.isRendered)
			{
				this.render();
			}
			else
			{
				this.triggerMethod('render');
			}

			this.$el.modal('show');

			return this.getModalPromise();
		},

		setBid: function(bid)
		{
			this.bid = bid;
			this.repeatChannel.vent.trigger(this.COMMAND_SETBID, this.bid);
		},

		_showDatepicker: function(defaultViewDate)
		{
			this.step = this.STEP_DATEPICKER;
			this.isValid = false;
			this.dateFinish = null;

			this.views.datepicker.setDefaultViewDate(defaultViewDate);
			this.replaceChildView('basketRepeatBody', this.views.datepicker);

			this.views.footer.resetData();
			this.views.footer.visible = true;
			this.replaceChildView('basketRepeatFooter', this.views.footer);
		},

		_showCheckout: function(repeatData)
		{
			this.step = this.STEP_CHECKOUT;
			this.repeatData = repeatData;
			this.isValid = true;

			this.views.checkout.setData(this.dateFinish, repeatData);
			this.replaceChildView('basketRepeatBody', this.views.checkout);

			this.views.footer.setData(repeatData);
			this.views.footer.visible = true;
			this.replaceChildView('basketRepeatFooter', this.views.footer);
		},

		_showNoPlaces: function()
		{
			this.step = this.STEP_NOPLACES;
			this.repeatData = null;
			this.isValid = true;

			this.views.noplaces.setData(this.dateFinish);
			this.replaceChildView('basketRepeatBody', this.views.noplaces);

			this.views.footer.resetData();
			this.views.footer.visible = false;
			this.replaceChildView('basketRepeatFooter', this.views.footer);
		},

		onRender: function ()
		{
			this.replaceChildView('basketRepeatHeader', this.views.header);
			this._showDatepicker();
		},

		onBeforeBasketSync: function()
		{
			this.ui.preloader.show();
		},

		onBasketSync: function()
		{
			this.ui.preloader.hide();
		},

		onCheckHoursDone: function(repeatData)
		{
			if (this._canRepeat(repeatData))
			{
				this._showCheckout(repeatData);
			}
			else
			{
				this._showNoPlaces(repeatData);
			}
		},

		onCheckHoursFail: function ()
		{
			this.$el.modal('hide');
			this.basket.openMessage({
				code: 8,
				header: 'Повторяемое время уже занято',
				message: 'Кто-то успел забронировать это время раньше. Выберите другое время.'
			}, 'pg_msg_8');
		},

		onStepClick: function()
		{
			switch (this.step)
			{
				case this.STEP_DATEPICKER:
					this._checkHours();
					break;
				case this.STEP_CHECKOUT:
					this._addHours();
					break;
			}

		},

		_canRepeat: function(repeatData)
		{
			return !_.every(_.rest(repeatData), function(repeatItem)
			{
				return repeatItem.state == this.STATE_INTERVAL_BUSY;
			}, this);
		},

		_checkHours: function()
		{
			this.dateFinish = this.views.datepicker.getDateFinish();
			var promise = this.basket.checkHours(this.bid, this.dateFinish);

			promise && promise.done($.proxy(this.onCheckHoursDone, this))
				.fail($.proxy(this.onCheckHoursFail, this));
		},

		_addHours: function()
		{
			var basketTimeSteps = _.reject(this.repeatData, function(repeatItem, key)
			{
				return repeatItem.state == this.STATE_INTERVAL_BUSY;
			}, this);

			basketTimeSteps = _.map(basketTimeSteps, function(basketTimeStep)
			{
				return _.pick(basketTimeStep, 'date', 'start', 'finish');
			});
			var promise = this.basket.addTime(basketTimeSteps, true);
			promise && promise.done($.proxy(this.onPeriodAddDone, this))
				.fail($.proxy(this.onPeriodAddFail, this));
		},

		onStepValid: function(isValid)
		{
			this.isValid = isValid;
			this.views.footer.render();
		},

		onPeriodAddDone: function()
		{
			// CRUTCH со скроллбаром страницы и модальным окном
			//
			// ПРИЧИНА: Модальное окно скрывает скроллбар страницы чтобы она не скролилась.
			// Чтобы при отключении скроллбара страница на фоне не прыгала нужно добавить паддинг размером со скроллбар.
			// Обратно паддинг убирается после всех анимаций.
			//
			// ПРОЦЕСС: мы скрыли первое окно, показываем второе, с задержкой из-за анимации
			// срабатывает обратный фикс скроллбара от первого окна.
			//
			// ИТОГ: после закрытия модального окна остаётся паддинг. Помимо визуального бага это влияет
			// на панель бронирования в состоянии fixed
			document.body.style.paddingRight = 0;

			this.$el.modal('hide');
			this.basket.openInfo({userRole: this.userRole, user: this.user});
		},

		onPeriodAddFail: function()
		{
			this.$el.modal('hide');
			this.basket.openMessage({
				code: 9,
				header: 'Одно или несколько занятий уже забронировано.',
				message: 'Пожалуйста, выберите другое время.'
			}, 'pg_msg_9');
		}
	});
}, application.module('main'));

/**
 * Модуль корзины
 */
application.module('pages.playgroundView', function (module, app, Bb, Mn, $, _, moment)
{
	'use strict';

	/**
	 * Компонент корзины
	 *
	 * Events:
	 * before:sync Перед любым запросом на сервер
	 * sync После любого запроса на сервер независимо от ответа
	 * before:check Перед запросом на проверку занятости часов (используется при повторяющихся бронях)
	 * check Проверка занятости часов завершена
	 * error:check Серверная ошибка при проверке занятости часов
	 * before:add Перед запросом добавления часов в корзину на сервер
	 * add Часы успешно добавлены в корзину на сервере
	 * error:add Сервер не добавил какие-то часы
	 * before:remove Перед запросом удаления часов из корзины на сервере (в т.ч. при очищении корзины)
	 * remove Часы успешно удалены из корзины на сервере (в т.ч. при очищении корзины)
	 * error:remove Сервер не удалил какие-то часы (в т.ч. при очищении корзины)
	 * before:resolve Перед запросом разрешения конфликта занятых и выбранных часов
	 * resolve Конфликт занятых и выбранных часов успешно разрешён (в пользу занятых :))
	 * error:resolve Ошибка разрешения конфликта занятых и выбранных часов
	 * clear Корзина опустела (вызывается после события remove)
	 * change:weight Изменилась доля площадки
	 * Во всех событиях error: первый аргумент - код ошибки (см. констаны ERROR_
	 *
	 * Promises:
	 * Все методы синхронизации с сервером возвращают jqXHR promise
	 */
	module.PlaygroundBasket = Mn.Object.extend({
		EVENT_CLEAR : 'clear',
		EVENT_ADD_ERROR : 'error:add',
		EVENT_ADD_SUCCESS : 'add',
		EVENT_CHECK_ERROR : 'error:check',
		EVENT_CHECK_SUCCESS : 'check',
		EVENT_BEFORE_ADD : 'before:add',
		EVENT_BEFORE_CHECK : 'before:check',
		EVENT_BEFORE_REMOVE : 'before:remove',
		EVENT_BEFORE_RESOLVE : 'before:resolve',
		EVENT_BEFORE_SYNC : 'before:sync',
		EVENT_CHANGE_WEIGHT : 'change:weight',
		EVENT_REMOVE_ERROR : 'error:remove',
		EVENT_REMOVE_SUCCESS : 'remove',
		EVENT_RESOLVE_ERROR : 'error:resolve',
		EVENT_RESOLVE_SUCCESS : 'resolve',
		EVENT_SYNC : 'sync',
		ERROR_UNKNOWN: 0,
		ERROR_ADD_FAILED: 1,
		HOUR_STATE_OK: 1,

		/**
		 * webData серверной корзины
		 */
		data: null,

		/**
		 * Экземпляры видов
		 */
		views: {
			info: null, // Ваш заказ
			repeat: null, // Повтор брони
			message: null // Сообщение об ошибке
		},

		/**
		 * Площадка
		 */
		playground: null,

		/**
		 * Карта часов корзины для расписания.
		 * Может опережать обновление на сервере:
		 * При добавлении времени часы сразу попадают в карту, затем идёт запрос на сервер. В случае ошибок (время занято) карта корректируется
		 * Аналогично работает удаление и очистка корзины
		 */
		timeMap: null,

		/**
		 * Бронируемая доля
		 */
		weight: 12,

		/**
		 * Тема для view
		 */
		theme: 'desktop',

		/**
		 * Инициализация объекта
		 *
		 * @param {Object} options
		 */
		initialize: function(options)
		{
			this.playground = options.playground;

			this.on(this.EVENT_ADD_ERROR, this._onError);
			this.on(this.EVENT_REMOVE_ERROR, this._onError);
			this.on(this.EVENT_RESOLVE_ERROR, this._onError);

			this.timeMap = new module.PlaygroundBasketTimeMap({ basket: this });

			if (options.data)
			{
				this._setData({basket: options.data});
			}

			if (options.theme) {
				this.theme = options.theme;
			}

		},

		/**
		 * Добавить интервалы времени в корзину + сохранить на сервере
		 *
		 * @param {Array} timeSteps Массив добавляемых интервалов времени. Каждый элемент имеет формат:
		 * {
		 *		date: {String}, // Дата 'YYYY-MM-DD'
		 *		start: {Number}, // Начало интервала - число секунд с начала дня
		 *		finish: {Number} // Конец интервала - число секунд с начала дня
		 * }
		 * @param {Boolean} periodic Массив интервалов времени периодичен? (выставляется при повторе брони)
		 * @return {Object|Null} jqXHR promise - если пошёл запрос на сервер, иначе - Null
		 */
		addTime: function(timeSteps, periodic)
		{
			var promise = null;
			if (timeSteps.length)
			{
				_.each(timeSteps, this.timeMapAdd, this);
				promise = this._saveTimeAdd(timeSteps, periodic);
			}
			return promise;
		},

		/**
		 * Проверить занятость часов для периодической брони
		 *
		 * @param {Number} bid Индекс интервала в корзине, из которого создаётся периодическая бронь
		 * @param {String} dateFinish Дата окончания повтора брони YYYY-MM-DD
		 * @return {Object|Null} jqXHR promise - если пошёл запрос на сервер, иначе - Null
		 */
		checkHours: function(bid, dateFinish)
		{
			var dataHour = this.getDataHourById(bid);
			if (!dataHour) return null;

			return this._checkHours({
				start: dataHour.start,
				finish: dataHour.finish,
				date: dataHour.date,
				dateEnd: dateFinish
			});
		},

		/**
		 * Создать периодическую бронь
		 *
		 * @param {Number} bid Индекс интервала в корзине, из которого создаётся периодическая бронь
		 * @param {String} dateFinish Дата окончания повтора брони YYYY-MM-DD
		 * @return {Object|Null} jqXHR promise - если пошёл запрос на сервер, иначе - Null
		 */
		makeTimePeriod: function(bid, dateFinish)
		{

			var dataHour = this.getDataHourById(bid);
			if (!dataHour) return null;

			var tzo = this.playground.get('timezoneOffset'),
				momentStart = moment.zone(dataHour.date, tzo),
				momentFinish = moment.zone(dateFinish, tzo),
				timeSteps = [];

			momentStart.add(1, 'w');
			while (momentStart <= momentFinish)
			{
				timeSteps.push({
					date: momentStart.format('YYYY-MM-DD'),
					start: dataHour.start,
					finish: dataHour.finish
				});
				momentStart.add(1, 'w');
			}

			return this.addTime(timeSteps);
		},

		/**
		 * Удалить интервалы времени из корзины + внести изменения на сервере
		 *
		 * @param {Array} timeSteps Массив удаляемых интервалов времени. Каждый элемент имеет формат:
		 * {
		 *		date: {String}, // Дата 'YYYY-MM-DD'
		 *		start: {Number}, // Начало интервала - число секунд с начала дня
		 *		finish: {Number}, // Конец интервала - число секунд с начала дня
		 *		bid: {Number} // [optional] Индекс интервала в корзине. Если задан, имеет приоритет, и другие параметры можно не задавать.
		 * }
		 * @return {Object|Null} jqXHR promise - если пошёл запрос на сервер, иначе - Null
		 */
		removeTime: function(timeSteps)
		{
			var promise = null;
			if (timeSteps.length)
			{
				_.each(timeSteps, this.timeMapRemove, this);
				promise = this._saveTimeRemove(timeSteps);
			}
			return promise;
		},

		/**
		 * Решить конфликты времени в корзине и занятого/прошедшего времени + внести изменения на сервере
		 * @return {Object} jqXHR promise
		 */
		resolveConflict: function()
		{
			return this._resolveConflict();
		},

		/**
		 * Сменить бронируемую долю. Предварительно очищает корзину, если доля меняется.
		 *
		 * @param {Number} weight Бронируемая доля площадки
		 */
		changeWeight: function(weight)
		{
			if (this.weight != weight)
			{
				this._setWeight(weight);
				this.clearBasket();
			}
		},

		/**
		 * Очистить корзину + на сервере
		 */
		clearBasket: function()
		{
			this.timeMap.clearMap();
			this._saveTimeRemove();
		},

		/**
		 * Получить интервал в корзине (на сервере) по его ID
		 *
		 * @param {Number} bid ID интервала
		 * @returns {Object}
		 */
		getDataHourById: function(bid)
		{
			return _.findWhere(this.data.time, {bid: bid} );
		},

		/**
		 * Получить текущий массив интервалов в корзине (на сервере) с успешным статусом (их можно сохранять)
		 * @returns {Array}
		 */
		getDataHoursOk: function()
		{
			return this._mapRepeats(_.where(this.data.time, { state: this.HOUR_STATE_OK }));
		},

		/**
		 * Перевести продолжительность из секунд в часы для использования в видах
		 *
		 * @param {Number} seconds Продолжительность в секундах
		 * @returns {Number} Продолжительность в часах
		 */
		getDurationAsHour: function(seconds)
		{
			return parseFloat((seconds / 3600).toFixed(1));
		},

		/**
		 * Получить продолжительность занятия в часах
		 *
		 * @param {Object} dataHour Занятие (Интервал времени в корзине на сервере)
		 * @returns {Number} Продолжительность занятия в часах
		 */
		getHourCount: function(dataHour)
		{
			return this.getDurationAsHour(dataHour.finish - dataHour.start);
		},

		/**
		 * Получить стоимость занятия
		 *
		 * @param {Object} dataHour Занятие (Интервал времени в корзине на сервере)
		 * @returns {Number}
		 */
		getHourPrice: function(dataHour)
		{
			return +dataHour.price.total;
		},

		/**
		 * Получить наценку за час в занятии
		 *
		 * @param {Object} dataHour Занятие (Интервал времени в корзине на сервере)
		 * @returns {Number}
		 */
		getHourTax: function(dataHour)
		{
			return dataHour.price.tax
				? +dataHour.price.tax
				: 0;
		},

		/**
		 * Получить итоговые данные по корзине
		 * getTotalPrice() + getTotalTime()
		 *
		 * @returns {
		 *		price: {Number}, // Стоимость всех занятий
		 *		taxHour: {Number}, // В том числе наценка
		 *		dates: {Number}, // Сколько всего дней идут занятия
		 *		seconds: {Number}, // Полная продолжительность в секундах
		 *		hours: {Number} // Полная продолжительность в часах
		 * }
		 */
		getTotal: function()
		{
			var totals = this.getTotalPrice();
			_.extend(totals, this.getTotalTime());
			return totals;
		},

		/**
		 * Получить итоговые данные по стоимости корзины
		 *
		 * @returns {
		 *		price: {Number}, // Стоимость всех занятий
		 *		taxHour: {Number} // В том числе наценка
		 * }
		 */
		getTotalPrice: function()
		{
			return {
				price: this.data.price.total,
				taxHour: this.data.price.tax
			};
		},

		/**
		 * Получить итоговые данные по времени занятий в корзине
		 *
		 * @returns {
		 *		dates: {Number}, // Сколько всего дней идут занятия
		 *		seconds: {Number}, // Полная продолжительность в секундах
		 *		hours: {Number} // Полная продолжительность в часах
		 * }
		 */
		getTotalTime: function()
		{
			var timeMap = this.timeMap.getMap(),
				datesCount = 0,
				secondsCount = 0;

			_.each(timeMap, function(dayMap)
			{
				datesCount++;
				for (var i = 0; i < dayMap.length; i++)
				{
					secondsCount += (dayMap[i].finish - dayMap[i].start);
				}
			});

			return {
				dates: datesCount,
				seconds: secondsCount,
				hours: this.getDurationAsHour(secondsCount)
			};
		},

		/**
		 * Получить название текущей бронируемой доли площадки
		 * Читает модель площадки
		 *
		 * @returns {String}
		 */
		getWeightLabel: function()
		{
			var label = _.findWhere(this.playground.getWeightLabels(), { value: +this.weight });
			return label
				? label.label
				: '';
		},

		/**
		 * Есть ли время рядом в карте часов корзины (сервер не интересует)?
		 *
		 * @param {Object} basketTimeStep
		 * @returns {Boolean}
		 */
		hasTimeNear: function(basketTimeStep)
		{
			return this.timeMap.hasNear(basketTimeStep.date, basketTimeStep.start, basketTimeStep.finish);
		},

		/**
		 * Карта часов корзины пуста?
		 *
		 * @returns {Boolean}
		 */
		isEmpty: function ()
		{
			return this.timeMap.isEmpty();
		},

		/**
		 * Этот час в карте часов корзины?
		 *
		 * @param {String} date 'YYYY-MM-DD'
		 * @param {Number} start Число секунд с начала дня
		 * @returns {Boolean}
		 */
		isInBasket: function(date, start)
		{
			return this.timeMap.has(date, start);
		},

		isDateInBasket: function(date)
		{
			return this.timeMap.hasDate(date);
		},

		/**
		 * Открыть окно "Ваш заказ"
		 * @param {Object} options Опции для окна "Ваш заказ"
		 * @return {promise} fail - закрытие окна
		 */
		openInfo: function(options)
		{
			if (!this.views.info)
			{
				this.views.info = new module.PlaygroundBasketInfoLayout(_.extend(options || {}, { basket: this }));
			}
			else
			{
				this.views.info.mergeOptions(options || {});
			}
			return this.views.info.show();
		},

		/**
		 * Открыть окно сообщения
		 * @param {Object|String} Сообщение или объект {header, message}
		 * @return {promise} fail - закрытие окна
		 */
		openMessage: function(data, ymGoal)
		{
			if (ymGoal)
			{
				module.ymReachGoal(ymGoal);
			}

			if (this.theme == 'mobile') {
				var message = data.header + '. ' + data.message;
				return alert(message.replace(/<(?:.|\n)*?>/gm, ''));
			} else {
				if (!this.views.message)
				{
					this.views.message = new module.PlaygroundBasketMessageView();
				}
				return this.views.message.show(data);
			}
		},

		/**
		 * Открыть окно "Повтор брони"
		 * @param {Number} bid ID повторяемого интервала
		 * @param {Object} options Опции для окна "Повтор брони"
		 * @return {promise} fail - закрытие окна
		 */
		openRepeat: function(bid, options)
		{
			if (!this.views.repeat)
			{
				this.views.repeat = new module.PlaygroundBasketRepeatLayout(_.extend(options || {}, {
					basket: this,
					user: this.getOption('user'),
					userRole: this.getOption('userRole')
				}));
			}
			else
			{
				this.views.repeat.mergeOptions(options || {});
			}
			return this.views.repeat.show(bid);
		},

		/**
		 * Добавить интервал в карту часов корзины (без сервера).
		 *
		 * @param {Object} basketTimeStep Добавляемый интервал. Формат:
		 * {
		 *		date: {String}, // Дата 'YYYY-MM-DD'
		 *		start: {Number}, // Начало интервала - число секунд с начала дня
		 *		finish: {Number} // Конец интервала - число секунд с начала дня
		 * }
		 */
		timeMapAdd: function(basketTimeStep)
		{
			this.timeMap.add(basketTimeStep.date, basketTimeStep.start, basketTimeStep.finish);
		},

		/**
		 * Удалить интервал из карты часов корзины (без сервера)
		 *
		 * @param {Object} basketTimeStep Удаляемый интервал. Формат:
		 * {
		 *		date: {String}, // Дата 'YYYY-MM-DD'
		 *		start: {Number}, // Начало интервала - число секунд с начала дня
		 *		finish: {Number} // Конец интервала - число секунд с начала дня
		 * }
		 */
		timeMapRemove: function(basketTimeStep)
		{
			if ('bid' in basketTimeStep)
			{
				var dataHour = this.getDataHourById(basketTimeStep.bid);
				if (dataHour)
				{
					this.timeMap.remove(dataHour.date, dataHour.start, dataHour.finish);
				}
			}
			else
			{
				this.timeMap.remove(basketTimeStep.date, basketTimeStep.start, basketTimeStep.finish);
			}
		},

		/**
		 * Найти в корзине повторяющиеся брони и сгруппировать так часы
		 *
		 * @todo К задаче по отображению повторяющихся броней
		 *
		 * @param {Array} dataHours
		 * @returns {Array}
		 */
		_mapRepeats: function(dataHours)
		{
			return dataHours;
		},

		/**
		 * Callback перед отправкой любого запроса на сервер
		 */
		_callbackBeforeSend: function()
		{
			this.trigger(this.EVENT_BEFORE_SYNC);
		},

		/**
		 * Callback при любом завершении любого запроса на сервер
		 */
		_callbackComplete: function()
		{
			this.trigger(this.EVENT_SYNC);
		},

		/**
		 * Запрос на сервер на проверку занятости повторяющейся брони
		 *
		 * @param {Object} data Данные по повторяющемуся интервалу. Формат:
		 * {
		 *		date: {String}, // Дата 'YYYY-MM-DD'
		 *		start: {Number}, // Начало интервала - число секунд с начала дня
		 *		finish: {Number} // Конец интервала - число секунд с начала дня
		 *		dateEnd: {String}, // Дата окончания повторяющегося интервала 'YYYY-MM-DD'
		 * }
		 * @returns {Object} jqXHR promise
		 */
		_checkHours: function(data)
		{
			this.trigger(this.EVENT_BEFORE_CHECK);
			return $.ajax({
				beforeSend: this._callbackBeforeSend,
				complete: this._callbackComplete,
				url: '/playground/checkHours/' + this.playground.id,
				type: 'GET',
				data: (_.extend({}, data, {weight: this.weight})),
				context: this
			})
			.done(this._callbackCheckHoursSuccess)
			.fail(this._callbackCheckHoursError);
		},

		/**
		 * Callback при успешном завершении запроса на проверку занятости часов
		 */
		_callbackCheckHoursSuccess: function()
		{
			this.trigger(this.EVENT_CHECK_SUCCESS);
		},

		/**
		 * Callback при ошибочном завершении запроса на проверку занятости часов
		 *
		 * @param {Object} data Данные с сервера с обновлённой корзиной и
		 *                      с забронированной картой часов начального времени,
		 *                      которое пользователь решил повторять
		 * {
		 *		basket: {Object},
		 *		bookedMap: {Object}
		 * }
		 */
		_callbackCheckHoursError: function (data)
		{
			data = this._parseJsonResponse(data);
			this._setData(data, true);
			this.trigger(this.EVENT_CHECK_ERROR, this._parseError(data), data.bookedMap || {});
		},

		/**
		 * Запрос на сервер на разрешение конфликта времени
		 * @return {Object} jqXHR promise
		 */
		_resolveConflict: function()
		{
            var data = {
                'Action': 'resolve'
            };
			this.trigger(this.EVENT_BEFORE_RESOLVE);
			return $.ajax({
				beforeSend: this._callbackBeforeSend,
				complete: this._callbackComplete,
				url: '/playground/basketHours/' + this.playground.id,
				type: 'POST',
                data: window.JSON.stringify(_.extend({}, data, {Weight: this.weight})),
				context: this
			})
			.done(this._callbackResolveConflictSuccess)
			.fail(this._callbackResolveConflictError);
		},

		/**
		 * Callback при успешном завершении запроса на разрешение конфликта времени
		 *
		 * @param {Object} data JSON-ответ сервера
		 */
		_callbackResolveConflictSuccess: function(data)
		{
			this._setData(data, true);
			this.trigger(this.EVENT_RESOLVE_SUCCESS);

			if (this.timeMap.isEmpty())
			{
				this.trigger(this.EVENT_CLEAR);
			}
		},

		/**
		 * Callback при ошибочном завершении запроса на разрешение конфликта времени
		 *
		 * @param {Object} data jqXHR
		 */
		_callbackResolveConflictError: function(data)
		{
			data = this._parseJsonResponse(data);
			this._setData(data, true);
			this.trigger(this.EVENT_RESOLVE_ERROR, this._parseError(data), data.bookedMap || {});
		},

		/**
		 * Запрос на сервер на добавление времени
		 *
		 * @param {Array} basketTimeSteps Массив добавляемых интервалов времени. Каждый элемент имеет формат:
		 * {
		 *		date: {String}, // Дата 'YYYY-MM-DD'
		 *		start: {Number}, // Начало интервала - число секунд с начала дня
		 *		finish: {Number} // Конец интервала - число секунд с начала дня
		 * }
		 * @param {Boolean} periodic Массив интервалов времени периодичен? (выставляется при повторе брони)
		 * @return {Object} jqXHR promise
		 */
		_saveTimeAdd: function(basketTimeSteps, periodic)
		{
			var data = {
                'Action': 'add',
				'Hours' : basketTimeSteps,
				'Weight': this.weight
			};

			if (periodic)
			{
				data.Periodic = periodic;
			}

			this.trigger(this.EVENT_BEFORE_ADD);
			return $.ajax({
				beforeSend: this._callbackBeforeSend,
				complete: this._callbackComplete,
				url: '/playground/basketHours/' + this.playground.id,
				type: 'POST',
				data: window.JSON.stringify(data),
				context: this
			})
			.done(this._callbackSaveTimeAddSuccess)
			.fail(this._callbackSaveTimeAddError);
		},

		/**
		 * Callback при успешном завершении запроса на добавление времени в корзину
		 *
		 * @param {Object} data JSON-ответ сервера
		 */
		_callbackSaveTimeAddSuccess: function(data)
		{
			this._setData(data, true);
			this.trigger(this.EVENT_ADD_SUCCESS);
		},

		/**
		 * Callback при ошибочном завершении запроса на добавление времени в корзину
		 *
		 * @param {Object} data jqXHR
		 */
		_callbackSaveTimeAddError: function(data)
		{
			data = this._parseJsonResponse(data);
			this._setData(data, true);
			this.trigger(this.EVENT_ADD_ERROR, this._parseError(data), data.bookedMap || {});
		},

		/**
		 * Запрос на сервер на удаление времени
		 *
		 * @param {Array} timeSteps Массив удаляемых интервалов времени. Каждый элемент имеет формат:
		 * {
		 *		date: {String}, // Дата 'YYYY-MM-DD'
		 *		start: {Number}, // Начало интервала - число секунд с начала дня
		 *		finish: {Number}, // Конец интервала - число секунд с начала дня
		 *		bid: {Number} // [optional] Индекс интервала в корзине. Если задан, имеет приоритет, и другие параметры можно не задавать.
		 * }
		 * @return {Object} jqXHR promise
		 */
		_saveTimeRemove: function(basketTimeSteps)
		{
			var data = {
                'Action': 'remove',
                'Weight': this.weight
            };
			if (basketTimeSteps)
			{
				data.Hours = basketTimeSteps;
			}

			this.trigger(this.EVENT_BEFORE_REMOVE);
			return $.ajax({
				beforeSend: this._callbackBeforeSend,
				complete: this._callbackComplete,
				url: '/playground/basketHours/' + this.playground.id,
				type: 'POST',
				data: window.JSON.stringify(data),
				context: this
			})
			.done(this._callbackSaveTimeRemoveSuccess)
			.fail(this._callbackSaveTimeRemoveError);
		},

		/**
		 * Callback при успешном завершении запроса на удаление времени из корзины
		 *
		 * @param {Object} data JSON-ответ сервера
		 */
		_callbackSaveTimeRemoveSuccess: function(data)
		{
			this._setData(data, true);
			this.trigger(this.EVENT_REMOVE_SUCCESS);

			if (this.timeMap.isEmpty())
			{
				this.trigger(this.EVENT_CLEAR);
			}
		},

		/**
		 * Callback при ошибочном завершении запроса на удаление времени из корзины
		 *
		 * @param {Object} data jqXHR
		 */
		_callbackSaveTimeRemoveError: function(data)
		{
			data = this._parseJsonResponse(data);
			this._setData(data, true);
			this.trigger(this.EVENT_REMOVE_ERROR, this._parseError(data));
		},

		/**
		 * Обновить корзину данными с сервера
		 *
		 * @param {Object} data JSON-ответ сервера. В ключе basket - веб-данные корзины
		 * @param {Boolean} rejectFailedOnly Только убрать ошибочные интервалы из карты часов? Полезно при асинхронных запросах. False: карта будет переписана данными с сервера
		 */
		_setData: function(data, rejectFailedOnly)
		{
			if (data && data.basket)
			{
				this.data = data.basket;
				this._setWeight(this.data.config.weight || 12);

				// Не обновляем без необходимости timeMap, т.к. в ней уже последняя информация, а ответ с сервера может запаздывать
				if (rejectFailedOnly && !_.isEmpty(this.data.time) && !data.forceUpdate)
				{
					this.timeMap.rejectFailed(this.data.time);
				}
				else
				{
					this.timeMap.setMap(this.data.time);
				}
			}
		},

		/**
		 * Установить бронируемую долю площадки
		 *
		 * @param {Number} weight Бронируемая доля
		 */
		_setWeight: function(weight)
		{
			if (this.weight != weight)
			{
				this.weight = weight;
				this.trigger(this.EVENT_CHANGE_WEIGHT);
			}
		},

		/**
		 * Событие: ошибка при запросе на сервер
		 *
		 * @param {Number} error Код ошибки (см. константы)
		 * @returns {undefined}
		 */
		_onError: function(error)
		{
			if (this.playground.get('timeStep') < 3600)
			{
				var orphanedBasketSteps = this.timeMap.removeOrphanedHalfhours();
				if (orphanedBasketSteps.length)
				{
					this._saveTimeRemove(orphanedBasketSteps);
				}
			}
		},

		/**
		 * Вытащить код ошибки из ответа сервера
		 *
		 * @param {Object} data JSON-ответ сервера
		 * @returns {Number}
		 */
		_parseError: function(data)
		{
			return (data && data.error)
				? data.error
				: this.ERROR_UNKNOWN;
		},

		/**
		 * Вытащить JSON-ответ из jqXHR.responseText
		 *
		 * @param {Object} jqXHR
		 * @returns {Object} JSON-ответ сервера
		 */
		_parseJsonResponse: function(jqXHR)
		{
			var responseJson = null;
			try
			{
				if (jqXHR.responseText)
				{
					responseJson = $.parseJSON(jqXHR.responseText);
				}
				else
				{
					responseJson = $.parseJSON(jqXHR);
				}
			}
			catch(e)
			{

			}
			return responseJson;
		},
	});
}, moment);

/**
 * @param {Marionette.Module} module
 * @param {Marionette.Application} app
 * @param {Backbone} Bb
 * @param {Marionette} Mn
 * @param {jQuery} $
 */
application.module('pages.playgroundView', function (module, app, Bb, Mn, $, _)
{
	var MarkView = module.MarkView = Mn.View.extend({
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

	var MarksListView = module.MarksListView = Mn.CollectionView.extend({
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

	var MarksContainerView = module.MarksContainerView = Mn.LayoutView.extend({
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
});
/**
 * @param {Marionette.Module} module
 * @param {Marionette.Application} app
 * @param {Backbone} Bb
 * @param {Marionette} Mn
 * @param {jQuery} $
 * @param {underscore} _
 * @param {Marionette.Module} main
 * @param {Marionette.Module} priceManagerModule
 */
application.module('pages.playgroundView', function (module, app, Bb, Mn, $, _, main, priceManagerModule)
{
	/**
	 * Создать страницу
	 *
	 * @param {Object} options Входные данные: playground, region
	 */
	module.createPage = function (options)
	{
		var popts = module.pageOptions = options;

		var playground = popts.playground = new main.Playground(options.playground);
		var theme = options.theme || 'desktop';

		var basket = popts.basket = new module.PlaygroundBasket({
			playground: playground,
			theme: theme,
			data: options.basket,

			user: options.user,
			userRole: options.userRole
		});

		if (options.user)
		{
			options.user.phone_verified = +options.user.phone_verified;
		}

		if (options.hasSchedule)
		{
			new module.PlaygroundScheduleLayoutView({
				el: '#playground-schedule-layout',

				theme: theme,

				basket: basket,
				playground: playground,
				priceManager: priceManager,
				weight: basket.weight,
				schedules: options.schedules,

				user: options.user,
				userRole: options.userRole
			}).render();
		}

		if (options.hasMarks)
		{
			(new module.MarksContainerView({
				el: '#marks',
				pageSize: options.marksPageSize
			})).render();
		}

		if (theme == 'desktop') {

			YandexMap.init({
				coordinates: playground.get('geo_location').split(',').map(Number), // дада, всё наоборот
				address: playground.escape('address')
			});
		}


		module.dotdotdot('.-js-read-more');
		module.hidePhone('.-js-phone');
		module.hideSports('.-js-sports');
		module.ezPopover('.-js-ez-popover');
		module.companyPopover('.-js-company');
		$('.-js-scroll-to').scrollTo({time: 200});
		$('[data-toggle="tooltip"]').tooltip();


		if (options.isPublished)
		{
			fsMetric.reachGoal('playgroundViewed', {
				objectId: playground.id,
				objectType: 'playground'
			});
		}
	};
}, application.module('main'), application.module('components.PlaygroundPriceManager'));
/**
 * @param {Marionette.Module} module
 * @param {Marionette.Application} app
 * @param {Backbone} Bb
 * @param {Marionette} Mn
 * @param {jQuery} $
 * @param {underscore} _
 */
application.module('pages.playgroundView', function (module, app, Bb, Mn, $, _)
{
	module.companyPopover = function (selector)
	{
		$(selector).popover({
			template: '<div class="popover">'
				+ '<div class="popover-inner">'
				+ '<button type="button" class="close pull-right" data-dismiss="popover">'
				+'<span aria-hidden="true">×</span>'
				+'</button>'
				+ '<div class="popover-content"></div>'
				+'</div>'
				+ '</div>',
			placement: 'top',
		});
	};
});
/**
 * Easy Popover
 *
 * @param {Marionette.Module} module
 * @param {Marionette.Application} app
 * @param {Backbone} Bb
 * @param {Marionette} Mn
 * @param {jQuery} $
 * @param {underscore} _
 */
application.module('pages.playgroundView', function (module, app, Bb, Mn, $, _)
{
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
});
/**
 * @param {Marionette.Module} module
 * @param {Marionette.Application} app
 * @param {Backbone} Bb
 * @param {Marionette} Mn
 * @param {jQuery} $
 * @param {underscore} _
 */
application.module('pages.playgroundView', function (module, app, Bb, Mn, $, _)
{
	module.hidePhone = function (selector)
	{
		$(selector).each(function ()
		{
			var $el = $(this);
			var phone = $el.html().trim();
			var $showLink = $('<a class="-new-link">Показать телефон</a>');

			$el.text(phone.substr(0, 10) + ' ');
			$el.append($showLink);

			$showLink.one('click', function (e)
			{
				e.preventDefault();
				$el.html(phone);

				if (module.pageOptions.isPublished)
				{
					fsMetric.reachGoal('showPlaygroundPhone', {
						objectId: module.pageOptions.playground.id,
						objectType: 'playground'
					});
				}

				module.ymReachGoal('show_phone');
			});
		});
	};
});
/**
 * @param {Marionette.Module} module
 * @param {Marionette.Application} app
 * @param {Backbone} Bb
 * @param {Marionette} Mn
 * @param {jQuery} $
 * @param {underscore} _
 */
application.module('pages.playgroundView', function (module, app, Bb, Mn, $, _)
{
	var getAvailableWidth = function ($sports)
	{
		var $sportsLast = $sports.last();
		return $sports.parent().width() - ($sportsLast.position().left + $sportsLast.outerWidth(true));
	};

	var getShowMoreWidth = function ($showMore)
	{
		var width,
			$showMoreText = $showMore.find('.-js-sport-more-text'),
			previousCss = $showMore.attr('style'),
			isEmpty = _.isEmpty($showMoreText.html()),
			isHidden = !$showMore.is(':visible');

		// Укажем контент, который надо померить
		if (isEmpty)
		{
			$showMoreText.html('N видов спорта');
		}

		// Можно померить только видимые (и условно-видимые:)) элементы
		if (isHidden)
		{
			$showMore
			.css({ // http://stackoverflow.com/a/2345813
				position: 'absolute',
				visibility: 'hidden',
				display: 'block'
			})
			.removeClass('hidden');
		}

		width = $showMore.outerWidth(true);

		// После замера вернём элемент в исходное состояние
		if (isEmpty)
		{
			$showMoreText.empty();
		}

		if (isHidden)
		{
			$showMore
				.attr('style', previousCss ? previousCss : '')
				.addClass('hidden');
		}

		return width;
	};

	var filterToPopover = function ($sports, showMoreWidth)
	{
		var firstLineTop = $sports.first().offset().top,
			availableWidth,
			$inPopover,
			$toPopover;

		// В поповер перемещаются все элементы, не уместившиеся на первой строке
		$inPopover = $sports.filter(function ()
		{
			return $(this).offset().top > firstLineTop;
		});
		$sports = $sports.not($inPopover);

		if (!$sports.length || !$inPopover.length)
			return $(); // Поповер не нужен

		// Выделяем место для поповера
		// Для этого проверяем, что все элементы поповера не превышают имеющееся место
		// 1 элемент влезет гарантированно - CSS держит
		availableWidth = getAvailableWidth($sports);
		do
		{
			// Переносим последний элемент первой строки в поповер,
			// чтобы освободить место для лейбла "+ N видов спортов"
			$toPopover = $sports.last();
			$inPopover = $toPopover.add($inPopover); // Сохраняем порядок
			$sports = $sports.not($toPopover);

			availableWidth += $toPopover.outerWidth(true);
		}
		while (
			$sports.length > 1 &&
			(
				availableWidth < showMoreWidth
				|| _.some($inPopover, function (elem)
				{
					return availableWidth < $(elem).outerWidth(true);
				})
			)
		);

		return $inPopover;
	};

	module.hideSports = function (selector)
	{
		$(selector).each(function ()
		{
			var $container = $(this),
				$sports = $container.find('.-js-sport'),
				$popover = $container.next('.-js-sports-popover'),
				$showMore = $container.find('.-js-sport-more'),
				$sportsInPopover = filterToPopover($sports, getShowMoreWidth($showMore)),
				popoverStyleOffset,
				getPopoverStyleOffset = function ()
				{
					var $popoverSportItem = $popover.find('.-js-sport').first();
					return {
						left: parseInt($showMore.css('padding-left')) - parseInt($popover.find('.-js-sport').css('margin-left')),
						top: -parseInt($popover.find('li').css('margin-top'))
					};
				};

			if (!$sportsInPopover.length) return true; // Поповер не нужен

			// Установить контент
			$popover.append($sportsInPopover);
			$showMore.find('.-js-sport-more-text').html(
				FS.helpers.pluralize($sportsInPopover.length, '{n} вид|{n} вида|{n} видов')
				+ '&nbsp;спорта'
			);

			// Задать ширину как у $showMore, чтобы коректно работал mouseleave
			$popover.css('min-width', getShowMoreWidth($showMore));

			popoverStyleOffset = getPopoverStyleOffset();

			// Повесить обработчики
			$showMore.find('.-js-label-sport-more').on('mouseenter click', function ()
			{
				var triggerOffset = $showMore.offset();

				$popover
					.css({
						left: triggerOffset.left + popoverStyleOffset.left,
						top: triggerOffset.top + popoverStyleOffset.top
					}) // Так учтём resize
					.removeClass('hidden'); // show
				$showMore.addClass('hidden'); // hide
			});
			$popover.on('mouseleave click', function ()
			{
				$popover.addClass('hidden'); // hide
				$showMore.removeClass('hidden'); // show
			});

			// Включить
			$showMore.removeClass('hidden'); // show
		});
	};
});
/**
 * @param {Marionette.Module} module
 * @param {Marionette.Application} app
 * @param {Backbone} Bb
 * @param {Marionette} Mn
 * @param {jQuery} $
 * @param {underscore} _
 */
application.module('pages.playgroundView', function (module, app, Bb, Mn, $, _)
{
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
});
