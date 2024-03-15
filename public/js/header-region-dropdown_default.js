document.addEventListener('DOMContentLoaded', function () {

	const widgetSelector = '-js-widget-header-region-dropdown';

	function missClickProxy(listener, el) {
		return function (event) {
			if (el !== event.target && !el.contains(event.target))
				return listener.apply(el, arguments);
		}
	}

	DropdownMenu = function (el) {
		this.el = el;
		this.toggleEvent = new Event('regionDropdownToggle');
		this.el.addEventListener('regionDropdownToggle', () => this.onToggle());
	};

	DropdownMenu.prototype = {
		visibleClassName: 'dropdown-list_visible',
		parentElId: '-js-header-region-location',

		show: function () {
			this.el.classList.add(this.visibleClassName);
			this.el.dispatchEvent(this.toggleEvent);
		},
		hide: function () {
			this.el.classList.remove(this.visibleClassName);
			this.el.dispatchEvent(this.toggleEvent);
		},
		toggle: function () {
			this.el.classList.toggle(this.visibleClassName);
			this.el.dispatchEvent(this.toggleEvent);
		},
		isVisible: function () {
			return this.el.classList.contains(this.visibleClassName);
		},
		onToggle: function () {
			this.isVisible()
				? this.addEventMissClick()
				: this.removeEventMissClick();
		},
		getParentEl: function () {
			return document.getElementById(this.parentElId);
		},
		addEventMissClick: function () {
			let context = this;
			document.addEventListener('click', missClickProxy(function () {
				context.hide();
			}, this.getParentEl()));
		},
		removeEventMissClick: function () {
			document.removeEventListener('click', missClickProxy(function () {
				context.hide();
			}, this.getParentEl()));
		}
	};

	forEach = Array.prototype.forEach;

	(function () {
		forEach.call(document.getElementsByClassName(widgetSelector), function (container) {
			let dropdownEl = container.getElementsByClassName('dropdown-list')[0],
				togglerEl = container.getElementsByClassName('button')[0],
				dropdown = new DropdownMenu(dropdownEl);

			togglerEl.addEventListener('click', function (e) {
				e.preventDefault();
				dropdown.toggle();
			});

			togglerEl.addEventListener('openRegionDropdown', function (e) {
				dropdown.show();
			});
		});
	})();
});