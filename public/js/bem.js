var bem = (function () {
	var bem = {};
	
	bem.components = {};
	
	bem.support = {};
	
	bem.plugin = (function () {
		var handlers = [];
		
		function getProp(pluginName) {
			return 'bem.plugin.' + pluginName;
		}
		
		var plugin = function (pluginName, el, options) {
			if (!plugin.isRegistered(pluginName))
				throw new Error('Unknown BEM plugin ' + pluginName);

			if ('length' in el)
				return Array.prototype.map.call(el, plugin.storingInstance);
			else
				return plugin.storingInstance(pluginName, el, options);
		};
		
		plugin.register = function (pluginName, fn) {
			handlers[pluginName] = fn;
		};
		
		plugin.isRegistered = function (pluginName) {
			return handlers.hasOwnProperty(pluginName);
		};
		
		plugin.instance = function (pluginName, el, options) {
			return new handlers[pluginName](el, options || {});
		};
		
		plugin.storingInstance = function (pluginName, el, options) {
			var opt = getProp(pluginName);
			return el[opt] || (el[opt] = plugin.instance(pluginName, el, options));
		};
		
		plugin.getStoredInstance = function (pluginName, el) {
			return el[getProp(pluginName)];
		};
		
		return plugin;
	})();
	
	
	return bem;
}) ();

(function () {
	var Collection = (function () {
		var Collection = function (length) {
			if (arguments.length === 1 && typeof length === 'number')
				this.length = -1 < length && length === length << 1 >> 1 ? length : this.push(length);
			else if (arguments.length)
				this.push.apply(this, arguments);
		};
		
		return Collection;
	})();
	
	var util = {
		forEach: function (ctx, callback) {
			Array.prototype.forEach.call(ctx, callback);
		},
		
		forOf: function (ctx, callback) {
			for (var key in ctx)
				if (ctx.hasOwnProperty(key))
					callback.call(ctx, ctx[key], key);
		},
		
		extend: function (dest/*, ...sources */) {
			for (var i = 1; i < arguments.length; i++)
				if (arguments[i])
					for (var key in arguments[i])
						if (arguments[i].hasOwnProperty(key))
							dest[key] = arguments[i][key];
			
			return dest;
		},
		
		inherit: function (Parent, proto, static) {
			var Child;

			if (proto && proto.hasOwnProperty('constructor'))
				Child = proto.constructor;
			else
				Child = function () { return Parent.apply(this, arguments); };
			
			util.extend(Child, Parent, static);
			
			var Fn = function () { this.constructor = Child; };
			Fn.prototype = Parent.prototype;
			Child.prototype = new Fn();
			
			if (proto)
				util.extend(Child.prototype, proto);
			
			return Child;
		},
	};
	
	
	
	var Element = function (el) {
		if (!el)
			el = 'div';
		if (typeof el === 'string')
			el = document.createElement(el);
		
		this.el = el;
	}
	Element.prototype = {
		on: function (type, callback) {
			this.el.addEventListener(type, callback);
			return this;
		},
		off: function (type, callback) {
			this.el.removeEventListener(type, callback);
			return this;
		},
		once: function (type, callback) {
			var ctx = this;
			this.on(type, function () {
				ctx.off(type, callback);
				return callback.apply(this, arguments);
			});
			return this;
		},
		
		attr: function (name, val) {
			if (arguments.length >= 2) {
				this.el.setAttribute(name, val);
				return this;
			}
			if (arguments.length == 1) {
				return this.el.getAttribute(name);
			}
		},
	};
	
	var Elements = (function () { // (C) Andrea Giammarchi - Mit Style License
		function Elements(length) {
			if (arguments.length === 1 && typeof length === 'number')
				this.length = -1 < length && length === length << 1 >> 1 ? length : this.push(length);
			else if (arguments.length)
				this.push.apply(this, arguments);
		}
		
		function Array() {}
		Array.prototype = [];
		
		Elements.prototype = new Array;
		Elements.prototype.length = 0;
		Elements.prototype.toString = function () {
			return this.slice(0).toString();
		};
		
		Elements.prototype.constructor = Elements;
		return Elements;
	})();
	util.extend(Elements.prototype, {
		on: function (type, callback) {
			this.forEach(function (el) {
				el.on(type, callback);
			});
			return this;
		},
		off: function (type, callback) {
			this.forEach(function (el) {
				el.off(type, callback);
			});
			return this;
		},
		once: function (type, callback) {
			this.forEach(function (el) {
				el.once(type, callback);
			});
			return this;
		},
	});
	
	var Find = {
		one: function (selector, parent) {
			if (!parent)
				parent = document;
			
			return parent.querySelector(selector);
		},
	};
	
	
	var BEM = function (el) {
		if (!(this instanceof BEM))
			return new BEM(el);

		try {
			var config = JSON.parse(el.dataset.js.replace(/(\w+)\s*\:/g, '"$1":'));
		} catch (e) {
			throw new Error('Bad BEM config');
		}

		el.bem = this;

		var blocks = this.blocks = {};
		for (var blockName in config) {
			if (!config.hasOwnProperty(blockName))
				continue;

			if (!(blockName in BEM.Blocks))
				throw new Error('Unknown BEM.block ' + blockName);

			blocks[blockName] = new BEM.Blocks[blockName](el, config[blockName], this);
		}
	};
	BEM.prototype = {
		blocks: null,
	};
	BEM.Blocks = {};
	
	var InputBlock = BEM.Blocks.i = function (el, options, hub) {
		this.el = el;
		this.options = options || {};
		this.hub = hub;

		this.initialize();
	};
	InputBlock.prototype.initialize = function () {
		var input = this.el,
			control = input.getElementsByClassName('i__control')[0];

		input.classList.toggle('i_empty', !control.value);
		control.addEventListener('focus', function () {
			input.classList.add('i_focused');
		});
		control.addEventListener('blur', function () {
			input.classList.remove('i_focused');
		});
		control.addEventListener('input', function () {
			input.classList.toggle('i_empty', !control.value);
		});
	};
	
	
});
(function (bem) {
	var iff = function (cond, yes, no) {
		return cond ? yes() : no();
	}
	
	var supported = (function (ua) {
		// https://github.com/jonathantneal/svg4everybody
		var ie = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/;
		var webkit = /\bAppleWebKit\/(\d+)\b/;
		var edge = /\bEdge\/12\.(\d+)\b/;
		
		return !(ie.test(ua) || (ua.match(edge) || [])[1] < 10547 || (ua.match(webkit) || [])[1] < 537);
	}) (navigator.userAgent);
	
	bem.support.externalSvg = iff(supported, function () {
		var noop = function () {};
		return {
			supported: true,
			fixUse: noop,
			fixSvg: noop,
			fixChildren: noop,
			fixUrl: function (href) {
				return href;
			},
		};
	}, function () {
		var loaded = {};
		var load = function (url) {
			if (loaded[url])
				return;
			
			loaded[url] = true;
			
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4 && xhr.status == 200) {
					var fragment = xhr.responseXML;
					Array.prototype.forEach.call(fragment.childNodes, function (node) {
						if (node.tagName && node.tagName.toLowerCase() === 'svg') {
							node.style.display = 'none';
							document.body.appendChild(node);
						}
					});
				}
			};
			xhr.open('GET', url, true);
			xhr.send();
		};
		
		var fixUrl = function (href) {
			if (href && href.indexOf('#') > 0) { 
				var splitted = href.split('#', 2),
					url = splitted[0],
					id = splitted[1];

				load(url);

				return '#' + id;
			} else {
				return href;
			}
		};
		var fixUse = function (useEl) {
			useEl.setAttribute('xlink:href', fixUrl(useEl.getAttribute('xlink:href')));
		};
		var fixChildren = function (el) {
			Array.prototype.forEach.call(el.getElementsByTagName('use'), fixUse);
		};
		var fixSvg = fixChildren;
		
		return {
			supported: false,
			fixUse: fixUse,
			fixSvg: fixSvg,
			fixChildren: fixChildren,
			fixUrl: fixUrl,
		};
	});
}) (window.bem || (window.bem = {}));
(function (bem) {
	var StateCommand = function (state, cmd, ctx) {
		this.state = !!state;
		
		if (state)
			this.result = cmd.call(ctx || null);
	}
	StateCommand.prototype = {
		state: null,
		result: void 0,
		
		log: function (/*...args */) {
			(this.state ? console.log : console.warn).apply(console, arguments);
			return this;
		},
	};
	
	var YaMetrika = function (handler) {
		switch (typeof handler) {
			case 'object':
				this._handler = handler;
				break;
			case 'string':
				this._handlerProp = handler;
				break;
			case 'undefined':
				throw new Error('[YaMetrika] Handler is undefined');
			default:
				throw new Error('[YaMetrika] Unknown type of handler');
		}
	}
	YaMetrika.prototype = {
		_handler: null,
		_handlerProp: null,
		
		goal: function (target/* [, params[, callback[, ctx]]] */) {
			this._command('reachGoal', arguments).log('YaMetrika.goal(%s)', target).result;
		},
		
		notBounce: function () {
			this._command('notBounce').log('YaMetrika.notBounce()').result;
		},
		
		_getHandler: function () {
			return this._handler || (this._handler = window[this._handlerProp]);
		},
		
		_command: function (method, args) {
			var h = this._getHandler();
			return new StateCommand(typeof h === 'object' && typeof h[method] === 'function', function () {
				return this[method].apply(this, args);
			}, h);
		},
	}
	
	
	bem.components.YaMetrika = YaMetrika;
}) (window.bem || (window.bem = {}));
/* ========================================================================
 * Bootstrap: modal.js v3.3.5
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($, bem) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal__dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false
	
    this.options             = $.extend({}, Modal.DEFAULTS, this.$element.data(), options);

    if (this.options.remote) {
      this.$element
        .find('.modal__content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bem.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.5'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bem.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('page_modal-opened')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bem.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bem.modal', function () {
      that.$element.one('mouseup.dismiss.bem.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('modal_animate')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .addClass('modal_opened')
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('modal_opened')

      that.enforceFocus()

      var e = $.Event('shown.bem.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bem.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bem.modal')

    this.$element
      .removeClass('modal_opened')
      .off('click.dismiss.bem.modal')
      .off('mouseup.dismiss.bem.modal')

    this.$dialog.off('mousedown.dismiss.bem.modal')

    $.support.transition && this.$element.hasClass('modal_animate') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bem.modal') // guard against infinite focus loop
      .on('focusin.bem.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bem.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bem.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bem.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bem.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.removeClass('modal_opened')
    this.backdrop(function () {
      that.$body.removeClass('page_modal-opened')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bem.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('modal_animate') ? 'modal-backdrop_animate' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bem.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('modal-backdrop_opened')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('modal-backdrop_opened')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('modal-backdrop_animate') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================
  
  bem.plugin.register('modal', Modal);

}(jQuery, bem);
