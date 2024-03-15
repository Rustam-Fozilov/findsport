document.addEventListener('DOMContentLoaded', function () {
	var $ = window.jQuery;

	$('[data-toggle-modal]').each(function () {
		var modal = window.bem.plugin('modal', window.document.querySelector(this.dataset.toggleModal), {show: false});
		this.addEventListener('click', function (e) {
			e.preventDefault();
			modal.toggle();
		});
	});

	$('body').append($('#authorization-modal'));
});