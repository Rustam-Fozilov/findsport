/**
 * Расширение BS Datepicker
 * методами по установке текущей даты, форматированию даты
 * 
 * Используется в fs.datepickerdouble.js - "двойном datepicker'е"
 */
+(function ()
{
	'use strict';
	
	var global = this,
		$ = global.jQuery,
		moment = global.moment,
		_ = global._,
		Datepicker = $.fn.datepicker.Constructor,
		DPGlobal = $.fn.datepicker.DPGlobal;
		
	Datepicker.prototype.clearSelectedDate = function()
	{
		this.element.removeData('date');
		this.update();
	};

	Datepicker.prototype.formatDate = function(date, format)
	{
		// Copy-paste из getFormattedDate
		if (format === undefined)
			format = this.o.format;

		return DPGlobal.formatDate(date, format, this.o.language);
	};

	Datepicker.prototype.parseDate = function(date)
	{
		// Copy-paste из _process_options
		return (date instanceof Date)
			? this._local_to_utc(this._zero_time(date))
			: DPGlobal.parseDate(date, this.o.format, this.o.language);
	};

	Datepicker.prototype.setViewDate = function(viewDate, clearSelected)
	{
		if (typeof clearSelected === 'undefined')
		{
			clearSelected = false;
		}
		this.viewDate = this.parseDate(viewDate);
		
		if (clearSelected)
		{
			this.clearSelectedDate();
		}
		else
		{
			this.fill();
		}
	};

	Datepicker.prototype.setDateSilent = function()
	{
		// TODO data-date, update
		// Copy-paste из setDates без _trigger
		var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
		this.update.apply(this, args);
		this.setValue();
	};
}).call(this);