function ymReachGoal(goal) {
	var success = true;

	try {
		new YandexMetrika(goal);
	}
	catch (e) {
		success = false;
	}
	finally {
		console[success ? 'log' : 'error']('YaMetrika.reachGoal(%s)', goal);
	}
}
$(document).ready(function () {
	$('.-js-booking-aside').click(function (e) {
		ymReachGoal('event_registration_click_aside');
	});
	$('.-js-booking-prices').click(function (e) {
		e.preventDefault();
		e.stopPropagation();

		var $link = $(e.currentTarget),
			id = $link.data('id'),
			$ticketDate = $('.-js-ticket-date-' + id),
			$ticketDateError = $('.-js-ticket-date-error-' + id),
			location = $link.attr('href');
		ymReachGoal('event_registration_click_buy');

		if ($ticketDate.length) {
			if ($ticketDate.val() == 'Дата посещения') {
				$ticketDateError.css('display', 'block');
				return;
			}

			location += '?date=' + $ticketDate.val();
		}

		window.location.href = location;
	});
});