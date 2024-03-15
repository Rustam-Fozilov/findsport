/**
 * @module components.PlaygrondPriceManager
 * @requires module:common.models
 * 
 * @param {Marionette.Module} module
 * @param {Marionette.Application} app
 * @param {Backbone} Bb
 * @param {Marionette} Mn
 * @param {jQuery} $
 * @param {_} _
 */
application.module('components.PlaygroundPriceManager', function (module, app, Bb, Mn, $, _)
{
	var models = app.module('common.models');
	var ensureMoment = FS.helpers.ensureMoment;
	var PlaygroundPriceManagerError = Mn.extend.call(Error);
	
	
	var PlaygroundPriceManager = module.PlaygroundPriceManager = function (options)
	{
		_.extend(this, _.pick(options, ['playground', 'periods', 'prices']));

		this.parts = this.playground.getAvailableParts();
		this._planManagers = {};
		this.selectPart(12);
	};
	PlaygroundPriceManager.create = function (options)
	{
		return new PlaygroundPriceManager({
			playground: new models.Playground(options.playground),
			periods: new models.PlaygroundPricePeriodCollection(options.periods),
			prices: new models.PlaygroundPriceCollection(options.prices),
		});
	};
	PlaygroundPriceManager.prototype = {
		playground: null,
		periods: null,
		prices: null,
		plans: null,
		
		_planManager: null,
		_planManagers: null,
		
		selectPart: function (part)
		{
			if (-1 === this.parts.indexOf(part))
			{
				throw new PlaygroundPriceManagerError('Бронируемая доля площадки недоступна');
			}
			
			this._planManager = this._planManagers[part] || (this._planManagers[part] = new PlaygroundPricePlanManager({
				part: part,
				playground: this.playground,
				periods: this.periods,
				prices: this.prices,
			}));
		},
		
		calculatePrice: function (date, start, finish)
		{
			return this._planManager.calculatePrice(date, start, finish);
		},
		
		getPricesByDate: function (date)
		{
			return this._planManager.getPricesByDate(date);
		},
		
		worksIn: function (date, start, finish)
		{
			if (finish <= this.playground.get('start') || this.playground.get('finish') <= start)
			{
				return false;
			}
			
			return this._planManager.worksIn(date, start, finish);
		}
	};
	
	var PlaygroundPricePlanManager = function (options)
	{
		_.extend(this, _.pick(options, ['playground', 'periods', 'prices', 'part']));

		this.prices = new models.PlaygroundPriceCollection(this.prices.where({part: this.part}));
		this.taxHour = this.playground.get('taxHour') * (this.part / 12);

		this._workingScheduleManager = new PlaygroundWorkingScheduleManager({
			playground: this.playground,
			periods: this.periods,
			prices: this.prices,
		});
	};
	PlaygroundPricePlanManager.prototype = {
		part: null,
		playground: null,
		periods: null,
		prices: null,
		taxHour: null,
		
		_workingScheduleManager: null,
		
		getPricesByDate: function (date)
		{
			date = ensureMoment(date);
			
			var period = this._getPeriodByDate(date),
				weekday = 1 << (date.isoWeekday() % 7);
			
			if (period)
			{
				return this.prices.filter(function (price)
				{
					return price.get('periodId') == period.id && price.get('weekdays') & weekday;
				});
			}
			else
			{
				return [];
			}
		},
		
		calculatePrice: function (date, start, finish)
		{
			var total = new TotalPrice(),
				count = (finish - start) / 3600;
			
			this.getPricesByDate(date).forEach(function (price)
			{
				var iStart = Math.max(start, price.get('start')),
					iFinish = Math.min(finish, price.get('finish')),
					iCount = (iFinish - iStart) / 3600;
				
				if (iCount > 0)
				{
					total.addPrices(iCount * price.get('outer'), iCount * price.get('inner'));
				}
			});
			
			if (this.taxHour && count <= 1)
			{
				total.addTaxHour(count * this.taxHour);
			}
			
			total.ceil();
			
			return total;
		},
		
		worksIn: function (date, start, finish)
		{
			date = ensureMoment(date);
			
			var schedule = this._getWorkingScheduleForDate(date);
			
			if (schedule)
			{
				return schedule.worksIn(date.isoWeekday() % 7, start, finish);
			}
			else
			{
				return false;
			}
		},
		
		_getPeriodByDate: function (date)
		{
			date = date.format('YYYY-MM-DD');
			return this.periods.find(function (period)
			{
				return period.get('periodStart') <= date && date < period.get('periodFinish');
			});
		},
		
		_getWorkingScheduleForDate: function (date)
		{
			var period = this._getPeriodByDate(date);
			
			if (period)
			{
				return this._workingScheduleManager.get(period);
			}
			else
			{
				return null;
			}
		}
	};
	
	
	var TotalPrice = function ()
	{
	};
	TotalPrice.prototype = {
		total: 0,
		outer: 0,
		inner: 0,
		taxHour: 0,
		
		addPrices: function (outer, inner)
		{
			this.total += outer;
			this.outer += outer;
			this.inner += inner;
		},
		
		addTaxHour: function (tax)
		{
			this.total += tax;
			this.taxHour += tax;
		},
		
		ceil: function ()
		{
			var self = this;
			
			['total', 'outer', 'inner', 'taxHour'].forEach(function (property)
			{
				self[property] = Math.ceil(self[property]);
			});
		}
	};
	
	
	var PlaygroundWorkingScheduleManager = function (options)
	{
		_.extend(this, _.pick(options, ['playground', 'periods', 'prices']));
		this._periodSchedules = {};
	};
	PlaygroundWorkingScheduleManager.prototype = {
		playgroundWorkStart: null,
		playgroundWorkFinish: null,
		
		_periodSchedules: null,
		
		initialize: function (options)
		{
			_.extend(this, _.pick(options, ['playground', 'periods', 'prices']));
		},
		
		get: function (period)
		{
			return this._periodSchedules[period.id] || (this._periodSchedules[period.id] = this.createPeriodSchedule(period));
		},
		
		createPeriodSchedule: function (period)
		{
			return this.prices.where({periodId: period.id}).reduce(function (schedule, price)
			{
				price.getWeekdayNumbers().forEach(function (weekday)
				{
					schedule.addTime(weekday, price.get('start'), price.get('finish'));
				});
				return schedule;
			}, new PlaygroundWorkingSchedule());
		}
	};
	
	var PlaygroundWorkingSchedule = function ()
	{
		this.days = [[],[],[],[],[],[],[]]; // 0=Su, 1=Mo, 2=Tu, 3=We, 4=Th, 5=Fr, 6=Sa
	};
	PlaygroundWorkingSchedule.prototype = {
		days: null,
		
		addTime: function (weekday, start, finish)
		{
			var addingTime = {start: start, finish: finish};
			
			this.days[weekday] = this.days[weekday].reduce(function (day, time)
			{
				if (time.finish < addingTime.start || addingTime.finish < time.start)
				{
					day.push(time);
				}
				else
				{
					addingTime.start = Math.min(time.start, addingTime.start);
					addingTime.finish = Math.max(time.finish, addingTime.finish);
				}

				return day;
			}, [addingTime]);
		},
		
		worksIn: function (weekday, start, finish)
		{
			return !!_.find(this.days[weekday], function (time)
			{
				return time.start <= start && finish <= time.finish
			});
		},
	};
});