/**
 * @param {Marionette.Module} module
 * @param {Marionette.Application} app
 * @param {Backbone} Bb
 * @param {Marionette} Mn
 * @param {jQuery} $
 * @param {_} _
 */
application.module('pages.objectSearch', function (module, app, Bb, Mn, $, _) {
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
		module.templateHelpers = {
			svg: function (fileName, spriteName, options) {
				var block = 'svg';
				var theme = options.hash.theme ? block + '_' + options.hash.theme : '';
				var classes = options.hash.class || '';
				var href = bem.support.externalSvg.fixUrl('/images/' + fileName + '.svg#' + block + '-' + fileName + '__' + spriteName);

				return new Handlebars.SafeString('<svg class="' + block + ' ' + theme + ' ' + classes + '" focusable="false"><use xlink:href="' + href + '" /></svg>');
			},
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
		module.LayoutView = Mn.LayoutView.extend({
			ui: {
				'content': '.object-search-page__content',

				'h1': '.object-search-page__h1',
				'text': '.object-search-page__text',
			},

			initialize: function () {
				this.bindUIElements();
			}
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
		module.PreloaderView = Mn.View.extend({
			visibleClass: 'object-search-preloader_visible',

			show: function () {
				this.el.classList.add(this.visibleClass);
			},
			hide: function () {
				this.el.classList.remove(this.visibleClass);
			},
			toggle: function () {
				this.el.classList.toggle(this.visibleClass);
			},
			isVisible: function () {
				return this.el.classList.contains(this.visibleClass);
			},
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
		module.DropdownListView = Mn.View.extend({
			visibleClassName: 'dropdown-list_visible',

			show: function () {
				this.el.classList.add(this.visibleClassName);
			},
			hide: function () {
				this.el.classList.remove(this.visibleClassName);
			},
			toggle: function (state) {
				if (arguments.length === 0)
					return this.el.classList.toggle(this.visibleClassName);
				else
					return this.el.classList.toggle(this.visibleClassName, !!state);
			},
			isVisible: function () {
				return this.el.classList.contains(this.visibleClassName);
			},
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
		var Form = module.Form = module.Form || {};

		/**
		 * @param {Marionette.Module} module
		 * @param {Marionette.Application} app
		 * @param {Backbone} Bb
		 * @param {Marionette} Mn
		 * @param {jQuery} $
		 * @param {_} _
		 * @param {Object} Form
		 */
		(function (module, app, Bb, Mn, $, _, Form)
		{
			var ToolFunctions = {
				htmlEncode: function (value) { // http://stackoverflow.com/a/1219983
					//create a in-memory div, set it's inner text(which jQuery automatically encodes)
					//then grab the encoded contents back out.  The div never exists on the page.
					return $('<div/>').text(value).html();
				},

				escapeRegExp: function (str) { // http://stackoverflow.com/a/6969486
					return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
				}
			};

			Form.BaseStoreModel = Bb.Model.extend({
				actions: null,
				reducer: null,

				dispatch: function (action) {
					var actions = _.isArray(action) ? action : [action];
					this.set(actions.reduce(this.reducer, _.clone(this.attributes)));
					return this;
				},
			});

			Form.BaseDropdownItemView = Mn.ItemView.extend({
				className: 'dropdown-list__item dropdown-list__link',

				triggers: {
					'click': {
						event: 'click',
						preventDefault: false,
						stopPropagation: false,
					},
					'mouseenter': {
						event: 'mouseenter',
						preventDefault: false,
						stopPropagation: false,
					},
				}
			});

			var DropdownFocusableBehavior = Mn.Behavior.extend({
				defaults: {
					childClassNameFocused: 'dropdown-list__item_focused',
				},

				modelEvents: {
					'change:itemFocused': 'onStateChangeItemFocused',
				},

				onRenderCollection: function () {
					this.renderItemFocus(this.view.model.get('itemFocused'));
				},

				onStateChangeItemFocused: function (model, value) {
					this.renderItemFocus(value);
				},

				renderItemFocus: function (itemId) {
					this.view.children.each(function (view) {
						view.$el.toggleClass(this.getOption('childClassNameFocused'), view.getOption('childIndex') === itemId);
					}, this);
				},
			});

			Form.BaseDropdownView = module.DropdownListView.extend(Mn.CollectionView.prototype).extend({
				actions: null,

				tagName: 'ul',
				className: 'dropdown-list dropdown-list_autocomplete',

				childView: Form.BaseDropdownItemView,
				childViewOptions: function (model, index) {
					return {
						tagName: 'li',
						childIndex: index,
					};
				},
				childEvents: {
					'click': 'onChildClick',
					'mouseenter': 'onChildMouseEnter',
				},

				behaviors: {
					'focusable': {
						behaviorClass: DropdownFocusableBehavior,
					},
				},

				initialize: function () {
					this.actions = this.model.actions;
					this.collection = new Bb.Collection(this.model.get('items'));
				},

				onChildClick: function (view) {
					this.model.dispatch([
						this.actions.itemFocus(view.getOption('childIndex')),
						this.actions.save(),
					]);
				},

				onChildMouseEnter: function (view) {
					this.model.dispatch(this.actions.itemFocus(view.getOption('childIndex')));
				},
			});

			Form.BaseReducerAutocomplete = {
				STATE_INITIAL: {
					hasFocus: false,
					userInput: '',
					userQuery: '',
					itemSelected: null,
					items: null,
					itemFocused: -1,
					isListVisible: false,
					queries: null,
				},

				tools: ToolFunctions,

				actions: {
					init: function (id, name, type) {
						return {
							type: 'INIT',
							id: id,
							name: name,
							itemType: type,
						};
					},
					blur: function () {
						return {type: 'BLUR'};
					},
					focus: function () {
						return {type: 'FOCUS'};
					},
					input: function (text) {
						return {
							type: 'INPUT',
							text: text,
						};
					},
					save: function () {
						return {type: 'SAVE'};
					},
					reset: function () {
						return {type: 'RESET'};
					},
					itemFocus: function (index) {
						return {
							type: 'ITEM_FOCUS',
							index: index,
						};
					},
					setQueries: function (queries) {
						return {
							type: 'SET_QUERIES',
							queries: queries,
						};
					},
				},

				reducer: function (state, action) {
					if (!state)
						state = _.clone(this.STATE_INITIAL);
					if (!action)
						return state;

					switch (action.type) {
						case 'INIT':
							if (action.id && action.name && action.itemType)
								return this.reduceInit(state, action.id, action.name, action.itemType);
							else
								return this.reduceSelect(state);
						case 'BLUR':
							return this.reduceFocusToggle(state, false);
						case 'FOCUS':
							return this.reduceFocusToggle(state, true);
						case 'INPUT':
							return this.reduceInput(state, action.text);
						case 'SAVE':
							if (state.userQuery) {
								if (state.items && state.items[state.itemFocused]) // Есть совпадения
									return this.reduceSelect(state, state.items[state.itemFocused]);
								else
									return this.reduceFocusToggle(state, true);
							} else { // Нет ввода - стираем
								return this.reduceSelect(state, null);
							}
						case 'RESET':
							return this.reduceSelect(state, state.itemSelected);
						case 'ITEM_FOCUS':
							return this.reduceItemFocus(state, action.index);
						case 'SET_QUERIES':
							return this.reduceSetQueries(state, action.queries);
						default:
							return state;
					}
				},

				reduceFocusToggle: function (state, hasFocus) {
					state.hasFocus = hasFocus;
					state.isListVisible = this.canShowList(state);
					return state;
				},

				reduceInit: function (state, id, name, itemType) {
					var itemAttributes = {
							id: id,
							name: name,
							type: itemType,
						},
						item = _.findWhere(state.items, itemAttributes);

					if (!item)
						item = itemAttributes;

					state = this.reduceSelect(state, item);

					return state;
				},

				reduceSelect: function (state, item) {

					state.itemSelected = item;

					state = this.reduceInput(state, state.itemSelected ? state.itemSelected.name : '');

					state.userInput = state.userQuery;

					state = this.reduceFocusToggle(state, false);
					return state;
				},

				reduceInput: function (state, text) {
					var textTrimmed = text.trim();
					state.userInput = text;

					if (state.userQuery !== textTrimmed) {
						state.userQuery = textTrimmed;
						state = this.reduceFindItems(state);
					}

					return state;
				},

				reduceItemFocus: function (state, index) {
					var itemFocused = -1;
					if (state.items && state.items.length) {
						if (index < 0)
							index = 0;
						else if (state.items.length - 1 < index)
							index = state.items.length - 1;

						itemFocused = index;
					}

					state.itemFocused = itemFocused;
					return state;
				},

				reduceFindItems: function (state) {
					state.isListVisible = this.canShowList(state);
					state.items = state.userQuery && state.queries
						? this.findItems(state.userQuery, state.queries, 5)
						: [];

					state = this.reduceItemFocus(state, 0);

					return state;
				},

				reduceSetQueries: function (state, queries) {
					state.queries = _.sortBy(queries, 'name');
					state = this.reduceFindItems(state);
					return state;
				},

				canShowList: function (state) {
					return state.hasFocus && !!state.userQuery;
				},

				findItems: function (text, queries, resultLength) {
					var result = [],
						query, i, queryLength,
						search = new RegExp(this.tools.escapeRegExp(text), 'i'),
						relevance;

					for (i = 0, queryLength = queries.length; i < queryLength; i++) {
						query = queries[i];
						relevance = query.name.search(search);

						if (relevance > -1) {
							if (!result[relevance])
								result[relevance] = [];

							if (!resultLength || result[relevance].length < resultLength) // Если совпадений уже и так достаточно, экономим
								result[relevance].push(query);
						}
					}

					result = _.compact(_.flatten(result, true));
					if (resultLength)
						result = _.first(result, resultLength);

					return result;
				},
			};
			Form.BaseAutocompleteStore = Form.BaseStoreModel.extend({
				actions: Form.BaseReducerAutocomplete.actions,
				reducer: _.bind(Form.BaseReducerAutocomplete.reducer, Form.BaseReducerAutocomplete),
				urlFetch: null,

				defaults: _.clone(Form.BaseReducerAutocomplete.STATE_INITIAL),

				initialize: function (attributes, options) {
					this.urlFetch = options.urlFetch;

					if (!this.get('queries')) {
						if (this.get('hasFocus'))
							this.loadQueries();
						else
							this.listenToOnce(this, 'change:hasFocus', this.loadQueries);
					}
				},

				loadQueries: function () {
					return $.ajax({
						url: this.urlFetch,
						method: 'post',
						dataType: 'json',
						context: this,

						success: function (queries) {
							this.dispatch(this.actions.setQueries(queries));
						},
					});
				},
			});

			//Базовые виды выпадающего списка для Автокомплита
			Form.BaseAutocompleteDropdownItemView = Form.BaseDropdownItemView.extend({
				tools: ToolFunctions,
				template: function (data) {
					switch (data.type) {
						case 'station':
						case 'line':
							return '<span class="metro-dot metro-dot_type_' + data.type + ' metro-dot_color_' + data.color + '"></span> ' + data.label;

						case 'sport':
						case 'inventory':
						case 'category':
						default:
							return data.label;
					}
				},

				serializeData: function () {
					var regEx = this.getOption('highlightRegex'),
						label = this.tools.htmlEncode(this.model.get('name'));

					if (regEx)
						label = label.replace(regEx, '<strong>$1</strong>');

					return {
						label: label,
						type: this.model.get('type'),
						color: this.model.get('color'), // только для метро
					};
				}
			});

			Form.BaseAutocompleteDropdownEmptyView = Mn.ItemView.extend({
				template: function (data) {
					return '<em>' + data.message + '</em>';
				},
				className: 'dropdown-list__item',

				serializeData: function () {
					return {
						message: this.getOption('message'),
					};
				}
			});
			Form.BaseAutocompleteDropdownView = Form.BaseDropdownView.extend({
				tools: ToolFunctions,
				_highlightRegex: null,

				childView: Form.BaseAutocompleteDropdownItemView,
				childViewOptions: function () {
					return _.extend(Form.BaseDropdownView.prototype.childViewOptions.apply(this, arguments), {
						highlightRegex: this._highlightRegex,
					});
				},

				emptyView: Form.BaseAutocompleteDropdownEmptyView,
				emptyViewOptions: function () {
					return {
						tagName: 'li',
						message: !_.isArray(this.model.get('queries'))
							? 'Загрузка...'
							: 'Совпадений не найдено',
					};
				},

				onBeforeRender: function () {
					var userInput = this.model.get('userQuery');

					this._highlightRegex = (userInput)
						? new RegExp('(' + this.tools.escapeRegExp(this.tools.htmlEncode(userInput)) + ')', 'ig')
						: null;
				},
			});

			Form.BaseAutocompleteChoiceItemView = Mn.ItemView.extend({

				tagName: 'li',

				className: 'search-choice_li',

				ui: {
					deleteItem : '.search-choice_delete'
				},

				triggers: {
					'click @ui.deleteItem': {
						event: 'item:delete',
						preventDefault: false,
						stopPropagation: false,
					}
				},

				template: function (data) {
					return '<div class="search-choice">' +
						'<span>' + data.label + '</span>&nbsp;' +
						'<a class="input__clear_visible search-choice_delete">\n' +
						'<svg class="svg  search-choice_clear" focusable="false">' +
						'<use xlink:href="/images/sprite.svg#svg-sprite__close"></use>' +
						'</svg>' +
						'</a>' +
						'</div>';
				},

				serializeData: function () {
					return {
						label: this.model.get('name'),
						type: this.model.get('type')
					};
				}
			});

			Form.MetroAutocompleteChoiceItemView = Form.BaseAutocompleteChoiceItemView.extend({
				template: function (data) {
					return '<div class="search-choice metro-dot_color_' + data.color + '">' +
						'<span>' + data.label + '</span>&nbsp;' +
						'<a class="input__clear_visible search-choice_delete">\n' +
						'<svg class="svg  search-choice_clear" focusable="false">' +
						'<use xlink:href="/images/sprite.svg#svg-sprite__close"></use>' +
						'</svg>' +
						'</a>' +
						'</div>';
				},

				serializeData: function () {
					return {
						label: this.model.get('name'),
						type: this.model.get('type'),
						color: this.model.get('color')
					};
				}
			});

			Form.BaseAutocompleteChoiceView = Mn.CollectionView.extend({
				tagName: 'ul',

				className: 'chosen_choices',

				childView: Form.BaseAutocompleteChoiceItemView,

				childEvents: {
					'item:delete': 'onClickDeleteItem'
				},

				initialize: function () {
					this.collection = new Bb.Collection(this.model.get('selectItems'));
				},

				onClickDeleteItem: function (view) {
					this.triggerMethod('choiceItem:delete', view._index);
				}
			});

			Form.MetroAutocompleteChoiceView = Form.BaseAutocompleteChoiceView.extend({
				childView: Form.MetroAutocompleteChoiceItemView
			});

		})(module, app, Bb, Mn, $, _, Form);
		/**
		 * @param {Marionette.Module} module
		 * @param {Marionette.Application} app
		 * @param {Backbone} Bb
		 * @param {Marionette} Mn
		 * @param {jQuery} $
		 * @param {_} _
		 * @param {Object} Form
		 */
		(function (module, app, Bb, Mn, $, _, Form)
		{
			Form.InputClearBehavior = Mn.Behavior.extend({
				defaults: {
					'classClearVisible': 'input__clear_visible',
				},

				ui: {
					'input': '.input__control',
					'clear': '.input__clear',
				},

				events: {
					'click @ui.clear': 'onClearClick',
					'input @ui.input': 'onInputText',
					'change @ui.input': 'onInputText',
				},

				initialize: function () {
					_.bindAll(this, 'onInputText');
				},

				onBeforeDestroy: function () {
					var behavior = this;
					this.ui.input.each(function () {
						this.form.removeEventListener('reset', behavior.onInputText);
					});
				},

				onRender: function () {
					var behavior = this;

					this.renderClear(!!this.ui.input.val());
					this.ui.input.each(function () {
						this.form.removeEventListener('reset', behavior.onInputText);
						this.form.addEventListener('reset', behavior.onInputText);
					});
				},

				onClearClick: function () {
					this.ui.input.val('').change();
					this.view.triggerMethod('input:clear', this.ui.input);
				},

				onInputText: function () {
					this.renderClear(!!this.ui.input.val());
				},

				renderClear: function (isVisible) {
					this.ui.clear.toggleClass(this.getOption('classClearVisible'), isVisible);
				},
			});

			Form.InputFocusBehavior = Mn.Behavior.extend({
				defaults: {
					'classNameFocused': 'input_focused',
				},

				ui: {
					'inputContainer': '.input',
					'input': '.input__control',
				},

				triggers: {
					'focus @ui.input': { // Crutch необходимо разрешить всплывание focusin см. InputMisclickBehavior
						event: 'input:focus',
						preventDefault: false,
						stopPropagation: false,
					},
				},

				modelEvents: {
					'change:hasFocus': 'onStateChangeHasFocus',
				},

				onStateChangeHasFocus: function (model, hasFocus) {
					this.renderFocus(hasFocus);
				},

				renderFocus: function (hasFocus) {
					this.ui.inputContainer.toggleClass(this.getOption('classNameFocused'), hasFocus);
					this.renderFocusPlaceholder(hasFocus);
					if (hasFocus && document.activeElement !== this.ui.input.get(0) && this.ui.input.is(':visible'))
						this.ui.input.focus();
					// blur произойдет автоматически. Если вызывать вручную - сбивается цикл фокуса в IE
				},

				renderFocusPlaceholder: function (hasFocus) {
					var placeholderOriginal = this.ui.input.data('focus-placeholder-original');
					if (hasFocus) {
						if (placeholderOriginal === void 0)
							this.ui.input.data('focus-placeholder-original', this.ui.input.attr('placeholder'));
						this.ui.input.attr('placeholder', this.ui.input.data('focus-placeholder'));
					} else {
						if (placeholderOriginal !== void 0)
							this.ui.input.attr('placeholder', placeholderOriginal);
					}
				},
			});

			Form.InputMisclickBehavior = Mn.Behavior.extend({
				listenEvents: null,

				modelEvents: {
					'change:hasFocus': 'onStateChangeHasFocus',
				},

				initialize: function () {
					// В идеале требуется слушать только click, но не всегда отправляется click, если сработал focus
					// IE11 при отлове focus некорректно обрабатывает click (неверный e.target, получается misclick, нельзя выбрать элемент из списка)
					this.listenEvents = this._isIE()
						? 'click'
						: 'click focusin';

					_.bindAll(this, 'onBodyClick');
				},

				onBeforeDestroy: function () {
					$(document.body).off(this.listenEvents, this.onBodyClick);
				},

				onBodyClick: function (e) {
					// Т.к. click по body, то он обрабатыватся последним после кликов на элементы компонента
					// Не удалось ловить blur, т.к. необходимо сначала обработать клик на элементы этого же компонента
					if ($(e.target).closest(this.view.$el).length) {
						if (e.type != 'focusin') // Crutch Firefox Иначе рекурсия
							this.view.triggerMethod('input:focus:restore');
					} else {
						this.view.triggerMethod('input:misclick');
					}
				},

				onStateChangeHasFocus: function (model, hasFocus) {
					if (hasFocus)
						$(document.body).on(this.listenEvents, this.onBodyClick);
					else
						$(document.body).off(this.listenEvents, this.onBodyClick);
				},

				_isIE: function () {
					return !(window.ActiveXObject) && 'ActiveXObject' in window;
				},
			});

			Form.InputFocusRestoreBehavior = Mn.Behavior.extend({
				ui: {
					'input': '.input__control',
				},

				onInputFocusRestore: function () {
					if (document.activeElement !== this.ui.input.get(0) && this.ui.input.is(':visible'))
						this.ui.input.focus();
				},
			});

			Form.InputResetBehavior = Mn.Behavior.extend({
				ui: {
					'input': '.input__control',
				},

				initialize: function () {
					_.bindAll(this, 'onReset');
				},

				onBeforeDestroy: function () {
					var behavior = this;
					this.ui.input.each(function () {
						this.form.removeEventListener('reset', behavior.onReset);
					});
				},

				onRender: function () {
					var behavior = this;
					this.ui.input.each(function () {
						this.form.removeEventListener('reset', behavior.onReset);
						this.form.addEventListener('reset', behavior.onReset);
					});
				},

				onReset: function () {
					this.view.triggerMethod('input:reset');
				},
			});

			Form.InputUnresetableBehavior = Mn.Behavior.extend({

			});

		    Form.SelectResetBehavior = Mn.Behavior.extend({
		        ui: {
		            'select': 'select',
		        },

		        initialize: function () {
		            _.bindAll(this, 'onReset');
		        },

		        onBeforeDestroy: function () {
		            var behavior = this;
		            this.ui.select.each(function () {
		                this.form.removeEventListener('reset', behavior.onReset);
		            });
		        },

		        onRender: function () {
		            var behavior = this;
		            this.ui.select.each(function () {
		                this.form.removeEventListener('reset', behavior.onReset);
		                this.form.addEventListener('reset', behavior.onReset);
		            });
		        },

		        onReset: function () {
		            this.view.triggerMethod('select:reset');
		        },
		    });

		})(module, app, Bb, Mn, $, _, Form);
		/**
		 * Блок набора select, выбора даты и времени
		 *
		 * @param {Marionette.Module} module
		 * @param {Marionette.Application} app
		 * @param {Backbone} Bb
		 * @param {Marionette} Mn
		 * @param {jQuery} $
		 * @param {_} _
		 * @param {Object} Form
		 */
		(function (module, app, Bb, Mn, $, _, Form)
		{
			var ControlsetFocusBehavior = Mn.Behavior.extend({
				defaults: {
					classNameFocused: 'i_focused',
					classNameControlFocused: 'i__control_focused',
				},

				ui: {
					'control': '.i__control',
					'controlset': '.i'
				},

				events: {
					'focusInDate' : 'onFocusInDate',
					'focusOutDate' : 'onFocusOutDate',
				},

				onFocusInDate: function () {
					this.ui.controlset.toggleClass(this.defaults.classNameFocused, true);
					this.ui.control.toggleClass(this.defaults.classNameControlFocused, true);
				},

				onFocusOutDate: function () {
					this.ui.controlset.toggleClass(this.defaults.classNameFocused, false);
					this.ui.control.toggleClass(this.defaults.classNameControlFocused, false);
				}
			});

			Form.DateView = Mn.ItemView.extend({

				ui: {
		            inputDateStart: 'input[name="date_start"]',
		            inputDateFinish: 'input[name="date_finish"]',
		            maskDateStart: '.mask_date_start',
		            maskDateFinish: '.mask_date_finish',
		            maskDate: '.mask_date',
					controlDate: '.i__control_date',
		        },

		        events : {
		            'change @ui.inputDateStart' : 'onChangeInputDate',
		            'change @ui.inputDateFinish' : 'onChangeInputDate',
					'click @ui.controlDate' : 'onClickMaskDate'
		        },

				behaviors: {
		            'inputReset': {
		                behaviorClass: Form.InputResetBehavior.extend({
		                    ui: {
		                        'input': 'input',
		                    }
		                }),
		            },
					'controlFocus': {
						behaviorClass: ControlsetFocusBehavior
					},
				},

		        initialize: function (opt) {
				  if (opt.datepicker) {
				      this.datepicker = opt.datepicker;
		          }
		        },

		        onClickMaskDate: function () {

					let view = this;
					//устанавливаем событие misclick
					$(document).bind('mouseup',function (e) {
						let el = $(e.target);
						let calendar = $(view.datepicker.ui.calendar);
						if (!calendar.is(e.target) && calendar.has(e.target).length == 0) {
							if (!el.hasClass('i__control')) {
								view.datepicker.hidden();
								view.triggerMethod('focusOutDate');
								$(document).unbind('mouseup');
							}
							$(document).unbind('mouseup');
						}
					});

					//вешаем событие на select так, как не правильно сробатывает click
					$('select').bind('focus',function () {
						view.datepicker.hidden();
						view.triggerMethod('focusOutDate');
						$(document).unbind('mouseup')
					});

		            if (view.datepicker.hasVisible()) {
		            	view.datepicker.hidden();
					} else {
		            	view.datepicker.visible();
					}

		            this.triggerMethod('focusInDate');
		        },

		        onChangeInputDate: function (event) {
				    let el = $(event.currentTarget);
					let date = moment(el.val()).format('D MMM');

				    if (el.attr('name') == 'date_start') {
				        this.ui.maskDateStart.text(date);
						if (el.val() != this.datepicker.defDateStart) {

							this.ui.maskDateStart.css('color', '#464646');
						}
		            }

		            if (el.attr('name') == 'date_finish') {
		                this.ui.maskDateFinish.text(date)
						if (el.val() != this.datepicker.defDateFinish) {
							this.ui.maskDateFinish.css('color', '#464646');
						}
		            }
				},

				onRender: function () {
				    if (this.datepicker) {
				        this.datepicker.render();
		            }
				},

		        refreshData: function () {
		            let dateStart = this.ui.inputDateStart.val();
		            let dateFinish = this.ui.inputDateFinish.val();

		            this.ui.maskDateStart.text(moment(dateStart).format('D MMM'));
		            this.ui.maskDateFinish.text(moment(dateFinish).format('D MMM'));

					if (dateStart != this.datepicker.defDateStart || dateFinish != this.datepicker.defDateFinish ) {
						this.ui.maskDate.css('color', '#464646');
					} else {
						this.ui.maskDate.css('color', '#7B7B7B');
					}

		            this.datepicker.setDateFromInput();
		        },

		        //Оставил так для сброса
				onInputReset: function() {
		            this.datepicker.reset();
		            this.refreshData();
				},

			});
		})(module, app, Bb, Mn, $, _, Form);
		/**
		 * Выпадающий списак для времени бронирования
		 *
		 * @param {Marionette.Module} module
		 * @param {Marionette.Application} app
		 * @param {Backbone} Bb
		 * @param {Marionette} Mn
		 * @param {jQuery} $
		 * @param {_} _
		 * @param {Object} Form
		 */
		(function (module, app, Bb, Mn, $, _, Form)
		{
			var ControlsetFocusBehavior = Mn.Behavior.extend({
				defaults: {
					classNameFocused: 'i_focused',
					classNameControlFocused: 'i__control_focused',
				},

				ui: {
					'control': '.i__control',
					'controlset': '.i'
				},

				events: {
					'focusin @ui.control': 'onFocusIn',
					'focusout @ui.control': 'onFocusOut'
				},

				onFocusIn: function (e) {
					this.renderHasFocus($(e.currentTarget), true);
				},

				onFocusOut: function (e) {
					this.renderHasFocus($(e.currentTarget), false);
				},

				renderHasFocus: function ($target, hasFocus) {
					$target.toggleClass(this.getOption('classNameControlFocused'), hasFocus);
					this.ui.controlset.toggleClass(this.getOption('classNameFocused'), hasFocus);
				}
			});

			Form.TimeView = Mn.ItemView.extend({
				ui: {
					selectTime: '.i__time'
				},

				events : {
					'change @ui.selectTime' : 'onChangeSelectTime',
					'focusin @ui.selectTime' : 'onFocusInSelectTime',
					'focusout @ui.selectTime' : 'onFocusOutSelectTime'
				},


				behaviors: {
					'controlFocus': {
						behaviorClass: ControlsetFocusBehavior
					},
					'selectReset': {
						behaviorClass: Form.SelectResetBehavior,
					}
				},

				onRender: function () {
					let view = this;
					view.ui.selectTime.each(function () {
						view.setWidthSelect($(this));
					});
				},

				onFocusInSelectTime: function (event) {
					let el = this.$(event.currentTarget);
					el.css('color','#464646');
				},

				onFocusOutSelectTime: function(event) {
					let el = this.$(event.currentTarget);
					if (el.find(':selected').attr('disabled')) {
						el.css('color', '#7b7b7b');
					} else {
						el.css('color', '#464646');
					}
				},

				onSelectReset: function() {
					let view = this;

					view.ui.selectTime.each(function () {
						let el = $(this).find(':selected');
						if (!el.attr('disabled')) {
							el.removeAttr('selected');
						}
					});

					view.ui.selectTime.each(function () {
						$(this).css('color', '#7b7b7b');
					});

				},

				onChangeSelectTime: function (event) {

					let elDuration = $('.js-field-time-duration input');
					let valDuration = +($('.js-field-time-duration .i__control_checked input').val());
					let el = this.$(event.currentTarget);
					let selectTime = this.ui.selectTime;
					let elStart = selectTime.filter('[name="time_from"]');
					let elFinish = selectTime.filter('[name="time_to"]');

					if (elStart.val() && elFinish.val()) {

						let valStart = +elStart.val();
						let valFinish = +elFinish.val();
						let diffTime = valFinish - valStart;

						if (valDuration) {

							if (diffTime < valDuration && diffTime != 0) {
								//Вызов события клик (сробатывает только с 2 раз)
								elDuration.filter('[value="'+diffTime+'"]').trigger('click');
								elDuration.filter('[value="'+diffTime+'"]').trigger('click');
							}
						}

						if (valFinish <= valStart) {

							let interim = valDuration ? valDuration : 1;

							if(el.attr('name') == elStart.attr('name')) {

								if ((valStart+interim) > 24) {
									interim = 24 - valStart;
									//Вызов события клик (сробатывает только с 2 раз)
									elDuration.filter('[value="'+interim+'"]').trigger('click');
									elDuration.filter('[value="'+interim+'"]').trigger('click');
								}

								elFinish.val(valStart+interim);
							}
							if (el.attr('name') == elFinish.attr('name')) {

								if (elStart.val() == 0 || elFinish.val() == 0) {
									elStart.val(24-interim);
									elFinish.val(24);
								} else {

									if (diffTime <= 0) {
										elStart.val(0);
										if(valFinish < interim) {
											//Вызов события клик (сробатывает только с 2 раз)
											elDuration.filter('[value="'+valFinish+'"]').trigger('click');
											elDuration.filter('[value="'+valFinish+'"]').trigger('click');
										}
									} else {
										elStart.val(elFinish.val()-interim);
									}
								}
							}

						}

					}

					this.setWidthSelect(el);
				},

				/**
				 * Установка ширины элемента в зависимости от его содержимого
				 * @param el
				 */
				setWidthSelect: function (el) {
					let test = document.createElement('div');
					test.style.visibility = 'hidden';
					test.style.position = 'absolute';
					test.style.top = 0;
					test.innerHTML = el.find(':selected').text();
					document.body.appendChild(test);
					el.width(test.clientWidth);
					document.body.removeChild(test);
				},

				/**
				 * Удаляем все элементы не 'disabled'
				 * @param el DOM элмент
				 * return значение выбранное в селект
				 */
				clearActiveOption: function (el) {
					let opt = el.find(':disabled');
					let val = el.find(':selected').val();

					el.empty();
					el.append(opt);

					return val;
				},

			});
		})(module, app, Bb, Mn, $, _, Form);
		/**
		 * Набор radio-переключателей с возможностью "отжать" по клику
		 * Пока не поднимает событие filter:change за ненадобностью
		 *
		 * @param {Marionette.Module} module
		 * @param {Marionette.Application} app
		 * @param {Backbone} Bb
		 * @param {Marionette} Mn
		 * @param {jQuery} $
		 * @param {_} _
		 * @param {Object} Form
		 */
		(function (module, app, Bb, Mn, $, _, Form)
		{
			var ControlsetFocusBehavior = Mn.Behavior.extend({
				defaults: {
					classNameFocused: 'i_focused',
					classNameControlFocused: 'i__control_focused',
				},

				ui: {
					'control': '.i__control',
					'controlset': '.i',
				},

				events: {
					'focusin @ui.control': 'onFocusIn',
					'focusout @ui.control': 'onFocusOut',
				},

				onFocusIn: function (e) {
					this.renderHasFocus($(e.currentTarget), true);
				},

				onFocusOut: function (e) {
					this.renderHasFocus($(e.currentTarget), false);
				},

				renderHasFocus: function ($target, hasFocus) {
					$target.toggleClass(this.getOption('classNameControlFocused'), hasFocus);
					this.ui.controlset.toggleClass(this.getOption('classNameFocused'), hasFocus);
				},
			});

			Form.TimeDuration = Mn.ItemView.extend({
				classNameControlChecked: 'i__control_checked',

				ui: {
					'control': '.i__control',
					'radio': '.i__radio',
				},

				events: {
					'click @ui.radio': 'onRadioClick'
				},

				behaviors: {
					'controlFocus': {
						behaviorClass: ControlsetFocusBehavior,
					},
					'inputReset': {
						behaviorClass: Form.InputResetBehavior.extend({
							ui: {
								'input': '.i__radio',
							}
						}),
					},
				},

				onInputReset: function () {
					var $radioCheckedDefault = this.ui.radio.filter('[checked]'); // В :checked еще текущее значение

					if ($radioCheckedDefault.length)
						$radioCheckedDefault.prop('checked', true); // radio автоматом отожмет у остальных
					else
						this.ui.radio.prop('checked', false);

					this.renderChecked();
				},

				onRadioClick: function (e) {
					// По умолчанию checked для radio всегда true по click и change
					// Отмена выбора щелчком по уже выбранному элементу
					if ($(e.target).closest(this.ui.control).hasClass(this.getOption('classNameControlChecked'))) {
		                e.target.checked = false;
					} else {
		                this.dependencyFromTime($(e.target));
					}

					this.renderChecked();
				},

				onRender: function () {
					this.renderChecked();
				},

				renderChecked: function () {
					var view = this;
					this.ui.radio.each(function () {
						var $control = $(this).closest(view.ui.control);
						$control.toggleClass(view.classNameControlChecked, this.checked);
					});
				},

				dependencyFromTime: function (el) {
					let elTimeFrom = $('select[name="time_from"]');
					let elTimeTo = $('select[name="time_to"]');
					let diff = 0;
					let offset = 0;

					if (
						elTimeFrom && elTimeTo
						&& elTimeFrom.val() && elTimeTo.val()
					)
					{
						let valFrom = +elTimeFrom.val();
						let valTo = +elTimeTo.val();
						let duration = Math.ceil(+el.val());

						diff = valTo - valFrom;

						if (diff < duration) {
							offset = valFrom + duration;

							if (offset > 24) {
								elTimeFrom.val(24 - duration);
								offset = 24;
							}

							elTimeTo.val(offset);
						}
					}
		        },
			});
		})(module, app, Bb, Mn, $, _, Form);
		/**
		 * Поля ввода для цены
		 *
		 * @param {Marionette.Module} module
		 * @param {Marionette.Application} app
		 * @param {Backbone} Bb
		 * @param {Marionette} Mn
		 * @param {jQuery} $
		 * @param {_} _
		 * @param {Object} Form
		 */
		(function (module, app, Bb, Mn, $, _, Form)
		{
			var ControlsetFocusBehavior = Mn.Behavior.extend({
				defaults: {
					classNameFocused: 'i_focused',
					classNameControlFocused: 'i__control_focused',
				},

				ui: {
					'control': '.i__control',
					'controlset': '.i'
				},

				events: {
					'focusin @ui.control': 'onFocusIn',
					'focusout @ui.control': 'onFocusOut'
				},

				onFocusIn: function (e) {
					this.renderHasFocus($(e.currentTarget), true);
				},

				onFocusOut: function (e) {
					this.renderHasFocus($(e.currentTarget), false);
				},

				renderHasFocus: function ($target, hasFocus) {
					$target.toggleClass(this.getOption('classNameControlFocused'), hasFocus);
					this.ui.controlset.toggleClass(this.getOption('classNameFocused'), hasFocus);
				}
			});

			Form.PriceView = Mn.ItemView.extend({
				ui: {
					inputPrice: '.i__price'
				},

				behaviors: {
					'controlFocus': {
						behaviorClass: ControlsetFocusBehavior
					},
					'inputReset': {
						behaviorClass: Form.InputResetBehavior
					}
				},

				events: {
					'input @ui.inputPrice' : 'onInput'
				},

				onInput: function (e) {
					var el, input, text;

					el = $(e.target);
					input = el.val();
					text = input.replace(/\D/ig,'');

					el.val(text);
				},

				onInputReset: function () {
					this.triggerMethod('filter:reset');
				}

			});
		})(module, app, Bb, Mn, $, _, Form);
		/**
		 * Набор radio-переключателей с возможностью "отжать" по клику
		 * Пока не поднимает событие filter:change за ненадобностью
		 *
		 * @param {Marionette.Module} module
		 * @param {Marionette.Application} app
		 * @param {Backbone} Bb
		 * @param {Marionette} Mn
		 * @param {jQuery} $
		 * @param {_} _
		 * @param {Object} Form
		 */
		(function (module, app, Bb, Mn, $, _, Form)
		{
			var ControlsetFocusBehavior = Mn.Behavior.extend({
				defaults: {
					classNameFocused: 'i_focused',
					classNameControlFocused: 'i__control_focused',
				},

				ui: {
					'control': '.i__control',
					'controlset': '.i',
				},

				events: {
					'focusin @ui.control': 'onFocusIn',
					'focusout @ui.control': 'onFocusOut',
				},

				onFocusIn: function (e) {
					this.renderHasFocus($(e.currentTarget), true);
				},

				onFocusOut: function (e) {
					this.renderHasFocus($(e.currentTarget), false);
				},

				renderHasFocus: function ($target, hasFocus) {
					$target.toggleClass(this.getOption('classNameControlFocused'), hasFocus);
					this.ui.controlset.toggleClass(this.getOption('classNameFocused'), hasFocus);
				},
			});

			Form.RadiosetView = Mn.ItemView.extend({
				classNameControlChecked: 'i__control_checked',

				ui: {
					'control': '.i__control',
					'radio': '.i__radio',
				},

				events: {
					'click @ui.radio': 'onRadioClick'
				},

				behaviors: {
					'controlFocus': {
						behaviorClass: ControlsetFocusBehavior,
					},
					'inputReset': {
						behaviorClass: Form.InputResetBehavior.extend({
							ui: {
								'input': '.i__radio',
							}
						}),
					},
				},

				onInputReset: function () {
					var $radioCheckedDefault = this.ui.radio.filter('[checked]'); // В :checked еще текущее значение

					if ($radioCheckedDefault.length)
						$radioCheckedDefault.prop('checked', true); // radio автоматом отожмет у остальных
					else
						this.ui.radio.prop('checked', false);

					this.renderChecked();
				},

				onRadioClick: function (e) {
					// По умолчанию checked для radio всегда true по click и change
					// Отмена выбора щелчком по уже выбранному элементу
					if ($(e.target).closest(this.ui.control).hasClass(this.getOption('classNameControlChecked')))
						e.target.checked = false;

					this.renderChecked();
				},

				onRender: function () {
					this.renderChecked();
				},

				renderChecked: function () {
					var view = this;
					this.ui.radio.each(function () {
						var $control = $(this).closest(view.ui.control);

						$control.toggleClass(view.classNameControlChecked, this.checked);
					});
				}
			});
		})(module, app, Bb, Mn, $, _, Form);
		/**
		 * Элемент формы - выпадающий список, стремящийся к select
		 *
		 * @exports Form.SelectView({ // Выпадающий список с одиночным выбором
		 *		items: Array({id: Number, name: String}), // Элементы списка
		 *		regions: {dropdown: String}, // Регион выпадающего списка
		 * })
		 *
		 * @exports Form.SelectMultipleView({ // Выпадающий список с множественным выбором
		 *		items: Array({id: Number, name: String}) // Элементы списка
		 *		itemPlurals: String, // [optional] Отображаемое значение при выборе нескольких элементов. По умолчанию: 'Выбран {n}|Выбрано {n}|Выбрано {n}'
		 *		itemName: String, // [optional] На это значение заменяется шаблон {name} в itemPlurals. По умолчанию: null
		 *		regions: {dropdown: String}, // Регион выпадающего списка
		 * })
		 *
		 * @example Шаблон для списка с CSS-классами, используемыми этим компонентом:
		 *	<div class="dropdown-container">
		 *		<div class="input"><!-- скрытое поле, куда записывается название выбранного элемента -->
		 *			<input class="input__control"
		 *				placeholder="обычный placeholder"
		 *				data-focus-placeholder="placeholder в фокусе"
		 *			>
		 *			<a class="input__clear"></a><!-- Кнопка "Очистить поле" -->
		 *		</div>
		 *		<input class="js-field-value"><!-- скрытое поле, куда записывается selectedId -->
		 *		<div><!-- регион dropdown -->
		 *			<!-- JavaScript content -->
		 *		</div>
		 *	</div>
		 *
		 * @example Список, который рендерится компонентом в регионе dropdown:
		 *	<ul class="dropdown-list dropdown-list_autocomplete [dropdown-list_visible]">
		 *		<li class="dropdown-list__item dropdown-list__item_has-pseudo-icon [dropdown-list__item_selected] dropdown-list__link">
		 *			item.name без encode
		 *		</li>
		 *	</ul>
		 *
		 * @param {Marionette.Module} module
		 * @param {Marionette.Application} app
		 * @param {Backbone} Bb
		 * @param {Marionette} Mn
		 * @param {jQuery} $
		 * @param {_} _
		 * @param {Object} Form
		 */
		(function (module, app, Bb, Mn, $, _, Form)
		{
			var ReducerSelect = {
				STATE_INITIAL: {
					hasFocus: false,
					selected: null,
					items: [],
					itemFocused: -1,
					isListVisible: false,
					timeListToggle: 0,
					timeListToggleWait: 200,
				},

				actions: {
					blur: function () {
						return {type: 'BLUR'};
					},
					clear: function () {
						return {type: 'CLEAR'};
					},
					focus: function () {
						return {type: 'FOCUS'};
					},
					hide: function () {
						return {
							type: 'TOGGLE',
							isVisible: false,
						};
					},
					init: function (id) {
						return {
							type: 'INIT',
							id: id,
						};
					},
					itemFocus: function (index) {
						return {
							type: 'ITEM_FOCUS',
							index: index,
						};
					},
					save: function () {
						return {type: 'SAVE'};
					},
					show: function () {
						return {
							type: 'TOGGLE',
							isVisible: true,
						};
					},
					toggle: function () {
						return {
							type: 'TOGGLE_THROTTLED',
							time: Date.now(),
						};
					},
				},

				reducer: function (state, action) {
					if (!state)
						state = _.clone(this.STATE_INITIAL);
					if (!action)
						return state;

					switch (action.type) {
						case 'BLUR':
							return this.reduceBlur(state);
						case 'CLEAR':
							return this.reduceClear(state);
						case 'FOCUS':
							return this.reduceFocus(state);
						case 'INIT':
							return this.reduceSetSelected(state, action.id);
						case 'ITEM_FOCUS':
							return this.reduceItemFocus(state, action.index);
						case 'SAVE':
							return this.reduceItemSelect(state, state.itemFocused);
						case 'TOGGLE':
							return this.reduceListToggle(state, action.isVisible);
						case 'TOGGLE_THROTTLED':
							return this.reduceListToggleThrottled(state, action.time);
						default:
							return state;
					}
				},

				reduceBlur: function (state) {
					state.hasFocus = false;
					state = this.reduceListToggle(state, false);
					return state;
				},

				reduceClear: function (state) {
					state = this.reduceSetSelected(state, []);
					state = this.reduceListToggle(state, false);

					return state;
				},

				reduceFocus: function (state) {
					if (!state.hasFocus)
						state = this.reduceListToggle(state, true);

					return state;
				},

				reduceListToggle: function (state, isListVisible) {
					state.isListVisible = !!isListVisible;
					state.timeListToggle = Date.now();

					if (state.isListVisible)
						state.hasFocus = true;
					else
						state.itemFocused = -1;

					return state;
				},

				reduceListToggleThrottled: function (state, time) {
					if (state.timeListToggle + state.timeListToggleWait < time) {
						state = this.reduceListToggle(state, !state.isListVisible);
					}

					return state;
				},

				reduceItemFocus: function (state, index) {
					var itemFocused = -1;

					if (state.items && state.items.length) {
						if (!state.isListVisible)
							state = this.reduceListToggle(state, true);

						if (index < 0)
							index = 0;
						else if (state.items.length - 1 < index)
							index = state.items.length - 1;

						itemFocused = index;
					}

					state.itemFocused = itemFocused;
					return state;
				},

				reduceItemSelect: function (state, itemIndex) {
					var itemSelected = state.items[itemIndex];

					if (itemSelected) {
						state.selected = (state.selected !== itemSelected.id)
							? itemSelected.id
							: null;
					}

					state = this.reduceListToggle(state, false);
					return state;
				},

				reduceSetSelected: function (state, id) {
					state.selected = +id || null;

					return state;
				},
			};

			var ReducerSelectMultiple = _.extend({}, ReducerSelect, {
				STATE_INITIAL: _.extend({}, ReducerSelect.STATE_INITIAL, {
					selected: [],
				}),

				reduceItemSelect: function (state, itemIndex) {
					var itemSelected = state.items[itemIndex],
						selectedIds,
						selectedIdIndex;

					if (itemSelected) {
						selectedIds = state.selected.slice(); // Чтобы был change на массиве
						selectedIdIndex = selectedIds.indexOf(itemSelected.id);
						if (selectedIdIndex === -1)
							selectedIds.push(itemSelected.id);
						else
							selectedIds.splice(selectedIdIndex, 1);

						state.selected = selectedIds;
					}

					state = this.reduceListToggle(state, false);
					return state;
				},

				reduceSetSelected: function (state, ids) {
					state.selected = ids.map(function (id) {
						return +id;
					}).filter(function (id) {
						return id;
					});

					return state;
				},
			});

			var DropdownItemSelectableBehavior = Mn.Behavior.extend({
				defaults: {
					classNameSelected: 'dropdown-list__item_selected',
				},

				modelEvents: {
					'change:isSelected': 'onChangeIsSelected',
				},

				onChangeIsSelected: function () {
					this.renderChecked();
				},

				onRender: function () {
					this.renderChecked();
				},

				renderChecked: function () {
					this.view.$el.toggleClass(this.getOption('classNameSelected'), !!this.view.model.get('isSelected'));
				},
			});

			var DropdownItemView = Form.BaseDropdownItemView.extend({
				className: 'dropdown-list__item dropdown-list__item_has-pseudo-icon dropdown-list__link',
				template: function (data) {
					return data.name;
				},

				behaviors: {
					'selectable': {
						behaviorClass: DropdownItemSelectableBehavior,
					},
				},
			});

			var DropdownView = Form.BaseDropdownView.extend({
				childView: DropdownItemView,

				modelEvents: _.extend({}, Form.BaseDropdownView.prototype.modelEvents, {
					'change:selected': 'onStateChangeSelected',
				}),

				onStateChangeSelected: function (model, selectedId) {
					this.toggleSelected(model.previous('selected'), false);
					this.toggleSelected(selectedId, true);
				},

				toggleSelected: function (id, isSelected) {
					var model = this.collection.get(id);
					if (model)
						model.set('isSelected', isSelected);
				}
			});

			var DropdownMultipleView = Form.BaseDropdownView.extend({
				childView: DropdownItemView,

				modelEvents: _.extend({}, Form.BaseDropdownView.prototype.modelEvents, {
					'change:selected': 'onStateChangeSelected',
				}),

				onStateChangeSelected: function (model, selectedIds) {
					var currentIds = selectedIds,
						previousIds = model.previous('selected');

					this.toggleSelected(_.difference(previousIds, currentIds), false);
					this.toggleSelected(_.difference(currentIds, previousIds), true);
				},

				toggleSelected: function (ids, isSelected) {
					ids.forEach(function (id) {
						var model = this.collection.get(id);
						if (model)
							model.set('isSelected', isSelected);
					}, this);
				}
			});

			var SelectStore = Form.BaseStoreModel.extend({
				actions: ReducerSelect.actions,
				reducer: _.bind(ReducerSelect.reducer, ReducerSelect),

				defaults: _.clone(ReducerSelect.STATE_INITIAL),
			});

			var SelectMultipleStore = Form.BaseStoreModel.extend({
				actions: ReducerSelectMultiple.actions,
				reducer: _.bind(ReducerSelectMultiple.reducer, ReducerSelectMultiple),

				defaults: _.clone(ReducerSelectMultiple.STATE_INITIAL),
			});

			Form.SelectView = Mn.LayoutView.extend({
				actions: null,
				DropdownView: DropdownView,
				Store: SelectStore,

				ui: {
					'inputContainer': '.input',
					'input': '.input__control',
					'inputClear': '.input__clear',
					'inputValue': '.js-field-value',
				},

				behaviors: {
					'inputClear': {
						behaviorClass: Form.InputClearBehavior,
					},
					'inputFocus': {
						behaviorClass: Form.InputFocusBehavior,
					},
					'inputFocusRestore': {
						behaviorClass: Form.InputFocusRestoreBehavior,
					},
					'inputMisclick': {
						behaviorClass: Form.InputMisclickBehavior,
					},
					'inputReset': {
						behaviorClass: Form.InputResetBehavior,
					},
				},

				events: {
					'change @ui.inputValue': 'onInputValueChange',
					'click @ui.inputContainer': 'onInputContainerClick',
					'keydown @ui.input': 'onInputKeydown',
				},

				modelEvents: {
					'change:isListVisible': 'onStateChangeIsListVisible',
					'change:selected': 'onStateChangeSelected',
				},

				initialize: function (options) {
					this.model = new this.Store({items: options.items});
					this.actions = this.model.actions;
				},

				initModelFromForm: function () {
					this.model.dispatch(this.actions.init(this.ui.inputValue.val()));
				},

				getItems: function () {
					return this.model.get('items');
				},

				onInputContainerClick: function (e) {
					if (!$(e.target).closest(this.ui.inputClear).length)
						this.model.dispatch(this.actions.toggle());
				},

				onInputClear: function () {
					this.model.dispatch([
						this.actions.clear(),
						this.actions.blur(),
					]);
				},

				onInputFocus: function () {
					this.model.dispatch(this.actions.focus());
				},

				onInputKeydown: function (e) {
					switch (e.keyCode) {
						case 8: // backspace
						case 46: // delete
							this.model.dispatch(this.actions.clear());
							break;
						case 9: // tab
							this.model.dispatch(this.actions.blur());
							return; // Чтобы фокус перешел на следующий control
						case 13: // enter
							this.model.dispatch(this.actions.save());
							break;
						case 27: // esc
							this.model.dispatch(this.actions.hide());
							break;
						case 32: // space
							this.model.dispatch(this.actions.show());
							break;
						case 33: // page up
							this.model.dispatch(this.actions.itemFocus(0));
							break;
						case 34: // page down
							this.model.dispatch(this.actions.itemFocus(this.getChildView('dropdown').isEmpty()
								? -1
								: this.getChildView('dropdown').children.length - 1)); // Редкая клавиша, поэтому незачем кешить getChildView
							break;
						case 38: // arrow up
							this.model.dispatch(this.actions.itemFocus(this.model.get('itemFocused') - 1));
							break;
						case 40: // arrow down
							this.model.dispatch(this.actions.itemFocus(this.model.get('itemFocused') + 1));
							break;
						default:
							return;
					}
					e.preventDefault();
				},

				onInputMisclick: function () {
					this.model.dispatch(this.actions.blur());
				},

				onInputReset: function () {
					// Пока не учитываем defaultValue, т.к.
					// 1. на hidden-поле не выполняется reset
					// 2. это не автокомплит, чтобы надо было уметь из label вычислять id
					// 3. нет ситуаций, когда поле предзаполняется в коде сервером
					this.model.dispatch(this.actions.clear());
				},

				onInputValueChange: function () {
					this.initModelFromForm();
				},

				onRender: function () {
					this.showChildView('dropdown', new this.DropdownView({
						model: this.model,
					}));
					this.initModelFromForm();
				},

				onStateChangeIsListVisible: function (model, isListVisible) {
					this.getChildView('dropdown').toggle(isListVisible);
				},

				onStateChangeSelected: function (model, selectedId) {
					var currentSelectedId = this.ui.inputValue.val(),
						item = _.findWhere(model.get('items'), {id: selectedId});

					this.renderInput(this.ui.input, item ? item.name : '');
					this.renderInput(this.ui.inputValue, selectedId);

					if (currentSelectedId != this.ui.inputValue.val())
						this.triggerMethod('filter:change', selectedId);
				},

				renderInput: function ($input, value) {
					if ($input.val() != value)
						$input.val(value).change();
				},
			});

			Form.SelectMultipleView = Form.SelectView.extend({
				itemPlurals: 'Выбран {n}|Выбрано {n}|Выбрано {n}',
				DropdownView: DropdownMultipleView,
				Store: SelectMultipleStore,

				initialize: function (options) {
					Form.SelectView.prototype.initialize.apply(this, arguments);

					this.mergeOptions(options, ['itemPlurals']);

					if (_.isArray(options.itemName) && options.itemName.length > 0) {
						let names = options.itemName,
							col = names.length,
							plurals = this.itemPlurals,
							i;
						for (i = 0; i < col; i++) {
							plurals = plurals.replace(/\{name\}/, names[i]);
						}
						this.itemPlurals = plurals;
					}

				},

				initModelFromForm: function () {
					this.model.dispatch(this.actions.init(this.ui.inputValue.val().split(',')));
				},

				onStateChangeSelected: function (model, selectedIds) {
					var currentSelectedIds = this.ui.inputValue.val();
					this.renderInput(this.ui.input, this.humanizeSelection(model.get('items'), selectedIds));
					this.renderInput(this.ui.inputValue, selectedIds.join(','));

					if (currentSelectedIds != this.ui.inputValue.val())
						this.triggerMethod('filter:change', selectedIds);
				},

				humanizeSelection: function (items, selectedIds) {
					var item;
					if (!selectedIds.length)
						return '';
					else if (selectedIds.length == 1 && (item = _.findWhere(items, {id: selectedIds[0]})))
						return item.name;
					else
						return this.pluralize(selectedIds.length, this.itemPlurals);
				},

				pluralize: function (num, plurals) {
					function detectPlural(a) {
						a = Math.abs(a);

						if (a % 10 == 1 && a % 100 != 11)
							return 0;

						if (a % 10 >= 2 && a % 10 <= 4 && (a % 100 < 10 || a % 100 >= 20))
							return 1;

						return 2;
					}

					if (_.isString(plurals)) plurals = plurals.split('|');

					return plurals[detectPlural(num)].replace('{n}', num);
				},
			});
		})(module, app, Bb, Mn, $, _, Form);
		/**
		 * Поля с автодополнением:
		 * - виды спорта и категорий
		 * - станции и линии метро
		 *
		 * @param {Marionette.Module} module
		 * @param {Marionette.Application} app
		 * @param {Backbone} Bb
		 * @param {Marionette} Mn
		 * @param {jQuery} $
		 * @param {_} _
		 * @param {Object} Form
		 */
		(function (module, app, Bb, Mn, $, _, Form)
		{
			var AutocompleteFieldView = Mn.LayoutView.extend({
				_isChangeSilent: false,
				actions: null,
				Store: Form.BaseAutocompleteStore,

				inputValue1Type: null, // sport, station
				inputValue2Type: null, // category, line

				ui: {
					'input': '.input__control',
					'inputClear': '.input__clear',
					'inputValue': '.js-field-value',
					'inputValue2': '.js-field-value2',
				},

				behaviors: {
					'inputClear': {
						behaviorClass: Form.InputClearBehavior,
					},
					'inputFocus': {
						behaviorClass: Form.InputFocusBehavior,
					},
					'inputFocusRestore': {
						behaviorClass: Form.InputFocusRestoreBehavior,
					},
					'inputMisclick': {
						behaviorClass: Form.InputMisclickBehavior,
					},
					'inputUnresetable': {
						behaviorClass: Form.InputUnresetableBehavior,
					},
		            'inputReset': {
					    behaviorClass: Form.InputResetBehavior
		            }
				},

				events: {
					'change @ui.input': 'onInputValueChange',
					'change @ui.inputValue': 'onInputValueChange',
					'change @ui.inputValue2': 'onInputValueChange',
					'input @ui.input': 'onInputText',
					'keydown @ui.input': 'onInputKeydown',
				},

				modelEvents: {
					'change:itemSelected': 'onStateChangeItemSelected',
					'change:isListVisible': 'onStateChangeIsListVisible',
					'change:queries': 'onStateChangeQueries',
					'change:userInput': 'onStateChangeUserInput',
					'change:userQuery': 'onStateChangeUserQuery',
				},

				regions: {
					dropdown: null,
				},

				initialize: function (options) {

					this.model = new this.Store(null, {
						urlFetch: options.urlFetch,
					});
					this.actions = this.model.actions;
				},

				initModelFromForm: function () {
					var id = this.ui.inputValue2.val(),
						itemType;

					if (id) {
						itemType = this.inputValue2Type;
					} else {
						id = this.ui.inputValue.val();
						if (id)
							itemType = this.inputValue1Type;
					}

					this.model.dispatch(this.actions.init(id, this.ui.input.val(), itemType));
				},

				onInputClear: function ($input) {
					this.model.dispatch([
						this.actions.input($input.val()),
						this.actions.save(),
						this.actions.focus(),
					]);
				},

				onInputMisclick: function (e) {
					this.model.dispatch(this.actions.blur());
				},

				onInputFocus: function () {
					this.model.dispatch(this.actions.focus());
				},

				onInputKeydown: function (e) {
					switch (e.keyCode) {
						case 9: // tab
							this.model.dispatch(this.actions.blur());
							return; // Чтобы фокус перешел на следующий control
						case 13: // enter
							this.model.dispatch(this.actions.save());
							this._isChangeSilent = true;
							if (!this.model.get('hasFocus'))
								this.ui.input.blur(); // Надо уводить фокус принудительно только при клавиатуре
							break;
						case 27: // esc
							this.model.dispatch(this.actions.reset());
							if (!this.model.get('hasFocus'))
								this.ui.input.blur(); // Надо уводить фокус принудительно только при клавиатуре
							break;
						case 33: // page up
							this.model.dispatch(this.actions.itemFocus(0));
							break;
						case 34: // page down
							this.model.dispatch(this.actions.itemFocus(this.getChildView('dropdown').isEmpty()
								? -1
								: this.getChildView('dropdown').children.length - 1)); // Редкая клавиша, поэтому незачем кешить getChildView
							break;
						case 38: // arrow up
							this.model.dispatch(this.actions.itemFocus(this.model.get('itemFocused') - 1));
							break;
						case 40: // arrow down
							this.model.dispatch(this.actions.itemFocus(this.model.get('itemFocused') + 1));
							break;
						default:
							return;
					}
					e.preventDefault();
				},

				onInputText: function (e) {
					var view = this;
					this._isChangeSilent = true;
					_.defer(function () {
						view.model.dispatch(view.actions.input(e.target.value));
					});
				},

				onInputValueChange: function () {
					if (!this._isChangeSilent)
						this.initModelFromForm();
					else
						this._isChangeSilent = false;
				},

				onRender: function () {
					this.showChildView('dropdown', new Form.BaseAutocompleteDropdownView({
						model: this.model,
					}));
					this.initModelFromForm();
				},

				onStateChangeItemSelected: function (model, item) {
					var currentValue1 = this.ui.inputValue.val(),
						currentValue2 = this.ui.inputValue2.val();

					this.renderItemSelected(item);

					if (
						currentValue1 != this.ui.inputValue.val()
						|| currentValue2 != this.ui.inputValue2.val()
					) {
						this.triggerMethod('filter:change', item);
					}
				},

				onStateChangeIsListVisible: function (model, isListVisible) {
					this.getChildView('dropdown').toggle(isListVisible);
				},

				onStateChangeQueries: function (model) {
		            this.getChildView('dropdown').collection.reset(model.get('items')); // Новый рендер списка
				},

				onStateChangeUserInput: function (model, userInput) {
		            this.renderUserInput(userInput);
				},

				onStateChangeUserQuery: function (model, userQuery) {
		            this.getChildView('dropdown').collection.reset(model.get('items')); // Новый рендер списка
				},

				renderItemSelected: function (item) {
					if (item) {
						if (item.type === this.inputValue2Type) { // Костыль для совмещенного списка спортов и категорий
							this.ui.inputValue.val(null);
							this.ui.inputValue2.val(item.id);
						} else {
							this.ui.inputValue.val(item.id);
							this.ui.inputValue2.val(null);
						}
					} else {
						this.ui.inputValue.val(null);
						this.ui.inputValue2.val(null);
					}
				},

				renderUserInput: function (userInput) {
					if (this.ui.input.val() != userInput) {
						this._isChangeSilent = true;
						this.ui.input.val(userInput).change();
					}
				},
			});

			/** Вид поля ввода ("вид спорта" для секций) */
			Form.FieldSportView = AutocompleteFieldView.extend({
				inputValue1Type: 'sport',
				inputValue2Type: 'category',

				onInputReset: function () {
					this.ui.inputValue.val('');
					this.ui.inputValue2.val('');
					this.ui.input.change();
					this.triggerMethod('filter:reset');
				}
			});

		})(module, app, Bb, Mn, $, _, Form);
		/**
		  Элемент формы - Множественный выбор

		/**
		 * @param {Marionette.Module} module
		 * @param {Marionette.Application} app
		 * @param {Backbone} Bb
		 * @param {Marionette} Mn
		 * @param {jQuery} $
		 * @param {_} _
		 * @param {Object} Form
		 */
		(function (module, app, Bb, Mn, $, _, Form)
		{
			var inputClearBehavior = Mn.Behavior.extend({
				defaults: {
					'classClearVisible': 'input__clear_visible',
				},

				ui: {
					'container': '.chosen_choices',
					'clear': '.input__clear',
					'input': '.input__control',
				},

				events: {
					'click @ui.clear': 'onClearClick'
				},

				modelEvents: {
					'change:selectedItems' : 'onChangeItems'
				},

				onBeforeDestroy: function () {
					var behavior = this;
					this.ui.input.each(function () {
						this.form.removeEventListener('reset', behavior.onInputText);
					});
				},

				onRender: function () {
					var behavior = this;
					this.renderClear(!!this.ui.input.val());
					this.ui.input.each(function () {
						this.form.removeEventListener('reset', behavior.onInputText);
						this.form.addEventListener('reset', behavior.onInputText);
					});
				},

				onClearClick: function () {
					this.view.triggerMethod('input:clear', this.ui.input);
				},

				onChangeItems: function () {
					if (this.view.model.get('selectedItems').length) {
						this.renderClear(true);
					} else {
						this.renderClear(false);
					}
				},

				renderClear: function (isVisible) {
					this.ui.clear.toggleClass(this.getOption('classClearVisible'), isVisible);
				}
			});

			var inputMisclickBehavior = Mn.Behavior.extend({
				listenEvents: null,
				targetClassName: 'search-choice_delete', //класс для цели, чтобы по клику не сбрасывался фокус

				modelEvents: {
					'change:hasFocus': 'onStateChangeHasFocus',
				},

				initialize: function () {
					// В идеале требуется слушать только click, но не всегда отправляется click, если сработал focus
					// IE11 при отлове focus некорректно обрабатывает click (неверный e.target, получается misclick, нельзя выбрать элемент из списка)
					this.listenEvents = this._isIE()
						? 'click'
						: 'click focusin';

					_.bindAll(this, 'onBodyClick');
				},

				onBeforeDestroy: function () {
					$(document.body).off(this.listenEvents, this.onBodyClick);
				},

				onBodyClick: function (e) {
					// Т.к. click по body, то он обрабатыватся последним после кликов на элементы компонента
					// Не удалось ловить blur, т.к. необходимо сначала обработать клик на элементы этого же компонента
					if ($(e.target).closest(this.view.$el).length
						|| $(e.target).hasClass(this.targetClassName)  //Класс выбранных элементов (так как при удалении потом не может найти родителя)
						|| $(e.target).hasClass('dropdown-list__item'))  //Класс элемента списка автоподстановки что бы при выборе не пропадал фокус
					{
						if (e.type != 'focusin') // Crutch Firefox Иначе рекурсия
							this.view.triggerMethod('input:focus:restore');
					} else {
						this.view.triggerMethod('input:misclick');
					}
				},

				onStateChangeHasFocus: function (model, hasFocus) {
					if (hasFocus) {
						$(document.body).on(this.listenEvents, this.onBodyClick);
						this.ui.choice.toggleClass('hidden', false);
					} else {
						$(document.body).off(this.listenEvents, this.onBodyClick);
						this.ui.choice.toggleClass('hidden', false);
					}
				},

				_isIE: function () {
					return !(window.ActiveXObject) && 'ActiveXObject' in window;
				}
			});

			var inputFocusBehavior = Mn.Behavior.extend({
				defaults: {
					'classNameFocused': 'input_focused',
				},

				ui: {
					'inputContainer': '.input',
					'input': '.input__control',
				},

				triggers: {
					'focus @ui.input': { // Crutch необходимо разрешить всплывание focusin см. InputMisclickBehavior
						event: 'input:focus',
						preventDefault: false,
						stopPropagation: false,
					}
				},

				modelEvents: {
					'change:hasFocus': 'onStateChangeHasFocus',
				},

				onStateChangeHasFocus: function (model, hasFocus) {
					this.renderFocus(hasFocus);
				},

				renderFocus: function (hasFocus) {
					this.ui.inputContainer.toggleClass(this.getOption('classNameFocused'), hasFocus);
					this.renderFocusPlaceholder(hasFocus);
					if (hasFocus && document.activeElement !== this.ui.input.get(0) && this.ui.input.is(':visible'))
						this.ui.input.focus();
					// blur произойдет автоматически. Если вызывать вручную - сбивается цикл фокуса в IE
				},

				renderFocusPlaceholder: function (hasFocus) {
					var placeholderOriginal = this.ui.input.data('focus-placeholder-original');
					if (hasFocus) {
						if (placeholderOriginal === void 0)
							this.ui.input.data('focus-placeholder-original', this.ui.input.attr('placeholder'));
						this.ui.input.attr('placeholder', this.ui.input.data('focus-placeholder'));
					} else {
						if (placeholderOriginal !== void 0)
							this.ui.input.attr('placeholder', placeholderOriginal);
					}
				}
			});

			//расширяем базовый класс
			var ReducerAutocomplete = _.extend(_.clone(Form.BaseReducerAutocomplete),
				{
					STATE_INITIAL: {
						hasFocus: false,
						userInput: '',
						userQuery: '',
						items: null,
						itemFocused: -1,
						isListVisible: false,
						queries: null,
						selectedItems: []
					},
					reduceSelect: function (state, item) {
						state.itemSelected = item ? item : [];
						state = this.reduceInput(state, '');
						state.userInput = state.userQuery;
						return state;
					},
					reduceFindItems: function (state) {
						state.isListVisible = this.canShowList(state);
						state.items = state.userQuery && state.queries
							? this.findItems(state,state.userQuery, state.queries, 5)
							: [];

						state = this.reduceItemFocus(state, 0);

						return state;
					},
					findItems: function (state,text, queries, resultLength) {
						var result = [],
							query, i, queryLength,
							search = new RegExp(this.tools.escapeRegExp(text), 'i'),
							relevance;

						for (i = 0, queryLength = queries.length; i < queryLength; i++) {
							query = queries[i];
							relevance = query.name.search(search);

							if (state.selectedItems.find(query)) {
								continue;
							}

							if (relevance > -1) {
								if (!result[relevance])
									result[relevance] = [];

								if (!resultLength || result[relevance].length < resultLength) // Если совпадений уже и так достаточно, экономим
									result[relevance].push(query);
							}
						}

						result = _.compact(_.flatten(result, true));
						if (resultLength)
							result = _.first(result, resultLength);

						return result;
					}
				});

			//так как Form.BaseAutocompleteStore использует Form.BaseReducerAutocomplete а,
			// мы его расширили, чтобы изменения в него вошли и его расширяем
			var AutocompleteStore = Form.BaseAutocompleteStore.extend({
				actions: ReducerAutocomplete.actions,
				reducer: _.bind(ReducerAutocomplete.reducer, ReducerAutocomplete),
				defaults: _.clone(ReducerAutocomplete.STATE_INITIAL),
			});

			Form.MultiSelectFieldView = Mn.LayoutView.extend({
				_isChangeSilent: false,
				actions: null,
				Store: AutocompleteStore,
				itemFullName: '',
				itemPluralsName: [],

				inputValue1Type: null, //station
				inputValue2Type: null, //line

				ui: {
					'input': '.input__control',
					'inputClear': '.input__clear',
					'inputValue': '.js-field-value',
					'inputValue2': '.js-field-value2',
					'choice' : '.chosen_choices_wrapper',
					'chosen_container': '.chosen_container'
				},

				behaviors: {

					'inputClear': {
						behaviorClass: inputClearBehavior
					},
					'inputFocus': {
						behaviorClass: inputFocusBehavior
					},
					'inputFocusRestore': {
						behaviorClass: Form.InputFocusRestoreBehavior
					},
					'inputMisclick': {
						behaviorClass: inputMisclickBehavior
					},
					'inputReset': {
						behaviorClass: Form.InputResetBehavior
					}
				},

				events: {
					'input @ui.input': 'onInputText',
					'keydown @ui.input': 'onInputKeydown',
					'click @ui.chosen_container': 'onClickChosenContainer',
					'filter:update': 'onFilterUpdate'
				},

				modelEvents: {
					'change:itemSelected': 'onStateChangeItemSelected',
					'change:isListVisible': 'onStateChangeIsListVisible',
					'change:queries': 'onStateChangeQueries',
					'change:userInput': 'onStateChangeUserInput',
					'change:userQuery': 'onStateChangeUserQuery',
					'change:selectedItems': 'onStateChangeSelectedItems'
				},

				childEvents: {
					'choiceItem:delete': 'onChoiceItemDelete'
				},

				regions: {
					dropdown: null,
					choice: null
				},

				initialize: function (options) {
					this.model = new this.Store(null, {
						urlFetch: options.urlFetch,
					});
					this.actions = this.model.actions;
				},

				pluralize: function (num, plurals) {
					function detectPlural(a) {
						a = Math.abs(a);

						if (a % 10 == 1 && a % 100 != 11)
							return 0;

						if (a % 10 >= 2 && a % 10 <= 4 && (a % 100 < 10 || a % 100 >= 20))
							return 1;

						return 2;
					}

					if (_.isString(plurals)) plurals = plurals.split('|');

					return plurals[detectPlural(num)];
				},

				reset: function () {
					this.model.set('selectedItems',[]);
					if (!this.model.get('hasFocus')) {
						this.ui.input.attr('placeholder', this.itemFullName);
					}
				},

				humanizeSelection: function (items) {
					var num = items.length,
						label = this.itemFullName;

					if (num > 0) {
						var plural;
						if (num == 1) {
							label = items[0].name;
						} else {
							plural = this.pluralize(num,this.itemPluralsName);
							label = num + ' ' + plural;
						}
					}

					this.ui.input.attr('placeholder', label);
				},

				onClickChosenContainer: function (e) {
					if (e.target !== this.ui.inputClear.get(0)) {
						this.ui.input.focus();
					}
				},

				onChoiceItemDelete: function (model, index) {
					var items = this.model.get('selectedItems').slice(0);
					items.splice(index, 1);
					this.model.set('selectedItems', items);
				},

				onInputClear: function ($input) {
					this.reset();
				},

				onInputMisclick: function (e) {
					this.model.dispatch(this.actions.blur());
					this.ui.choice.addClass('hidden');
					this.humanizeSelection(this.model.get('selectedItems'));
					this.model.dispatch(this.actions.input('')); //очишаем значение
				},

				onInputFocus: function (e) {
					this.model.dispatch(this.actions.focus());
				},

				onInputKeydown: function (e) {
					switch (e.keyCode) {
						case 9: // tab
							this.model.dispatch(this.actions.blur());
							return; // Чтобы фокус перешел на следующий control
						case 13: // enter
							this.model.dispatch(this.actions.save());
							this._isChangeSilent = true;
							break;
						case 27: // esc
							this.model.dispatch(this.actions.reset());
							break;
						case 33: // page up
							this.model.dispatch(this.actions.itemFocus(0));
							break;
						case 34: // page down
							this.model.dispatch(this.actions.itemFocus(this.getChildView('dropdown').isEmpty()
								? -1
								: this.getChildView('dropdown').children.length - 1)); // Редкая клавиша, поэтому незачем кешить getChildView
							break;
						case 38: // arrow up
							this.model.dispatch(this.actions.itemFocus(this.model.get('itemFocused') - 1));
							break;
						case 40: // arrow down
							this.model.dispatch(this.actions.itemFocus(this.model.get('itemFocused') + 1));
							break;
						default:
							return;
					}
					e.preventDefault();
				},

				onInputText: function (e) {
					var view = this;
					this._isChangeSilent = true;
					_.defer(function () {
						view.model.dispatch(view.actions.input(e.target.value));
					});
				},

				onRender: function () {
					this.showChildView('dropdown', new Form.BaseAutocompleteDropdownView({
						model: this.model
					}));

					this.showChildView('choice', new Form.MetroAutocompleteChoiceView({
						model: this.model
					}));
				},

				onStateChangeItemSelected: function (model, item) {
					//добавляем модель в список выбранных
					if (item.length !== 0) {
						var items = this.model.get('selectedItems').slice(0);
						items[items.length] = item;
						this.model.set('selectedItems', items);
						this.model.set('itemSelected',[],{silent: true}); //очищаем выбранное значение так, как в дальнейшем он не понадобится
					}
				},

				//пока только для выбора станций сделано
				onStateChangeSelectedItems: function (model, value) {
					var items = value.slice(0);
					this.renderItemsSelected(items);
					this.triggerMethod('filter:change', items);
				},

				onStateChangeIsListVisible: function (model, isListVisible) {
					this.getChildView('dropdown').toggle(isListVisible);
				},

				onStateChangeQueries: function (model) {
					this.getChildView('dropdown').collection.reset(model.get('items')); // Новый рендер списка
				},

				onStateChangeUserInput: function (model, userInput) {
					this.renderUserInput(userInput);
				},

				onStateChangeUserQuery: function (model, userQuery) {
					this.getChildView('dropdown').collection.reset(model.get('items')); // Новый рендер списка
				},

				//Пока все делается только для станций
				renderItemsSelected: function (items) {
					if (items) {
						this.ui.inputValue.val(items.reduce(function (input, item) {
							return input == '' ? + item.id : input + ',' + item.id;
						},''));

						this.getChildView('choice').collection.reset(items); // Новый рендер списка выбраных
					}
				},

				renderUserInput: function (userInput) {
					if (this.ui.input.val() != userInput) {
						this._isChangeSilent = true;
						this.ui.input.val(userInput).change();
					}
				},

				//Событие обновления фильтра
				onFilterUpdate: function (items) {
					this.model.set('selectedItems', items);
					this.humanizeSelection(items);
					this.ui.choice.toggleClass('hidden', true);
				}
			});
		})(module, app, Bb, Mn, $, _, Form);
		/**
		  Элемент формы - Множественный выбор ("Метро")
		 --------------------------------------

		 <div class="chosen_container input_theme_normal-primary input">
		   <?=BEM::svg('sprite', 'metro', ['class' => 'input__icon'])?>
		     <div class="chosen_choices_wrapper">
		        <ul class="chosen_choices"></ul>
		     </div>
		     <div class="search-field">
		        <input class="input__control input__control_placeholder_theme_text" name="metro_name" type="text" placeholder="Станции метро" data-focus-placeholder="Начните ввод станции метро" maxlength="255">
		     </div>
		     <input class="js-field-value" name="metro_station" type="hidden">
		     <input class="js-field-value2" name="metro_line" type="hidden">
		     <div class="js-field-metro__dropdown">
		     <!-- JavaScript content -->
		     </div>
		     <a class="input__clear multi-select__clear">
		        <?=BEM::svg('sprite', 'close', ['class' => 'multi-select__clear-icon'])?>
		     </a>
		 </div>
		 */



		/**
		 * @param {Marionette.Module} module
		 * @param {Marionette.Application} app
		 * @param {Backbone} Bb
		 * @param {Marionette} Mn
		 * @param {jQuery} $
		 * @param {_} _
		 * @param {Object} Form
		 */
		(function (module, app, Bb, Mn, $, _, Form)
		{
		    Form.FieldMetroView = Form.MultiSelectFieldView.extend({
		        inputValue1Type: 'station',
		        inputValue2Type: 'line',
		        itemPluralsName: ['станция', 'станции', 'станций'],
		        itemFullName: 'Станции метро',

		        ui: {
		            'input': '.input__control',
		            'inputClear': '.input__clear',
		            'inputValue': '.js-field-value',
		            'inputValue2': '.js-field-value2',
		            'choice' : '.chosen_choices_wrapper',
		            'chosen_container': '.chosen_container'
		        },

		        onInputReset: function () {
		            this.reset();
		        }
		    });
		})(module, app, Bb, Mn, $, _, Form);
		/**
		  Элемент формы - Множественный выбор ("Инвентарь")
		 */

		/**
		 * @param {Marionette.Module} module
		 * @param {Marionette.Application} app
		 * @param {Backbone} Bb
		 * @param {Marionette} Mn
		 * @param {jQuery} $
		 * @param {_} _
		 * @param {Object} Form
		 */
		(function (module, app, Bb, Mn, $, _, Form)
		{
		    Form.FieldInventoryView = Form.MultiSelectFieldView.extend({
		        inputValueType: 'inventory',
		        itemPluralsName: ['наименование инвентаря', 'наименования инвентаря', 'наименований инвентаря'],
		        itemFullName: 'Инвентарь',

		        ui: {
		            'input': '.input__control',
		            'inputClear': '.input__clear',
		            'inputValue': '.js-field-inventory-value',
		            'choice' : '.chosen_choices_wrapper',
		            'chosen_container': '.chosen_container'
		        },

		        onInputReset: function () {
		            this.reset();
		        }
		    });
		})(module, app, Bb, Mn, $, _, Form);
		/**
		 Элемент формы - горизонтальный календарь
		 */

		/**
		 * @param {Marionette.Module} module
		 * @param {Marionette.Application} app
		 * @param {Backbone} Bb
		 * @param {Marionette} Mn
		 * @param {jQuery} $
		 * @param {_} _
		 * @param {Object} Form
		 */
		(function (module, app, Bb, Mn, $, _, Form, moment)
		{
		    function getDaysByMonth(month) {
		        var daysInMonth = month.daysInMonth();
		        var yearAndMonth = month.format('YYYY-MM');
		        var days = [];
		        var isCurrent = yearAndMonth === moment().format('YYYY-MM');
		        var start = isCurrent ? +moment().format('D') : 1;

		        for (var i = start; i <= daysInMonth; i++) {
		            days.push(moment(yearAndMonth + '-' + (i < 10 ? '0' + i : i)));
		        }

		        return days;
		    }

		    Form.HorizontalCalView = Mn.ItemView.extend({
		        el: '.js-horizontal-calendar',
		        template: 'horizontalCal',
		        templateHelpers: module.templateHelpers,

		        ui: {
		            'calendar': '.horizontal-calendar',
		            'wrapper': '.horizontal-calendar__wrapper',
		            'controlRight': '.horizontal-calendar-control__wrapper_right',
		            'controlLeft': '.horizontal-calendar-control__wrapper_left',
		            'monthNames': '.horizontal-calendar-month__name',
		            'day': '.horizontal-calendar-day',
		            'input': 'input[name="calendar_date"]',
		        },

		        events: {
		            'click @ui.controlRight': 'onSlideRight',
		            'click @ui.controlLeft': 'onSlideLeft',
		            'click @ui.day': 'onSelectDay',
		        },

		        serializeData: function () {
		            var dayOffset = 0;
		            var months = Array
		                .apply(0, Array(3))
		                .map(function(_,i){
		                    var month = moment().add(i, 'M');
		                    return new Bb.Model({
		                        name: month.format('MMMM'),
		                        month: month.format('YYYY-MM'),
		                        offset: i,
		                        days: new Bb.Collection(getDaysByMonth(month).map(function (date) {
		                            return {
		                                date: date.format('YYYY-MM-DD'),
		                                dayNumber: date.format('D'),
		                                type: +date.format('e') === 5 || +date.format('e') === 6 ? 'weekend' : 'default',
		                                name: date.format('ddd'),
		                                offset: dayOffset++
		                            }
		                        }))
		                    });
		                });

		            return {
		                months: months
		            }
		        },

		        onSelectDay: function (event) {
		            var selectedClass = 'horizontal-calendar-day__wrapper_selected',
		                $this = $(event.currentTarget),
		                $wrapper = $this.find('.horizontal-calendar-day__wrapper'),
		                hasClass = $wrapper.hasClass(selectedClass);

		            $('.horizontal-calendar-day__wrapper').removeClass(selectedClass);

		            $wrapper.toggleClass(selectedClass, !hasClass);

		            this.ui.input.val(
		                $wrapper.hasClass(selectedClass)
		                ? $this.data('date')
		                : ''
		            )

		            this.onDateChange();
		        },

		        onDateChange: function ()
		        {
		            this.triggerMethod('filter:change', this.ui.input.val());
		            if (!this.ui.input.val()) {
		                this.triggerMethod('filter:reset');
		            }
		            this.selectDate(this.ui.input.val());
		        },

		        onSlideLeft: function () {
		            var wrapper = this.ui.wrapper,
		                context = this;

		            if (wrapper.is(':animated')) {
		                return;
		            }

		            var current = parseInt(wrapper.css('right')),
		                calendarWidth = context.ui.calendar.width()
		            wrapperWidth = wrapper.width()
		            moveStep = calendarWidth / 2
		            stepLimit = 0;

		            if (current <= stepLimit) {
		                return;
		            }

		            var isLastStep = current - moveStep <= stepLimit;
		            if (isLastStep) {
		                moveStep = current;
		            }

		            wrapper.animate({
		                right: '-=' + moveStep
		            }, 'fast', 'swing', context.updateLeftControl(isLastStep))
		        },

		        onSlideRight: function () {
		            var wrapper = this.ui.wrapper,
		                context = this;

		            if (wrapper.is(':animated')) {
		                return;
		            }

		            var current = parseInt(wrapper.css('right')),
		                calendarWidth = context.ui.calendar.width()
		                wrapperWidth = wrapper.width()
		                moveStep = calendarWidth / 2
		                stepLimit = (wrapperWidth - (calendarWidth / 2) - 300);
		            if (current >= stepLimit) {
		                return;
		            }

		            var isLastStep = current + moveStep >= stepLimit;
		            if (isLastStep) {
		                moveStep = stepLimit - current;
		            }

		            this.updateMonthNamePosition(false);

		            wrapper.animate({
		                right: '+=' + moveStep
		            }, 'fast', 'swing', context.updateRightControl(isLastStep))
		        },

		        updateLeftControl: function (isLastStep) {
		            if (isLastStep) {
		                this.ui.controlLeft.hide();
		                this.updateMonthNamePosition(true);
		            } else if (this.ui.controlRight.is(":hidden")) {
		                this.ui.controlRight.show();
		            }
		        },

		        updateRightControl: function (isLastStep) {
		            if (isLastStep) {
		                this.ui.controlRight.hide();
		            } else if (this.ui.controlLeft.is(":hidden")) {
		                this.ui.controlLeft.show();
		            }
		        },

		        updateMonthNamePosition: function (toLeft) {
		            var current = parseInt(this.ui.monthNames.css('left'));
		            if ((current === 0 && toLeft) || (current !== 0 && !toLeft)) return;

		            this.ui.monthNames.animate({
		                left: toLeft ? 0 : 45
		            }, 100, 'swing');
		        },

		        selectDate: function (date) {
		            var selectedClass = 'horizontal-calendar-day__wrapper_selected';
		            $('.horizontal-calendar-day__wrapper').removeClass(selectedClass);

		            var $day = $('.horizontal-calendar-day[data-date="' + date + '"]');
		            if ($day) {
		                var dayWidth = $day.width() + parseInt($day.css('marginRight')),
		                    dayOffset = $day.data('offset'),
		                    $month = $day.closest('.horizontal-calendar-month'),
		                    monthOffset = $month.data('offset'),
		                    monthPadding = parseInt($month.css('paddingRight')),
		                    calendarWidth = this.ui.calendar.width(),
		                    $wrapper = $day.find('.horizontal-calendar-day__wrapper'),
		                    haveToScroll = (dayOffset * dayWidth) > (calendarWidth / 2);

		                if (haveToScroll) {
		                    var scrollLength = ((dayOffset * dayWidth) + (monthOffset * monthPadding)),
		                        wrapper = this.ui.wrapper,
		                        context = this,
		                        calendarCenter = (calendarWidth / 2);

		                    if (scrollLength >= (wrapper.width() - calendarCenter)) {
		                        scrollLength -= calendarWidth - 100;
		                    } else {
		                        scrollLength -= calendarCenter;
		                    }

		                    wrapper.animate({
		                        right: scrollLength
		                    }, 'fast', 'swing');

		                    if (scrollLength) {
		                        this.updateMonthNamePosition(false);
		                        this.ui.controlLeft.show();
		                    }
		                }

		                $wrapper.toggleClass(selectedClass);
		            }
		        }
		    });
		})(module, app, Bb, Mn, $, _, Form, window.moment);
		/**
		 * Базовый фильтры формы
		 * Form запускает методы BaseFilter
		 *
		 * @param {Marionette.Module} module
		 * @param {Marionette.Application} app
		 * @param {Backbone} Bb
		 * @param {Marionette} Mn
		 * @param {jQuery} $
		 * @param {_} _
		 * @param {Object} Form
		 * @param {Moment} moment
		 */
		(function (module, app, Bb, Mn, $, _, Form, moment)
		{
			/**
			 * Базовый класс фильтра
			 * @triggers событие filter:change от View
			 */
				Form.BaseFilter = Mn.Object.extend({
				/**
				 * Форма
				 * Передается при инициализации фильтра
				 */
				$form: null,

				/**
				 * Хеш селекторов, которые инициализируются в контексте $form [optional]
				 * Зависит от реализации
				 */
				ui: null,

				/**
				 * Внутренняя структура данных фильтра
				 * Зависит от реализации
				 * Сохраняется в истории браузера
				 */
				data: null,

				/**
				 * Данные по умолчанию
				 */
				defaultData: null,
				/**
				 * Предыдущее значение фильтра (специально для яндкс метрики)
				 */
				prevData : null,

				/**
				 * Имя события для яндекс метрики
				 */
				ymEventName : '',

				/**
				 * Параметр запроса [optional]
				 * Необходимо задать, чтобы использовать базовую реализацию getQueryParams
				 */
				queryParam: null, // параметр запроса [optional] (можно задать, чтобы использовать базовую реализацию getQueryParams)

				/**
				 * Класс Mn.View [optional]
				 * Если указан, фильтр слушает событие filter:change и вызывает triggerMethod('filter:change')
				 */
				View: null, // класс Mn.View [optional]

				/**
				 * Опции для View [optional]
				 * Передаются при иницилизации фильтра
				 */
				viewSettings: {},

				/**
				 * Экземпляр View [optional]
				 * Создается при initialize фильтра
				 */
				view: null,

				initialize: function (options) {
					this.mergeOptions(options, [
						'$form',
						'ui',
						'data',
						'queryParam',
						'View',
						'viewSettings'
					]);

					this.$form = $(this.$form);

					if (this.View)
						this.view = (new this.View(this.viewSettings)).render();

					this.ui = _.mapObject(this.ui, function ($selector) {
						return this.$form.find($selector);
					}, this);

					if (this.view) {
						this.listenTo(this.view, 'filter:change', this.onViewFilterChange);
						//добавляем данное событие что бы при очистке фильтра не вызывать событие change
						//так, как фильтры sport слушают это событие и по нему выполняют submit, а форма поиска
						//слушает событие reset и по нему выполняет submit. Врезультате сабмит вызывается 2 раза при очистке всез фильтров
						this.listenTo(this.view, 'filter:reset', this.onViewFilterReset);
					}

					//устанавливаем значения по умолчанию если передаются
					if (options.viewSettings.default) {
						this.defaultData = options.viewSettings.default;
						if (typeof this.defaultData === 'object') { //если обьект то правильно копируем
							this.data = this.objCopy(this.defaultData);
						} else {
							this.data = this.defaultData;
						}
					}
				},

				//функция для копирования обьектов
				objCopy: function (obj) {
					var data  = JSON.stringify(obj);
					return JSON.parse(data);
				},

				onViewFilterChange: function (value) {
					this.triggerMethod('filter:change', value);
				},
				onViewFilterReset: function (value) {
					this.triggerMethod('filter:reset', value);
				},

				/**
				 * Очищает фильтр
				 * @param {mixed} value [optional] Значение фильтра, которое надо стереть. По умолчанию: undefined (стереть всё)
				 */
				clear: function (value) {},

				/**
				 * Возвращает структуру данных фильтра
				 * @returns {Object}
				 */
				getRawData: function () {
					return this.data;
				},

				/**
				 * Устанавливает структуру данных фильтра
				 */
				setRawData: function (data) {
					this.data = data;
				},

				/**
				 * Возвращает теги текущих фильтров
				 * @returns {Array: {label: String, [value: mixed]}} Один фильтр может создать несколько тегов
				 */
				getTags: function () {
					return [];
				},

				/**
				 * Возвращает параметры для запроса на сервер
				 * @returns {Object}
				 */
				getQueryParams: function () {
					var query = {};
					if (this.queryParam && !_.isEmpty(this.data))
						query[this.queryParam] = this.data;

					return query;
				},

				/**
				 * Устанавливает данные фильтра из параметров запроса
				 * @param {Object} request Все параметры запроса
				 */
				setFromQueryParams: function (request) {},

				/**
				 * Устанавливает данные фильтра из связанных полей формы
				 */
				setFromUserInput: function () {},

				/**
				 * Обновляет связанные поля формы данными фильтра
				 */
				updateUserInput: function () {},

				hasChangedData: function () {

					if (typeof this.data === 'object') {
						var col1 = Object.keys(this.data).length,
							col2  = Object.keys(this.prevData).length;

						if (col1 != col2) {
							return true;
						}

						if (typeof this.data[0] === 'object') {
							var	ident = [],
								i,j;

							for (i = 0; i < col1; i++) {
								for (j = 0; j < col2; j++) {
									if(_.isMatch(this.data[i], this.prevData[j])) {
										ident[i] = true; break;
									}

									if (j === col2-1) {
										return true;
									}
								}

							}

							return false;
						} else {
							return !_.isMatch(this.data, this.prevData);
						}

					} else {
						return this.data != this.prevData || (!this.prevData && this.data.length > 0);
					}
				},

				/**
				 * Передача события в яндекс метрику
				 */
				ymReachGoal: function () {
					app.commands.execute('ymReachGoal', this.ymEventName);
				},
			});

		})(module, app, Bb, Mn, $, _, Form, window.moment);

		/**
		 * Фильтры результатов поиска
		 * Каждый фильтр - элемент Form.Filters, расширяет Form.BaseFilter
		 * Form запускает методы Form.BaseFilter
		 *
		 * @param {Marionette.Module} module
		 * @param {Marionette.Application} app
		 * @param {Backbone} Bb
		 * @param {Marionette} Mn
		 * @param {jQuery} $
		 * @param {_} _
		 * @param {Object} Form
		 * @param {Moment} moment
		 */
		(function (module, app, Bb, Mn, $, _, Form, moment)
		{
			Form.Filters = Form.Filters || {};

			var ensureIdArray = function (idArray) {
				return idArray.map(function (id) {
						return +id;
					}).filter(function (id) {
						return id;
					});
			};

			var parseTimeOffsetInterval = function (timeInterval) {
				return timeInterval.split('-').map(function (time) {
						return TimeOffset.parse(time);
					});
			};

			var TimeOffset = function (offset) {
				this.offset = offset;

				if (offset < 0)
					throw new Error('Negative time offset specified');
			};
			TimeOffset.parse = function (time) {
				var info = _.object(['hours', 'minutes', 'seconds'], _.defaults(time.split(':'), [0, 0, 0]));
				return TimeOffset.createFromInfo(info);
			};
			TimeOffset.createFromInfo = function (props) {
				props = _.extend({
					hours: 0,
					minutes: 0,
					seconds: 0
				}, props);

				if (props.hours < 0 || props.hours > 24)
					throw new Error('Incorrect "hours" property');

				if (props.minutes < 0 || props.minutes > 59)
					throw new Error('Incorrect "minutes" property');

				if (props.seconds < 0 || props.seconds > 59)
					throw new Error('Incorrect "seconds" property');

				return new TimeOffset(props.hours * 3600 + props.minutes * 60 + props.seconds);
			};
			TimeOffset.prototype = {
				humanize: function (format) {
					if (!format) format = 'hh:mm';

					var pad = _.str.lpad;
					var info = this.getInfo();

					return format.replace(/\w+/g, function (match) {
						switch (match) {
							case 'hh': return pad(info.hours, 2, '0');
							case 'mm': return pad(info.minutes, 2, '0');
							case 'ss': return pad(info.seconds, 2, '0');
							case 'h': return info.hours;
							case 'm': return info.minutes;
							case 's': return info.seconds;
							default: return match;
						}
					});
				},

				getHours: function () {
					return Math.floor(this.offset / 3600);
				},

				getMinutes: function () {
					return Math.floor((this.offset % 3600) / 60);
				},

				getSeconds: function () {
					return Math.floor(this.offset % 60);
				},

				getInfo: function () {
					return {
						hours: this.getHours(),
						minutes: this.getMinutes(),
						seconds: this.getSeconds(),
					};
				},

				toString: function () {
					return this.humanize();
				},

				valueOf: function () {
					return this.offset;
				},
			};

			/**
			 * Фильтр "Дети/Взрослые"
			 */
			Form.Filters.age = Form.BaseFilter.extend({
				data: [],
				ymEventName: 'agechange',
				ui: {
					radio: 'input[name="age"]',
				},

				View: Form.RadiosetView.extend({
					el: '.js-field-age',
					template: false,
				}),

				clear: function () {
					this.data = [];
				},

				getTags: function () {
					var data = this.data,
						label;
					if (!data.length || (data[0] == 0 && data[1] == 100))
						return [];

					if (data[0] == 0 && data[1] == 17) {
						label = 'Для детей';
					} else if (data[0] == 18 && data[1] == 100) {
						label = 'Для взрослых';
					} else { // Костыль для старых url. Уйдет, когда появится признак "Для детей"
						label = 'Возраст '
							+ (data[0] ? 'от ' + data[0] + ' ' : '')
							+ (data[1] && data[1] < 100 ? 'до ' + data[1] : '');
						label = label.trim();
					}

					return [{label: label}];
				},

				getQueryParams: function () {
					if (!_.isEmpty(this.data) && (this.data[0] || this.data[1])) { // Пока для поиска обязательно диапазон
						return {
							'Search[age_from]': this.data[0] || 0,
							'Search[age_to]': this.data[1] || 100,
						};
					} else {
						return {};
					}
				},

				setFromQueryParams: function (request) {
					this.data = [];
					if (request['Search[age_from]'])
						this.data[0] = +request['Search[age_from]'];

					if (request['Search[age_to]'])
						this.data[1] = +request['Search[age_to]'];
				},

				setFromUserInput: function () {
					var $radioChecked = this.ui.radio.filter(':checked');
					this.prevData = this.data;
					this.data = $radioChecked.length
						? $radioChecked.val().split('-').map(function (age) {
								return +age;
							})
						: [];
					// Если изменено значение фильтра то отправляем событие в метрику
					if (this.hasChangedData()) {
						this.ymReachGoal();
					}
				},

				updateUserInput: function () {
					var ageFrom = this.data[0] || 0,
						ageTo = this.data[1] || 100,
						$radioFound = this.ui.radio.filter('[value="' + ageFrom + '-' + ageTo + '"]');

					if ($radioFound.length)
						$radioFound.prop('checked', true);
					else
						this.ui.radio.prop('checked', false);

					this.view.triggerMethod('render');
				},
			});

			/**
			 * Фильтр "Крыша"
			 */
			Form.Filters.roof = Form.BaseFilter.extend({
				data: [],
				ymEventName: 'roofchange',
				queryParam: 'Search[type_id]',

				ui: {
					radio: 'input[name="roof"]',
				},

				View: Form.RadiosetView.extend({
					el: '.js-field-roof',
					template: false,
				}),

				clear: function () {
					this.data = [];
				},

				getTags: function () {
					var data = this.data;
					if (!_.isArray(data)) {
						var label = null,
							data = +data;
						switch (data) {
							case 0: label = 'Открытая площадка'; break;
							case 1: label = 'Крытая площадка'; break;
						}
						if (!_.isNull(label)) {
							return [{label: label}];
						}
					}
					return [];
				},

				setFromQueryParams: function (request) {
					this.data = [];
					if (request['Search[type_id]'])
						this.data = +request['Search[type_id]'];
				},

				setFromUserInput: function () {
					var $radioChecked = this.ui.radio.filter(':checked');

					this.prevData = this.data;

					this.data = $radioChecked.length ? $radioChecked[0].value : [];

					// Если изменено значение фильтра то отправляем событие в метрику
					if (this.hasChangedData()) {
						this.ymReachGoal();
					}
				},

				updateUserInput: function () {
					var $radioFound = this.ui.radio.filter('[value="' + this.data + '"]');

					if ($radioFound.length)
						$radioFound.prop('checked', true);
					else
						this.ui.radio.prop('checked', false);

					this.view.triggerMethod('render');
				},
			});

			/**
			 * Фильтр "Округ"
			 */
			Form.Filters.district = Form.BaseFilter.extend({
				data: [],
				queryParam: 'Search[region_ids]',
				ymEventName: 'districtchange',

				ui: {
					input: 'input[name="district"]',
					inputLabel: '.js-field-district .input__control',
				},

				View: Form.SelectMultipleView.extend({
					el: '.js-field-district',
					template: false,
					regions: {
						dropdown: '.js-field-district__dropdown',
					},
					itemPlurals: 'Выбран {n} {name}|Выбрано {n} {name}|Выбрано {n} {name}',
				}),

				clear: function (value) {
					this.data = value
						? _.without(this.data, value) // Очистить 1 элемент
						: []; // Очистить все
				},

				getTags: function () {
					var items = this.view.getItems();

					if (this.data.length < 4) {
						return this.data.map(function (id) {
							var item = _.findWhere(items, {id: id});
							return item
								? {
									label: item.name,
									value: id,
								}
								: {value: id};
						});
					} else {
						return [{
							label: this.view.humanizeSelection(items, this.data)
								.replace(/(^Выбран\S?\s)/, '') // Ленивка см. itemPlurals для this.View выше
						}];
					}
				},

				setFromQueryParams: function (request) {
					if (_.isArray(request[this.queryParam]))
						this.data = ensureIdArray(request[this.queryParam]);
				},

				setFromUserInput: function () {
					this.prevData = this.data;
					this.data = ensureIdArray(this.ui.input.val().split(','));
					// Если изменено значение фильтра то отправляем событие в метрику
					if (this.hasChangedData()) {
						this.ymReachGoal();
					}
				},

				updateUserInput: function () {
					this.ui.input.val(this.data.join(',')).change();
				},
			});

			/**
			 * Фильтр "Уровень подготовки"
			 */
			Form.Filters.skill = Form.BaseFilter.extend({
				data: [],
				queryParam: 'Search[skill]',
				ymEventName: 'skillchange',

				ui: {
					input: 'input[name="skill"]',
					inputLabel: '.js-field-skill .input__control',
				},

				View: Form.SelectView.extend({
					el: '.js-field-skill',
					template: false,
					regions: {
						dropdown: '.js-field-skill__dropdown',
					},

					constructor: function (options) {
						options = {
							items: _.reduce(options, function (items, skillName, skillId) {
								items.push({
									id: +skillId,
									name: skillName,
								});
								return items;
							}, []),
						};

						Form.SelectView.prototype.constructor.apply(this, arguments);
					},
				}),

				clear: function () {
					this.data = [];
				},

				getTags: function () {
					var label = this.ui.inputLabel.val();
					if (!label)
						return [];
					else
						return [{label: label + ' уровень'}];
				},

				setFromQueryParams: function (request) {
					if (_.isArray(request[this.queryParam]))
						this.data = ensureIdArray(request[this.queryParam]);
				},

				setFromUserInput: function () {
					this.prevData = this.data;
					this.data = ensureIdArray(this.ui.input.val().split(','));
					// Если изменено значение фильтра то отправляем событие в метрику
					if (this.hasChangedData()) {
						this.ymReachGoal();
					}
				},

				updateUserInput: function () {
					this.ui.input.val(this.data.join(',')).change();
				},
			});

			/**
			 * Фильтр "Вид спорта"
			 */
			Form.Filters.sport = Form.BaseFilter.extend({
				_userQuery: null,
				data: [],
				ymEventName: 'sportchange',

				ui: {
					label: 'input[name="sport_name"]',
					value: 'input[name="sport"]',
					valueCategory: 'input[name="sport_ids"]', // crutch для одновременного поиска по видам спорта и категориям
				},

				View: Form.FieldSportView.extend({
					el: '.js-field-sport',
					template: false,
					regions: {
						dropdown: '.js-field-sport__dropdown',
					},
				}),

				onFilterChange: function (item) {
					this._userQuery = _.clone(item);
				},

				onFilterReset: function () {
					this._userQuery = [];
				},

				getQueryParams: function () {
					if (!this.data) return {};

					if (this.data.type === 'category') {
						return {
							'Search[sport_ids]': this.data.id,
							'sport': this.data.name,
						};
					} else if (this.data.type === 'sport') {
						return {
							'Search[sport_ids]': this.data.id,
							'sport': this.data.name,
						};
					} else {
						return {};
					}
				},

				setFromQueryParams: function (request) {
					if (request['Search[sport_ids]']) {
						this.data = {
							id: request['Search[sport_ids]'],
							name: request['sport'],
							type: 'category',
						};
					} else if (request['Search[sport_ids]']) {
						this.data = {
							id: request['Search[sport_ids]'],
							name: request['sport'],
							type: 'sport',
						};
					} else {
						this.data = [];
					}
				},

				setFromUserInput: function () {
					this.prevData = this.data;
					// Не доверяем пользовательскому вводу напрямую
					// Вместо этого берем очищенный ввод от автокомплита
					this.data = this._userQuery;
					this.data = this.data ? this.data : []; //переопределяем пустое значении так как при очистке возвращает undefined
					// Если изменено значение фильтра то отправляем событие в метрику
					if (this.hasChangedData()) {
						this.ymReachGoal();
					}
				},

				updateUserInput: function () {
					this._userQuery = this.data;

					if (this.data && this.data.type === 'category') {
						this.ui.label.val(this.data.name);
						this.ui.value.val(null);
						this.ui.valueCategory.val(this.data.id);
					} else if (this.data && this.data.type === 'sport') {
						this.ui.label.val(this.data.name);
						this.ui.value.val(this.data.id);
						this.ui.valueCategory.val(null);
					} else {
						this.ui.label.val(null);
						this.ui.value.val(null);
						this.ui.valueCategory.val(null);
					}
					this.ui.label.change();
				},
			});

			/**
			 * Фильтр "Вид спорта" для площадок
			 */
			Form.Filters.sport_playground = Form.BaseFilter.extend({

				data: [],
				queryParam: 'Search[sport_ids]',
				ymEventName: 'playgroundsportchange',

				ui: {
					input: 'input[name="sport"]',
					inputLabel: '.js-field-sport .input__control',
				},

				View: Form.SelectMultipleView.extend({
					el: '.js-field-sport',
					template: false,
					regions: {
						dropdown: '.js-field-sport__dropdown',
					},
					itemPlurals: 'Выбран {n} вид спорта|Выбрано {n} вида спорта|Выбрано {n} видов спорта',

					onInputReset: function () {
						this.ui.inputValue.val('').change(); //ченже выполняем чтобы правильно сработал рендер
						this.triggerMethod('filter:reset');
					}
				}),

				clear: function (value) {
					this.data = value
						? _.without(this.data, value) // Очистить 1 элемент
						: []; // Очистить все
				},

				getTags: function () {
					var items = this.view.getItems();

					if (this.data.length < 4) {
						return this.data.map(function (id) {
							var item = _.findWhere(items, {id: id});
							return item
								? {
									label: item.name,
									value: id,
								}
								: {value: id};
						});
					} else {
						return [{
							label: this.view.humanizeSelection(items, this.data)
								.replace(/(^Выбран\S?\s)/, '') // Ленивка см. itemPlurals для this.View выше
						}];
					}
				},

				setFromQueryParams: function (request) {
					if (_.isArray(request[this.queryParam]))
						this.data = ensureIdArray(request[this.queryParam]);
				},

				setFromUserInput: function () {
					this.prevData = this.data;
					this.data = ensureIdArray(this.ui.input.val().split(','));
					// Если изменено значение фильтра то отправляем событие в метрику
					if (this.hasChangedData()) {
						this.ymReachGoal();
					}
				},

				updateUserInput: function () {
					this.ui.input.val(this.data.join(',')).change();
				},

				onFilterReset: function () {
					this.prevData = this.data;
					this.data = [];
					// Если изменено значение фильтра то отправляем событие в метрику
					if (this.hasChangedData()) {
						this.ymReachGoal();
					}
				}
			});

			Form.MultiSelectFilterDesktop = Form.BaseFilter.extend({
				onFilterChange: function (items) {
					this._userQuery = items.slice(0);
				},

				setFromUserInput: function () {

					this.prevData = this.data;

					if (this._userQuery) {
						this.data = this._userQuery.slice(0);
					}

					// Если изменено значение фильтра то отправляем событие в метрику
					if (this.hasChangedData()) {
						this.ymReachGoal();
					}
				},

				fillDataFromQueryParams: function (params)
				{
					var values = params,
						valuesLength = values.length;

					for (var i = 0; i < valuesLength; i++) {
						if (values[i][this.dataTypeName] == this.dataTypeValue) {
							this.data[this.data.length] = values[i];
						}
					}
				},

				getTags: function () {
					var data = this.data.slice(0),
						col = data.length,
						plural = this.view.itemPluralsName,
						tags = [];

					if (col > 0) {
						if (col < 4) {
							for (var i = 0; i < col; i++) {
								tags[i] = {label: data[i].name, value:data[i].id, color: data[i].color}
							}
						} else {
							tags = [{label: col + ' ' + this.view.pluralize(col,plural)}]
						}
					}
					return tags;
				},

				getQueryValues: function () {
					var dataNames = this.data.slice(0),
						dataLength = dataNames.length,
						values = '';

					for (var i = 0; i < dataLength; i++) {
						if (dataNames[i][this.dataTypeName] == this.dataTypeValue) {
							values += _.isEmpty(values) ? dataNames[i].id : ',' + dataNames[i].id;
						}
					}

					return values;
				},

				clear: function (value) {
					var data = this.data.slice(0); //копируем массив

					data = value
						? _.without(data, data.splice(_.findIndex(data, {id:value}),1)) // Очистить 1 элемент
						: []; // Очистить все

					this.data = data;
				},

				updateUserInput: function () {
					var data = this.data.slice(0);
					this._userQuery = data.slice(0);
					this.view.triggerMethod('filter:update', data);
				}
			});

			/**
			 * Фильтр "Станции метро"
			 */
			Form.Filters.metro = Form.MultiSelectFilterDesktop.extend({
				_userQuery: null,
				data: [],
				ymEventName: 'metrochange',
				dataTypeName: 'type',
				dataTypeValue: 'station',

				ui: {
					label: 'input[name="metro_name"]',
					value: 'input[name="metro_station"]',
					valueLine: 'input[name="metro_line"]'
				},

				View: Form.FieldMetroView.extend({
					el: '.js-field-metro',
					template: false,
					regions: {
						dropdown: '.js-field-metro__dropdown',
						choice: '.chosen_choices_wrapper'
					}
				}),

				getQueryParams: function () {
					if (!this.data) return {};
					var values = this.getQueryValues();
					return values ? {'Search[metro]': values} : {}
				},

				setFromQueryParams: function (request) {
					this.data = [];

					if (request['Search[metro]'] && request['metro']) {
						this.fillDataFromQueryParams(request['metro']);
					}
				}
			});

			/**
			 * Фильтр "Инвентарь"
			 */
			Form.Filters.inventory = Form.MultiSelectFilterDesktop.extend({
				_userQuery: null,
				data: [],
				ymEventName: 'inventorychange',
				dataTypeName: 'type',
				dataTypeValue: 'inventory',

				ui: {
					label: 'input[name="inventory_name"]',
					value: 'input[name="inventory"]'
				},

				View: Form.FieldInventoryView.extend({
					el: '.js-field-inventory',
					template: false,
					regions: {
						dropdown: '.js-field-inventory__dropdown',
						choice: '.chosen_choices_wrapper'
					}
				}),

				getQueryParams: function () {
					if (!this.data) return {};
					var values = this.getQueryValues();
					return values ? {'Search[inventory]': values} : {}
				},

				setFromQueryParams: function (request) {
					this.data = [];

					if (request['Search[inventory]'] && request['inventory']) {
						this.fillDataFromQueryParams(request['inventory']);
					}
				}
			});

		    /**
		     * Фильтр "Инфраструктура"
		     */
		    Form.Filters.infra = Form.BaseFilter.extend({
		        data: [],
				ymEventName: 'infrachange',
		        queryParam: 'Search[option]',

		        ui: {
		            input: 'input[name="infra"]',
		            inputLabel: '.js-field-infra .input__control',
		        },

		        View: Form.SelectMultipleView.extend({
		            el: '.js-field-infra',
		            template: false,
		            regions: {
		                dropdown: '.js-field-infra__dropdown',
		            },
		            itemPlurals: 'Выбрана {n} {name}|Выбрано {n} {name}|Выбрано {n} {name}',
		        }),

		        clear: function (value) {
		            this.data = value
		                ? _.without(this.data, value) // Очистить 1 элемент
		                : []; // Очистить все
		        },

		        getTags: function () {
		            var items = this.view.getItems();

		            if (this.data.length < 4) {
		                return this.data.map(function (id) {
		                    var item = _.findWhere(items, {id: id});
		                    return item
		                        ? {
		                            label: item.name,
		                            value: id,
		                        }
		                        : {value: id};
		                });
		            } else {
		                return [{
		                    label: this.view.humanizeSelection(items, this.data)
		                        .replace(/(^Выбран\S?\s)/, '') + ' инфраструктуры' // Ленивка см. itemPlurals для this.View выше
		                }];
		            }
		        },

		        setFromQueryParams: function (request) {
		            if (_.isArray(request[this.queryParam]))
		                this.data = ensureIdArray(request[this.queryParam]);
		        },

		        setFromUserInput: function () {
		        	this.prevData = this.data;
		            this.data = ensureIdArray(this.ui.input.val().split(','));
					// Если изменено значение фильтра то отправляем событие в метрику
					if (this.hasChangedData()) {
						this.ymReachGoal();
					}
		        },

		        updateUserInput: function () {
		            this.ui.input.val(this.data.join(',')).change();
		        },
		    });

		    /**
		     * Фильтр "Время занятия"
		     */
		    Form.Filters.time = Form.BaseFilter.extend({
		        data: [],
				ymEventName: 'timechange',
		        ui: {
					timeFrom: 'select[name="time_from"]',
					timeTo: 'select[name="time_to"]'
		        },

		        View: Form.TimeView.extend({
		            el: '.js-field-time',
		            template: false,
		        }),

				clear: function () {

					this.data = [];

					_.each(this.ui,function (el) {
						el.val(el.find(':disabled').val());
						el.css('color','#7b7b7b');
					});
				},

				getRawData: function () {
					if (!_.isEmpty(this.data)) {
						return this.data.map(function (timeOffset) {
							return timeOffset.valueOf();
						});
					}
					return [];
				},

				setRawData: function (data) {
					this.data = _.isArray(data)
						? data.map(function (offset) {
							return new TimeOffset(offset);
						})
						: [];
				},

				getQueryParams: function () {
					let timeFrom = this.data['time_from'];
					let timeTo = this.data['time_to'];
					let request = {};

					if (_.isEmpty(timeFrom) && !_.isEmpty(timeTo)
						|| !_.isEmpty(timeFrom) && _.isEmpty(timeTo)
						|| !_.isEmpty(timeFrom) && !_.isEmpty(timeTo))
					{
						request['Search[time_from]'] = timeFrom ? timeFrom : '00:00';
						request['Search[time_to]'] = timeTo ? timeTo : '24:00';
					}

					return request;
				},

				getTags: function () {
					let timeFrom = this.data['time_from'];
					let timeTo = this.data['time_to'];
					let labelTime;

					if (!_.isEmpty(timeFrom) || !_.isEmpty(timeTo))
					{
						if (timeTo && timeTo != '24:00') {
							timeTo = moment(timeTo, 'H:mm').format('H:mm');
						}
						labelTime = (timeFrom ? ' с ' + moment(timeFrom, 'H:mm').format('H:mm') : '') + (timeTo? ' до ' + timeTo : '');
					}

					if (_.isEmpty(labelTime)) {
						labelTime = 'любое время';
					}

					if (this.isDefaultValues()) {
						return [{label: labelTime, clearHide: true}];
					} else {
						return [{label: labelTime}];
					}
				},

				setFromQueryParams: function (request) {
					this.data = [];

					if (request['Search[time_from]'])
						this.data['time_from'] = request['Search[time_from]'];
					if (request['Search[time_to]'])
						this.data['time_to'] = request['Search[time_to]'];
				},

				setFromUserInput: function () {

					let timeFrom, timeTo;

					this.prevData = this.data;
					this.data = [];
					view = this.view;

					//Записываем все значения
					let val = _.map(this.ui, function (el) {
						return $(el).val() ? true : false;
					});

					//Если хотя бы одно значение не пустое
					if (val.find(true)) {
						timeFrom = this.ui.timeFrom.val();
						timeTo = this.ui.timeTo.val();
					}

					if (!_.isEmpty(timeFrom) || !_.isEmpty(timeTo)) {
						this.data['time_from'] = this.convertInTimeFormat(timeFrom);
						this.data['time_to'] = this.convertInTimeFormat(timeTo);
					}

					_.each(this.ui,function (el) {
						view.setWidthSelect(el);
					});

					// Если изменено значение фильтра то отправляем событие в метрику
					if (this.hasChangedData()) {
						this.ymReachGoal();
					}

				},

				updateUserInput: function () {
					let data = this.data;
					let ui = this.ui;
					let view = this.view;

					if (Object.keys(data).length) {
						let timeFrom, timeTo;

						if (data['time_from']) {
							timeFrom = data['time_from'].substr(0,2);
							timeFrom = timeFrom[0] == 0 ? timeFrom[1] : timeFrom;
							ui.timeFrom.val(timeFrom);
						}

						if (data['time_to']) {
							timeTo = data['time_to'].substr(0,2);
							timeTo = timeTo[0] == 0 ? timeTo[1] : timeTo;
							ui.timeTo.val(timeTo);
						}

						_.each(ui,function (el) {
							el.css('color','#464646');
						});

					} else {
						_.each(ui,function (el) {
							el.val(el.find(':disabled').val());
							el.css('color','#7b7b7b');
						});
					}

					//Подгоняем ширину элементов
					_.each(ui,function (el) {
						view.setWidthSelect(el);
					});

				},

				/**
				 * Преобразование значения времени в формат "00:00"
				 * @param val Значение
				 * @returns {string}
				 */
				convertInTimeFormat: function (val) {
					if (val) {
						return val < 10 ? '0'+val+':00' : val+':00'
					} else {
						return null;
					}
				},

				/**
				 * Проверка являются ли значения в обьекте значениями по умолчанию
				 */
				isDefaultValues: function () {
					return (!this.data['time_from']) && (!this.data['time_to']);
				}

		    });

		    /**
		     * Фильтр "Покрытие"
		     */
		    Form.Filters.cover = Form.BaseFilter.extend({
		        data: [],
				ymEventName: 'coverchange',
		        queryParam: 'Search[coating_ids]',

		        ui: {
		            input: 'input[name="cover"]',
		            inputLabel: '.js-field-cover .input__control',
		        },

		        View: Form.SelectMultipleView.extend({
		            el: '.js-field-cover',
		            template: false,
		            regions: {
		                dropdown: '.js-field-cover__dropdown',
		            },
		            itemPlurals: 'Выбран {n} {name}|Выбрано {n} {name}|Выбрано {n} {name}',
		        }),

		        clear: function (value) {
		            this.data = value
		                ? _.without(this.data, value) // Очистить 1 элемент
		                : []; // Очистить все
		        },

		        getTags: function () {
		            var items = this.view.getItems();

		            if (this.data.length < 4) {
		                return this.data.map(function (id) {
		                    var item = _.findWhere(items, {id: id});
		                    return item
		                        ? {
		                            label: item.name,
		                            value: id,
		                        }
		                        : {value: id};
		                });
		            } else {
		                return [{
		                    label: this.view.humanizeSelection(items, this.data)
		                        .replace(/(^Выбран\S?\s)/, '') // Ленивка см. itemPlurals для this.View выше
		                }];
		            }
		        },

		        setFromQueryParams: function (request) {
		            if (_.isArray(request[this.queryParam]))
		                this.data = ensureIdArray(request[this.queryParam]);
		        },

		        setFromUserInput: function () {
		        	this.prevData = this.data;
		            this.data = ensureIdArray(this.ui.input.val().split(','));
					// Если изменено значение фильтра то отправляем событие в метрику
					if (this.hasChangedData()) {
						this.ymReachGoal();
					}
		        },

		        updateUserInput: function () {
		            this.ui.input.val(this.data.join(',')).change();
		        },
		    });

		    /**
		     * Фильтр "Длительность бронирования 1,2,3"
		     */
		    Form.Filters.time_duration = Form.BaseFilter.extend({
		        data: [],
				ymEventName: 'hourscountchange',
		        queryParam: 'Search[time_duration]',

		        ui: {
		            radio: 'input[name="time-duration"]',
		        },

		        View: Form.TimeDuration.extend({
		            el: '.js-field-time-duration',
		            template: false,
		        }),

		        clear: function () {
		            this.data = [];
		        },

		        getTags: function () {
		            var data = this.data;
		            if (!_.isArray(data)) {
		                var label = null,
		                    data = +data;
		                switch (data) {
		                    case 1: label = '1 час'; break;
							case 1.5: label = '1 ч. 30 мин.'; break;
		                    case 2: label = '2 часа'; break;
		                    case 3: label = '3 часа'; break;
		                }
		                if (!_.isNull(label)) {
		                    return [{label: label}];
		                }
		            }
		            return [];
		        },

		        setFromQueryParams: function (request) {
		            this.data = [];
		            if (request['Search[time_duration]'])
		                this.data = +request['Search[time_duration]'];
		        },

		        setFromUserInput: function () {
		            var $radioChecked = this.ui.radio.filter(':checked');

		            this.prevData = this.data;

		            this.data = $radioChecked.length ? $radioChecked[0].value : [];

					// Если изменено значение фильтра то отправляем событие в метрику
					if (this.hasChangedData()) {
						this.ymReachGoal();
					}
		        },

		        updateUserInput: function () {
		            var $radioFound = this.ui.radio.filter('[value="' + this.data + '"]');

		            if ($radioFound.length)
		                $radioFound.prop('checked', true);
		            else
		                this.ui.radio.prop('checked', false);

		            this.view.triggerMethod('render');
		        },
		    });

		    /**
		     * Фильтр "Дата бронирования"
		     */
		   	Form.Filters.date = Form.BaseFilter.extend({
		        data: [],
				ymEventName: 'datechange',

		        ui: {
		            dateStart: 'input[name="date_start"]',
		            dateFinish: 'input[name="date_finish"]',
		        },

		        View: Form.DateView.extend({
		            el: '.js-field-date',
		            template: false,
		        }),

		        clear: function () {
		            this.data = this.objCopy(this.defaultData);
		            this.view.datepicker.reset();
		        },

		        getQueryParams: function () {
					let dateStart =  this.data['date_start'];
		            let dateFinish = this.data['date_finish'];
		            let request = {};
		            if (!_.isEmpty(dateStart) && !_.isEmpty(dateFinish)) {
		                request['Search[date_start]'] = dateStart;
		                request['Search[date_finish]'] = dateFinish;
		            }
		            return request;
		        },

		        getTags: function () {

					let dateStart =  this.data['date_start'];
		            let dateFinish = this.data['date_finish'];
		            let labelDate;
		            let formatDateStart ,formatDateFinish;

		            formatDateStart = formatDateFinish = '';

		            if (_.isEmpty(dateStart) && _.isEmpty(dateFinish)) {
						dateStart = this.options.viewSettings.date_start;
						dateFinish = this.options.viewSettings.date_finish;
					}

					if (moment(dateStart).format('DD') == moment(dateFinish).format('DD')) {
						formatDateStart = 'Do';
						formatDateFinish = '';
					} else {
						formatDateStart = 'Do';
						formatDateFinish = 'Do';
					}

					if (moment(dateStart).format('MM') != moment(dateFinish).format('MM')) {
						formatDateStart = 'Do MMMM';
						formatDateFinish = 'Do MMMM';
					} else {
						if (formatDateFinish) {
							formatDateFinish += ' MMMM';
						} else {
							formatDateStart += ' MMMM';
						}
					}

					if (moment(dateStart).format('YY') != moment(dateFinish).format('YY')) {
						formatDateStart = 'Do MMMM YY';
						formatDateFinish = ' Do MMMM YY';
					} else {
						if (moment(dateStart).format('YY') != moment().format('YY')) {
							formatDateFinish += ' YY';
						}
					}

					labelDate = 'c '+ moment(dateStart).format(formatDateStart) +' по '+ moment(dateFinish).format(formatDateFinish);

					if(moment(dateStart).format('DD') == moment(dateFinish).format('DD')
						&& moment(dateStart).format('MM') == moment(dateFinish).format('MM')
						&& moment(dateStart).format('YY') == moment(dateFinish).format('YY')) {
						labelDate = moment(dateStart).format(formatDateStart) +  (formatDateFinish ? moment(dateFinish).format(formatDateFinish) : '');
					}

		            if (this.isDefaultValues()) {
		                return [{label: labelDate, clearHide: true}];
		            } else {
		                return [{label: labelDate}];
		            }
		        },

		        setFromQueryParams: function (request) {
		            //this.data = [];
		            if (request['Search[date_start]'])
		                this.data['date_start'] = moment(request['Search[date_start]']).format('YYYY-MM-DD') === 'Invalid date' ? this.defaultData.date_start : request['Search[date_start]'];
		            if (request['Search[date_finish]'])
		                this.data['date_finish'] = moment(request['Search[date_finish]']).format('YYYY-MM-DD') === 'Invalid date' ? this.defaultData.date_finish : request['Search[date_finish]'];
		        },

		        setFromUserInput: function () {
					let dateStart, dateFinish;
		            this.prevData = this.objCopy(this.data);
					dateStart = this.ui.dateStart.val();
					dateFinish = this.ui.dateFinish.val();
		        	if (this.defaultData && !dateFinish && !dateStart) {
						dateStart = this.defaultData.date_start;
						dateFinish = this.defaultData.date_finish;
					}
					this.data['date_start'] = dateStart;
					this.data['date_finish'] = dateFinish;
					// Если изменено значение фильтра то отправляем событие в метрику
					if (this.hasChangedData()) {
						this.ymReachGoal();
					}
		        },

		        updateUserInput: function () {
					let data = this.data;
		            //если данные пустые
		        	if (Object.keys(data).length) {
						if (data['date_start']) {
							this.ui.dateStart.val(moment(data['date_start']).format('YYYY-MM-DD'));
						}

						if (data['date_finish']) {
							this.ui.dateFinish.val(moment(data['date_finish']).format('YYYY-MM-DD'));
						}
					} else {
						this.ui.dateStart.val(moment(this.options.viewSettings.date_start).format('YYYY-MM-DD'));
						this.ui.dateFinish.val(moment(this.options.viewSettings.date_finish).format('YYYY-MM-DD'));
					}
		        	this.view.refreshData();
		        },

		        /**
		         * Проверка являются ли значения в обьекте значениями по умолчанию
		         */
		        isDefaultValues: function () {
					let opt = this.options.viewSettings.default;
		            return (this.data['date_start'] == opt.date_start && this.data['date_finish'] == opt.date_finish)
						|| (!this.data['date_start'] && !this.data['date_finish']);
		        }
		    });

		    /**
		     * Фильтр "Цена бронирования"
		     */
		    Form.Filters.price = Form.BaseFilter.extend({
		        data: [],
				ymEventName: 'pricechange',
		        ui: {
		            priceFrom: 'input[name="price_from"]',
		            priceTo: 'input[name="price_to"]',
		        },

		        View: Form.PriceView.extend({
		            el: '.js-field-price',
		            template: false,
		        }),

		        clear: function () {
		            this.data = [];
		        },

		        getRawData: function () {
		            if (!_.isEmpty(this.data)) {
		                return this.data;
		            }
		            return [];
		        },

		        setRawData: function (data) {
		            this.data = _.isArray(data)
		                ? data : [];
		        },

		        getQueryParams: function () {
		            if (!_.isEmpty(this.data))
		            { // Пока для поиска обязательно диапазон
		                return {
		                    'Search[price_from]': this.data[0],
		                    'Search[price_to]': this.data[1],
		                };
		            } else {
		                return {};
		            }
		        },

		        getTags: function () {
		            var data = this.data;
		            if (!_.isEmpty(data)) {
		                var	labelFrom,
							labelTo,
							label;

		                	labelFrom = data[0] ? 'от ' + data[0] : '';
		                	labelTo = data[1] ? ' до ' + data[1] : '';
		                    label = labelFrom + labelTo + ' р.';
		                return [{label:label}];
		            }
		            return [];
		        },

		        setFromQueryParams: function (request) {
		            this.data = [];
		            if (request['Search[price_from]'])
		                this.data[0] = request['Search[price_from]'];
		            if (request['Search[price_to]'])
		                this.data[1] = request['Search[price_to]'];
		        },

		        setFromUserInput: function () {
		        	this.prevData = this.data;

		        	this.data = [];

		            let priceFrom = this.ui.priceFrom.val();
		            let priceTo = this.ui.priceTo.val();

		            if (!_.isEmpty(priceFrom)) {
		                this.data[0] = priceFrom;
		            }

		            if (!_.isEmpty(priceTo)) {
						this.data[1] = priceTo;
					}

		            if (_.isEmpty(priceFrom) && _.isEmpty(priceTo)) {
		            	this.data = [];
					}

					// Если изменено значение фильтра то отправляем событие в метрику
					if (this.hasChangedData()) {
						this.ymReachGoal();
					}
		        },

		        updateUserInput: function () {
		            let priceFrom = this.data[0];
		            let priceTo = this.data[1];

		            this.ui.priceFrom.val(priceFrom);
		            this.ui.priceTo.val(priceTo);
		        },
		    });

			/**
			 * Фильтр "Время занятия (период дня)"
			 */
			Form.Filters.time_period = Form.BaseFilter.extend({
				data: [],
				ymEventName: 'timeperiodchange',
				ui: {
					radio: 'input[name="time_period"]',
				},

				View: Form.RadiosetView.extend({
					el: '.js-field-time-period',
					template: false,
				}),

				clear: function () {
					this.data = [];
				},

				getTags: function () {
					var label, timeFrom, timeTo, $radioFound;

					timeFrom = this.data[0]
						? this.data[0].humanize()
						: '00:00',
						timeTo = this.data[1]
							? this.data[1].humanize()
							: '24:00',
						$radioFound = this.ui.radio.filter('[value="' + timeFrom + '-' + timeTo + '"]');

					if ($radioFound.length)
						label = $radioFound.closest('label').text();

					if (timeFrom == '00:00' && timeTo == '24:00')
						return [];
					else if (label)
						return [{label: label}];
					else
						return [{label: 'Время с ' + timeFrom + ' до ' + timeTo}];
				},

				getRawData: function () {
					return this.data.map(function (timeOffset) {
						return timeOffset.valueOf();
					});
				},

				setRawData: function (data) {
					this.data = _.isArray(data)
						? data.map(function (offset) {
							return new TimeOffset(offset);
						})
						: [];
				},

				getQueryParams: function () {
					if (
						!_.isEmpty(this.data)
						&& this.data[0] instanceof TimeOffset
						&& this.data[1] instanceof TimeOffset
					) { // Пока для поиска обязательно диапазон
						return {
							'Search[time_from]': this.data[0].humanize(),
							'Search[time_to]': this.data[1].humanize(),
						};
					} else {
						return {};
					}
				},

				setFromQueryParams: function (request) {
					this.data = [];
					if (request['Search[time_from]'])
						this.data[0] = TimeOffset.parse(request['Search[time_from]']);

					if (request['Search[time_to]'])
						this.data[1] = TimeOffset.parse(request['Search[time_to]']);
				},

				setFromUserInput: function () {
					var $radioChecked = this.ui.radio.filter(':checked');
					this.prevData = this.data;
					this.data = ($radioChecked.length)
						? parseTimeOffsetInterval($radioChecked.val())
						: [];
					// Если изменено значение фильтра то отправляем событие в метрику
					if (this.hasChangedData()) {
						this.ymReachGoal();
					}
				},

				updateUserInput: function () {
					var timeFrom = this.data[0]
						? this.data[0].humanize()
						: '00:00',
						timeTo = this.data[1]
							? this.data[1].humanize()
							: '24:00',
						$radioFound = this.ui.radio.filter('[value="' + timeFrom + '-' + timeTo + '"]');

					if ($radioFound.length)
						$radioFound.prop('checked', true);
					else
						this.ui.radio.prop('checked', false);

					this.view.triggerMethod('render');
				},
			});

			/**
			 * Фильтр по датам горизонтального календаря
			 */
			Form.Filters.calendar_date = Form.BaseFilter.extend({
				_userQuery: null,
				data: [],
				ui: {
					input: 'input[name="calendar_date"]',
				},

				View: Form.HorizontalCalView,

				getQueryParams: function () {
					if (!this.data) return {};

					return {
						"Search[calendar_date]": this.data
					};
				},

				setFromQueryParams: function (request) {
					this.data = [];
					if (request['Search[calendar_date]'])
						this.data = request['Search[calendar_date]'];
				},

				setFromUserInput: function () {
					var value = this.view.ui.input.val();
					this.prevData = this.data;
					this.data = value ? value : [];
				},

				updateUserInput: function () {
					this._userQuery = this.data;
					this.view.selectDate(this.data);
					this.view.ui.input.val(this.data);
				},

				clear: function () {
					this.data = [];
				},

				getTags: function () {
					return [];
				},
			});

		})(module, app, Bb, Mn, $, _, Form, window.moment);


		var FormExtraBehavior = Mn.Behavior.extend({
			defaults: {
				classNameOpened: 'object-search-form__extra_opened',
			},

			ui: {
				'extraButton': '.js-show-extra-form-button',
				'extraForm': '.object-search-form__extra',
			},

			events: {
				'click @ui.extraButton': 'onButtonClick',
			},

			onButtonClick: function () {
				this.ui.extraForm.toggleClass(this.getOption('classNameOpened'));
			},

			onFormExtraHide: function () {
				this.ui.extraForm.removeClass(this.getOption('classNameOpened'));
			},
		});

		Form.LayoutView = Mn.LayoutView.extend({
			template: false,

			fields: null,

			events: {
				'reset': 'onReset',
				'submit': 'onSubmit',
			},

			collectionEvents: {
				'remove': 'onFilterRemove',
			},

			behaviors: {
				'extraForm': {
					behaviorClass: FormExtraBehavior,
				},
			},

			initialize: function (options) {
				var sportUrl = options.sportUrl,
					metroUrl = options.metroUrl,
					inventoryUrl = options.inventoryUrl,
					fieldSettings = options.fieldSettings || {};

				this.collection = new Bb.Collection();

				if (options.fields) {
					this.fields = _.reduce(options.fields, function (fieldRegistry, filterName) {
						var Filter,
							opts;

						if ((Filter = Form.Filters[filterName])) {

							opts = {
								$form: this.$el,
								viewSettings: fieldSettings[filterName] || {},
							};
							if (filterName === 'sport') {
								opts.viewSettings.urlFetch = sportUrl;
							}
							if (filterName === 'metro') {
								opts.viewSettings.urlFetch = metroUrl;
							}
							if (filterName === 'inventory') {
								opts.viewSettings.urlFetch = inventoryUrl;
							}
							if (filterName === 'date') {
								if (options.datepicker) {
									opts.viewSettings.datepicker = options.datepicker;
								}
							}
							fieldRegistry[filterName] = new Filter(opts);
						}

						return fieldRegistry;
					}, {}, this);
				}

				this.update(options);

				this.refreshTags();

				if (this.fields.sport) {
					this.listenTo(this.fields.sport, 'filter:change', this.onSportChange);
				}
				if (this.fields.sport_playground) {
					this.listenTo(this.fields.sport_playground, 'filter:change', this.onPlaygroundSportChange);
				}
				if (this.fields.calendar_date) {
					this.listenTo(this.fields.calendar_date, 'filter:change', this.onCalendarDateChange);
				}
			},

			update: function (form) {
				if (!_.isEmpty(form.data)) {
					this.setData(form.data);
				}
				if (!_.isEmpty(form.rawData)) {
					this.setRawData(form.rawData);
				}
			},

			getData: function () {
				return _.reduce(this.fields, function (data, field) {
					_.extend(data, field.getQueryParams());
					return data;
				}, {});
			},

			setData: function (data) {
				_.each(this.fields, function (field) {
					field.setFromQueryParams(data);
					field.updateUserInput();
				});
			},

			getRawData: function () {
				return _.reduce(this.fields, function (data, field, name) {
					data[name] = field.getRawData();
					return data;
				}, {});
			},

			setRawData: function (data) {
				_.each(data, function (fieldData, name) {
					var field = this.fields[name];
					if (field) {
						field.setRawData(fieldData);
						field.updateUserInput();
					}
				}, this);
			},

			refreshTags: function () {
				this.collection.reset(this.getTags());
			},

			getTags: function () {
				return _.reduce(this.fields, function (tags, field, name) {
					var fieldTags = field.getTags().map(function (tag) {
						tag.filter = field;
						return tag;
					});
					tags.push.apply(tags, fieldTags);
					return tags;
				}, []);
			},

			onFilterRemove: function (model) {
				var filter = model.get('filter');

				if (!filter) return;

				filter.clear(model.get('value'));
				filter.updateUserInput();

				if (filter.ymEventName){
					filter.ymReachGoal();
				}

				this.triggerMethod('form:submit');
			},

			onPlaygroundSportChange: function () {
				this.fields.sport_playground.setFromUserInput();

				this.triggerMethod('form:submit');
			},

			onSportChange: function () {
				this.fields.sport.setFromUserInput();

				this.triggerMethod('form:submit');
			},

			onCalendarDateChange: function () {
				this.fields.calendar_date.setFromUserInput();

				this.triggerMethod('form:submit');
			},

			onSubmit: function (e) {
				e.preventDefault();

				_.each(this.fields, function (field) {
					field.setFromUserInput();
				});

				this.triggerMethod('form:submit');
				this.triggerMethod('form:extra:hide');
			},

			onReset: function (e) {
				var view = this;
				_.defer(function () { // Чтобы сначала отработали обработчики reset в фильтрах
					view.$el.submit();
				});
			}
		});

		var FilterTagView = Mn.ItemView.extend({
			template: 'filterTag',
			templateHelpers: module.templateHelpers,

			ui: {
				clear: '.object-search-filter-tag__clear'
			},

			triggers: {
				'click @ui.clear': {
					event: 'filter:clear',
					stopPropagation: false, // Чтобы событие всплыло и сработал отработчик Misclick на body см. InputMisclickBehavior
				},
			},
		});

		Form.FilterTagsView = Mn.CollectionView.extend({
			tagName: 'ul',
			className: 'object-search-filter-tag-list',

			childView: FilterTagView,
			childViewOptions: {
				tagName: 'li',
				className: 'object-search-filter-tag-list__item',
			},
			childEvents: {
				'filter:clear': 'onFilterClear'
			},

			emptyView: FilterTagView, // Нужно указать, чтобы сработали события render:empty и remove:empty

			onFilterClear: function (view) {
				this.collection.remove(view.model);
			},

			onRenderEmpty: function () {
				this.$el.hide();
			},

			onRemoveEmpty: function () {
				this.$el.show();
			}
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
		module.ResultsView = Mn.View.extend({
			update: function (html) {
				this.el.innerHTML = html;
				bem.support.externalSvg.fixChildren(this.el);
			},

			isEmpty: function () {
				return !!this.el.querySelector('.object-search-results-empty');
			},
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
		module.CommercialTopView = Mn.View.extend({
			update: function (html) {
				this.el.innerHTML = html;
				bem.support.externalSvg.fixChildren(this.el);
			},

			clear: function () {
				this.el.innerHTML = '';
			}
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
		module.CommercialBottomView = Mn.View.extend({
			update: function (html) {
				this.el.innerHTML = html;
				bem.support.externalSvg.fixChildren(this.el);
			},

	        clear: function () {
	            this.el.innerHTML = '';
	        }
		});
	})(module, app, Bb, Mn, $, _);
	/**
	 * @param {Marionette.Module} module
	 * @param {Marionette.Application} app
	 * @param {Backbone} Bb
	 * @param {Marionette} Mn
	 * @param {jQuery} $
	 * @param {_} _
	 * @param {ymaps}
	 */
	(function (module, app, Bb, Mn, $, _, ymaps)
	{
		module.MapView = Mn.View.extend({
			className: 'object-search-page__map',

			center: [0.0, 0.0],
			margin: [64, 32, 32, 32], // Отступы от краёв карты для учёта контролов и свёрнутого блока статьи [top, right, bottom left]
			zoom: 10,
			placemarks: [],

			balloonUrl: null,

			_map: null,

			update: function (options) {
				_.extend(this.options, options);

				if (this._map) // Карта может ещё не прогрузиться, в таком случае renderPlacemarks выполнится в ymaps.ready()
					this.renderPlacemarks();
			},

			render: function () {
				ymaps.ready(function () {
					this.el.innerHTML = '';
					this.renderMap();
					this.renderPlacemarks();
				}.bind(this));
			},

			renderMap: function () {
				if (this._map) {
					this._map.destroy();
					this._map = null;
				}

				this._map = new ymaps.Map(this.el, {
					center: this.getOption('center'),
					// margin: this.getOption('margin'), // crutch-map-margin Почему-то завышаются значения отступов для балунов
					zoom: this.getOption('zoom'),
					behaviors: ['default'],
					controls: [],
				});
				this._map.controls.add('zoomControl', {
					position: { left: 'auto', right: 10, top: 75 },
					size: 'large',
					zoomDuration: 100,
				});
			},

			renderPlacemarks: function () {
				var balloonUrl = this.getOption('balloonUrl');

				this._map.geoObjects.removeAll();
				/**
				 * Лэйаут балуна
				 * @link https://tech.yandex.ru/maps/jsbox/2.1/balloon_autopan
				 */
				var BalloonLayoutOverrides = {
					/**
					 * Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент.
					 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#build
					 * @function
					 * @name build
					 */
					build: function ()
					{
						this.constructor.superclass.build.call(this);

						this._$element = $('.object-search-card', this.getParentElement());
						this.applyElementOffset();
						this.fixSvg();
						this._$element.find('.object-search-card__close-button').on('click', $.proxy(this.onCloseClick, this));
					},

					/**
					 * Удаляет содержимое макета из DOM.
					 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#clear
					 * @function
					 * @name clear
					 */
					clear: function ()
					{
						this._$element.find('.object-search-card__close-button').off('click');

						this.constructor.superclass.clear.call(this);
					},

					/**
					 * Метод будет вызван системой шаблонов АПИ при изменении размеров вложенного макета.
					 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
					 * @function
					 * @name onSublayoutSizeChange
					 */
					onSublayoutSizeChange: function ()
					{
						this.constructor.superclass.onSublayoutSizeChange.apply(this, arguments);

						if(!this._isElement(this._$element)) {
							return;
						}

						this.applyElementOffset();

						this.events.fire('shapechange');
					},

					/**
					 * Сдвигаем балун, чтобы "хвостик" указывал на точку привязки.
					 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
					 * @function
					 * @name applyElementOffset
					 */
					applyElementOffset: function ()
					{
						this._$element.css({
							left: -(this._$element[0].offsetWidth / 2),
							top: -(this._$element[0].offsetHeight + this._$element.find('.object-search-card__arrow')[0].offsetHeight)
						});
					},

					/**
					 * Закрывает балун при клике на крестик, кидая событие "userclose" на макете.
					 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
					 * @function
					 * @name onCloseClick
					 */
					onCloseClick: function (e)
					{
						e.preventDefault();

						this.events.fire('userclose');
					},

					/**
					 * Используется для автопозиционирования (balloonAutoPan).
					 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ILayout.xml#getClientBounds
					 * @function
					 * @name getClientBounds
					 * @returns {Number[][]} Координаты левого верхнего и правого нижнего углов шаблона относительно точки привязки.
					 */
					getShape: function ()
					{
						if(!this._isElement(this._$element)) {
							return this.constructor.superclass.getShape.call(this);
						}

						var position = this._$element.position();

						return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
							[position.left, position.top], [
								position.left + this._$element[0].offsetWidth,
								position.top + this._$element[0].offsetHeight + this._$element.find('.object-search-card__arrow')[0].offsetHeight
							]
						]));
					},

					fixSvg: function ()
					{
						if (this._isElement(this._$element))
						{
							bem.support.externalSvg.fixChildren(this._$element[0]);
						}
					},

					_isElement: function (element)
					{
						return !!(element && element[0] && element.find('.object-search-card__arrow')[0]);
					}
				};

				/**
				 * Контент балуна
				 */
				var MyBalloonLayoutClass = ymaps
						.templateLayoutFactory
						.createClass(
							document.getElementById('ytpl-balloon-template').innerHTML,
							BalloonLayoutOverrides
						),
					MyBalloonClusterLayoutClass = ymaps
						.templateLayoutFactory
						.createClass(
							document
								.getElementById('ytpl-balloon-cluster-template').innerHTML,
							BalloonLayoutOverrides
						);

				/** Подключаем шаблоны для карты */
				/**
				 * Шаблоны для яндекс карт
				 */

				var findById = document.getElementById.bind(document);
				module.templates = {};

				module.templates.ymapBalloonContentLayout = ymaps
					.templateLayoutFactory.createClass(findById('ytpl-balloon-content').innerHTML);
				module.templates.ymapBalloonClusterContentLayout = ymaps
					.templateLayoutFactory.createClass(findById('ytpl-balloon-cluster-content').innerHTML);
				module.templates.ymapClusterLayout = ymaps.templateLayoutFactory.createClass(findById('ytpl-cluster').innerHTML);
				module.templates.ymapPlacemarkLayout = ymaps
					.templateLayoutFactory.createClass(findById('ytpl-placemark').innerHTML);
				/**
				 * Создание вида рекламируемой метри
				 * @param {number} zoomToggleView значение зума при котором происходит смена вида
				 * @returns {function}
				 */
				module.templates.createCommercialPlacemarkLayout = function (zoomToggleView) {
					var Template = ymaps.templateLayoutFactory.createClass(
						'<div class="-js-custom-placemark"></div>',
						{
							build: function () {
								Template.superclass.build.call(this);

								var map = this.getData().geoObject.getMap(),
									zoom = map.getZoom();

								if (!this.inited) {
									this.inited = true;
									// Подпишемся на событие изменения области просмотра карты.
									map.events.add('boundschange', function () {
										// Запустим перестраивание макета при изменении уровня зума.
										var currentZoom = map.getZoom();
										if (currentZoom != zoom) {
											zoom = currentZoom;
											this.rebuild();
										}

									}, this);
								}

								var options = this.getData().options,
									element = this.getParentElement().getElementsByClassName('-js-custom-placemark')[0],
									shape = null,
									template = null;

								if (zoom >= zoomToggleView) {
									var templateDataManager = new ymaps.data.Manager({
											properties: this.getData().properties.getAll()
										}),
										templateString = findById('ytpl-placemark-tag').innerHTML;

									template = new ymaps.Template(templateString).build(templateDataManager).text;
									shape = {
										type: 'Rectangle',
										coordinates: [
											[-13, 0],
											[216, 46]
										]
									};
								} else {
									template = findById('ytpl-placemark-commercial').innerHTML;
									shape = {
										type: 'Circle',
										coordinates: [13, 13],
										radius: 13
									};
								}
								options.set('shape', shape);
								element.innerHTML = template;
							}
						}
					);

					return Template;
				};

				module.templates.customCreateCluster = function (center, geoObjects) {
					var hasCommercial = false;
					for (var i = 0; i < geoObjects.length; i++) {
						if (geoObjects[i].properties.get('isCommercial') === true ) {
							hasCommercial = true;
							break;
						}
					}

					var clusterPlacemark = ymaps.Clusterer.prototype.createCluster.call(this, center, geoObjects);

					if (hasCommercial) {
						clusterPlacemark.properties.set('isCommercial', true);
					}

					return clusterPlacemark;
				};

				/**
				 * Получить настройки метки на карте в зависимости от состояния
				 * @param {Object} settings
				 * @returns {Object}
				 */
				var getClusterOptions = function(state)
				{
					if (state.create)
					{
						return {
							clusterIconLayout: module.templates.ymapClusterLayout,
							iconShape: {
								type: 'Circle',
								coordinates: [17, 17],
								radius: 17
							}
						};
					}
				};
				var getPointOptions = function(state)
				{
					if (state.create)
					{
						return {
							iconLayout: module.templates.ymapPlacemarkLayout,
							iconShape: {
								type: 'Circle',
								coordinates: [9, 9],
								radius: 9
							}
						};
					}
				};

				var items = this.getOption('placemarks');

				var idKey = 'objectId',
					pointOptions = $.extend({
							openEmptyBalloon: false,
							balloonAutoPanMargin: this.getOption('margin'), // crutch-map-margin По идее надо задавать на уровне карты, а не здесь, но почему-то завышаются значения
							balloonLayout: MyBalloonLayoutClass,
							balloonContentLayout: module.templates.ymapBalloonContentLayout,
							hasHint: false,
						},
						getPointOptions({create: 1})),
					clusterer = new ymaps.Clusterer($.extend({
								clusterHideIconOnBalloonOpen: true,
								geoObjectHideIconOnBalloonOpen: true,
								hasHint: false,
								clusterBalloonAutoPan: false, // Сами автопозиционируем балун в обработчике, чтобы не было рывков при загрузке контента
								clusterBalloonAutoPanMargin: this.getOption('margin'), // crutch-map-margin По идее надо задавать на уровне карты, а не здесь, но почему-то завышаются значения
								clusterBalloonLayout: MyBalloonClusterLayoutClass,
								clusterBalloonContentLayout: module.templates.ymapBalloonClusterContentLayout,
								clusterBalloonPanelMaxMapArea: 0, // Запретим замену обычного балуна на балун-панель
								clusterDisableClickZoom: true, // Сами отмасштабируем в обработчике
								clusterOpenBalloonOnClick: false, // Сами откроем балун в обработчике
								clusterNumbers: [10, 20, 100], // Число объектов в кластере, при которых меняется его размер
						},
						getClusterOptions({create: 1}))
					),
					clusterOpenBalloonMaxObjects = clusterer.options.get('clusterNumbers')[0]; // Если объектов в кластере меньше этого числа - то открываем балун, а не масштабируем карту

				clusterer.createCluster = module.templates.customCreateCluster;

				var commercialPlacemarks = [],
					placemarks = [];

				items.forEach(function (item)
				{	var properties = {
						placemarkId: parseInt(item[idKey])
				    };

					if (item['isCommercial'] === true) {
						properties.title = item.title;
						properties.rating = item.rating;
						properties.sports = item.sports;
						properties.isCommercial = item.isCommercial;
						pointOptions.iconLayout = module.templates.createCommercialPlacemarkLayout(13);
					} else {
						pointOptions.iconLayout = module.templates.ymapPlacemarkLayout;
					}

					var placemark = new ymaps.Placemark(
						item.center,
						properties,
						Object.assign({}, pointOptions)
					);

					if (item['isCommercial'] === true) {
						commercialPlacemarks.push(placemark);
					} else {
						placemarks.push(placemark);
					}
				});

				//для рандомного вывода рекламируемых площадок
				commercialPlacemarks.sort(function () {
					return Math.random() - 0.5;
				});

				clusterer.add(commercialPlacemarks.concat(placemarks));

				// Кластеризатор расширяет коллекцию, что позволяет использовать один обработчик
				// для обработки событий всех геообъектов.
				clusterer.events
					.add('balloonopen', function(e)
					{
						var target = e.get('target'), // Для кластера это Balloon, для отдельной геометки это Placemark
							cluster = e.get('cluster'),
							balloon = cluster ? target : target.balloon,
							balloonLayout = balloon.getOverlaySync().getBalloonLayoutSync(),
							requestPlacemarks = [],
							setAsideCommercial = false,
							requestIds = [],
							data,
							ensureRequestPlacemark = function (placemark)
							{
								var id;
								if (!placemark.properties.get('linkText')) // Информация еще не загружена
								{
									id = placemark.properties.get('placemarkId');
									requestPlacemarks[id] = placemark;
									requestIds.push(id);

									if (!setAsideCommercial) {
										setAsideCommercial = !!placemark.properties.get('isCommercial');
									}
								}
							};

						// Соберём ID объектов, по которым ещё не загружены данные
						if (cluster)
						{
							balloon.autoPan(); // Автопозиционируем сами, чтобы не было рывков при загрузке контента
							cluster.getGeoObjects().forEach(ensureRequestPlacemark);
						}
						else
						{
							ensureRequestPlacemark(target);
						}

						if (!requestIds.length) // Ничего нового загружать не надо
						{
							balloonLayout.fixSvg();
							return;
						}

						data = {ids: requestIds, setAsideCommercial: setAsideCommercial};

						$.ajax({
							type: "post",
							url: balloonUrl,
							data: data,
							dataType: "json",
							beforeSend: function ()
							{
								$('.preloader').addClass('preloader_visible');
							}
						})
						.done(function (data)
						{
							$('.preloader').removeClass('preloader_visible');
							data.forEach(function(dataItem)
							{
								if (requestPlacemarks[dataItem.placemarkId])
								{
									requestPlacemarks[dataItem.placemarkId].properties.set(dataItem);
								}
							});

							if (cluster)
							{
								balloonLayout.rebuild(); // Иначе не рендерит при переклике между кластерами
							}
							balloonLayout.fixSvg();
						});
					})
					.add('click', function(e)
					{
						var target = e.get('target'),
							map = target.getMap(),
							zoomRange;

						if (typeof target.getGeoObjects != 'undefined') // Событие произошло на кластере
						{
							// Разбираемся, открыть ли сразу балун кластера, или увеличить карту
							if (target.getGeoObjects().length <= clusterOpenBalloonMaxObjects)
							{
								clusterer.balloon.open(target);
							}
							else
							{
								zoomRange = map.zoomRange.getCurrent() || [-1, -1];
								if (zoomRange[1] <= map.getZoom())
								{
									// Увеличивать некуда
									clusterer.balloon.open(target);
								}
								else
								{
									// Масштабируем кластер
									map.setBounds(target.getBounds(), {
										checkZoomRange: true,
										zoomMargin: this.getOption('margin'),
										// useMapMargin: true, // crutch-map-margin Должно быть вместо zoomMargin, но почему-то завышает поля на балунах
									}).then(function()
									{
										// Масштабирование удалось)
									}, function(err)
									{
										// Не удалось показать заданный регион - объекты стремятся к одной точке
										clusterer.balloon.open(target);
									});
								}
							}
						}
					}, this);

				// Добавляем кластер на карту.
				this._map.geoObjects.add(clusterer);

				this._map.container.fitToViewport();

				// Выставляем масштаб карты чтобы были видны все группы.
				if (items.length > 1)
				{
					this._map.setBounds(this._map.geoObjects.getBounds(), {
						checkZoomRange: true,
						zoomMargin: this.getOption('margin'),
						// useMapMargin: true, // crutch-map-margin Должно быть вместо zoomMargin, но почему-то завышает поля на балунах
					});
				}
				else if (items.length == 1)
				{
					this._map.setCenter(items[0].center, 9, {duration: 1000});
				}
			},
		});
	})(module, app, Bb, Mn, $, _, ymaps);
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
		module.PaginationView = Mn.ItemView.extend({
			template: 'pagination',

			itemOffset: 0,
			itemCount: 0,
			pageSize: 0,
			pageCount: 0,
			currentPage: 0,

			buttonLimit: 7,

			templateHelpers: module.templateHelpers,

			events: {
				'click [data-page]': 'onPageClick',
			},

			update: function (options) {
				_.extend(this.options, options);
				this.render();
			},

			isEmpty: function () {
				return this.getOption('pageCount') < 2;
			},

			getTemplate: function () {
				if (this.isEmpty())
					return function () { return ''; };
				else
					return Mn.ItemView.prototype.getTemplate.apply(this, arguments);
			},

			serializeData: function () {
				if (this.isEmpty())
					return {};

				var pageSize = this.getOption('pageSize'),
					pageCount = this.getOption('pageCount'),

					currentPage = this.getOption('currentPage'),
					firstPage = 1,
					lastPage = pageCount,

					itemOffset = this.getOption('itemOffset'),
					itemCount = this.getOption('itemCount'),
					pageItemCount = Math.min(pageSize, itemCount - itemOffset),
					firstPageItem = itemOffset + 1,
					lastPageItem = itemOffset + pageItemCount;

				// Вычисление первой и последней кнопки
				var sideButtonLimit = Math.floor((this.getOption('buttonLimit') - 1) / 2),
					firstButton = currentPage - sideButtonLimit,
					lastButton = currentPage + sideButtonLimit;

				firstButton = Math.max(firstPage, firstButton);
				lastButton = Math.min(lastPage, lastButton);

				// Формирование списка кнопок
				var createPageButton = function (page) {
					return {
						type: 'link',
						label: page,
						page: page,
						isCurrent: page == currentPage,
					};
				};

				var items = _.range(firstButton, lastButton + 1).map(createPageButton);

				if (firstPage + 1 < firstButton) // Добавляем разделитель м\у 1ой страницей и 1ой кнопкой
					items.unshift({type: 'skip'});
				if (firstPage < firstButton) // Всегда показываем ссылку на 1ую страницу
					items.unshift(createPageButton(firstPage));

				// Краевые кнопки
				var prevButton = (firstPage < currentPage) ? currentPage - 1 : null,
					nextButton = (lastPage > currentPage) ? currentPage + 1 : null;

				// Данные для шаблона
				return {
					items: items,

					currentPage: currentPage,
					firstPage: firstPage,
					lastPage: lastPage,

					pageSize: pageSize,
					pageCount: pageCount,

					prevButton: prevButton,
					nextButton: nextButton,

					itemOffset: itemOffset,
					itemCount: itemCount,

					pageItemCount: pageItemCount,
					firstPageItem: firstPageItem,
					lastPageItem: lastPageItem,
				};
			},

			onPageClick: function (e) {
				e.preventDefault();
				this.trigger('page:select', +e.currentTarget.dataset.page);
			},
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
		module.StatusView = Mn.View.extend({
			update: function (pagination) {
				this.$('.object-search-status__item-count').text(pagination.itemCount);
			},
		});
	})(module, app, Bb, Mn, $, _);
	/**
	 * @param {Marionette.Module} module
	 * @param {Marionette.Application} app
	 * @param {Backbone} Bb
	 * @param {Marionette} Mn
	 * @param {jQuery} $
	 * @param {_} _
	 * @param {bem} Bem
	 */
	(function (module, app, Bb, Mn, $, _, bem)
	{
		var BasicView = Mn.ItemView.extend({
			template: false,

			visibleClassName: null,

			getContent: function () {
				return this.ui.content.html();
			},

			setContent: function (html) {
				this.ui.content.html(html);
				return this;
			},

			onRender: function () {
				bem.support.externalSvg.fixChildren(this.el);
			},

			show: function () {
				this.toggle(true);
			},

			hide: function () {
				this.toggle(false);
			},

			toggle: function (isVisible) {
				if (this.visibleClassName)
					this.$el.toggleClass(this.visibleClassName, !!isVisible);
				else
					this.$el.toggle(!!isVisible);
			},

			isVisible: function () {
				if (this.visibleClassName)
					return this.$el.hasClass(this.visibleClassName);
				else
					return this.$el.is(':visible');
			},
		});

		var ArticleHeadView = BasicView.extend({
			// className: 'object-search-article-trigger',
			visibleClassName: 'object-search-article-trigger_opened',

			ui: {
				'content': '.object-search-article-trigger__label',
			},

			triggers: {
				'click': {
					event: 'article:expand',
					stopPropagation: false, // Чтобы событие всплыло и сработал отработчик Misclick на body см. Form.InputMisclickBehavior
				},
			},
		});

		var ArticleBodyView = BasicView.extend({
			// className: 'object-search-article-modal',
			visibleClassName: 'object-search-article-modal_opened',
			_isContentUpdated: null,

			ui: {
				'content': '.object-search-article-modal__content',
				'close': '.object-search-article-modal__close-button',
				'sectionHeader': '.object-search-article__section_collapsible .object-search-article__section-header',
			},

			events: {
				'click @ui.sectionHeader': 'onSectionHeaderClick',
			},

			triggers: {
				'click @ui.close': {
					event: 'article:collapse',
					stopPropagation: false, // Чтобы событие всплыло и сработал отработчик Misclick на body см. Form.InputMisclickBehavior
				},
			},

			onSectionHeaderClick: function (e) {
				$(e.target).closest('.object-search-article__section_collapsible')
					.toggleClass('object-search-article__section_collapsed');
			},

			setContent: function (html) {
				this._isContentUpdated = true;
				return BasicView.prototype.setContent.apply(this, arguments);
			},

			onRender: function () {
				BasicView.prototype.onRender.apply(this, arguments);

				if (this.isScrollToReset())
					this.resetScroll();
			},

			show: function () {
				BasicView.prototype.show.apply(this, arguments);

				if (this.isScrollToReset())
					this.resetScroll();
			},

			toggle: function (isVisible) {
				BasicView.prototype.toggle.apply(this, arguments);

				if (this.isScrollToReset())
					this.resetScroll();
			},

			isScrollToReset: function () {
				return this._isContentUpdated && this.$el.is(':visible');
			},

			resetScroll: function () {
				this.ui.content.scrollTop(0);
				this._isContentUpdated = false;
			},
		});

		module.ArticleManager = Mn.Object.extend({
			template: false,
			currentView: null,
			cookieKey: 'object-search-article--view',
			views: {},
			showDelay: 5000,
			_timerId: null,

			initialize: function (options) {
				var currentViewName;

				this.views = {
					head: new ArticleHeadView({el: options.regions.head}).render(),
					body: new ArticleBodyView({el: options.regions.body}).render(),
				};

				this.listenTo(this.views.head, 'article:expand', this.expand);
				this.listenTo(this.views.body, 'article:collapse', this.collapse);

				currentViewName = JSON.parse(localStorage.getItem('screens.objectSearch.sectionArticle.collapsed'))
					? 'head'
					: 'body';
				this.currentView = this.views[currentViewName] || this.views.body;

				if (this.isEmpty())
					this.hide();
				else
					this.showDeferred();
			},

			isEmpty: function () {
				return _.some(this.views, function (view) {
					return !view.getContent().trim();
				});
			},

			update: function (article) {
				var wasEmpty = this.isEmpty();

				if (!wasEmpty && !article)
					this.hide();

				if (!wasEmpty || article) {
					_.each(this.views, function (view, viewName) {
						var html = article && article[viewName]
							? article[viewName]
							: null;

						view.setContent(html).render();
					}, this);
				}

				if (wasEmpty && !this.isEmpty())
					this.show();
			},

			showDeferred: function () {
				var mediator = this;
				clearTimeout(this._timerId);

				this._timerId = setTimeout(function () {
					mediator.show();
				}, this.showDelay);
			},

			show: function () {
				this.currentView.show();
			},

			hide: function () {
				clearTimeout(this._timerId);
				_.each(this.views, function (view) {
					view.hide();
				});
			},

			expand: function () {
				this.setCurrentView(this.views.body);
			},

			collapse: function () {
				this.setCurrentView(this.views.head);
			},

			setCurrentView: function (currentView) {
				var currentViewName;
				_.each(this.views, function (view, viewName) {
					var isCurrentView = view === currentView;

					if (isCurrentView)
						currentViewName = viewName;

					view.toggle(isCurrentView);
				});
				this.currentView = currentView;
				localStorage.setItem('screens.objectSearch.sectionArticle.collapsed', JSON.stringify('body' != currentViewName));
			},
		});
	})(module, app, Bb, Mn, $, _, bem);
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
		function capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		module.Page = Mn.Object.extend({
			blocks: ['form', 'results', 'commercialTop', 'commercialBottom', 'map', 'article', 'pagination', 'page'],
			settings: null,

			layoutView: null,
			formView: null,
			filterTagsView: null,
			horizontalCalView: null,
			resultsView: null,
			CommercialTopView: null,
			CommercialBottomView: null,
			mapView: null,
			articleManager: null,
			paginationView: null,
			statusView: null,
			preloaderView: null,

			_fetchXHR: null,

			initialize: function (options) {

				switch (options.objectType) {
					case 'Section':
						this.settings = {
							ymType: 'section', // тип цели для яндекс.метрики
							resultsUrl: '/api/section',
							balloonUrl: '/api/section/map',
							sportUrl: '/api/section/sport',
							metroUrl: '/api/playground/metro',
						};
						break;
					case 'Place':
						this.settings = {
							ymType: 'club', // тип цели для яндекс.метрики
							resultsUrl: '/api/club/',
							balloonUrl: '/api/club/map',
							sportUrl: '/api/section/sport',
							metroUrl: '/api/playground/metro',
						};
						break;
					case 'Event':
						this.settings = {
							ymType: 'event', // тип цели для яндекс.метрики
							resultsUrl: '/api/event',
							balloonUrl: '/api/event/map',
							sportUrl: '/api/event/sport',
							metroUrl: '/api/playground/metro',
						};
						break;
					case 'Playground':
						this.settings = {
							ymType: 'playground', // тип цели для яндекс.метрики
							resultsUrl: '/api/playground',
							balloonUrl: '/api/playground/map',
							sportUrl: '/api/playground/sport',
							metroUrl: '/api/playground/metro',
							inventoryUrl: '/api/playground/inventory'
						};
						break;
					default:
						throw new Error('Unknown object type');
				}

				this.layoutView = new module.LayoutView({el: '.object-search-page'});

				this.datepicker = new module.DatePicker(_.extend({el: '.date-picker',
					inputStart: 'input[name="date_start"]',
					inputFinish: 'input[name="date_finish"]'
				}, options.form.fieldSettings));

				options.form.datepicker = this.datepicker;

				this.formView = new module.Form.LayoutView(_.extend({
					el: '.object-search-form',
					sportUrl: this.settings.sportUrl,
					inventoryUrl: this.settings.inventoryUrl,
					metroUrl: this.settings.metroUrl,
				}, options.form));
				this.filterTagsView = new module.Form.FilterTagsView({collection: this.formView.collection});
				this.resultsView = new module.ResultsView({el: '.object-search-results'});
	            this.commercialTopView = new module.CommercialTopView({el: '.object-search-commercial-top-result'});
	            this.commercialBottomView = new module.CommercialBottomView({el: '.object-search-commercial-bottom-result'});
				this.mapView = new module.MapView(_.extend({}, options.map, {balloonUrl: this.settings.balloonUrl}));
				this.articleManager = new module.ArticleManager({
					regions: {
						head: '.object-search-article-trigger',
						body: '.object-search-article-modal',
						mapContainer: '.object-search-page__map-container',
					}
				});
				this.paginationView = new module.PaginationView(options.pagination);
				this.statusView = new module.StatusView({el: '.object-search-status'});
				this.preloaderView = new module.PreloaderView({el: '.object-search-preloader'});

				this.layoutView.addRegion('form', '.object-search-page__form').show(this.formView);
				this.layoutView.addRegion('results', '.object-search-page__results').show(this.resultsView);
				this.layoutView.addRegion('commercialTop', '.object-search-commercial-top').show(this.commercialTopView);
				this.layoutView.addRegion('commercialBottom', '.object-search-commercial-bottom').show(this.commercialBottomView);
				this.layoutView.addRegion('map', '.object-search-page__map-container').show(this.mapView);
				this.layoutView.addRegion('pagination', '.object-search-page__pagination').show(this.paginationView);
				this.layoutView.addRegion('filter-tags', '.object-search-page__filter-tags').show(this.filterTagsView);

				this.listenTo(this.formView, 'form:submit', this.onFormSubmit);
				this.listenTo(this.paginationView, 'page:select', this.onPageSelect);

				history.replaceState(this.getHistoryState(), document.title, location.href);
				this.restoreStateFromHistory = _.debounce(this.restoreStateFromHistory, 750);
				_.bindAll(this, 'onHistoryPopState');
				window.addEventListener('popstate', this.onHistoryPopState);

				this.ymReachGoal('object-search_{type}');

				if (this.resultsView.isEmpty()) {
	                this.triggerMethod('results:empty');
	                this.moveBottomRegionCommercialTop()
	            } else {
	                this.moveTopRegionCommercialTop()
	            }
			},


			setBlocks: function (blocks) {
				this.blocks.forEach(function (block) {
					if (block in blocks) {
						this['setBlock' + capitalizeFirstLetter(block)](blocks[block]);
					}
				}, this);
			},
			setBlockForm: function (form) {
				this.formView.update(form);
			},
			setBlockResults: function (results) {
				if (this.layoutView.getRegion('filter-tags-empty'))
					this.layoutView.removeRegion('filter-tags-empty');

				this.resultsView.update(results);

				if (this.resultsView.isEmpty()) {
	                this.triggerMethod('results:empty');
	                this.moveBottomRegionCommercialTop();
				} else {
					this.moveTopRegionCommercialTop()
				}
			},
			setBlockCommercialTop: function (commercialTop) {
				if (commercialTop) {
	                this.commercialTopView.update(commercialTop);
				} else {
	                this.triggerMethod('commercialTop:empty');
				}
	        },
			setBlockCommercialBottom: function (commercialBottom) {
				if (commercialBottom) {
	                this.commercialBottomView.update(commercialBottom);
				} else {
	                this.triggerMethod('commercialBottom:empty');
				}
	        },
			setBlockMap: function (options) {
				this.mapView.update(options);
			},
			setBlockArticle: function (article) {
				this.articleManager.update(article);
			},
			setBlockPagination: function (options) {
				this.paginationView.update(options);
				this.statusView.update(options);
			},
			setBlockPage: function (page) {
				var referer = location.href;

				document.title = page.title || '';
				history.pushState(this.getHistoryState(), page.title, page.url);

				app.commands.execute('ymHit', page.url, {
					title: page.title,
					referer: referer,
				});
			},

			onDestroy: function () {
				window.removeEventListener('popstate', this.onHistoryPopState);
			},

			onFormSubmit: function () {
				this.ymReachGoal('object-search_{type}--search');

				var blocks = ['results', 'pagination', 'map', 'page', 'commercialTop', 'commercialBottom'];
				if (this.isRequiredBlockArticle())
					blocks.push('article');

				this.fetch({
					search: this.getSearchFormData(),
					blocks: blocks,
				}).then(function () {
					this.layoutView.ui.h1.remove();
					this.layoutView.ui.text.remove();
					this.formView.refreshTags();
				}.bind(this));
			},

			onHistoryPopState: function (e) {
				document.title = e.state.title || '';
				this.preloaderView.show();
				this.restoreStateFromHistory(e.state);
			},

			restoreStateFromHistory: function (statePopped) {
				var data,
					stateCurrent = this.getHistoryState(), // Нельзя history.state, т.к. метод debounced
					isFormUpdating = false,
					isClone = function (object1, object2) {
						var keys1 = _.keys(object1),
							keys2 = _.keys(object2);

						if (_.difference(keys1, keys2).length || _.difference(keys2, keys1).length)
							return false;

						return keys1.every(function (key) {
							if (object1[key] === object2[key])
								return true;
							else if (_.isObject(object1[key]) && _.isObject(object2[key]))
								return isClone(object1[key], object2[key]); // Рекурсия
							else
								return false; // Остальные случаи не интересуют
						});
					};

				if (statePopped.form) {
					data = {
						blocks: ['results', 'pagination'],
					};

					if (statePopped.page > 1)
						data.page = statePopped.page;

					if (!isClone(statePopped.form, stateCurrent.form)) {
						isFormUpdating = true;

						if (this.isRequiredBlockArticle(statePopped, stateCurrent))
							data.blocks.push('article');

						this.setBlockForm(statePopped.form);
						data.blocks.push('map');
					}

					data.search = this.getSearchFormData();

					if (document.activeElement && document.activeElement !== document.body)
						document.activeElement.blur();
					this.formView.triggerMethod('form:extra:hide');

					this.fetch(data).then(function () {
						if (isFormUpdating)
							this.formView.refreshTags();
					}.bind(this));
				}
			},

			onPageSelect: function (page) {
				this.fetch({
					search: this.getSearchFormData(),
					blocks: ['results', 'pagination', 'page'],
					page: page,
				});
			},

			onResultsEmpty: function () {
				if (!this.layoutView.getRegion('filter-tags-empty')) {
					this.layoutView.addRegion('filter-tags-empty', '.object-search-results-empty__filter-tags')
						.show(new module.Form.FilterTagsView({collection: this.formView.collection}));
				}

				this.ymReachGoal('object-search_{type}--no-results');
			},

			onCommercialTopEmpty: function() {
	           this.commercialTopView.clear();
			},

	        onCommercialBottomEmpty: function() {
	            this.commercialBottomView.clear();
	        },

			getHistoryState: function () {
				return {
					form: {
						rawData: this.formView.getRawData()
					},
					page: this.paginationView.getOption('currentPage'),
					title: document.title,
				};
			},

			getSearchFormData: function () {
				return this.formView.getData();
			},

			isRequiredBlockArticle: function (currentState, newState) {
				var getDataFromState = function (state) {
					return (state && state.form && state.form.rawData)
						? state.form.rawData
						: null;
				};

				// Если зашли через лендинг, всегда нужно запросить статью
				if (this.layoutView.ui.h1.is(':visible') || this.layoutView.ui.text.is(':visible'))
					return true;

				var newData = getDataFromState(newState) || this.formView.getRawData(),
					currentData = getDataFromState(currentState) || getDataFromState(history.state),
					isSportSame;

				isSportSame = currentData
					&& newData.sport && currentData.sport
					&& newData.sport.id === currentData.sport.id
					&& newData.sport.type === currentData.sport.type;

				return !isSportSame;
			},

			fetch: function (data) {
				var params = [];

				if (data.page)
					params.push('page=' + parseInt(data.page));

				if (data.blocks)
					data.blocks.map(function (value) {
						params.push('Blocks[]=' + encodeURIComponent(value));
					});

				var page = this,
					layout = this.layoutView,
					preloader = this.preloaderView;

				var dfd = $.Deferred();

				$.ajax({
					url: this.settings.resultsUrl+ '?' + params.join('&'), // _ajax=1 из-за того что у некоторых корпоративных клиентов фильтруются заголовки
					method: 'post',
					data: data.search || {},
					dataType: 'json',

					beforeSend: function (jqXHR) {
						if (page._fetchXHR)
							page._fetchXHR.abort();

						page._fetchXHR = jqXHR;
						preloader.show();
					},

					error: function () {
						preloader.hide();
						dfd.reject.apply(dfd, arguments);
					},

					success: function (blocks) {
						var content = layout.ui.content,
							className = 'object-search-page__content_updating';

						var onTransitionEnd = function () {
							preloader.hide(); // скрывается без анимации
							page.setBlocks(blocks);
							content.scrollTop(0);

							dfd.resolve(blocks);

							_.defer(function() { // Чтобы класс скрылся после всех рендеров по resolve
								content.removeClass(className);
							});
						};

						if (content.hasClass(className)) { // Если класс уже был установлен, transitionend не произойдет
							onTransitionEnd();
						} else {
							content.addClass(className);
							content.one('transitionend', onTransitionEnd);
						}
					},

					complete: function () {
						page._fetchXHR = null;
					},
				});

				return dfd.promise(this);
			},

			ymReachGoal: function (goal) {
				app.commands.execute('ymReachGoal', goal.replace('{type}', this.settings.ymType));
			},

			//Перемещаем верхний блок рекламы в верх если он внизу
			moveTopRegionCommercialTop: function () {
	            let regionBottomResults = this.layoutView.getRegion('results').$el.next();
	            if (this.layoutView.getRegion('commercialTop').$el.attr('class') == regionBottomResults.attr('class')) {
	                    this.layoutView.getRegion('results').$el.before(regionBottomResults.css({marginBottom: "-40px"}));
	            }
	        },

			//Перемещаем верхний блок рекламы в низ если он вверху
	        moveBottomRegionCommercialTop: function () {
	            let regionBottomResults = this.layoutView.getRegion('results').$el.next();
	            if (this.layoutView.getRegion('commercialBottom').$el.attr('class') == regionBottomResults.attr('class')) {
	                this.layoutView.getRegion('results').$el.after(this.layoutView.getRegion('commercialTop').$el.css({marginBottom: "0px"}));
	            }
	        },
		});
	})(module, app, Bb, Mn, $, _);

	/**
	 * Структура DatePicker
	 *
	 <div class="date-picker">
	 	<div class="date-picker__input">
			<div class="date-picker__input_inner">
				<label class="date-picker__label">Дата с</label>
				<input class="date-picker__input_date input__control" name="date_start" readonly>
				<label class="date-picker__label">по</label>
				<input class="date-picker__input_date input__control" name="date_finish" readonly>
			</div>
		</div>
		<div class="ui-calendar">
			<div class="ui-calendar__main">
				<div class="ui-calendar__control ui-calendar__control_prev"><?=BEM::svg('sprite', 'arrow-left-12', ['class' => 'ui-calendar__control__icon'])?></div>
				<div class="ui-calendar__control ui-calendar__control_next"><?=BEM::svg('sprite', 'arrow-right-12', ['class' => 'ui-calendar__control__icon'])?></div>
				<div class="ui-calendar__content">
					<div class="ui-calendar__wrapper ui-calendar__month_left">
						<div class="ui-calendar__month">Ноябрь 2019</div>
						<table class="ui-calendar__dates">
							<thead>
	 							<tr class="ui-calendar__row_label">
									<td class="ui-calendar__day_name">пн</td>
									<td class="ui-calendar__day_name">вт</td>
									<td class="ui-calendar__day_name">ср</td>
									<td class="ui-calendar__day_name">чт</td>
									<td class="ui-calendar__day_name">пт</td>
									<td class="ui-calendar__day_name">сб</td>
									<td class="ui-calendar__day_name">вс</td>
								</tr>
							</thead>
							<tbody class="ui-calendar__dates_body ui-calendar__dates_body_left"></tbody>
						</table>
					</div>
					<div class="ui-calendar__wrapper ui-calendar__month_right">
						<div class="ui-calendar__month">Ноябрь 2019</div>
						<table class="ui-calendar__dates">
							<thead>
								<tr class="ui-calendar__row_label">
									<td class="ui-calendar__day_name">пн</td>
									<td class="ui-calendar__day_name">вт</td>
									<td class="ui-calendar__day_name">ср</td>
									<td class="ui-calendar__day_name">чт</td>
									<td class="ui-calendar__day_name">пт</td>
									<td class="ui-calendar__day_name">сб</td>
									<td class="ui-calendar__day_name">вс</td>
								</tr>
							</thead>
							<tbody class="ui-calendar__dates_body ui-calendar__dates_body_right"></tbody>
						</table>
					</div>
				</div>
			</div>
	 	</div>
	 </div>
	*/
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
		module.DatePicker= Mn.ItemView.extend({

			dateMonthLeft: null,
			dateMonthRight: null,
			dateStart: null,
			dateFinish: null,
			selectedItem: false,
			selectComplete: false,
			defDateStart: null,
			defDateFinish: null,

			//подключенный метод ввода
			// input[name="date_start"]
			inputStart: null,
			inputFinish: null,

			className: {
				date : 'ui-calendar__date',
				dateSelected : 'ui-calendar__date_selected',
				labelMonth : 'ui-calendar__month',
				dateDisabled : 'ui-calendar__date_disabled',
				dateCurrent : 'ui-calendar__date_current',
				dateRange : 'ui-calendar__date_in_range'
			},

			ui: {
				calendar: '.ui-calendar',
				controlNext: '.ui-calendar__control_next',
				controlPrev: '.ui-calendar__control_prev',
				monthLeft : '.ui-calendar__month_left',
				monthRight : '.ui-calendar__month_right',
				bodyMonth: '.ui-calendar__dates_body',
				bodyMonthLeft: '.ui-calendar__dates_body_left',
				bodyMonthRight: '.ui-calendar__dates_body_right',
				dates: '.ui-calendar__date'
			},

			events: {
				'click @ui.controlNext' : 'onClickNext',
				'click @ui.controlPrev' : 'onClickPrev',
				'click @ui.dates' : 'onClickDate',
				'mouseover @ui.dates' : 'onMouseoverDate',
				'mouseout @ui.dates' : 'onMouseoutDate',
			},

			tempWeek: function (week) {
				return '<tr class="ui-calendar__row">' + week + '</tr>';
			},
			tempDay: function (day, date) {
				return '<td class="ui-calendar__date" data-date="'+ date +'">' + day + '</td>'
			},
			tempDayEmpty: '<td class="ui-calendar__date_empty"></td>',

			template: false,

			initialize: function (option) {
				this.dateMonthLeft = moment().format('YYYY-MM-DD');
				this.dateMonthRight = moment().add(1, 'month').format('YYYY-MM-DD');
				this.defDateStart = typeof option.date != 'undefined' ? moment(option.date.default.date_start, 'YYYY-MM-DD').format('YYYY-MM-DD') : null;
				this.defDateFinish = typeof option.date != 'undefined'  ? moment(option.date.default.date_finish, 'YYYY-MM-DD').format('YYYY-MM-DD') : null;
				this.selectComplete = true;
				this.dateStart = this.defDateStart;
				this.dateFinish = this.defDateFinish;
			},

			onRender: function () {
				this.showMonth();
				this.setDataInInput();
			},

			visible: function () {
				this.ui.calendar.addClass('visible');
			},

	        hidden: function () {
	            this.ui.calendar.removeClass('visible');
	        },

	        hasVisible: function () {
			    return this.ui.calendar.hasClass('visible');
	        },

			onClickDate: function (event) {
				let el = $(event.currentTarget);
				let dateClick = el.attr('data-date');
				if (el.hasClass(this.className.dateSelected)) {

					if (this.dateStart == dateClick) {
						this.ui.bodyMonth.find('[data-date="' + this.dateFinish + '"]').removeClass(this.className.dateSelected);
					} else {
						this.ui.bodyMonth.find('[data-date="' + this.dateStart + '"]').removeClass(this.className.dateSelected);
						this.dateStart = this.dateFinish;
					}

					this.dateFinish = null;
					this.selectComplete = false;
					this.selectedItem = true;
					this.hidden();

				} else {

					if ( !(_.isEmpty(this.dateStart)) && (!_.isEmpty(this.dateFinish)) || (moment(dateClick).unix() < moment(this.dateStart).unix()) ) {
						this.ui.bodyMonth.find('[data-date="' + this.dateStart + '"]').removeClass(this.className.dateSelected);
						this.ui.bodyMonth.find('[data-date="' + this.dateFinish + '"]').removeClass(this.className.dateSelected);
						this.ui.bodyMonth.find('.' + this.className.date).removeClass(this.className.dateRange);
						this.dateStart = dateClick;
						this.dateFinish = null;
						this.selectedItem = false;
						this.selectComplete = false;
					}

					el.addClass(this.className.dateSelected);

					if (!this.selectedItem) {
						this.dateStart = el.attr('data-date');
						this.selectedItem = true;
					} else {
						this.dateFinish = el.attr('data-date');
						let dates = this.ui.bodyMonth.find('.'+this.className.date);

						let indexStart = dates.index(this.ui.bodyMonth.find('[data-date="' + this.dateStart + '"]'));
						let indexFinish = dates.index(this.ui.bodyMonth.find('[data-date="' + this.dateFinish + '"]'));

						for (i = indexStart+1; i  < indexFinish; i++) {
							$(dates[i]).addClass(this.className.dateRange);
						}

						this.selectComplete = true;
						this.ui.calendar.removeClass('visible');
					}
				}

				this.setDataInInput();
			},

			onClickNext: function () {
				this.dateMonthLeft = moment(this.dateMonthLeft).add(1, 'month').format('YYYY-MM-DD');
				this.dateMonthRight = moment(this.dateMonthRight).add(1, 'month').format('YYYY-MM-DD');
				this.showMonth();
			},

			onClickPrev: function () {
				this.dateMonthLeft = moment(this.dateMonthLeft).subtract(1, 'month').format('YYYY-MM-DD');
				this.dateMonthRight = moment(this.dateMonthRight).subtract(1, 'month').format('YYYY-MM-DD');
				this.showMonth();
			},

			onMouseoverDate: function (event) {
				el = $(event.currentTarget);

				if (!_.isEmpty(this.dateStart) && (moment(el.attr('data-date')).unix() > moment(this.dateStart).unix()) && !this.selectComplete) {

					let dates = this.ui.bodyMonth.find('.' + this.className.date);

					let indexStart = dates.index(this.ui.bodyMonth.find('[data-date="' + this.dateStart + '"]'));
					let indexFinish = dates.index(this.ui.bodyMonth.find('[data-date="' + el.attr('data-date') + '"]'));

					for (i = indexStart+1; i  < indexFinish; i++) {
						$(dates[i]).addClass(this.className.dateRange);
					}
				}
			},

			onMouseoutDate: function () {
				if (!this.selectComplete) {
					let dates = this.ui.bodyMonth.find('.' + this.className.date);
					dates.removeClass(this.className.dateRange);
				}
			},

			//Вывод месяцев календаря
			showMonth: function () {

				if(moment(this.dateMonthLeft).format('MM') <= moment().format('MM') && moment(this.dateMonthLeft).format('YY') <= moment().format('YY')) {
					this.ui.controlPrev.addClass('hidden');
				} else {
					this.ui.controlPrev.removeClass('hidden');
				}

				if(moment().add(1, 'year').format('MM') <= moment(this.dateMonthRight).format('MM') && moment().add(1, 'year').format('YY') <= moment(this.dateMonthRight).format('YY')) {
					this.ui.controlNext.addClass('hidden');
				} else {
					this.ui.controlNext.removeClass('hidden');
				}

				this.ui.monthLeft.find('.' + this.className.labelMonth).text(this.firstUpperCase(moment(this.dateMonthLeft).format('MMMM YYYY')));
				this.ui.monthRight.find('.' + this.className.labelMonth).text(this.firstUpperCase(moment(this.dateMonthRight).format('MMMM YYYY')));

				this.ui.bodyMonthLeft.empty();
				this.ui.bodyMonthRight.empty();

				this.ui.bodyMonthLeft.html(this.getBlockDaysInMonth(this.dateMonthLeft));
				this.ui.bodyMonthRight.html(this.getBlockDaysInMonth(this.dateMonthRight));

				//Отмечаем не активные дни у текущего месца слева
				if (moment(this.dateMonthLeft).hours(0).minutes(0).seconds(0).unix()
					<= moment().hours(0).minutes(0).seconds(0).unix()) {
					let view = this;
					this.ui.bodyMonth.find('.' + this.className.date).each(function () {
															let el = $(this);
															let dateCell = moment(el.attr('data-date')).hours(0).minutes(0).seconds(0).unix();
															let dateCurrent = moment().hours(0).minutes(0).seconds(0).unix();

															if (dateCell < dateCurrent) {
																el.addClass(view.className.dateDisabled);
															}
					});
				}

				this.ui.bodyMonthLeft.find('[data-date="' + moment().format('YYYY-MM-DD') + '"]').addClass(this.className.dateCurrent);

				this.markSelectedDates();
			},

			//Для преобразования первого символа в верхний регистр
			firstUpperCase: function (str) {
				return str.charAt(0).toUpperCase() + str.slice(1);
			},

			//Отментить выделенные даты
			markSelectedDates: function () {

				let dateMonthLeft, dateMonthRight, dateStart, dateFinish;

				dateMonthLeft = moment(this.dateMonthLeft);
				dateMonthRight = moment(this.dateMonthRight);
				dateStart = !_.isEmpty(this.dateStart) ? moment(this.dateStart) : null;
				dateFinish = !_.isEmpty(this.dateFinish) ? moment(this.dateFinish) : null;

				if (dateStart || dateFinish) {
					if (dateStart) {
						if ( (dateStart.format('MMYY') == dateMonthLeft.format('MMYY'))
							|| (dateStart.format('MMYY') == dateMonthRight.format('MMYY')))
						{
							this.ui.bodyMonth.find('[data-date="' + dateStart.format('YYYY-MM-DD') + '"]').addClass(this.className.dateSelected);
						}
					}

					if (dateFinish) {
						if ( (dateFinish.format('MMYY') == dateMonthLeft.format('MMYY'))
							|| (dateFinish.format('MMYY') == dateMonthRight.format('MMYY')))
						{
							this.ui.bodyMonth.find('[data-date="' + dateFinish.format('YYYY-MM-DD') + '"]').addClass(this.className.dateSelected);
						}
					}
				}

				if (dateStart && dateFinish) {
					let view = this;
					this.ui.bodyMonth.find('.' + this.className.date).each(function () {
						let el = $(this);
						let elDate = el.attr('data-date');

						if ( (moment(elDate).unix() > moment(view.dateStart).unix())
							&& (moment(moment(elDate).unix()) < moment(view.dateFinish).unix())
						) {
							el.addClass(view.className.dateRange);
						}
					});
				}

			},

			//Генерация блока с днями для месяца
			getBlockDaysInMonth: function (dates) {

				let bodyDays, days;

				dates = moment(dates);

				NDays = dates.daysInMonth();
				NDayWeekFirst = dates.date(1).format('e');
				NDayWeekLast = dates.date(NDays).format('e');

				bodyDays = '';
				days = '';

				if(NDayWeekFirst != 6) {
					for (i = 0; i < NDayWeekFirst; i++) {
						days += this.tempDayEmpty;
					}
				}
				if (NDayWeekFirst == 6) {
					for(i=0;i<6;i++) {
						days += this.tempDayEmpty;
					}
				}

				for (i=1;i<=NDays;i++) {
					days += this.tempDay(i, dates.dates(i).format('YYYY-MM-DD'));
					if(dates.dates(i).format('e') == 6) {
						bodyDays += this.tempWeek(days);
						days = '';
					}
				}

				if (NDayWeekLast != 6) {
					for(i=NDayWeekLast;i<6;i++) {
						days += this.tempDayEmpty;
					}

					bodyDays += this.tempWeek(days);
				}

				return bodyDays;
			},

			//Запись данных в инпут если он есть
			setDataInInput: function () {
				if (!_.isEmpty(this.options.inputStart)) {
					let date = this.dateStart ? moment(this.dateStart).format('YYYY-MM-DD') : '';
					$(this.options.inputStart).val(date);
					$(this.options.inputStart).trigger('change');
				}

				if (!_.isEmpty(this.options.inputFinish) ) {
					let date = this.dateFinish ? moment(this.dateFinish).format('YYYY-MM-DD') : moment(this.dateStart).format('YYYY-MM-DD');
					$(this.options.inputFinish).val(date);
					$(this.options.inputFinish).trigger('change');
				}
			},

			//устанавливаем значения из импута
			setDateFromInput: function () {
				this.dateStart = $(this.options.inputStart).val() ? $(this.options.inputStart).val() : this.defDateStart;
				this.dateFinish = $(this.options.inputFinish).val() ? $(this.options.inputFinish).val() : this.defDateFinish;
				this.showMonth();
			},

			//Сброс на дефолтные значения
			reset: function () {
				this.dateStart = this.defDateStart;
				this.dateFinish = this.defDateFinish;
				this.dateMonthLeft = this.dateStart;
				this.dateMonthRight = moment(this.dateStart).add(1,'month').format('YYYY-MM-DD');
				this.selectComplete = true;
				this.showMonth();
				this.setDataInInput();
			}

		});

	})(module, app, Bb, Mn, $, _);

	module.createPage = function (options) {
		return new module.Page(options);
	};
});
