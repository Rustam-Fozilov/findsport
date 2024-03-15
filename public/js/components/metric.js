var YandexMetrika = function(goal)
{
	this.init();
	
	if (goal && this.data)
	{
		this.reachGoal(goal);
	}
};

YandexMetrika.prototype.init = function()
{
	var id = document.getElementById('yaCounterId');
	
	if (id && id.value)
	{
		this.data = {
			id: id.value,
			name: 'yaCounter' + id.value
		};
	}
};

YandexMetrika.prototype.reachGoal = function(goal)
{
	try
	{
		window[this.data.name].reachGoal(goal);
	}
	catch(e){};
};

var fsMetric = {
	
	reachGoal: function(goal, data, ajax)
	{
		data = $.extend({
			goal: goal,
			once: 0
		}, data);
		
		ajax || (ajax = {});
		
		$.ajax($.extend({}, ajax, {
			data: data,
			dataType: 'json',
			type: 'POST',
			url: '/metric/reachgoal',
			
			error: function ()
			{
				console.error('FsMetrika.reachGoal(%s)', goal);
				ajax.error && ajax.error.apply(this, arguments);
			},
			
			success: function ()
			{
				console.log('FsMetrika.reachGoal(%s)', goal);
				ajax.success && ajax.success.apply(this, arguments);
			}
		}));
	},
	
	reachGoalOnce: function(goal, data, ajax)
	{
		data = $.extend({
			once: 1
		}, data || {});
		
		this.reachGoal(goal, data, ajax);
	}
};
