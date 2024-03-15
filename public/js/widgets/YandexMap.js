/**
 * @param {ymaps} ymaps YandexMaps
 */
var YandexMap = (function (ymaps)
{
	var YandexMap = {
		coordinates: [],
		centerOffsets: { x: 0, y: 0 },
		address: '',

		init: function (options)
		{
			this.coordinates = options.coordinates;
			this.address = options.address;

			if (options.centerOffsets)
			{
				this.centerOffsets = options.centerOffsets;
			}

			ymaps.ready(this.initMap);
		},
		
		getPointOptions: function(state)
		{
			if (state.create)
			{
				return {
					iconLayout: ymaps.templateLayoutFactory.createClass('<div class="placemark placemark_type_point placemark_theme_primary"></div>'),
					iconShape: {
						type: 'Circle',
						coordinates: [8, 8],
						radius: 8
					}
				};
			}
		},

		/**
		 * Инициализация карты
		 * @returns {undefined}
		 */
		initMap: function ()
		{
			var handler = YandexMap,
				coordinates = handler.coordinates,
				address = handler.address,
				center = handler._calculateMapCenter();

			var map = new ymaps.Map('map', {
				center: center,
				zoom: 15,
				behaviors: ['drag'],
				controls: []
			}, {
				autoFitToViewport: 'always'
			});

			map.controls.add('zoomControl', {
				position: {
					right: '10px',
					top: '10px'
				}
			});
			
			var placemark = new ymaps.Placemark(coordinates, {
					hasHint: false,
					balloonContent: address
				}, handler.getPointOptions({create: 1})
			);

			map.geoObjects.add(placemark);
		},

		/**
		 * @crutch Вычисление центра карты с учётом левой панели
		 * @returns {Array}
		 */
		_calculateMapCenter: function ()
		{
			return [this.coordinates[0] - this.centerOffsets.y, this.coordinates[1] - this.centerOffsets.x];
		}
	};
	
	return YandexMap;

}).call(this, ymaps);