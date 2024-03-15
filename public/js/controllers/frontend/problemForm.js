$(document).ready(function ()
{
	var global = window,
		document = global.document,
		location = global.location,
		$ = global.jQuery,
		_ = global._,
		Backbone = global.Backbone,
		Handlebars = global.Handlebars,
		bem = null;

	function getFirstError(errors)
	{
		for (var i in errors)
		{
			if (errors.hasOwnProperty(i))
			{
				for (var j in errors[i])
				{
					if (errors[i].hasOwnProperty(j))
					{
						return errors[i][j];
					}
				}
			}
		}

		return;
	}

	var emailRegEx = /^[a-zA-Z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;

	var validators = {
		email: function (value)
		{
			return emailRegEx.test(value);
		},
	};


	var ProblemForm = Backbone.Model.extend({
		errors: null,

		defaults: {
			email: '',
			message: '',
			name: '',
		},

		attributeLabels: {
			email: 'Ваш email',
			name: 'Ваше имя',
			message: 'Что не работает и как это должно работать?'
		},

		initialize: function ()
		{
			this.errors = {};
		},

		reset: function ()
		{
			this.clear().set(this.defaults);
			return this;
		},

		validate: function (attributes)
		{
			var e = this.errors = {};

			if (!attributes)
			{
				attributes = this.attributes;
			}

			if (_.has(attributes, 'email'))
			{
				if (!validators.email(attributes.email))
				{
					e.email = ['Email заполнен неверно'];
				}
			}

			if (_.has(attributes, 'name'))
			{
				if (0 === attributes.name.length)
				{
					e.name = ['Имя заполнено неверно'];
				}
			}

			if (_.has(attributes, 'message'))
			{
				if (0 === attributes.message.length)
				{
					e.message = ['Сообщение заполнено неверно'];
				}
			}


			return getFirstError(e);
		}
	});


	var ProblemFormView = Backbone.View.extend({
		tagName: 'form',

		events: {
			'submit': 'eventSubmitForm'
		},

		FormModel: ProblemForm,

		templateName: 'problemModalForm',

		attributes: {
			action: '/site/problem',
			method: 'post',
			novalidate: ''
		},

		_modelAndFormAttributes: {
			email: 'Problem[email]',
			message: 'Problem[message]',
			name: 'Problem[name]'
		},

		_popup: null,
		_unknownSubmitError: 'Произошла ошибка, перезагрузите страницу и попробуйте снова',

		initialize: function (options)
		{
			if (!options) options = {};

			this.model = new this.FormModel();

			if (options.parent)
			{
				this.parent = options.parent;
			}
		},

		getRenderer: function ()
		{
			return this.template || (this.template = Handlebars.compile(this._getTemplate()));
		},

		preloader: function ()
		{
			return this.parent && this.parent.$('.preloader') || $('<div class="preloader"></div>').appendTo(this.el);
		},

		reset: function ()
		{
			this.el.reset();
			this.model.reset();

			bem
				? this.$('.input_state_error').removeClass('input_state_error')
				: this.$('.has-error').removeClass('has-error');
		},

		render: function ()
		{
			this.$el.html(this.getRenderer()(this.model));
		},

		eventSubmitForm: function (e)
		{
			e.stopPropagation();
			e.preventDefault();

			var formData = {
				'Problem[email]': this.$el.find('input[name="Problem[email]"]').val(),
				'Problem[name]': this.$el.find('input[name="Problem[name]"]').val(),
				'Problem[message]': this.$el.find('textarea[name="Problem[message]"]').val()
			};

			if (this._validateForm(formData))
			{
				this._ajaxSubmit(formData);
			}
		},

		_getTemplate: function ()
		{
			return document.getElementById('hbs-' + _.str.dasherize(this.templateName)).innerHTML;
		},

		_validateForm: function (formValues)
		{
			var model = this.model,

				attributes = this._modelAndFormAttributes,

				values = _.object(
					_.keys(attributes),
					_.values(_.pick(formValues, _.values(attributes)))
				),

				isValid = !this.model.validate(values);

			this.$('input[name], textarea[name]').each(function ()
			{
				var modelAttribute = _.keyOf(attributes, this.name),
					hasError = _.has(model.errors, modelAttribute) && 0 < model.errors[modelAttribute].length;

				bem
					? $(this).parents('.input').toggleClass('input_state_error', hasError)
					: $(this).parents('.form-group').toggleClass('has-error', hasError);
			});

			return isValid;
		},

		_ajaxSubmit: function (data)
		{
			return $.ajax({
				url: this.el.action,
				type: this.el.method,
				dataType: 'json',
				context: this,
				data: data,

				beforeSend: function () {
					this.preloader().show();
				},

				complete: function () {
					this.preloader().hide();
					this.$('.-js-form').toggleClass('hidden');
					this.$('.-js-result').toggleClass('hidden');
				},

				error: function () {
					alert(this._unknownSubmitError);
				},

				success: function (data) {
					if (!data.success) {
						alert(getFirstError(data.errors) || this._unknownSubmitError);
					}
				}
			});
		}
	});


	var ProblemModalView = Backbone.View.extend({
		_returnUrl: '',
		_handler: null,

		_forms: {
			problem: {
				View: ProblemFormView,
				instance: null
			}
		},

		events: bem
		? {
			'show.bem.modal': 'eventModalShow',
			'hide.bem.modal': 'eventModalHide'
		}
		: {
			'show.bs.modal': 'eventModalShow',
			'hide.bs.modal': 'eventModalHide'
		},

		initialize: function (options)
		{
			if (options.returnUrl)
			{
				this.setReturnUrl(options.returnUrl);
			}

			this._handler = bem
				? bem.plugin('modal', this.el)
				: this.$el.data('bs.modal');
		},

		show: function ()
		{
			this._handler.show();
		},

		hide: function ()
		{
			this._handler.hide();
		},

		toggle: function ()
		{
			this._handler.toggle();
		},

		eventModalShow: function ()
		{
			this._ensureFormCreated('problem');
		},

		eventModalHide: function ()
		{
			this.$('.-js-form').removeClass('hidden');
			this.$('.-js-result').addClass('hidden');
		},

		_ensureFormCreated: function (formName)
		{
			var form = this._forms[formName];

			if (form.instance)
			{
				form.instance.reset();
			}
			else
			{
				form.instance = new form.View({parent: this});

				form.instance.render();
				this.$(bem ? '.modal__content' : '.modal-content').append(form.instance.el);
			}

			return form.instance;
		}
	});

	global.problemModal = new ProblemModalView({ el: '#problem-modal' });
});