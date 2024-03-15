(function ()
{
	var window = this;
	
	window.browserChecker = {
	
		init: function ()
		{
			var data = this.getBrowserData();
			
			if ((data[0] === 'IE' || data[0] === 'MSIE') && +data[1] < 11)
			{
				this.isEnabled() && this.showNotification();
			}
		},

		showNotification: function ()
		{
			$('.-js-browser-name').text('(' + this.getBrowserName() + ') ');
			$('.-js-old-browser-notification').show();
		},

		getBrowserData: function ()
		{
			var userAgent = navigator.userAgent,
				tmp,
				match = userAgent.match(/(yabrowser|opera|chrome|safari|firefox|msie|trident|tasman(?=\/))\/?\s*(\d+)/i) || [];

			if (match[1])
			{
				if (/trident|tasman/i.test(match[1]))
				{
					tmp = /\brv[:]+(\d+)/g.exec(userAgent);

					return ['IE', tmp[1]];
				}

				if (match[1] === 'Chrome')
				{
					if (tmp = userAgent.match(/\bOPR\/(\d+)/))
					{
						return ['Opera', tmp[1]];
					}
					else if (tmp = userAgent.match(/\YaBrowser\/(\d+)/))
					{
						return ['YaBrowser', tmp[1]];
					}
				}

				match = match[2] ? [match[1], match[2]] : [navigator.appName, navigator.appVersion, '-?'];

				tmp = userAgent.match(/version\/(\d+)/i);

				if (tmp)
				{
					match.splice(1, 1, tmp[1]);
				}
			}

			return match;
		},

		getBrowserName: function ()
		{
			var data = this.getBrowserData(),
				name = '',
				version = '';

			if (data)
			{
				if (data[0] === 'IE' || data[0] === 'MSIE')
				{
					name = 'Internet Explorer';
				}
				else
				{
					name = data[0];
				}

				version = data[1];
			}

			return name + ' ' + version;
		},
		
		isEnabled: function ()
		{
			return !/\bbc=false/.test(document.cookie);
		}
	};
}).call(this);

$(document).ready(function ()
{
	browserChecker.init();
	
	if (/Internet Explorer/.test(browserChecker.getBrowserName()))
	{
		$('.tag-label').addClass('is-ie');
	}
	
	$('.-js-close').click(function ()
	{
		$(this).parent().hide();
		document.cookie = 'bc=false';
	});
});
