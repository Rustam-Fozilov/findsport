/**
 * @param {Marionette.Module} module
 * @param {Marionette.Application} app
 * @param {Backbone} Bb
 * @param {Marionette} Mn
 * @param {jQuery} $
 * @param {_} _
 * @param {Handlebars} Hb
 */
application.module('main', function (module, app, Bb, Mn, $, _, Hb)
{
	module.Playground = Bb.Model.extend({
		defaults: {
			id: null,
			uid: null,
			name: '',
			sport: 0, // bin
			start: 0,
			finish: 0,
			timeStep: 3600,
			minBookingInterval: 3600,
			timezone: 'UTC',
			timezoneOffset: 0,
			confirmation: 0, // boolean
			players: 0, // boolean
			weights: 1, // bin
			autocancel: 0, // boolean
			courier: 0, // boolean
			taxHour: 0,
			paymentOptions: 0 // bin
		},
		
		weightLabels: {
			12: 'Вся площадка',
			6: '1/2 площадки',
			3: '1/4 площадки',
			8: '2/3 площадки',
			4: '1/3 площадки'
		},
		
		/**
		 * Рабочие часы площадки
		 * 
		 * @returns {Object} Ключ = оффсет в секундах, значение = время в формате "%H:%i"
		 */
		getWorkingHours: function ()
		{
			var range = _.range(this.get('start'), this.get('finish'), this.get('timeStep'));
			
			return _.reduce(range, function (hours, offset)
			{
				hours[offset] = Hb.helpers.formatTimeOffset(offset); // crutch
				return hours;
			}, {});
		},

		/**
		 * Получить рабочие часы, разбитые по оптимальному шагу расписания
		 *
		 * @returns {Object} Ключ = оффсет в секундах, значение = время в формате "%H:%i"
		 */
		getWorkingRange: function ()
		{
			var range = _.range(this.get('start'), this.get('finish'), this.getRangeDuration());

			return _.reduce(range, function (hours, offset)
			{
				hours[offset] = Hb.helpers.formatTimeOffset(offset); // crutch
				return hours;
			}, {});
		},

		/**
		 * Получить оптимальный шаг времени для выбора интервала.
		 * Если шаг расписания 5 минут, а минимальный интервал бронирования больше 10 минут,
		 * то шаг времени будет 15 минут, иначе это будет шагом расписания
		 *
		 * @return {number}
		 */
		getRangeDuration: function ()
		{
			var timeStep = +this.get('timeStep');
			var minBookingInterval = +this.get('minBookingInterval');

			return timeStep === 5 * 60 && minBookingInterval > 10 * 60
				? 15 * 60
				: timeStep;
		},

		/**
		 * Доступные для заказа доли
		 * 
		 * @returns {Array} Структура записей имеет 2 свойства: value, label
		 */
		getWeightLabels: function ()
		{
			var weights = this.get('weights'),
				weightMap = [
					[12, 1],
					[6, 2],
					[3, 4],
					[8, 8],
					[4, 8],
				];
			
			return _.reduce(weightMap, function (result, map)
			{
				if (weights & map[1])
				{
					result.push({
						value: map[0],
						label: this.weightLabels[map[0]]
					});
				}
				
				return result;
			}, [], this);
		},
		
		/**
		 * Проверяет есть ли у площадки доли
		 * 
		 * @returns {Boolean}
		 */
		hasWeights: function ()
		{
			return this.get('weights') > 1;
		}
	});
}, Handlebars);
/**
 * Базовый класс для Marionette ItemView, LayoutView в модальных окнах
 * 
 * Сейчас создан ради promise, чтобы на закрытие окна можно было навешивать обработчики
 * @todo Расширять другими общими модальными фичами
 * 
 * @param {Marionette.Module} module
 * @param {Marionette.Application} app
 * @param {Backbone} Bb
 * @param {Marionette} Mn
 */
application.module('main', function (module, app, Bb, Mn)
{
	var ModalPromiseAbstract = {
		_deferred: null,
		
		events: {
			'hidden.bs.modal': 'onModalHidden'
		},
		
		isVisible: function()
		{
			// http://stackoverflow.com/a/19674741
			return this.$el.hasClass('in');
		},
		
		getModalPromise: function()
		{
			if (!this._deferred || this._deferred.state() != 'pending')
			{
				this._deferred = $.Deferred();
			}
			
			return this._deferred.promise();
		},
		
		setModalReject: function()
		{
			if (this._deferred)
			{
				this._deferred.reject();
			}
		},
		
		setModalResolve: function()
		{
			if (this._deferred)
			{
				this._deferred.resolve();
			}
		},
		
		onModalHidden: function()
		{
			if (this._deferred && this._deferred.state() != 'resolved')
			{
				this.setModalReject();
			}
		}
	};
	
	module.ModalItemView = Mn.ItemView.extend(ModalPromiseAbstract);
	module.ModalLayoutView = Mn.LayoutView.extend(ModalPromiseAbstract);
	
	/**
	 * Заменить вид в регионе и вернуть существующий
	 * 
	 * @param {String} regionName Имя региона
	 * @param {Marionette.View} view Экземпляр вида
	 * @param {Boolean} preventDestroy [optional] Сохранить ли старый вид? По умолчанию: true
	 * @returns {Marionette.View|undefined} Старый вид
	 */
	module.ModalLayoutView.prototype.replaceChildView = function(regionName, view, preventDestroy)
	{
		var region = this.getRegion(regionName),
			currentView;
		if (!region) return;
		
		if (typeof preventDestroy == 'undefined')
		{
			preventDestroy = true;
		}
		
		currentView = region.currentView;
		if (region.currentView != view)
		{
			region.show(view, { preventDestroy: preventDestroy });
		}
		else
		{
			view.render();
		}
		
		return currentView;
	};
});



/**
 * @param {Marionette.Module} module
 * @param {Marionette.Application} app
 * @param {Backbone} Bb
 * @param {Marionette} Mn
 * @param {jQuery} $
 */
application.module('main', function (module, app, Bb, Mn, $)
{
    'use strict';

    module.Behaviors = {};

    var InlineValidationBehavior = Mn.Behavior.extend({

        VIEW_VALIDATION_COMPLETE: 'validation:complete',
        VIEW_VALIDATION_START: 'validation:start',

        events: {
            'focusout input[type="text"]': 'onFocusOut'
        },

        initialize: function(){
            this.view.errors = {};
            this.view.lastErrorAttr = null;
        },

        onFocusOut: function(event){
            this.view.triggerMethod(this.VIEW_VALIDATION_START);
            var error,
                name = event.currentTarget.name,
                $input = $(event.currentTarget);

            error = this.view.model.preValidate(name, $input.val());
            if(error)
            {
                this.view.lastErrorAttr = name;
                this.view.errors[name] = error;
                this.showErrorBorder(name);
            }
            else
            {
                delete this.view.errors[name];
                this.hideError(name);
            }
            this.view.triggerMethod(this.VIEW_VALIDATION_COMPLETE);
        },

        showErrorBorder: function(name){
            var $input = $('input[name="'+ name +'"]'),
                $formGroup = $input.closest('.form-group');
            $formGroup.addClass('has-error');
            $input.addClass('has-error');
        },

        hideError: function(name){
            var $input = $('input[name="'+ name +'"]'),
                $formGroup = $input.closest('.form-group'),
                $errorBlock = $formGroup.find('.error-message');
            $input.removeClass('has-error');
            $formGroup.removeClass('has-error');
            $errorBlock.text('');
        }
    });

    module.Behaviors.InlineValidation = InlineValidationBehavior;

    Mn.Behaviors.behaviorsLookup = function() {
        return module.Behaviors;
    };
});