/*!
* WeatherCube - v2.0.2019
* https://mcx-systems.com/weatherCube
*
* All rights Reserved.
* Copyrights by Davorin Casar <casardavorin@gmail.com> (https://mcx-systems.net)
*/
(function($, window, document, undefined)
{
	let leaflet = L.noConflict();
	/*
		Store the name of the plugin in the "pluginName" variable. This
		variable is used in the "Plugin" constructor below, as well as the
		plugin wrapper to construct the key for the "$.data" method.

		More: http://api.jquery.com/jquery.data/
	*/
	const pluginName = 'weatherCube';

	// Images by country PNG
	// Link https://api.sat24.com/mostrecent/
	// Europe codes DE, SP, FR, ALPS, IT, SCAN, GB, PL, GR, TU, RU, BA, BC, SE, HU, UK, EU
	// Africa codes CE, NG, CAF, TD, CG, EG, ET, CM, IS, LY, MG, MO, BW, SA, SO, SD, TZ, TN, WA, ZM, ZA, KE, AO, EA, AF
	// Asia codes ID, TH, MY, PG, KR, KP, LA, SEASIA
	// Oceania codes NZ, OCE, AU
	// America codes ANA, AMA, ASA
	// Japan, Taiwan, HongKong, Korea codes JP
	// Define map Type visual5hdcomplete, infraPolair, rainTMC, snow
	// Link Example
	// https://api.sat24.com/mostrecent/BA/visual5hdcomplete or
	// https://api.sat24.com/mostrecent/BA/infraPolair
	let apiSatImage = 'https://api.sat24.com/mostrecent/{0}/{1}';

	// Animated by country GIF
	// Link https://api.sat24.com/animated/
	// Europe codes DE, SP, FR, ALPS, IT, SCAN, GB, PL, GR, TU, RU, BA, BC, SE, HU, UK, EU
	// Africa codes CE, NG, CAF, TD, CG, EG, ET, CM, IS, LY, MG, MO, BW, SA, SO, SD, TZ, TN, WA, ZM, ZA, KE, AO, EA, AF
	// Asia codes ID, TH, MY, PG, KR, KP, LA, SEASIA
	// Oceania codes NZ, OCE, AU
	// America codes ANA, AMA, ASA
	// Japan, Taiwan, HongKong, Korea codes JP
	// Define map Type visual, infraPolair, rainTMC, snow
	// Numbers define map size 1-small, 2-medium, 3-large
	// Link Example
	// https://api.sat24.com/animated/HU/visual/1/
	// https://api.sat24.com/animated/BA/infraPolair/
	let apiSatAnimatedImage = 'https://api.sat24.com/animated/{0}/{1}/{2}/{3}/{4}';

	// Satellite type of image GIF animated.
	const satAnimatedImageTypes = ['visual', 'infraPolair', 'rainTMC', 'snow'];

	// Satellite type of image PNG static.
	const satVisualImageTypes = ['visual5hdcomplete', 'infraPolair', 'rainTMC', 'snow'];

	// World Country regions codes as on sat24
	const satImageRegions = [
		'DE', 'SP', 'FR', 'ALPS', 'IT', 'SCAN', 'GB', 'PL', 'GR', 'TU', 'RU', 'BA', 'BC', 'SE', 'HU', 'UK', 'EU',
		'CE', 'NG', 'CAF', 'TD', 'CG', 'EG', 'ET', 'CM', 'IS', 'LY', 'MG', 'MO', 'BW', 'SA', 'SO', 'SD', 'TZ', 'TN',
		'WA', 'ZM', 'ZA', 'KE', 'AO', 'EA', 'AF', 'ID', 'TH', 'MY', 'PG', 'KR', 'KP', 'LA', 'SEASIA', 'NZ', 'OCE', 'AU',
		'ANA', 'AMA', 'ASA', 'JP'
	];

	// MeteoAlarm, rss feeds for extreme weather conditions
	let apiMeteoAlarmUrl = 'https://www.meteoalarm.eu/documents/rss/{0}.rss';

	// Europe Country regions codes as on sat24
	const europeRegions = [
		'AT', 'BA', 'BE', 'BO', 'CH', 'CY', 'CZ', 'DE', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 'HU', 'IE', 'IL',
		'IS', 'IT', 'LT', 'LU', 'LV', 'MD', 'ME', 'MK', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'RS', 'SE', 'SI', 'SK',
		'UK'
	];

	// OpenWetherMap API
	// Define basic api endpoint https://www.openweathermap.org
	let apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
	let apiUviUrl = 'https://api.openweathermap.org/data/2.5/uvi/forecast';
	let apiForecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

	// Astronomical calculations API
	// Docs here https://aa.usno.navy.mil/data/docs/api.php
	let apiMoonDataUrl = 'https://api.usno.navy.mil/rstt/oneday';
	let apiEclipseDataUrl = 'https://api.usno.navy.mil/eclipses/solar';
	let apiSeasonsDataUrl = 'https://api.usno.navy.mil/seasons';

	// USGS earthquake API
	let apiEarthQuakesUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_{0}.geojson';

	/*
		The "Plugin" constructor, builds a new instance of the plugin for the
		DOM node(s) that the plugin is called on. For example,
		"$('h1').pluginName();" creates a new instance of pluginName for
		all h1's.
	*/
	// Create the plugin constructor
	function Plugin(element, options)
	{
		/*
			Provide local access to the DOM node(s) that called the plugin,
			as well local access to the plugin name and default options.
		*/
		this.element = element;
		this._name = pluginName;
		this._date = new Date();
		this._version = 'V2.0.2019';
		this._flag = false;
		this._language = this.getUserLanguage();
		this._locationLat = null;
		this._locationLon = null;
		this._weatherIntervalId = null;
		/***************************************************************************/
		this._dataResult = [];
		/***************************************************************************/
		this._tempChart = null;
		this._humidityChart = null;
		this._pressureChart = null;
		this._windChart = null;
		this._tempWeekChart = null;
		this._humidityWeekChart = null;
		this._pressureWeekChart = null;
		this._earthquakeChart = null;
		/***************************************************************************/
		this._earthquakesArray = leaflet.layerGroup();
		/***************************************************************************/
		this._uId = this.createUniqId(8);
		this._timezone = -(this._date.getTimezoneOffset() / 60);

		this._defaults = $.fn.weatherCube.defaults;

		/*
			The "$.extend" method merges the contents of two or more objects,
			and stores the result in the first object. The first object is
			empty so that we don't alter the default options for future
			instances of the plugin.

			More: http://api.jquery.com/jquery.extend/
		*/
		this.options = $.extend({}, this._defaults, options);

		/*
			The "init" method is the starting point for all plugin logic.
			Calling the init method here in the "Plugin" constructor function
			allows us to store all methods (including the init method) in the
			plugin's prototype. Storing methods required by the plugin in its
			prototype lowers the memory footprint, as each instance of the
			plugin does not need to duplicate all of the same methods. Rather,
			each instance can inherit the methods from the constructor
			function's prototype.
		*/
		let widget = this;

		if (leaflet.Browser.ielt9)
		{
			alert(getI18n('weatherCube_browserError', widget.options.language));

			return;
		}

		/***************************************************************************/

		if (!widget.options.apiKey || widget.options.apiKey === '')
		{
			alert(getI18n('weatherCube_apiKeyError', widget.options.language));
			console.warn(getI18n('weatherCube_apiKeyError', widget.options.language));
			console.error(getI18n('weatherCube_apiError', widget.options.language));

			return;
		}

		if (!widget.options.language)
		{
			widget.options.language = widget._language;
		}

		if ($.isEmptyObject(widget.options.firstTimezone) || widget.options.firstTimezone === '')
		{
			widget.options.firstTimezone = widget._defaults.firstTimezone;
		}

		if ($.isEmptyObject(widget.options.secondTimezone) || widget.options.secondTimezone === '')
		{
			widget.options.secondTimezone = widget._defaults.secondTimezone;
		}

		if (widget.options.debug)
		{
			console.info('--------------------------------------------');
			console.info(widget.capitalizeFirstLetter(widget._name) + ' Info');
		}

		/***************************************************************************/

		$(widget.element).append(widget.createWeatherWidget());
		$(widget.element).addClass('weatherCube-' + widget.options.theme + 'Theme');
		$(widget.element).find('#weatherCube-overlay-' + widget._uId).empty().append(widget.createWeatherLoader());
		$(widget.element).find('#weatherCube-footerLoader-' + widget._uId).css('color', 'rgb(183, 26, 0)');
		$(widget.element).find('#weatherCube-loaderText-' + widget._uId)
			.text(getI18n('weatherCube_getLocation', widget.options.language));

		$(widget.element).find('.beaufortScaleModal, #weatherTab-' + widget._uId + ' a').tooltip({
			animation: true,
			trigger: 'hover'
		});

		$(widget.element).find('#currentWeatherInterval-' + widget._uId).carousel({
			interval: widget.options.alertsInterval,
			pause: 'hover'
		});

		/***************************************************************************/

		setInterval(() =>
		{
			widget.setClocksTime(widget);
		}, 1000);
		widget.setClocksTime(widget);

		/***************************************************************************/

		widget.getIPLocation();

		if (widget.options.latitude && widget.options.longitude)
		{
			widget._locationLat = widget.options.latitude;
			widget._locationLon = widget.options.longitude;

			if (widget.options.debug)
			{
				console.info('--------------------------------------------');
				console.info('Location is set to user input.');
				console.info('--------------------------------------------');
			}

			$(widget.element).find('#weatherCube-latitude-' + widget._uId).text(widget._locationLat);
			$(widget.element).find('#weatherCube-longitude-' + widget._uId).text(widget._locationLon);
			$(widget.element).find('#weatherCube-loaderText-' + widget._uId)
				.text(getI18n('weatherCube_getLocationSuccess', widget.options.language));

			if (!widget._flag)
			{
				widget.init();
				widget._flag = true;
			}
		}
		else
		{
			if (navigator.geolocation)
			{
				let id = navigator.geolocation.watchPosition(function(position)
				{
					if (widget._locationLat !== position.coords.latitude.toFixed(3) ||
						widget._locationLon !== position.coords.longitude.toFixed(3))
					{
						widget._locationLat = position.coords.latitude.toFixed(3);
						widget._locationLon = position.coords.longitude.toFixed(3);

						$(widget.element).find('#weatherCube-latitude-' + widget._uId).text(widget._locationLat);
						$(widget.element).find('#weatherCube-longitude-' + widget._uId).text(widget._locationLon);

						if (!widget._flag)
						{
							$(widget.element).find('#weatherCube-loaderText-' + widget._uId)
								.text(getI18n('weatherCube_getLocationSuccess', widget.options.language));
							if (widget.options.debug)
							{
								console.info('--------------------------------------------');
								console.info('Location was detected and was set automatically.');
								console.info('--------------------------------------------');
							}

							setTimeout(function()
							{
								widget.init();
							}, 1000);

							widget._flag = true;
						}

						navigator.geolocation.clearWatch(id);
					}
				}, function(error)
				{
					widget.locationErrorCallback(error);

					widget._locationLat = 46.6623;
					widget._locationLon = 16.1711;

					$(widget.element).find('#weatherCube-latitude-' + widget._uId).text(46.6623);
					$(widget.element).find('#weatherCube-longitude-' + widget._uId).text(16.1711);
					$(widget.element).find('#weatherCube-loaderText-' + widget._uId)
						.text(getI18n('weatherCube_getLocationError', widget.options.language));

					if (!widget._flag)
					{
						widget.init();
						widget._flag = true;
					}

					navigator.geolocation.clearWatch(id);
				}, {
					highAccuracy: true,
					maximumAge: 40000, // 40 seconds
					timeout: 20000 // 20 seconds
				});
			}
			else
			{
				alert(getI18n('weatherCube_geoError', this.options.language));
				if (widget.options.debug)
				{
					console.info('--------------------------------------------');
					console.info('Location was not found nor detected and was set to default.');
					console.info('Geolocation is not supported by this browser.');
					console.info('--------------------------------------------');
				}

				widget._locationLat = 46.6623;
				widget._locationLon = 16.1711;

				$(widget.element).find('#weatherCube-latitude-' + widget._uId).text(widget._locationLat);
				$(widget.element).find('#weatherCube-longitude-' + widget._uId).text(widget._locationLon);
				$(widget.element).find('#weatherCube-loaderText-' + widget._uId)
					.text(getI18n('weatherCube_getLocationError', widget.options.language));

				if (!widget._flag)
				{
					widget.init();
					widget._flag = true;
				}
			}
		}
	}

	/***************************************************************************/

	// Avoid Plugin.prototype conflicts
	$.extend(Plugin.prototype,
		{
			// Initialization logic
			init: function()
			{
				let widget = this;
				/*
					Create additional methods below and call them via
					"this.myFunction(arg1, arg2)", ie: "this.buildCache();".
	
					Note, you can access the DOM node(s), plugin name, default
					plugin options and custom plugin options for a each instance
					of the plugin by using the variables "this.element",
					"this._name", "this._defaults" and "this.options" created in
					the "Plugin" constructor function (as shown in the buildCache
					method below).
				*/
				widget.buildCache();
				widget.bindEvents();

				if (widget.options.debug)
				{
					console.info('--------------------------------------------');
					console.info(widget.capitalizeFirstLetter(widget._name) + ' ' + widget._version +
						' successfully initialized and is ready.');
					console.info('Latitude set to: ' + widget._locationLat);
					console.info('Longitude set to: ' + widget._locationLon);
					console.info('Language is set to: ' + widget.options.language);
					console.info('Units are set to: ' + widget.options.units);
					console.info('Uniq ID generated: ' + widget._uId);

					console.info('Current time is: ' + widget.formatTime($.now(), 0));
					console.info('Current time is: ' + widget.formatTime($.now(), 1));
					console.info('Current time is: ' + widget.formatTime($.now()));

					console.info('Current timezone is set to: ' + widget._timezone);
					console.info('Current timezone name is: ' + widget.getTimezoneName());

					console.info('--------------------------------------------');
					console.info('--------------------------------------------');
				}

				widget._tempChart = echarts.init(widget.$element.find('#weatherTempChart-' + widget._uId)[0],
					widget.options.theme);
				widget._tempChart.showLoading();

				widget._humidityChart = echarts.init(widget.$element.find('#weatherHumidityChart-' + widget._uId)[0],
					widget.options.theme);
				widget._humidityChart.showLoading();

				widget._pressureChart = echarts.init(widget.$element.find('#weatherPressureChart-' + widget._uId)[0],
					widget.options.theme);
				widget._pressureChart.showLoading();

				widget._windChart = echarts.init(widget.$element.find('#weatherWindChart-' + widget._uId)[0],
					widget.options.theme);
				widget._windChart.showLoading();

				widget._tempWeekChart = echarts.init(widget.$element.find('#weatherWeekTempChart-' + widget._uId)[0],
					widget.options.theme);
				widget._tempWeekChart.showLoading();

				widget._humidityWeekChart =
					echarts.init(widget.$element.find('#weatherWeekHumidityChart-' + widget._uId)[0],
						widget.options.theme);
				widget._humidityWeekChart.showLoading();

				widget._pressureWeekChart =
					echarts.init(widget.$element.find('#weatherWeekPressureChart-' + widget._uId)[0],
						widget.options.theme);
				widget._pressureWeekChart.showLoading();

				widget._windWeekChart = echarts.init(widget.$element.find('#weatherWeekWindChart-' + widget._uId)[0],
					widget.options.theme);
				widget._windWeekChart.showLoading();

				widget._earthquakeChart = echarts.init(widget.$element.find('#weatherQuakeChart-' + widget._uId)[0],
					widget.options.theme);
				widget._earthquakeChart.showLoading();

				$(window).bind('resize', function()
				{
					widget._tempChart.resize();
					widget._humidityChart.resize();
					widget._pressureChart.resize();
					widget._windChart.resize();
					widget._tempWeekChart.resize();
					widget._humidityWeekChart.resize();
					widget._pressureWeekChart.resize();
					widget._windWeekChart.resize();
					widget._earthquakeChart.resize();
					widget._weatherMap.invalidateSize();
				});

				setTimeout(function()
				{
					$(widget.element).find('#weatherCube-loaderText-' + widget._uId)
						.text(getI18n('weatherCube_getDataFeeds', widget.options.language));
					$(widget.element).find('#imagesContainer-' + widget._uId)
						.append(widget.createWeatherSatImages(widget._uId));
					widget.initWeather();
				}, 500);

				if (!widget._weatherIntervalId)
				{
					widget._weatherIntervalId = setInterval(function()
					{
						$(widget.element).find('#weatherCube-loaderText-' + widget._uId)
							.text(getI18n('weatherCube_getDataFeeds', widget.options.language));
						$(widget.element).find('#imagesContainer-' + widget._uId)
							.append(widget.createWeatherSatImages(widget._uId));
						widget.initWeather();
					}, widget.options.wInterval); // Interval every 360000 or 6 minutes
				}
			},

			/***************************************************************************/

			initWeather: function()
			{
				let widget = this;
				this.getWeatherMeteoAlarmData();

				// If city isn't null
				if (widget.options.city)
				{
					// define API url using city (and remove any spaces in city)
					apiUrl += '?q=' + encodeURIComponent(widget.options.city);
					apiForecastUrl += '?q=' + encodeURIComponent(widget.options.city);
				}
				else
				{
					if (widget.options.latitude && widget.options.longitude)
					{
						// Define API url using lat and lng
						apiUrl += '?lat=' + widget.options.latitude + '&lon=' + widget.options.longitude;
						apiForecastUrl += '?lat=' + widget.options.latitude + '&lon=' + widget.options.longitude;
					}
					else
					{
						apiUrl += '?lat=' + widget._locationLat + '&lon=' + widget._locationLon;
						apiForecastUrl += '?lat=' + widget._locationLat + '&lon=' + widget._locationLon;
					}
				}

				if (widget.options.latitude && widget.options.longitude)
				{
					// Define API url using lat and lng
					apiUviUrl += '?lat=' + widget.options.latitude + '&lon=' + widget.options.longitude;
				}
				else
				{
					apiUviUrl += '?lat=' + widget._locationLat + '&lon=' + widget._locationLon;
				}

				if (widget.options.units !== null)
				{
					// Append api key parameter
					apiUrl += '&units=' + widget.options.units;
					apiForecastUrl += '&units=' + widget.options.units;
				}

				// if api key was supplied
				if (widget.options.apiKey !== null)
				{
					// append api key parameter
					apiUrl += '&appid=' + widget.options.apiKey;
					apiUviUrl += '&appid=' + widget.options.apiKey;
					apiForecastUrl += '&appid=' + widget.options.apiKey;
				}

				if (widget.options.language !== null)
				{
					apiUrl += '&lang=' + widget.options.language;
					apiForecastUrl += '&lang=' + widget.options.language;
				}

				if (widget.options.debug)
				{
					console.info('--------------------------------------------');
					console.info('OpenWeatherMAp api url\'s are constructed and ready!.');
					console.info('--------------------------------------------');
				}

				setTimeout(function()
				{
					widget.$element.find('#weatherCube-loaderText-' + widget._uId)
						.text(getI18n('weatherCube_getDataFeeds', widget.options.language));

					widget.getWeatherCurrentData();
					setTimeout(function()
					{
						widget.getWeatherForecastData();
						setTimeout(function()
						{
							widget.getWeatherAstronomyData();
							setTimeout(function()
							{
								widget.getWeatherQuakesData();
							}, 500);
						}, 500);
					}, 500);
				}, 500);

				widget.createWeatherMap();
			},

			/***************************************************************************/

			createWeatherWidget: function()
			{
				return '<div id="weatherCube-' + this._uId + '" class="card weatherCube rounded-0">' +
					this.createWeatherHeader() +
					this.createWeatherNavigation() +
					this.createWeatherMain() +
					this.createWeatherFooter() +
					'</div>';
			},

			/***************************************************************************/

			createWeatherMain: function()
			{
				return '<main class="weatherCube-main tab-content p-0 m-0 rounded-0">' +
					'<div id="tabWeatherCurrent-' + this._uId +
					'" class="weatherCurrentTab tab-pane fade show active" role="tabpanel" aria-labelledby="tabWeatherCurrentToggle-' +
					this._uId + '">' +
					'<div class="row no-gutters">' +
					'<div class="col-md-6 weatherCubeCurrentBackground">' +
					'<div id="weatherCube-overlay-' + this._uId + '" class="weatherCube-loader-overlay"></div>' +
					'<div class="media p-3">' +
					'<div id="weatherCube-currentForecastImage-' + this._uId + '"></div>' +
					'<div class="media-body weatherCubeDayBody text-right overflow-hidden">' +
					'<span class="font-weight-bold mr-3">' +
					getI18n('weatherCube_currentForecastToday', this.options.language) + '</span>' +
					'<div class="weatherCubeCurrentTemperature d-flex justify-content-end align-items-center mr-3 mt-2">' +
					'<span id="weatherCube-currentTemperatureIcon-' + this._uId + '"></span>' +
					'<span id="weatherCube-currentTemperature-' + this._uId +
					'" class="digital-numbers pb-2 pb-sm-1 h1">--</span>' +
					'<i class="wi ' + this.generateUnitIcon(this.options.units) + ' pb-4 h3"></i>' +
					'</div>' +
					'<div class="weatherCubeMinMaxTemperature d-flex justify-content-end flex-sm-wrap flex-lg-nowrap align-items-center mr-1">' +
					'<span class="mr-1 pb-1">' + getI18n('weatherCube_currentForecastMin', this.options.language) +
					'</span>' +
					'<span id="weatherCube-currentMinTemperature-' + this._uId +
					'" class="digital-numbers mr-1 pb-1">--</span>' +
					'<i class="wi ' + this.generateUnitIcon(this.options.units) + ' pb-2 mr-2"></i>' +
					'<span class="mr-1 pb-1">' + getI18n('weatherCube_currentForecastMax', this.options.language) +
					'</span>' +
					'<span id="weatherCube-currentMaxTemperature-' + this._uId +
					'" class="digital-numbers mr-1 pb-1">--</span>' +
					'<i class="wi ' + this.generateUnitIcon(this.options.units) + ' pb-2 mr-2"></i>' +
					'</div>' +
					'<div class="weatherCubeMinMaxTemperature d-flex justify-content-end align-items-center mt-3 mr-2">' +
					'<a id="weatherCube-uviIndexTable-' + this._uId +
					'" href="#" class="pt-3"><span class="mr-2 font-weight-bold">' +
					getI18n('weatherCube_currentForecastUvi', this.options.language) + '</span></a>' +
					'<img id="weatherCube-uviIndexImage-' + this._uId +
					'" src="" class="mt-3 mr-2" alt="" title="UV-index" />' +
					'</div>' +
					'<div id="weatherCube-currentMore-' + this._uId + '" class="card-content d-flex p-2 pt-4"></div>' +
					'</div>' +
					'</div>' +
					'<div class="weatherCube-desc font-weight-bold mt-auto text-center p-2">' +
					'<span id="weatherCube-currentDescription-' + this._uId +
					'" class="font-weight-bold">---------</span>' +
					'</div>' +
					'</div>' +
					'<div class="col-md-6 p-0 weatherCubeTimeBackground">' +
					'<div class="weatherCube-desc font-weight-bold mt-auto text-left p-2">' +
					'<div id="weatherCube-spinner-' + this._uId +
					'" class="spinner-border spinner-border-sm text-danger mb-1" role="status"></div>' +
					'<span id="weatherCube-loaderText-' + this._uId + '" class="font-weight-bold small ml-3"></span>' +
					'</div>' +
					'<div class="d-flex flex-row align-items-center">' +
					'<div class="alert alert-primary d-flex flex-column text-left ml-2 mt-3 p-2">' +
					'<samp class="font-weight-bold small p-1">' +
					getI18n('weatherCube_latitude', this.options.language) + '<span id="weatherCube-latitude-' +
					this._uId + '" class="digital-numbers ml-2 badge badge-danger">--.---</span>' +
					'<i class="wi wi-degrees wi-fw"></i>' +
					'</samp>' +
					'<samp class="font-weight-bold small p-1">' +
					getI18n('weatherCube_longitude', this.options.language) + '<span id="weatherCube-longitude-' +
					this._uId + '" class="digital-numbers ml-2 badge badge-danger">--.---</span>' +
					'<i class="wi wi-degrees wi-fw"></i>' +
					'</samp>' +
					'<hr />' +
					'<samp class="font-weight-bold small p-1">' +
					getI18n('weatherCube_city', this.options.language) + '<span id="weatherCube-city-' + this._uId +
					'" class="ml-2 badge badge-danger">-------------</span>' +
					'</samp>' +
					'<samp class="font-weight-bold p-1 small">' +
					getI18n('weatherCube_state', this.options.language) + '<span id="weatherCube-state-' + this._uId +
					'" class="ml-2 badge badge-danger">---</span>' +
					'</samp>' +
					'<samp class="font-weight-bold p-1 small">' +
					getI18n('weatherCube_country', this.options.language) + '<span id="weatherCube-country-' +
					this._uId + '" class="ml-2 badge badge-danger">---</span>' +
					'</samp>' +
					'</div>' +
					'<div class="ml-auto h-100 pb-3 pt-2 pr-3">' +
					'<span class="badge badge-danger">' + getI18n('weatherCube_local', this.options.language) +
					'</span>' +
					'<a href="#" class="weatherCube-timeTable">' +
					'<div class="weatherCube-clock mt-3">' +
					'<div class="outer-clock-face">' +
					'<div class="inner-clock-face">' +
					'<div class="hand wcLocal-hours-hand"></div>' +
					'<div class="hand wcLocal-minutes-hand"></div>' +
					'<div class="hand wcLocal-seconds-hand"></div>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'</a>' +
					'</div>' +
					'<div class="ml-auto h-100 pb-3 pt-2 pr-3 d-none d-xl-block">' +
					'<span class="badge badge-danger">' + this.options.firstTimezone[0] + '</span>' +
					'<a href="#" class="weatherCube-timeTable">' +
					'<div class="weatherCube-clock mt-3">' +
					'<div class="outer-clock-face">' +
					'<div class="inner-clock-face">' +
					'<div class="hand wcFirst-hours-hand"></div>' +
					'<div class="hand wcFirst-minutes-hand"></div>' +
					'<div class="hand wcFirst-seconds-hand"></div>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'</a>' +
					'</div>' +
					'<div class="ml-auto h-100 pb-3 pt-2 pr-3 d-none d-xl-block">' +
					'<span class="badge badge-danger">' + this.options.secondTimezone[0] + '</span>' +
					'<a href="#" class="weatherCube-timeTable">' +
					'<div class="weatherCube-clock mt-3">' +
					'<div class="outer-clock-face">' +
					'<div class="inner-clock-face">' +
					'<div class="hand wcSecond-hours-hand"></div>' +
					'<div class="hand wcSecond-minutes-hand"></div>' +
					'<div class="hand wcSecond-seconds-hand"></div>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'</a>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'<div id="tabWeatherHour-' + this._uId +
					'" class="weatherHourTab tab-pane fade" role="tabpanel" aria-labelledby="tabWeatherHourToggle-' +
					this._uId + '">' +
					'<div id="weatherHoursArea-' + this._uId +
					'" class="d-flex flex-wrap overflow-hidden text-center"></div>' +
					'</div>' +
					'<div id="tabWeatherDay-' + this._uId +
					'" class="weatherDayTab tab-pane fade" role="tabpanel" aria-labelledby="tabWeatherDayToggle-' +
					this._uId + '">' +
					'<div id="weatherDaysArea-' + this._uId +
					'" class="d-flex flex-wrap overflow-hidden text-center"></div>' +
					'</div>' +
					'<div id="tabWeatherUvi-' + this._uId +
					'" class="weatherUviTab tab-pane fade" role="tabpanel" aria-labelledby="tabWeatherUviToggle-' +
					this._uId + '"></div>' +
					'<div id="tabWeatherSat-' + this._uId +
					'" class="weatherSatTab tab-pane fade" role="tabpanel" aria-labelledby="tabWeatherSatToggle-' +
					this._uId + '">' +
					'<div id="imagesContainer-' + this._uId + '" class="row no-gutters"></div>' +
					'</div>' +
					'<div id="tabWeatherMoon-' + this._uId +
					'" class="weatherMoonTab tab-pane fade" role="tabpanel" aria-labelledby="tabWeatherMoonToggle-' +
					this._uId + '">' +
					this.createWeatherMoonData() +
					'</div>' +
					'<div id="tabWeatherQuake-' + this._uId +
					'" class="weatherQuakeTab tab-pane fade" role="tabpanel" aria-labelledby="tabWeatherQuakeToggle-' +
					this._uId + '">' +
					'<div class="row no-gutters">' +
					'<div id="weatherQuakeChart-' + this._uId +
					'" class="weatherCube-quakeChart col-xl-5 col-lg-6 col-md-12 p-2"></div>' +
					'<div id="weatherQuakesArea-' + this._uId +
					'" class="weatherCube-quakes col-xl-7 col-lg-6 col-md-12 p-1"></div>' +
					'</div>' +
					'</div>' +
					'<div id="tabWeatherChart-' + this._uId +
					'" class="weatherChartTab tab-pane fade" role="tabpanel" aria-labelledby="tabWeatherChartToggle-' +
					this._uId + '">' +
					'<div class="row no-gutters">' +
					'<div class="col-sm-12 col-md-6 col-xl-3">' +
					'<div id="weatherTempChart-' + this._uId + '" class="weatherChart p-2"></div>' +
					'</div>' +
					'<div class="col-sm-12 col-md-6 col-xl-3">' +
					'<div id="weatherHumidityChart-' + this._uId + '" class="weatherChart p-2"></div>' +
					'</div>' +
					'<div class="col-sm-12 col-md-6 col-xl-3">' +
					'<div id="weatherPressureChart-' + this._uId + '" class="weatherChart p-2"></div>' +
					'</div>' +
					'<div class="col-sm-12 col-md-6 col-xl-3">' +
					'<div id="weatherWindChart-' + this._uId + '" class="weatherChart p-2"></div>' +
					'</div>' +
					'</div>' +
					'<div class="row no-gutters">' +
					'<div class="col-sm-12 col-md-6 col-xl-3">' +
					'<div id="weatherWeekTempChart-' + this._uId + '" class="weatherChart p-2"></div>' +
					'</div>' +
					'<div class="col-sm-12 col-md-6 col-xl-3">' +
					'<div id="weatherWeekHumidityChart-' + this._uId + '" class="weatherChart p-2"></div>' +
					'</div>' +
					'<div class="col-sm-12 col-md-6 col-xl-3">' +
					'<div id="weatherWeekPressureChart-' + this._uId + '" class="weatherChart p-2"></div>' +
					'</div>' +
					'<div class="col-sm-12 col-md-6 col-xl-3">' +
					'<div id="weatherWeekWindChart-' + this._uId + '" class="weatherChart p-2"></div>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'<div id="tabWeatherMap-' + this._uId +
					'" class="weatherMapTab tab-pane fade" role="tabpanel" aria-labelledby="tabWeatherMapToggle-' +
					this._uId + '">' +
					'<div class="weatherCube-content">' +
					'<div class="d-flex">' +
					'<div id="weatherCube-map-' + this._uId + '" class="weatherCube-map flex-fill text-left"></div>' +
					'<div class="weatherCube-scrollbarArea d-block d-lg-none"></div>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'</main>';
			},

			/***************************************************************************/

			createWeatherNavigation: function()
			{
				return '<nav class="weatherCube-navigation">' +
					'<ul id="weatherTab-' + this._uId + '" class="nav justify-content-between" role="tablist">' +
					'<li class="nav-item">' +
					'<a id="tabWeatherCurrentToggle-' + this._uId + '" title="' +
					getI18n('weatherCube_viewCurrent', this.options.language) + '" href="#tabWeatherCurrent-' +
					this._uId + '" role="tab" aria-controls="tabWeatherCurrent-' + this._uId +
					'" aria-selected="true" class="nav-link active">' +
					'<i class="wi wi-day-sunny"></i>' +
					'</a>' +
					'</li>' +
					'<li class="nav-item">' +
					'<a id="tabWeatherHourToggle-' + this._uId + '" title="' +
					getI18n('weatherCube_viewHours', this.options.language) + '" href="#tabWeatherHour-' + this._uId +
					'" role="tab" aria-controls="tabWeatherHour-' + this._uId +
					'" aria-selected="false" class="nav-link">' +
					'<i class="wi wi-time-5"></i>' +
					'</a>' +
					'</li>' +
					'<li class="nav-item">' +
					'<a id="tabWeatherDayToggle-' + this._uId + '" title="' +
					getI18n('weatherCube_viewDays', this.options.language) + '" href="#tabWeatherDay-' + this._uId +
					'" role="tab" aria-controls="tabWeatherDay-' + this._uId +
					'" aria-selected="true" class="nav-link">' +
					'<i class="wi wi-rain-wind"></i>' +
					'</a>' +
					'</li>' +
					'<li class="nav-item d-none d-sm-block">' +
					'<a id="tabWeatherUviToggle-' + this._uId + '" title="' +
					getI18n('weatherCube_viewUvi', this.options.language) + '" href="#tabWeatherUvi-' + this._uId +
					'" role="tab" aria-controls="tabWeatherUvi-' + this._uId +
					'" aria-selected="false" class="nav-link">' +
					'<i class="wi wi-umbrella"></i>' +
					'</a>' +
					'</li>' +
					'<li class="nav-item">' +
					'<a id="tabWeatherSatToggle-' + this._uId + '" title="' +
					getI18n('weatherCube_viewSat', this.options.language) + '" href="#tabWeatherSat-' + this._uId +
					'" role="tab" aria-controls="tabWeatherSat-' + this._uId +
					'" aria-selected="false" class="nav-link">' +
					'<i class="wi wi-lightning"></i>' +
					'</a>' +
					'</li>' +
					'<li class="nav-item">' +
					'<a id="tabWeatherMoonToggle-' + this._uId + '" title="' +
					getI18n('weatherCube_viewMoon', this.options.language) + '" href="#tabWeatherMoon-' + this._uId +
					'" role="tab" aria-controls="tabWeatherMoon-' + this._uId +
					'" aria-selected="false" class="nav-link">' +
					'<i class="wi wi-moon-waxing-crescent-3"></i>' +
					'</a>' +
					'</li>' +
					'<li class="nav-item">' +
					'<a id="tabWeatherQuakeToggle-' + this._uId + '" title="' +
					getI18n('weatherCube_viewQuakes', this.options.language) + '" href="#tabWeatherQuake-' + this._uId +
					'" role="tab" aria-controls="tabWeatherQuake-' + this._uId +
					'" aria-selected="false" class="nav-link">' +
					'<i class="wi wi-earthquake"></i>' +
					'</a>' +
					'</li>' +
					'<li class="nav-item">' +
					'<a id="tabWeatherChartToggle-' + this._uId + '" title="' +
					getI18n('weatherCube_viewCharts', this.options.language) + '" href="#tabWeatherChart-' + this._uId +
					'" role="tab" aria-controls="tabWeatherChart-' + this._uId +
					'" aria-selected="false" class="nav-link">' +
					'<i class="wi wi-snowflake-cold"></i>' +
					'</a>' +
					'</li>' +
					'<li class="nav-item">' +
					'<a id="tabWeatherMapToggle-' + this._uId + '" title="' +
					getI18n('weatherCube_viewMaps', this.options.language) + '" href="#tabWeatherMap-' + this._uId +
					'" role="tab" aria-controls="tabWeatherMap-' + this._uId +
					'" aria-selected="false" class="nav-link">' +
					'<i class="wi wi-stars"></i>' +
					'</a>' +
					'</li>' +
					'</ul>' +
					'</nav>';
			},

			/***************************************************************************/

			createWeatherHeader: function()
			{
				return '<header class="weatherCube-header rounded-0 card-header d-flex flex-row align-items-center p-2">' +
					'<div class="weatherCube-header-logo font-weight-bold d-flex flex-row align-items-center">' +
					'<img src="data:image/png;base64,' + getImage(false, false) + '" alt="' +
					getI18n('weatherCube_title', this.options.language) + '" class="mr-2" />' +
					'<span class="card-text">' + getI18n('weatherCube_title', this.options.language) + '</span>' +
					'</div>' +
					'<div id="currentWeatherInterval-' + this._uId +
					'" class="weatherCube-header-carousel carousel slide font-weight-bold ml-auto mr-2" data-ride="carousel">' +
					'<div class="carousel-inner">' +
					'<div class="spinner-border spinner-border-sm text-danger mb-1" role="status"></div>' +
					'</div>' +
					'</div>' +
					'</header>';
			},

			/***************************************************************************/

			createWeatherFooter: function()
			{
				return '<footer class="weatherCube-footer rounded-0 text-left card-footer d-flex align-items-center flex-wrap-reverse p-2">' +
					'<samp class="weatherCube-footer-powered font-weight-bold small text-left mr-1">' +
					getI18n('weatherCube_powered', this.options.language) +
					'&nbsp;<a href="#" id="weatherCubeInfoToggle-' + this._uId + '">' +
					this.capitalizeFirstLetter(this._name) +
					'</a>.' +
					'</samp>' +
					'<samp id="weatherCube-detectedIP-' + this._uId +
					'" class="mr-auto font-weight-bold small"></samp>' +
					'<div class="weatherCube-footer-updated d-flex flex-row align-items-center font-weight-bold mr-2">' +
					'<i class="wi wi-time-4 w-wi-fw mr-2"></i>' +
					'<samp class="small font-weight-bold mr-3">' +
					getI18n('weatherCube_updated', this.options.language) + '&nbsp;<b id="weatherCube-update-' +
					this._uId + '">00:00&nbsp;-&nbsp;00-00-0000</b></samp>' +
					'<div id="weatherCube-footerLoader-' + this._uId +
					'" class="spinner-grow spinner-grow-sm" role="status"></div>' +
					'</div>' +
					'</footer>';
			},

			/***************************************************************************/

			createWeatherMoonData: function()
			{
				return '<div class="row no-gutters">' +
					'<div class="weatherCube-moonSeasons col-md-6">' +
					'<div class="d-flex">' +
					'<img id="weatherCube-seasonsImage-' + this._uId +
					'" src="" class="img-fluid d-none d-lg-block" alt="" />' +
					'<div class="alert flex-fill align-items-stretch rounded-0 m-0" role="alert">' +
					'<h5 class="alert-heading">' + getI18n('weatherCube_earthSeasons', this.options.language) +
					'</h5>' +
					'<div id="weatherCube-seasonsTable-' + this._uId + '" class="table-responsive"></div>' +
					'<hr />' +
					'<h5 class="alert-heading">' + getI18n('weatherCube_earthAstrology', this.options.language) +
					'</h5>' +
					'<div id="weatherCube-astronomyTable-' + this._uId +
					'" class="table-responsive text-center"></div>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'<div class="weatherCube-moonDesc col-md-6 text-center d-flex flex-column align-self-stretch">' +
					'<div class="alert rounded-0 alert-success" role="alert">' +
					'<h5 class="alert-heading">' + getI18n('weatherCube_moonPhaseToday', this.options.language) +
					'</h5>' +
					'<p class="h4 text-danger" id="currentMoonPhase-' + this._uId + '"></p>' +
					'<span class="h5">' + getI18n('weatherCube_moonFracillum', this.options.language) +
					'<b class="digital-numbers ml-2" id="currentMoonFracillum-' + this._uId + '"></b>' +
					'</span>' +
					'<hr class="m-0 p-0 mt-2">' +
					'<div class="d-flex justify-content-between">' +
					'<span>' +
					'<span class="card-text">' + getI18n('weatherCube_earthMoon', this.options.language) + '</span>' +
					'</span>' +
					'<span class="ml-auto">' +
					'<span class="card-text">' + getI18n('weatherCube_earthSun', this.options.language) + '</span>' +
					'</span>' +
					'</div>' +
					'<div class="d-flex justify-content-between"><span class="pb-1 pt-1">' +
					'<i class="wi wi-moonrise wi-fw mr-1"></i>' +
					'<span class="digital-numbers" id="moonRise-' + this._uId + '"></span>' +
					'</span>' +
					'<span class="ml-auto pb-1 pt-1">' +
					'<i class="wi wi-sunrise wi-fw mr-1"></i>' +
					'<span class="digital-numbers" id="sunRise-' + this._uId + '"></span>' +
					'</span>' +
					'</div>' +
					'<div class="d-flex justify-content-between">' +
					'<span class="pb-1 pt-1">' +
					'<i class="wi wi-moonset wi-fw mr-1"></i>' +
					'<span class="digital-numbers" id="moonSet-' + this._uId + '"></span>' +
					'</span>' +
					'<span class="ml-auto pb-1 pt-1">' +
					'<i class="wi wi-sunset wi-fw mr-1"></i>' +
					'<span class="digital-numbers" id="sunSet-' + this._uId + '"></span>' +
					'</span>' +
					'</div>' +
					'</div>' +
					'<div id="weatherMoon-' + this._uId + '"></div>' +
					'<div class="alert rounded-0 alert-info mt-auto mb-0" role="alert">' +
					'<h4 class="alert-heading">' + getI18n('weatherCube_earthSolar', this.options.language) + '</h4>' +
					'<p id="currentEclipsesData-' + this._uId + '"></p>' +
					'</div>' +
					'</div>' +
					'<div class="weatherCube-moonCalendar table-responsive col-md-12 d-none d-xl-block">' +
					'<table id="moonCalendar-' + this._uId +
					'" class="weatherCube-moonTable table table-sm table-striped table-borderless w-100 m-0">' +
					'<thead></thead>' +
					'<tbody></tbody>' +
					'</table>' +
					'</div>' +
					'</div>';
			},

			/***************************************************************************/

			createWeatherInfoModal: function()
			{
				return '<div class="modal fade" id="weatherCubeInfo-' + this._uId +
					'" tabindex="-1" role="dialog" aria-labelledby="weatherCubeInfoModal-' + this._uId +
					'" aria-hidden="true">' +
					'<div class="modal-dialog" role="document">' +
					'<div class="modal-content rounded-0">' +
					'<header class="modal-header bg-danger rounded-0 p-2">' +
					'<h6 class="modal-title text-warning font-weight-bold" id="weatherCubeInfoModal-' + this._uId +
					'">' + getI18n('weatherCube_vendors', this.options.language) + '</h6>' +
					'</header>' +
					'<div class="modal-body bg-dark">' +
					'<div class="media">' +
					'<div class="media-body weatherInfoContent d-flex align-items-center">' +
					'<div class="pt-2">' +
					'<a href="https://en.sat24.com/en/" title="Sat24">' +
					'<img src="data:image/png;base64,' + getImage('weatherInfo', 1) +
					'" class="img-fluid weatherInfoImage" alt="Sat24" />' +
					'</a>' +
					'<a href="https://www.esri.com/en-us/home" title="Esri">' +
					'<img src="data:image/png;base64,' + getImage('weatherInfo', 2) +
					'" class="img-fluid weatherInfoImage" alt="Esri" />' +
					'</a>' +
					'<a href="https://openweathermap.org/" title="OpenWeatherMap">' +
					'<img src="data:image/png;base64,' + getImage('weatherInfo', 3) +
					'" class="img-fluid weatherInfoImage" alt="OpenWeatherMap" />' +
					'</a><br />' +
					'<a href="https://www.meteoalarm.eu/" title="MeteoAlarm">' +
					'<img src="data:image/png;base64,' + getImage('weatherInfo', 4) +
					'" class="img-fluid weatherInfoImage" alt="MeteoAlarm" />' +
					'</a>' +
					'<a href="https://www.usgs.gov/" title="USGS">' +
					'<img src="data:image/png;base64,' + getImage('weatherInfo', 5) +
					'" class="img-fluid weatherInfoImage" alt="USGS" />' +
					'</a>' +
					'<a href="https://www.usno.navy.mil/" title="US Navy">' +
					'<img src="data:image/png;base64,' + getImage('weatherInfo', 6) +
					'" class="img-fluid weatherInfoImage" alt="US Navy" />' +
					'</a>' +
					'</div>' +
					'</div>' +
					'<a href="https://mcx-systems.net" title="MCX-Systems" target="_blank">' +
					'<img src="data:image/png;base64,' + getImage('weatherInfo', 0) + '" alt="MCX-Systems" />' +
					'</a>' +
					'</div>' +
					'</div>' +
					this.createWeatherModalCopyright() +
					'</div>' +
					'</div>';
			},

			/***************************************************************************/

			createWeatherVersionModal: function()
			{
				return '<div class="modal fade" id="weatherCubeVersion-' + this._uId +
					'" tabindex="-1" role="dialog" aria-labelledby="weatherCubeInfoVersion-' + this._uId +
					'" aria-hidden="true">' +
					'<div class="modal-dialog" role="document">' +
					'<div class="modal-content rounded-0">' +
					'<header class="modal-header bg-danger rounded-0 p-2">' +
					'<h6 class="modal-title text-warning font-weight-bold" id="weatherCubeInfoVersion-' + this._uId +
					'">' + this.capitalizeFirstLetter(this._name) + '&nbsp;' + this._version + '</h6>' +
					'</header>' +
					'<div class="modal-body text-white font-weight-bold bg-dark">' +
					'<div class="d-flex align-items-center">' +
					'<div class="text-left ml-2">' +
					'<h5 class="font-weight-bold">' +
					'<a href="https://jquery.com" class="ml-auto" title="Go to jquery.com" target="_blank">Jquery</a>:&nbsp;' +
					'<span id="versionJQuery-' + this._uId + '" class="text-warning"></span>' +
					'</h5>' +
					'<h5 class="font-weight-bold">' +
					'<a href="https://getbootstrap.com" class="ml-auto" title="Go to getbootstrap.com" target="_blank">Bootstrap</a>:&nbsp;' +
					'<span id="versionBootstrap-' + this._uId + '" class="text-warning"></span>' +
					'</h5>' +
					'<h5 class="font-weight-bold">' +
					'<a href="https://leafletjs.com" class="ml-auto" title="Go to leafletjs.com" target="_blank">Leaflet</a>:&nbsp;' +
					'<span id="versionLeaflet-' + this._uId + '" class="text-warning"></span>' +
					'</h5>' +
					'<h5 class="font-weight-bold">' +
					'<a href="https://echarts.apache.org" class="ml-auto" title="Go to echarts.apache.org" target="_blank">ECharts</a>:&nbsp;' +
					'<span id="versionECharts-' + this._uId + '" class="text-warning"></span>' +
					'</h5>' +
					'</div>' +
					'<a href="https://weathercube.mcx-systems.com" class="ml-auto" title="WeatherCube" target="_blank">' +
					'<img src="data:image/png;base64,' + getImage(false, false) + '" alt="WeatherCube" />' +
					'</a>' +
					'</div>' +
					'</div>' +
					this.createWeatherModalCopyright() +
					'</div>' +
					'</div>' +
					'</div>';
			},

			/***************************************************************************/

			createWeatherAlertsModal: function()
			{
				return '<div class="weatherCube-modal modal fade" id="weatherCubeAlerts-' + this._uId +
					'" tabindex="-1" role="dialog" aria-labelledby="weatherCubeAlerts-' + this._uId +
					'" aria-hidden="true">' +
					'<div class="modal-dialog modal-full" role="document">' +
					'<div class="modal-content alert-weather rounded-0">' +
					'<div class="modal-body font-weight-bold small d-flex align-self-stretch flex-column">' +
					'<div id="alertsInterval-' + this._uId +
					'" class="weatherCube-alertsCarousel carousel slide" data-interval="true" data-ride="carousel" data-interval="4000"> ' +
					'<div id="weatherCube-alertsCarousel-' + this._uId + '" class="carousel-inner"></div>' +
					'</div>' +
					'<footer class="d-flex justify-content-end align-items-center rounded-0 p-2">' +
					'<button type="button" class="btn btn-info btn-sm" data-dismiss="modal">' +
					getI18n('weatherCube_close', this.options.language) + '</button>' +
					'</footer>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'</div>';
			},

			/***************************************************************************/

			createWeatherBeaufortModal: function()
			{
				return '<div class="weatherCube-modal modal fade" id="weatherCubeBeaufort-' + this._uId +
					'" tabindex="-1" role="dialog" aria-labelledby="weatherCubeBeaufort-' + this._uId +
					'" aria-hidden="true">' +
					'<div class="modal-dialog modal-full" role="document">' +
					'<div class="modal-content rounded-0">' +
					'<div class="modal-body">' +
					'<table class="table table-bordered table-striped small">' +
					'<tbody>' +
					'<tr class="text-center">' +
					'<th style="background-color:#FFFFFF;">' +
					'<span title="' + getI18n('weatherCube_beaufortScale_0', this.options.language) +
					':&nbsp;<1 mph (<0.3 m/s)">0</span>' +
					'</th>' +
					'<th style="background-color:#CCFFFF;">' +
					'<span title="' + getI18n('weatherCube_beaufortScale_1', this.options.language) +
					':&nbsp;1-3&nbsp;mph (0.3-1.5&nbsp;m/s)">1</span>' +
					'</th>' +
					'<th style="background-color:#99FFCC;">' +
					'<span title="' + getI18n('weatherCube_beaufortScale_2', this.options.language) +
					':&nbsp;4-7&nbsp;mph (1.6-3.3&nbsp;m/s)">2</span>' +
					'</th>' +
					'<th style="background-color:#99FF99;">' +
					'<span title="' + getI18n('weatherCube_beaufortScale_3', this.options.language) +
					':&nbsp;8-12&nbsp;mph (3.4-5.5&nbsp;m/s)">3</span>' +
					'</th>' +
					'<th style="background-color:#99FF66;">' +
					'<span title="' + getI18n('weatherCube_beaufortScale_4', this.options.language) +
					':&nbsp;13-18&nbsp;mph (5.5-7.9&nbsp;m/s)">4</span>' +
					'</th>' +
					'<th style="background-color:#99FF00;">' +
					'<span title="' + getI18n('weatherCube_beaufortScale_5', this.options.language) +
					':&nbsp;19-24&nbsp;mph (8.0-10.7&nbsp;m/s)">5</span>' +
					'</th>' +
					'<th style="background-color:#CCFF00;">' +
					'<span title="' + getI18n('weatherCube_beaufortScale_6', this.options.language) +
					':&nbsp;25-31&nbsp;mph (10.8-13.8&nbsp;m/s)">6</span>' +
					'</th>' +
					'<th style="background-color:#FFFF00;">' +
					'<span title="' + getI18n('weatherCube_beaufortScale_7', this.options.language) +
					':&nbsp;32-38&nbsp;mph (13.9-17.1&nbsp;m/s)">7</span>' +
					'</th>' +
					'<th style="background-color:#FFCC00;">' +
					'<span title="' + getI18n('weatherCube_beaufortScale_8', this.options.language) +
					':&nbsp;39-46&nbsp;mph (17.2-20.7&nbsp;m/s)">8</span>' +
					'</th>' +
					'<th style="background-color:#FF9900;">' +
					'<span title="' + getI18n('weatherCube_beaufortScale_9', this.options.language) +
					':&nbsp;47-54&nbsp;mph (20.8-24.4&nbsp;m/s)">9</span>' +
					'</th>' +
					'<th style="background-color:#FF6600;">' +
					'<span title="S' + getI18n('weatherCube_beaufortScale_10', this.options.language) +
					':&nbsp;55-63&nbsp;mph (24.5-28.4&nbsp;m/s)">10</span>' +
					'</th>' +
					'<th style="background-color:#FF3300;">' +
					'<span title="' + getI18n('weatherCube_beaufortScale_11', this.options.language) +
					':&nbsp;64-72&nbsp;mph (28.5-32.6&nbsp;m/s)">11</span>' +
					'</th>' +
					'<th style="background-color:#FF0000;">' +
					'<span title="' + getI18n('weatherCube_beaufortScale_12', this.options.language) +
					':&nbsp;≥73&nbsp;mph (≥32.7&nbsp;m/s)">12</span>' +
					'</th>' +
					'</tr>' +
					'<tr class="text-center">' +
					'<td><small>' + getI18n('weatherCube_beaufortScale_0', this.options.language) + '</small></td>' +
					'<td><small>' + getI18n('weatherCube_beaufortScale_1', this.options.language) + '</small></td>' +
					'<td><small>' + getI18n('weatherCube_beaufortScale_2', this.options.language) + '</small></td>' +
					'<td><small>' + getI18n('weatherCube_beaufortScale_3', this.options.language) + '</small></td>' +
					'<td><small>' + getI18n('weatherCube_beaufortScale_4', this.options.language) + '</small></td>' +
					'<td><small>' + getI18n('weatherCube_beaufortScale_5', this.options.language) + '</small></td>' +
					'<td><small>' + getI18n('weatherCube_beaufortScale_6', this.options.language) + '</small></td>' +
					'<td><small>' + getI18n('weatherCube_beaufortScale_7', this.options.language) + '</small></td>' +
					'<td><small>' + getI18n('weatherCube_beaufortScale_8', this.options.language) + '</small></td>' +
					'<td><small>' + getI18n('weatherCube_beaufortScale_9', this.options.language) + '</small></td>' +
					'<td><small>' + getI18n('weatherCube_beaufortScale_10', this.options.language) + '</small></td>' +
					'<td><small>' + getI18n('weatherCube_beaufortScale_11', this.options.language) + '</small></td>' +
					'<td><small>' + getI18n('weatherCube_beaufortScale_12', this.options.language) + '</small></td>' +
					'</tr>' +
					'<tr class="text-center text-warning font-weight-bold">' +
					'<td colspan="6"><h6>' + getI18n('weatherCube_beaufortForce_1', this.options.language) +
					'</h6></td>' +
					'<td colspan="2"><h6>' + getI18n('weatherCube_beaufortForce_2', this.options.language) +
					'</h6></td>' +
					'<td colspan="2"><h6>' + getI18n('weatherCube_beaufortForce_3', this.options.language) +
					'</h6></td>' +
					'<td colspan="2"><h6>' + getI18n('weatherCube_beaufortForce_4', this.options.language) +
					'</h6></td>' +
					'<td><h6>' + getI18n('weatherCube_beaufortForce_5', this.options.language) + '</h6></td>' +
					'</tr>' +
					'<tr class="text-center">' +
					'<td><span>&lt;1&nbsp;mph<br />&lt;1&nbsp;knot<br />&lt;0.3&nbsp;m/s</span></td>' +
					'<td><span>1-3&nbsp;mph<br />1-3&nbsp;knots<br />0.3-1.5&nbsp;m/s</span></td>' +
					'<td><span>4-7&nbsp;mph<br />4-6&nbsp;knots<br />1.6-3.3&nbsp;m/s</span></td>' +
					'<td><span>8-12&nbsp;mph<br />7-10&nbsp;knots<br />3.4-5.5&nbsp;m/s</span></td>' +
					'<td><span>13-18&nbsp;mph<br />11-16&nbsp;knots<br />5.5-7.9&nbsp;m/s</span></td>' +
					'<td><span>18-24&nbsp;mph<br />17-21&nbsp;knots<br />8.0-10.7&nbsp;m/s</span></td>' +
					'<td><span>25-31&nbsp;mph<br />22-27&nbsp;knots<br />10.8-13.8&nbsp;m/s</span></td>' +
					'<td><span>31-38&nbsp;mph<br />28-33&nbsp;knots<br />13.9-17.1&nbsp;m/s</span></td>' +
					'<td><span>39-46&nbsp;mph<br />34-40&nbsp;knots<br />17.2-20.7&nbsp;m/s</span></td>' +
					'<td><span>47-54&nbsp;mph<br />41-47&nbsp;knots<br />20.8-24.4&nbsp;m/s</span></td>' +
					'<td><span>55-63&nbsp;mph<br />48-55&nbsp;knots<br />24.5-28.4&nbsp;m/s</span></td>' +
					'<td><span>64-72&nbsp;mph<br />56-63&nbsp;knots<br />28.5-32.6&nbsp;m/s</span></td>' +
					'<td><span>&ge;73&nbsp;mph73<br />&ge;63&nbsp;knots<br />&ge;32.7&nbsp;m/s</span></td>' +
					'</tr>' +
					'</tbody>' +
					'</table>' +
					'<footer class="d-flex justify-content-end align-items-center rounded-0 p-2">' +
					'<button type="button" class="btn btn-info btn-sm" data-dismiss="modal">' +
					getI18n('weatherCube_close', this.options.language) + '</button>' +
					'</footer>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'</div>';
			},

			/***************************************************************************/

			createWeatherUviModal: function()
			{
				return '<div class="weatherCube-modal modal fade" id="weatherCubeUviModal-' + this._uId +
					'" tabindex="-1" role="dialog" aria-labelledby="weatherCubeUviModal-' + this._uId +
					'" aria-hidden="true">' +
					'<div class="modal-dialog modal-full" role="document">' +
					'<div class="modal-content rounded-0">' +
					'<div class="modal-body">' +
					'<table class="uviTableInfo table table-borderless mb-0">' +
					'<thead>' +
					'<tr class="uviTableInfo-tr">' +
					'<th class="m-2 p-4 text-center bg-primary">' +
					'<samp class="h2 digital-numbers font-weight-bold">1</samp>' +
					'</th>' +
					'<th class="m-2 p-4 text-center bg-primary">' +
					'<samp class="h2 digital-numbers font-weight-bold">2</samp>' +
					'</th>' +
					'<th class="m-2 p-4 text-center bg-success">' +
					'<samp class="h2 digital-numbers font-weight-bold">3</samp>' +
					'</th>' +
					'<th class="m-2 p-4 text-center bg-success">' +
					'<samp class="h2 digital-numbers font-weight-bold">4</samp>' +
					'</th>' +
					'<th class="m-2 p-4 text-center bg-success">' +
					'<samp class="h2 digital-numbers font-weight-bold">5</samp>' +
					'</th>' +
					'<th class="m-2 p-4 text-center bg-warning">' +
					'<samp class="h2 digital-numbers font-weight-bold">6</samp>' +
					'</th>' +
					'<th class="m-2 p-4 text-center bg-warning">' +
					'<samp class="h2 digital-numbers font-weight-bold">7</samp>' +
					'</th>' +
					'<th class="m-2 p-4 text-center bg-danger">' +
					'<samp class="h2 digital-numbers font-weight-bold">8</samp>' +
					'</th>' +
					'<th class="m-2 p-4 text-center bg-danger">' +
					'<samp class="h2 digital-numbers font-weight-bold">9</samp>' +
					'</th>' +
					'<th class="m-2 p-4 text-center bg-danger">' +
					'<samp class="h2 digital-numbers font-weight-bold">10</samp>' +
					'</th>' +
					'<th class="m-2 p-4 text-center bg-secondary">' +
					'<samp class="h2 digital-numbers font-weight-bold">11&nbsp;-&nbsp;16</samp>' +
					'</th>' +
					'</tr>' +
					'<tr class="uviTableInfo-tr">' +
					'<th colspan="3" class="bg-primary">' +
					'<samp class="h4 font-weight-bold">' +
					getI18n('weatherCube_currentIndexLow', this.options.language) + '</samp>' +
					'</th>' +
					'<th colspan="2" class="bg-success">' +
					'<samp class="h4 font-weight-bold">' +
					getI18n('weatherCube_currentIndexModerate', this.options.language) + '</samp>' +
					'</th>' +
					'<th colspan="3" class="bg-warning">' +
					'<samp class="h4 font-weight-bold">' +
					getI18n('weatherCube_currentIndexHigh', this.options.language) + '</samp>' +
					'</th>' +
					'<th colspan="2" class="bg-danger">' +
					'<samp class="h4 font-weight-bold">' +
					getI18n('weatherCube_currentIndexVeryHigh', this.options.language) + '</samp>' +
					'</th>' +
					'<th colspan="1" class="bg-secondary">' +
					'<samp class="h4 font-weight-bold">' +
					getI18n('weatherCube_currentIndexExtreme', this.options.language) + '</samp>' +
					'</th>' +
					'</tr>' +
					'</thead>' +
					'<tbody>' +
					'<tr>' +
					'<td colspan="3" class="border-success p-2">' +
					'<div class="alert alert-primary" role="alert">' +
					'<span class="h6 p-1">' +
					getI18n('weatherCube_currentIndexLowDesc', this.options.language) +
					'</span>' +
					'</div>' +
					'</td>' +
					'<td colspan="3" class="border-warning p-2">' +
					'<div class="alert alert-success" role="alert">' +
					'<span class="h6 p-1">' +
					getI18n('weatherCube_currentIndexModerateDesc', this.options.language) +
					'</span>' +
					'</div>' +
					'</td>' +
					'<td colspan="3" class="border-danger p-2">' +
					'<div class="alert alert-warning" role="alert">' +
					'<span class="h6 p-1">' +
					getI18n('weatherCube_currentIndexHighDesc', this.options.language) +
					'</span>' +
					'</div>' +
					'</td>' +
					'<td colspan="2" class="border-dark p-2">' +
					'<div class="alert alert-danger" role="alert">' +
					'<span class="h6 p-1">' +
					getI18n('weatherCube_currentIndexExtremeDesc', this.options.language) +
					'</span>' +
					'</div>' +
					'</td>' +
					'</tr>' +
					'</tbody>' +
					'</table>' +
					'<footer class="d-flex justify-content-end align-items-center rounded-0 p-2">' +
					'<button type="button" class="btn btn-info btn-sm" data-dismiss="modal">' +
					getI18n('weatherCube_close', this.options.language) + '</button>' +
					'</footer>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'</div>';
			},

			/***************************************************************************/

			createWeatherTimeModal: function()
			{
				let widget = this;
				let opts = {
					imgUrl: 'https://api.usno.navy.mil/imagery/earth.png?date=' + widget.formatTime($.now(), 1) +
						'&time=' + widget.formatTime($.now(), 2),
					beforeLoad: function()
					{
					},
					complete: function()
					{
						widget.$element.find('#weatherCube-timeDayOverlay-' + widget._uId).hide('slow');
						widget.$element.find('#weatherCube-timeDayOverlay-' + widget._uId).empty();
					},
					success: function(e)
					{
						widget.$element.find('#weatherCube-timeDayImage-' + widget._uId).attr('src', e.imageElem.src);
						if (widget.options.debug)
						{
							console.info('Successfully loaded timeDay image');
						}
						widget.$element.find('#weatherCube-loaderText-' + widget._uId)
							.text(getI18n('weatherCube_ready', widget.options.language));
					},
					error: function()
					{
						widget.$element.find('#weatherCube-loaderText-' + widget._uId)
							.text(getI18n('weatherCube_getSatErrors', widget.options.language));
						if (widget.options.debug)
						{
							console.error('Error loading timeDay image');
						}
					}
				};

				// Load each Image
				widget.loadSatImage(opts);

				return '<div class="weatherCube-modal modal fade" id="weatherCubeTimeModal-' + this._uId +
					'" tabindex="-1" role="dialog" aria-labelledby="weatherCubeTimeModal-' + this._uId +
					'" aria-hidden="true">' +
					'<div class="modal-dialog modal-full" role="document">' +
					'<div class="modal-content rounded-0">' +
					'<div class="modal-body p-3 m-0">' +
					'<div class="row no-gutters">' +
					'<div class="col-md-4 col-sm-12">' +
					'<div class="embed-responsive embed-responsive-16by9">' +
					'<iframe class="embed-responsive-item" src="https://www.youtube-nocookie.com/embed/7pRev3usGPA?controls=0&rel=0&autoplay=1"></iframe>' +
					'</div>' +
					'</div>' +
					'<div class="col-md-4 col-sm-12 text-center">' +
					'<button type="button" class="btn btn-info btn-lg" data-dismiss="modal">' +
					getI18n('weatherCube_close', this.options.language) + '</button>' +
					'</div>' +
					'<div class="col-md-4 col-sm-12">' +
					'<div id="weatherCube-timeDayOverlay-' + this._uId + '" class="weatherCube-loader-overlay">' +
					this.createWeatherLoader() + '</div>' +
					'<img id="weatherCube-timeDayImage-' + this._uId +
					'" src="#" class="img-fluid h-100" alt="Current Time Zone" />' +
					'</div>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'</div>';
			},

			/***************************************************************************/

			createEarthquakePopup: function(strength, tsunami)
			{
				return '<div class="earthquake-popup">' +
					'<h6 class="text-center text-warning">' +
					getI18n('weatherCube_currentForecastEarthquakes', this.options.language) + '</h6>' +
					'<div class="d-flex flex-column align-self-center align-items-center justify-content-center flex-grow-1 mr-2 text-left">' +
					'<h1 class="text-bold mr-2 digital-font text-warning d-flex align-self-center align-items-center justify-content-center">' +
					'<i class="wi wi-earthquake wi-fw text-warning"></i>' +
					strength +
					'</h1>' +
					'<hr class="p-1 m-0 w-75" />' +
					'<span class="text-uppercase font-weight-bold">' +
					getI18n('weatherCube_earthquakesTsunami', this.options.language) +
					tsunami +
					'</span>' +
					'</div>' +
					'</div>';
			},

			/***************************************************************************/

			createWeatherModalCopyright: function()
			{
				/// <summary>
				/// s this instance.
				/// </summary>
				/// <returns></returns>
				return '<footer class="modal-footer d-flex align-items-center bg-dark rounded-0 p-2">' +
					'<span class="text-warning font-weight-bold mr-auto h6 pt-2">Copyright&nbsp;&copy;&nbsp;2007&nbsp;-&nbsp;' +
					new Date().getFullYear().toString() +
					',&nbsp;<a href="https://mcx-systems.net">MCX-Systems&reg;</a>.</span>' +
					'<button type="button" class="btn btn-info btn-sm" data-dismiss="modal">' +
					getI18n('weatherCube_close', this.options.language) + '</button>' +
					'</footer>';
			},

			/***************************************************************************/

			createWeatherLoader: function()
			{
				return '<div class="spinner-border spinner-border-sm text-danger mb-1" role="status" style="width:3rem;height:3rem;"></div>';
			},

			/***************************************************************************/

			// Remove plugin instance completely
			destroy: function()
			{
				/*
					The destroy method unbinds all events for the specific instance
					of the plugin, then removes all plugin data that was stored in
					the plugin instance using jQuery's .removeData method.
	
					Since we store data for each instance of the plugin in its
					instantiating element using the $.data method (as explained
					in the plugin wrapper below), we can call methods directly on
					the instance outside of the plugin initialization, ie:
					$('selector').data('plugin_myPluginName').someOtherFunction();
	
					Consequently, the destroy method can be called using:
					$('selector').data('plugin_myPluginName').destroy();
				*/
				this.unbindEvents();
				this.$element.removeData();
			},

			/***************************************************************************/

			// Cache DOM nodes for performance
			buildCache: function()
			{
				/*
					Create variable(s) that can be accessed by other plugin
					functions. For example, "this.$element = $(this.element);"
					will cache a jQuery reference to the element that initialized
					the plugin. Cached variables can then be used in other methods.
				*/
				this.$element = $(this.element);
			},

			/***************************************************************************/

			// Bind events that trigger methods
			bindEvents: function()
			{
				let plugin = this;

				// Require X clicks in Y seconds to trigger secret action
				const secondsForClicks = 1;
				const numClicksRequired = 5;
				const clickTimestamps = [numClicksRequired];

				let oldestIndex = 0;
				let nextIndex = 0;

				/*
					Bind event(s) to handlers that trigger other functions, ie:
					"plugin.$element.on('click', function() {});". Note the use of
					the cached variable we created in the buildCache method.
	
					All events are namespaced, ie:
					".on('click'+'.'+this._name', function() {});".
					This allows us to unbind plugin-specific events using the
					unbindEvents method below.
				*/
				plugin.$element.on('click touchstart' + '.' + plugin._name, '.weatherCube-alertDialog', function()
				{
					plugin.$element.find('#weatherCube-' + plugin._uId).append(plugin.createWeatherAlertsModal());
					plugin.$element.find('#weatherCubeAlerts-' + plugin._uId).modal({
						show: true,
						keyboard: false,
						backdrop: true
					}).on('hidden.bs.modal', function()
					{
						plugin.$element.find('#alertsInterval-' + plugin._uId).carousel('dispose');
						plugin.$element.find('#weatherCubeAlerts-' + plugin._uId).modal('dispose');
						plugin.$element.find('#weatherCubeAlerts-' + plugin._uId).remove();
					});

					let alerts = '';
					$.each(plugin._dataResult, function(i, item)
					{
						let active = '';

						if (i > 0)
						{
							if (i === 1)
							{
								active = 'active';
							}

							alerts += '<div id="alertsIntervalItem-' + plugin._uId + '-' + i +
								'" class="table-responsive carousel-item ' + active + '">' +
								'<div class="p-1 font-weight-bold text-left text-white">' + item.title + '</div>' +
								item.description +
								'</div>';
						}
					});

					plugin.$element.find('#alertsInterval-' + plugin._uId + ' .carousel-inner').empty().append(alerts);
					plugin.$element.find('.weatherCube-alertsCarousel table')
						.addClass('table table-sm table-striped table-bordered text-white');
					plugin.$element.find('#alertsInterval-' + plugin._uId).carousel({
						interval: 5000
					});

					// Appending modal background inside the div
					plugin.$element.find('.weatherCube .modal-full .modal-content').height(plugin.$element.height());
					$('.modal-backdrop').attr('id', 'backdrop-' + plugin._uId)
						.appendTo(plugin.$element.find('#weatherCube-' + plugin._uId));
				});

				plugin.$element.on('click touchstart' + '.' + plugin._name, '#weatherCubeInfoToggle-' + plugin._uId,
					function()
					{
						plugin.$element.find('#weatherCube-' + plugin._uId).append(plugin.createWeatherInfoModal());
						plugin.$element.find('#weatherCubeInfo-' + plugin._uId).modal({
							show: true,
							keyboard: false,
							backdrop: true
						});

						// Appending modal background inside the div
						$('.modal-backdrop').attr('id', 'backdrop-' + plugin._uId)
							.appendTo(plugin.$element.find('#weatherCube-' + plugin._uId));

						plugin.$element.find('#weatherCubeInfo-' + plugin._uId + ' a').tooltip({
							animation: true,
							trigger: 'hover'
						});
					});

				plugin.$element.on('hidden.bs.modal' + '.' + plugin._name, '#weatherCubeInfo-' + plugin._uId, function()
				{
					plugin.$element.find('#weatherCubeInfo-' + plugin._uId).modal('dispose');
					plugin.$element.find('#backdrop-' + plugin._uId).remove();
					plugin.$element.find('#weatherCubeInfo-' + plugin._uId).remove();
				});

				plugin.$element.on('hidden.bs.modal' + '.' + plugin._name, '#weatherCubeBeaufort-' + plugin._uId,
					function()
					{
						plugin.$element.find('#weatherCubeBeaufort-' + plugin._uId).modal('dispose');
						plugin.$element.find('#backdrop-' + plugin._uId).remove();
						plugin.$element.find('#weatherCubeBeaufort-' + plugin._uId).remove();
					});

				plugin.$element.on('shown.bs.modal' + '.' + plugin._name, '#weatherCubeBeaufort-' + plugin._uId,
					function()
					{
						plugin.$element.find('.table span').tooltip({
							animation: true,
							trigger: 'hover'
						});
					});

				plugin.$element.on('shown.bs.tab' + '.' + plugin._name, function(e)
				{
					let target = e.target.toString(); // newly activated tab
					let res = target.split('#');
					if (res[1] === 'tabWeatherChart-' + plugin._uId)
					{
						plugin._tempChart.resize();
						plugin._humidityChart.resize();
						plugin._pressureChart.resize();
						plugin._windChart.resize();
						plugin._tempWeekChart.resize();
						plugin._humidityWeekChart.resize();
						plugin._pressureWeekChart.resize();
						plugin._windWeekChart.resize();
					}
					else if (res[1] === 'tabWeatherMap-' + plugin._uId)
					{
						plugin._weatherMap.invalidateSize();
					}
					else if (res[1] === 'tabWeatherQuake-' + plugin._uId)
					{
						plugin._earthquakeChart.resize();
					}
				});

				plugin.$element.on('click touchstart' + '.' + plugin._name, '#weatherTab-' + plugin._uId + ' a',
					function(e)
					{
						e.preventDefault();
						$(this).tab('show');
					});

				plugin.$element.on('click touchstart' + '.' + plugin._name, '.beaufortScaleModal', function(e)
				{
					e.preventDefault();
					plugin.$element.find('#weatherCube-' + plugin._uId).append(plugin.createWeatherBeaufortModal());
					plugin.$element.find('#weatherCubeBeaufort-' + plugin._uId).modal({
						show: true,
						keyboard: false,
						backdrop: true
					});

					// Appending modal background inside the div
					plugin.$element.find('.weatherCube .modal-full .modal-content').height(plugin.$element.height());
					$('.modal-backdrop').attr('id', 'backdrop-' + plugin._uId)
						.appendTo(plugin.$element.find('#weatherCube-' + plugin._uId));
				});

				plugin.$element.on('click touchstart' + '.' + plugin._name, '#weatherCube-uviIndexTable-' + plugin._uId,
					function(e)
					{
						e.preventDefault();
						plugin.$element.find('#weatherCube-' + plugin._uId).append(plugin.createWeatherUviModal());
						plugin.$element.find('#weatherCubeUviModal-' + plugin._uId).modal({
							show: true,
							keyboard: false,
							backdrop: true
						});

						// Appending modal background inside the div
						plugin.$element.find('.weatherCube .modal-full .modal-content')
							.height(plugin.$element.height());
						$('.modal-backdrop').attr('id', 'backdrop-' + plugin._uId)
							.appendTo(plugin.$element.find('#weatherCube-' + plugin._uId));
					});

				plugin.$element.on('click touchstart' + '.' + plugin._name, '.weatherCube-timeTable', function(e)
				{
					e.preventDefault();
					plugin.$element.find('#weatherCube-' + plugin._uId).append(plugin.createWeatherTimeModal());
					plugin.$element.find('#weatherCubeTimeModal-' + plugin._uId).modal({
						show: true,
						keyboard: false,
						backdrop: true
					});

					// Appending modal background inside the div
					plugin.$element.find('.weatherCube .modal-full .modal-content').height(plugin.$element.height());
					$('.modal-backdrop').attr('id', 'backdrop-' + plugin._uId)
						.appendTo(plugin.$element.find('#weatherCube-' + plugin._uId));
				});

				plugin.$element.on('hidden.bs.modal' + '.' + plugin._name, '#weatherCubeTimeModal-' + plugin._uId,
					function()
					{
						plugin.$element.find('#weatherCubeTimeModal-' + plugin._uId).modal('dispose');
						plugin.$element.find('#backdrop-' + plugin._uId).remove();
						plugin.$element.find('#weatherCubeTimeModal-' + plugin._uId).remove();
					});

				plugin.$element.on('click touchstart' + '.' + plugin._name, function()
				{
					// Use the "call" method so that inside of the method being
					// called, ie: "someOtherFunction", the "this" keyword refers
					// to the plugin instance, not the event handler.
					// More: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
					const timeMillis = (new Date()).getTime();

					//If we have at least the min number of clicks on record
					if (nextIndex === numClicksRequired - 1 || oldestIndex > 0)
					{
						//Check that all required clicks were in required time
						let diff = timeMillis - clickTimestamps[oldestIndex];
						if (diff < secondsForClicks * 1000)
						{
							plugin.$element.find('#weatherCube-' + plugin._uId)
								.append(plugin.createWeatherVersionModal());
							plugin.$element.find('#weatherCubeVersion-' + plugin._uId).modal({
								show: true,
								keyboard: false,
								backdrop: true
							});

							let lString = leaflet.version.split('+');
							$('#versionJQuery-' + plugin._uId).html(window.jQuery.fn.jquery);
							$('#versionBootstrap-' + plugin._uId).html($.fn.tooltip.Constructor.VERSION);
							$('#versionLeaflet-' + plugin._uId).html(lString[0]);
							$('#versionECharts-' + plugin._uId).html(echarts.version);

							// Appending modal background inside the div
							$('.modal-backdrop').attr('id', 'backdrop-' + plugin._uId)
								.appendTo(plugin.$element.find('#weatherCube-' + plugin._uId));

							plugin.$element.find('#weatherCubeVersion-' + plugin._uId + ' a').tooltip({
								animation: true,
								trigger: 'hover'
							});

							if (plugin.options.debug)
							{
								console.info('You clicked 5 times (Quickly) on the widget, showing Widget Info!');
							}
						}

						oldestIndex++;
					}

					//If not done, record click time, and bump indices
					clickTimestamps[nextIndex] = timeMillis;
					nextIndex++;

					if (nextIndex === numClicksRequired)
					{
						nextIndex = 0;
					}

					if (oldestIndex === numClicksRequired)
					{
						oldestIndex = 0;
					}
				});
			},

			/***************************************************************************/

			// Unbind events that trigger methods
			unbindEvents: function()
			{
				/*
					Unbind all events in our plugin's namespace that are attached
					to "this.$element".
				*/
				this.$element.off('.' + this._name);
			},

			/***************************************************************************/

			createWeatherSatImages: function()
			{
				/// <summary>
				/// s the specified u identifier.
				/// </summary>
				/// <param name="uId">The u identifier.</param>
				/// <returns></returns>
				let widget = this;
				let urlHttps;
				let url;
				let satImage = '';
				let timezone = widget.getTimezoneName();
				timezone = timezone.replace('.', '_dot_');

				if (widget.options.satImageEnabled)
				{
					if (widget.options.debug)
					{
						console.info('Function for creating Satellite images called.');
					}

					let result = widget.options.satImageLocations;
					let imageSize = widget.options.satImageSize;

					if (result.length)
					{
						if (widget.options.debug)
						{
							console.info('Array of satellite images is set. It counts - ' + result.length + ' images.');
							console.info('--------------------------------------------');
						}

						widget.$element.find('#weatherCube-loaderText-' + widget._uId)
							.text(getI18n('weatherCube_getSatImages', widget.options.language));

						// Now loop trough each image and load src
						$.each(result, function(i, value)
						{
							/// <summary>
							/// s the specified i.
							/// </summary>
							/// <param name="i">The i.</param>
							/// <param name="value">The value.</param>
							/// <returns></returns>
							satImage += '<div class="col-sm-12 col-md-6 col-xl-3">' +
								'<div id="imageContainerLoader_' + i + '_' + widget._uId +
								'" class="weatherCube-loader-overlay">' + widget.createWeatherLoader() + '</div>' +
								'<img id="SatImage-' + widget._uId + '-' + i +
								'" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgAQMAAAAPH06nAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAADxJREFUeNrtwQENAAAAwiD7pzbHN2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHSX4AABBztEwQAAAABJRU5ErkJggg==" alt="Sat Image for region ' +
								value['region'] + '" class="img-fluid" />' +
								'</div>';

							// Check if provided region is valid if not exit loop
							if ($.inArray(value['region'], satImageRegions) < 0)
							{
								if (widget.options.debug)
								{
									console.info('Selected region is invalid: ' + value['region']);
								}

								return;
							}

							if (widget.options.debug)
							{
								console.info('Selected region is valid: ' + value['region']);
							}

							// Check what sort of image do we want. Animated GIF or static PNG
							if (value['animated'])
							{
								// Check if provided type is valid if not exit loop
								if ($.inArray(value['type'], satAnimatedImageTypes) < 0)
								{
									if (widget.options.debug)
									{
										console.error('Selected image type is invalid: ' + value['type'] +
											'. Allowed types are: ' + satAnimatedImageTypes.toString());
									}

									return;
								}

								if (widget.options.debug)
								{
									console.info('Selected Satellite image type is animated.');
								}

								url = apiSatAnimatedImage.replace('{0}', value['region']);
								url = url.replace('{1}', value['type']);
								url = url.replace('{2}', imageSize);

								if (timezone !== null && timezone !== '')
								{
									url = url.replace('{3}', timezone);
								}
								else
								{
									url = url.replace('{3}', '');
								}

								let randomNum = Math.floor(Math.random() * 10000000 + 1);
								url = url.replace('{4}', randomNum.toString());
								url = encodeURI(url);
								urlHttps = url.replace('http:', 'https:');
							}
							else
							{
								if ($.inArray(value['type'], satVisualImageTypes) < 0)
								{
									if (widget.options.debug)
									{
										console.error('Selected image type is invalid: ' + value['type'] +
											'. Allowed types are: ' + satVisualImageTypes.toString());
									}

									return;
								}

								if (widget.options.debug)
								{
									console.info('Selected Satellite image type is static.');
								}

								url = apiSatImage.replace('{0}', value['region']);
								url = url.replace('{1}', value['type']);
								url = encodeURI(url);
								urlHttps = url.replace('http:', 'https:');
							}

							if (widget.options.debug)
							{
								console.info('Everything seems to be ok. Try to load Image.');
								console.info('Getting visual satellite image for region: ' + value['region']);
							}

							let opts = {
								imgUrl: urlHttps,
								beforeLoad: function()
								{
								},
								complete: function()
								{
									widget.$element.find('#imageContainerLoader_' + i + '_' + widget._uId).hide('slow');
									widget.$element.find('#imageContainerLoader_' + i + '_' + widget._uId).empty();
								},
								success: function(e)
								{
									widget.$element.find('#SatImage-' + widget._uId + '-' + i)
										.attr('src', e.imageElem.src);
									widget.$element.find('#weatherCube-loaderText-' + widget._uId)
										.text(getI18n('weatherCube_getSatSuccess', widget.options.language));
									if (widget.options.debug)
									{
										console.info('Successfully loaded satellite image for region- ' +
											value['region']);
									}
									widget.$element.find('#weatherCube-loaderText-' + widget._uId)
										.text(getI18n('weatherCube_ready', widget.options.language));
								},
								error: function()
								{
									widget.$element.find('#weatherCube-loaderText-' + widget._uId)
										.text(getI18n('weatherCube_getSatErrors', widget.options.language));
									if (widget.options.debug)
									{
										console.error('Error loading satellite image for region- ' + value['region']);
									}
								}
							};

							// Load each Image
							widget.loadSatImage(opts);

							if (widget.options.debug)
							{
								console.info('--------------------------------------------');
							}
						});
					}
					else
					{
						satImage += '<div class="col-12 text-center p-3 pb-1">' +
							'<div class="alert alert-danger" role="alert">' +
							'<i class="wi wi-snowflake-cold mr-2"></i>' +
							'<strong>' + getI18n('weatherCube_satNotSet', widget.options.language) + '</strong>' +
							'</div></div>';

						if (widget.options.debug)
						{
							console.warn('Weather Satellite Images, are not set!');
						}
					}
				}
				else
				{
					satImage += '<div class="col-12 text-center p-3 pb-1">' +
						'<div class="alert alert-danger" role="alert">' +
						'<i class="wi wi-snowflake-cold mr-2"></i>' +
						'<strong>' + getI18n('weatherCube_satError', widget.options.language) + '</strong>' +
						'</div></div>';

					if (widget.options.debug)
					{
						console.warn('Weather Satellite Images, are disabled!');
					}
				}

				widget.$element.find('#imagesContainer-' + widget._uId).empty().append(satImage);
				setTimeout(function()
				{
					widget.$element.find('#weatherCube-loaderText-' + widget._uId)
						.text(getI18n('weatherCube_getSatAll', widget.options.language));
					setTimeout(function()
					{
						widget.$element.find('#weatherCube-spinner-' + widget._uId).hide();
						widget.$element.find('#weatherCube-footerLoader-' + widget._uId).css('color', 'green');
						widget.$element.find('#weatherCube-update-' + widget._uId).text(widget.formatTime($.now(), 0));
						widget.$element.find('#weatherCube-loaderText-' + widget._uId)
							.text(getI18n('weatherCube_ready', widget.options.language));
					}, 2000);
				}, 4000);
			},

			/***************************************************************************/

			createWeatherMap: function()
			{
				let widget = this;
				let standard = leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					maxZoom: 19,
					attribution:
						'MCX-Systems © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors</a>'
				});

				let standardHot = leaflet.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
					maxZoom: 19,
					attribution:
						'MCX-Systems © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors</a>' +
							'Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> ' +
							'hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
				});

				let esriImagery = leaflet.tileLayer(
					'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg',
					{
						maxZoom: 19,
						attribution:
							'MCX-Systems © Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
					});

				let esriStreet = leaflet.tileLayer(
					'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
					{
						maxZoom: 19,
						attribution:
							'MCX-Systems © Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
					});

				let lat = widget._locationLat;
				let lon = widget._locationLon;

				const baseAttr =
					'MCX-Systems © Weather from <a href="https://openweathermap.org/" title="World Map and worldwide Weather Forecast online">OpenWeatherMap</a>';
				let baseUrl = 'https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={api_key}';

				let openWeatherPrecipitation = leaflet.tileLayer(baseUrl, {
					layer: 'precipitation_new',
					api_key: widget.options.apiKey,
					attribution: baseAttr
				});

				let openWeatherWind = leaflet.tileLayer(baseUrl, {
					layer: 'wind_new',
					api_key: widget.options.apiKey,
					attribution: baseAttr
				});

				let openWeatherTemp = leaflet.tileLayer(baseUrl, {
					layer: 'temp_new',
					api_key: widget.options.apiKey,
					attribution: baseAttr
				});

				let openWeatherPressure = leaflet.tileLayer(baseUrl, {
					layer: 'pressure_new',
					api_key: widget.options.apiKey,
					attribution: baseAttr
				});

				let openWeatherClouds = leaflet.tileLayer(baseUrl, {
					layer: 'clouds_new',
					api_key: widget.options.apiKey,
					attribution: baseAttr
				});

				let openWeatherRain = leaflet.tileLayer(baseUrl, {
					layer: 'rain_new',
					api_key: widget.options.apiKey,
					attribution: baseAttr
				});

				widget._weatherMap = leaflet.map('weatherCube-map-' + widget._uId, {
					center: new leaflet.LatLng(lat, lon), zoom: 3,
					layers: [esriImagery]
				});
				widget._weatherMap.attributionControl.setPrefix('');

				let baseMaps = {
					'OSM HOT': standardHot,
					'OSM Standard': standard,
					'ESRI Imagery': esriImagery,
					'ESRI Street': esriStreet
				};

				let overlayMaps = {};
				overlayMaps[getI18n('weatherCube_currentForecastPrecipitation', widget.options.language)] =
					openWeatherPrecipitation;
				overlayMaps[getI18n('weatherCube_currentForecastWind', widget.options.language)] = openWeatherWind;
				overlayMaps[getI18n('weatherCube_currentForecastClouds', widget.options.language)] = openWeatherClouds;
				overlayMaps[getI18n('weatherCube_currentForecastPressure', widget.options.language)] =
					openWeatherPressure;
				overlayMaps[getI18n('weatherCube_currentForecastRain', widget.options.language)] = openWeatherRain;
				overlayMaps[getI18n('weatherCube_currentForecastTemperature', widget.options.language)] =
					openWeatherTemp;
				overlayMaps[getI18n('weatherCube_currentForecastEarthquakes', widget.options.language)] =
					widget._earthquakesArray;

				leaflet.control.layers(baseMaps, overlayMaps, { collapsed: true }).addTo(widget._weatherMap);
				let popup = leaflet.popup();

				function onMapClick(e)
				{
					popup.setLatLng(e.latlng)
						.setContent(getI18n('weatherCube_mapClick', widget.options.language) + e.latlng.toString())
						.openOn(widget._weatherMap);
					console.info('Click on map Detected.');
				}

				widget._weatherMap.on('click', onMapClick);
			},

			/***************************************************************************/

			getWeatherQuakesData: function()
			{
				let widget = this;
				let retryCount = 0;

				let quakes_status = widget.statusLocalStorage('weather_quakes');
				let urlEarthQuake = apiEarthQuakesUrl.replace('{0}', widget.options.quakesPeriod);

				if (this.options.debug)
				{
					console.info('Updating earthquake data!');
				}

				// Has Data
				if (quakes_status)
				{
					// Get Cache
					let data = localStorage.getItem('weather_quakes');
					let myArray = JSON.parse(data);
					widget.parseWeatherQuakesData(myArray, 'Quakes data from local storage: ');
					// Expired or Empty Cache
					widget.$element.find('#weatherCube-loaderText-' + widget._uId)
						.text(getI18n('weatherCube_getQuakesCacheFeed', widget.options.language));
				}
				else
				{
					widget.$element.find('#weatherCube-loaderText-' + widget._uId)
						.text(getI18n('weatherCube_getQuakesLiveFeed', widget.options.language));

					$.ajax({
						url: urlEarthQuake,
						cache: false,
						success: function(result)
						{
							if (result === null)
							{
								return true;
							}

							if (widget.options.debug)
							{
								console.info('Success, getting data for: ' + urlEarthQuake);
							}

							widget.setLocalStorage('weather_quakes', JSON.stringify(result), widget.options.cache);
							let data = localStorage.getItem('weather_quakes');
							let dataArray = JSON.parse(data);
							widget.parseWeatherQuakesData(dataArray, 'Quakes data from local storage: ');

							widget.$element.find('#weatherCube-loaderText-' + widget._uId)
								.text(getI18n('weatherCube_getQuakesSuccessFeed', widget.options.language));
							retryCount = 0;

							return true;
						},
						error: function(xhr, textStatus, thrownError)
						{
							if (widget.options.debug)
							{
								console.error('Error getting JSON data from: ' + urlEarthQuake);
								console.error(thrownError + '\r' + xhr.statusText + '\r' + xhr.responseText);
							}
							widget.$element.find('#weatherCube-loaderText-' + widget._uId)
								.text(getI18n('weatherCube_getQuakesErrorFeed', widget.options.language));

							retryCount ++;

							if (retryCount <= widget.options.retryLimit)
							{
								// Try again
								widget.$element.find('#weatherCube-loaderText-' + widget._uId)
									.text(getI18n('weatherCube_getFeedTryAgain', widget.options.language));
								$.ajax(this);

								return false;
							}

							return false;
						}
					});
				}
			},

			parseWeatherQuakesData: function(data, message)
			{
				let widget = this;
				let html = '';

				if (widget.options.debug)
				{
					console.log(message, data);
				}

				if (widget.options.debug)
				{
					console.info('Updating current data!');
				}

				let earthquakeChartNames = [];
				let earthquakeChartStrength = [];

				widget._earthquakeChart.clear();
				widget._earthquakesArray.clearLayers();

				const LeafIcon = leaflet.Icon.extend({
					options: {
						iconSize: [95, 95]
					}
				});

				// Each each earthquake in a week
				$.each(data.features, function(i, item)
				{
					let style = 'alert-info';
					let tsunami = getI18n('weatherCube_earthquakesTsunamiNo', widget.options.language);

					if (item.properties.mag < 3)
					{
						style = 'alert-info';
					}
					else if (item.properties.mag > 3 && item.properties.mag < 5)
					{
						style = 'alert-warning';
					}
					else if (item.properties.mag > 5 && item.properties.mag < 14)
					{
						style = 'alert-danger';
					}
					else
					{
						style = 'alert-info';
					}

					if (item.properties.tsunami > 0)
					{
						tsunami = getI18n('weatherCube_earthquakesTsunamiYes', widget.options.language);
					}

					earthquakeChartNames.push(widget.formatTime(item.properties.time, true));
					earthquakeChartStrength.push(Math.round(item.properties.mag * 100) / 100);

					let coordLat = Math.round(item.geometry.coordinates[1] * 100) / 100;
					let coordLon = Math.round(item.geometry.coordinates[0] * 100) / 100;

					if (Math.round(item.properties.mag * 100) / 100 > 5)
					{
						let greenIcon = new LeafIcon({
							iconUrl: 'data:image/png;base64,' + getImage('quake', 0)
						});

						leaflet.marker([coordLat, coordLon], { icon: greenIcon })
							.bindPopup(widget.createEarthquakePopup(Math.round(item.properties.mag * 100) / 100,
								getI18n('weatherCube_earthquakesTsunami', widget.options.language)))
							.addTo(widget._earthquakesArray);
					}

					html += '<div class="alert ' + style + ' text-left" role="alert">' +
						'<samp class="mr-1">' + getI18n('weatherCube_earthquakesStatus', widget.options.language) +
						'<span class="text-uppercase badge bg-primary">' + item.properties.status + '</span></samp>' +
						'<h1 class="text-bold d-flex align-self-center align-items-center justify-content-end justify-content-sm-center ">' +
						'<i class="wi wi-earthquake wi-fw text-info"></i>' +
						'<samp class="digital-numbers pb-1">' + Math.round(item.properties.mag * 100) / 100 +
						'</samp>' +
						'</h1>' +
						'<p class="text-semibold d-flex align-self-center align-items-center justify-content-end justify-content-sm-center mr-2">' +
						item.properties.place +
						'</p>' +
						'<hr class="p-0 m-0 mt-1"/>' +
						'<div class="d-flex justify-content-between">' +
						'<div class="text-left">' +
						'<span class="text-semibold small">' +
						getI18n('weatherCube_earthquakesLatitude', widget.options.language) + '</span>' +
						'<samp class="text-semibold digital-numbers small ml-2">' +
						Math.round(item.geometry.coordinates[1] * 100) / 100 + '</samp>' +
						'<i class="wi wi-degrees"></i>' +
						'<hr class="p-0 m-0 mt-1"/>' +
						'<span class="text-semibold small">' +
						getI18n('weatherCube_earthquakesLongitude', widget.options.language) + '</span>' +
						'<samp class="text-semibold digital-numbers small ml-2">' +
						Math.round(item.geometry.coordinates[0] * 100) / 100 + '</samp>' +
						'<i class="wi wi-degrees"></i>' +
						'</div>' +
						'<div class="text-center">' +
						'<span class="text-semibold small">' +
						getI18n('weatherCube_earthquakesTime', widget.options.language) + '</span>' +
						'<samp class="text-semibold small digital-numbers">' +
						widget.formatTime(item.properties.time, 2, false) + '</samp>' +
						'<hr class="p-0 m-0 mt-1"/>' +
						'<samp class="text-semibold small digital-numbers">' +
						widget.formatTime(item.properties.time, 1, false) + '</samp>' +
						'</div>' +
						'<div class="text-right">' +
						'<span class="text-semibold small">' +
						getI18n('weatherCube_earthquakesTsunami', widget.options.language) + '</span>' +
						'<hr class="p-0 m-0 mt-1"/>' +
						'<h3 class="text-uppercase badge badge-danger">' + tsunami + '</h3>' +
						'</div>' +
						'</div>' +
						'</div>';
				});

				widget.$element.find('#weatherQuakesArea-' + widget._uId).empty().append(html);

				widget._earthquakeChart.setOption({
					tooltip: {
						formatter: '{a} <br/>{b}: {c} (Mw)'
					},
					grid: {
						bottom: '15%'
					},
					legend: {},
					yAxis: {
						type: 'value',
						axisLabel: {
							formatter: '{value} Mw',
							margin: 15
						}
					},
					xAxis: {
						type: 'category',
						data: earthquakeChartNames
					},
					dataZoom: [
						{
							startValue: '2014-06-01'
						}, {
							type: 'inside'
						}
					],
					visualMap: {
						top: 5,
						right: 5,
						pieces: [
							{
								gt: 0,
								lte: 1,
								color: 'rgb(0,153,102)'
							}, {
								gt: 1,
								lte: 2,
								color: 'rgb(255,222,51)'
							}, {
								gt: 2,
								lte: 5,
								color: 'rgb(255,153,51)'
							}, {
								gt: 5,
								color: 'rgb(189,40,27)'
							}
						],
						outOfRange: {
							color: 'rgb(153,153,153)'
						}
					},
					series: [
						{
							name: getI18n('weatherCube_earthquakesStrength', widget.options.language),
							data: earthquakeChartStrength,
							type: 'bar',
							markPoint: {
								data: [
									{ type: 'min',
										name: getI18n('weatherCube_earthquakesMaxStrength', widget.options.language) },
									{ type: 'max',
										name: getI18n('weatherCube_earthquakesMinStrength', widget.options.language) }
								]
							},
							markLine: {
								silent: true,
								data: [
									{
										yAxis: 1
									}, {
										yAxis: 2
									}, {
										yAxis: 4
									}, {
										yAxis: 5
									}, {
										yAxis: 12
									}
								]
							}
						}
					]
				});

				widget._earthquakeChart.hideLoading();

				if (widget.options.debug)
				{
					console.info('Earthquake list successfully updated!');
				}
			},

			/***************************************************************************/

			getWeatherAstronomyData: function()
			{
				let widget = this;
				let dt = new Date();
				let location = widget._locationLat + ',' + widget._locationLon;
				let calendar = widget.$element.find('#moonCalendar-' + widget._uId)[0];

				let row;
				let cell;
				let image;
				let first;

				let year = dt.getUTCFullYear();
				let month = dt.getUTCMonth() + 1;
				let day = dt.getUTCDate();

				let dayNames = [
					getI18n('weatherCube_monday', widget.options.language),
					getI18n('weatherCube_tuesday', widget.options.language),
					getI18n('weatherCube_wednesday', widget.options.language),
					getI18n('weatherCube_thursday', widget.options.language),
					getI18n('weatherCube_friday', widget.options.language),
					getI18n('weatherCube_saturday', widget.options.language),
					getI18n('weatherCube_sunday', widget.options.language)
				];

				let monthNames = [
					getI18n('weatherCube_january', widget.options.language),
					getI18n('weatherCube_february', widget.options.language),
					getI18n('weatherCube_march', widget.options.language),
					getI18n('weatherCube_april', widget.options.language),
					getI18n('weatherCube_may', widget.options.language),
					getI18n('weatherCube_june', widget.options.language),
					getI18n('weatherCube_july', widget.options.language),
					getI18n('weatherCube_august', widget.options.language),
					getI18n('weatherCube_september', widget.options.language),
					getI18n('weatherCube_october', widget.options.language),
					getI18n('weatherCube_november', widget.options.language),
					getI18n('weatherCube_december', widget.options.language)
				];

				let phaseNames = [
					getI18n('weatherCube_moonNewMoon', widget.options.language),
					getI18n('weatherCube_moonNewMoon', widget.options.language),
					getI18n('weatherCube_moonWaxingCrescent', widget.options.language),
					getI18n('weatherCube_moonWaxingCrescent', widget.options.language),
					getI18n('weatherCube_moonWaxingCrescent', widget.options.language),
					getI18n('weatherCube_moonWaxingCrescent', widget.options.language),
					getI18n('weatherCube_moonFirstQuarter', widget.options.language),
					getI18n('weatherCube_moonFirstQuarter', widget.options.language),
					getI18n('weatherCube_moonFirstQuarter', widget.options.language),
					getI18n('weatherCube_moonWaxingGibbous', widget.options.language),
					getI18n('weatherCube_moonWaxingGibbous', widget.options.language),
					getI18n('weatherCube_moonWaxingGibbous', widget.options.language),
					getI18n('weatherCube_moonWaxingGibbous', widget.options.language),
					getI18n('weatherCube_moonWaxingGibbous', widget.options.language),
					getI18n('weatherCube_moonFullMoon', widget.options.language),
					getI18n('weatherCube_moonFullMoon', widget.options.language),
					getI18n('weatherCube_moonWaningGibbous', widget.options.language),
					getI18n('weatherCube_moonWaningGibbous', widget.options.language),
					getI18n('weatherCube_moonWaningGibbous', widget.options.language),
					getI18n('weatherCube_moonWaningGibbous', widget.options.language),
					getI18n('weatherCube_moonWaningGibbous', widget.options.language),
					getI18n('weatherCube_moonLastQuarter', widget.options.language),
					getI18n('weatherCube_moonLastQuarter', widget.options.language),
					getI18n('weatherCube_moonLastQuarter', widget.options.language),
					getI18n('weatherCube_moonWaningCrescent', widget.options.language),
					getI18n('weatherCube_moonWaningCrescent', widget.options.language),
					getI18n('weatherCube_moonWaningCrescent', widget.options.language),
					getI18n('weatherCube_moonWaningCrescent', widget.options.language),
					getI18n('weatherCube_moonNewMoon', widget.options.language),
					getI18n('weatherCube_moonNewMoon', widget.options.language)
				];

				let zodiacSigns = [
					getI18n('weatherCube_earthAstrologyAries', widget.options.language),
					getI18n('weatherCube_earthAstrologyTaurus', widget.options.language),
					getI18n('weatherCube_earthAstrologyGemini', widget.options.language),
					getI18n('weatherCube_earthAstrologyCancer', widget.options.language),
					getI18n('weatherCube_earthAstrologyLeo', widget.options.language),
					getI18n('weatherCube_earthAstrologyVirgo', widget.options.language),
					getI18n('weatherCube_earthAstrologyLibra', widget.options.language),
					getI18n('weatherCube_earthAstrologyScorpio', widget.options.language),
					getI18n('weatherCube_earthAstrologySagittarius', widget.options.language),
					getI18n('weatherCube_earthAstrologyCapricorn', widget.options.language),
					getI18n('weatherCube_earthAstrologyAquarius', widget.options.language),
					getI18n('weatherCube_earthAstrologyPisces', widget.options.language)
				];

				let phase = widget.getMoonPhase(year, month, day);
				let moonImage = '<img src="data:image/png;base64,' + getImage('moon', phase) +
					'" class="img-fluid mt-3 mb-4" alt="' + phaseNames[phase] + '" />';
				let moonText = phaseNames[phase];

				let currentMonth = dt.getMonth() + 1;
				if (currentMonth === 12 || currentMonth === 1 || currentMonth === 2)
				{
					// Winter background
					widget.$element.find('#weatherCube-seasonsImage-' + widget._uId).attr('src',
						'data:image/png;base64,' + getImage('weatherBackground', 0));
				}
				else if (currentMonth >= 3 && currentMonth <= 5)
				{
					// Spring background
					widget.$element.find('#weatherCube-seasonsImage-' + widget._uId).attr('src',
						'data:image/png;base64,' + getImage('weatherBackground', 1));
				}
				else if (currentMonth >= 6 && currentMonth <= 8)
				{
					// Summer background
					widget.$element.find('#weatherCube-seasonsImage-' + widget._uId).attr('src',
						'data:image/png;base64,' + getImage('weatherBackground', 2));
				}
				else if (currentMonth >= 9 && currentMonth <= 11)
				{
					// Fall background
					widget.$element.find('#weatherCube-seasonsImage-' + widget._uId).attr('src',
						'data:image/png;base64,' + getImage('weatherBackground', 3));
				}

				let zodiac = widget.getZodiacSign(month, day, zodiacSigns);
				let zod = '<table class="table table-striped table-bordered w-100">' +
					'<tr>' +
					'<td><img src="data:image/png;base64,' + getImage('zodiac', zodiacSigns.indexOf(zodiac)) +
					'" alt="' + zodiac + '" /></td>' +
					'</tr>' +
					'<tr>' +
					'<td class="font-weight-bold h4">' + zodiac + '</td>' +
					'</tr>' +
					'</table>';

				widget.$element.find('#weatherCube-astronomyTable-' + widget._uId).empty().append(zod);
				widget.$element.find('#weatherMoon-' + widget._uId).empty().append(moonImage);
				widget.$element.find('#currentMoonPhase-' + widget._uId).text(moonText);
				widget.$element.find('#currentEclipsesData-' + widget._uId).empty();

				let length = 32 - new Date(year, month, 32).getDate();
				while (calendar.firstElementChild.firstChild)
				{
					calendar.firstElementChild.removeChild(calendar.firstElementChild.firstChild);
				}

				while (calendar.lastElementChild.firstChild)
				{
					calendar.lastElementChild.removeChild(calendar.lastElementChild.firstChild);
				}

				row = calendar.firstElementChild.insertRow();
				cell = document.createElement('th');
				cell.colSpan = 7;

				let monthSpan = document.createElement('span');
				monthSpan.setAttribute('class', 'badge badge-danger');
				let monthSamp = document.createElement('samp');
				monthSpan.innerHTML = getI18n('weatherCube_moonPhases', widget.options.language) +
					monthNames[month - 1] + '-' + year;
				monthSpan.appendChild(monthSamp);
				cell.appendChild(monthSpan);
				row.appendChild(cell);

				row = calendar.firstElementChild.insertRow();
				for (let index1 = 0; index1 < 7; index1 += 1)
				{
					cell = document.createElement('th');
					cell.appendChild(document.createTextNode(dayNames[index1]));
					row.appendChild(cell);
				}

				first = new Date(year, month - 1, 1).getUTCDay();
				let index1 = 0;

				for (let index2 = 0; index2 < 42; index2 += 1)
				{
					if (index2 % 7 === 0)
					{
						row = calendar.lastElementChild.insertRow(index1);
						index1 += 1;
					}

					if (index2 < first || index2 >= length + first)
					{
						cell = row.insertCell(index2 % 7);
					}
					else
					{
						cell = row.insertCell(index2 % 7);
						image = document.createElement('img');

						if (index2 - first + 1 === day)
						{
							cell.setAttribute('class', 'active');
						}

						let phase = this.getMoonPhase(year, month, index2 - first + 1);
						image.src = 'data:image/png;base64,' + getImage('moon', phase);

						let dayDiv = document.createElement('div');
						let daySpan = document.createElement('span');
						daySpan.setAttribute('class', 'moonDay badge badge-danger');

						let daySamp = document.createElement('samp');
						daySamp.innerHTML = index2 - first + 1;
						daySpan.appendChild(daySamp);

						dayDiv.appendChild(daySpan);
						cell.appendChild(dayDiv);
						cell.appendChild(image);

						let phaseSpan = document.createElement('span');
						phaseSpan.setAttribute('class', 'moonPhase badge');
						phaseSpan.innerHTML = phaseNames[phase];
						cell.appendChild(phaseSpan);
					}
				}

				widget.getMoonData(location);
			},

			/***************************************************************************/

			getMoonData: function(location)
			{
				let widget = this;
				let dt = new Date();
				let retryCount = 0;

				// Status
				let moon_status = widget.statusLocalStorage('weather_moon');

				// Has Data
				if (moon_status)
				{
					// Get Cache
					let data = localStorage.getItem('weather_moon');
					let myArray = JSON.parse(data);
					widget.parseWeatherMoonData(myArray, 'Moon data from local storage: ');
					// Expired or Empty Cache
					widget.$element.find('#weatherCube-loaderText-' + widget._uId)
						.text(getI18n('weatherCube_getMoonCacheFeed', widget.options.language));
				}
				else
				{
					widget.$element.find('#weatherCube-loaderText-' + widget._uId)
						.text(getI18n('weatherCube_getMoonLiveFeed', widget.options.language));

					$.ajax({
						url: apiMoonDataUrl + '?coords=' + encodeURIComponent(location) + '&date=' +
							(dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear() + '&tz=' +
							-dt.getTimezoneOffset() / 60,
						cache: false,
						success: function(result)
						{
							if (result === null)
							{
								return true;
							}

							if (widget.options.debug)
							{
								console.info('Success, getting data for: ' + apiMoonDataUrl);
							}

							widget.setLocalStorage('weather_moon', JSON.stringify(result), widget.options.cache);
							let data = localStorage.getItem('weather_moon');
							let dataArray = JSON.parse(data);
							widget.parseWeatherMoonData(dataArray, 'New Moon Feed Data: ');
							widget.$element.find('#weatherCube-loaderText-' + widget._uId)
								.text(getI18n('weatherCube_getMoonSuccessFeed', widget.options.language));
							retryCount = 0;

							return true;
						},
						error: function(xhr, textStatus, thrownError)
						{
							if (widget.options.debug)
							{
								console.error('Error getting JSON data from: ' + apiMoonDataUrl);
								console.error(thrownError + '\r' + xhr.statusText + '\r' + xhr.responseText);
							}
							widget.$element.find('#weatherCube-loaderText-' + widget._uId)
								.text(getI18n('weatherCube_getMoonErrorFeed', widget.options.language));

							retryCount++;

							if (retryCount <= widget.options.retryLimit)
							{
								// Try again
								widget.$element.find('#weatherCube-loaderText-' + widget._uId)
									.text(getI18n('weatherCube_getFeedTryAgain', widget.options.language));
								$.ajax(this);

								return false;
							}

							return false;
						}
					});

					setTimeout(function()
					{
						let retryCount = 0;
						// Status
						let seasons_status = widget.statusLocalStorage('weather_seasons');

						// Has Data
						if (seasons_status)
						{
							// Get Cache
							let data = localStorage.getItem('weather_seasons');
							let myArray = JSON.parse(data);
							widget.parseWeatherSeasonsData(myArray, 'Seasons from local storage: ');
							// Expired or Empty Cache
							widget.$element.find('#weatherCube-loaderText-' + widget._uId)
								.text(getI18n('weatherCube_getSeasonsCacheFeed', widget.options.language));
						}
						else
						{
							widget.$element.find('#weatherCube-loaderText-' + widget._uId)
								.text(getI18n('weatherCube_getSeasonsLiveFeed', widget.options.language));

							$.ajax({
								url: apiSeasonsDataUrl + '?year=' + dt.getFullYear() + '&tz=' +
									- dt.getTimezoneOffset() / 60 + '&dst=true',
								cache: false,
								success: function(result)
								{
									if (result === null)
									{
										return true;
									}

									if (widget.options.debug)
									{
										console.info('Success, getting data for: ' + apiSeasonsDataUrl);
									}

									widget.setLocalStorage('weather_seasons', JSON.stringify(result),
										widget.options.cache);
									let data = localStorage.getItem('weather_seasons');
									let dataArray = JSON.parse(data);
									widget.parseWeatherSeasonsData(dataArray, 'New Seasons Feed Data: ');
									widget.$element.find('#weatherCube-loaderText-' + widget._uId)
										.text(getI18n('weatherCube_getSeasonsSuccessFeed', widget.options.language));
									retryCount = 0;

									return true;
								},
								error: function(xhr, textStatus, thrownError)
								{
									if (widget.options.debug)
									{
										console.error('Error getting JSON data from: ' + apiSeasonsDataUrl);
										console.error(thrownError + '\r' + xhr.statusText + '\r' + xhr.responseText);
									}
									widget.$element.find('#weatherCube-loaderText-' + widget._uId)
										.text(getI18n('weatherCube_getSeasonsErrorFeed', widget.options.language));

									retryCount ++;

									if (retryCount <= widget.options.retryLimit)
									{
										// Try again
										widget.$element.find('#weatherCube-loaderText-' + widget._uId)
											.text(getI18n('weatherCube_getFeedTryAgain', widget.options.language));
										$.ajax(this);

										return false;
									}

									return false;
								}
							});
						}
					}, 1000);

					setTimeout(function()
					{
						let retryCount = 0;
						// Status
						let eclipse_status = widget.statusLocalStorage('weather_eclipse');

						// Has Data
						if (eclipse_status)
						{
							// Get Cache
							let data = localStorage.getItem('weather_eclipse');
							let myArray = JSON.parse(data);
							$.each(myArray.eclipses_in_year, function(i, item)
							{
								widget.$element.find('#currentEclipsesData-' + widget._uId)
									.append('<span class="font-weight-bold small">' + item.event + '<br /></span>');
							});
							// Expired or Empty Cache
							widget.$element.find('#weatherCube-loaderText-' + widget._uId)
								.text(getI18n('weatherCube_getEclipseCacheFeed', widget.options.language));
						}
						else
						{
							widget.$element.find('#weatherCube-loaderText-' + widget._uId)
								.text(getI18n('weatherCube_getEclipseLiveFeed', widget.options.language));

							$.ajax({
								url: apiEclipseDataUrl + '?year=' + dt.getFullYear(),
								cache: false,
								success: function(result)
								{
									if (result === null)
									{
										return true;
									}

									if (widget.options.debug)
									{
										console.info('Success, getting data for: ' + apiEclipseDataUrl);
									}

									widget.setLocalStorage('weather_eclipse', JSON.stringify(result),
										widget.options.cache);
									let data = localStorage.getItem('weather_eclipse');
									let dataArray = JSON.parse(data);

									$.each(dataArray.eclipses_in_year, function(i, item)
									{
										widget.$element.find('#currentEclipsesData-' + widget._uId)
											.append('<span class="font-weight-bold small">' + item.event +
												'<br /></span>');
									});

									widget.$element.find('#weatherCube-loaderText-' + widget._uId)
										.text(getI18n('weatherCube_getEclipseSuccessFeed', widget.options.language));
									retryCount = 0;

									return true;
								},
								error: function(xhr, textStatus, thrownError)
								{
									if (widget.options.debug)
									{
										console.error('Error getting JSON data from: ' + apiEclipseDataUrl);
										console.error(thrownError + '\r' + xhr.statusText + '\r' + xhr.responseText);
									}
									widget.$element.find('#weatherCube-loaderText-' + widget._uId)
										.text(getI18n('weatherCube_getEclipseErrorFeed', widget.options.language));

									retryCount ++;

									if (retryCount <= widget.options.retryLimit)
									{
										// Try again
										widget.$element.find('#weatherCube-loaderText-' + widget._uId)
											.text(getI18n('weatherCube_getFeedTryAgain', widget.options.language));
										$.ajax(this);

										return false;
									}

									return false;
								}
							});
						}
					}, 2000); // Time Out
				}
			},

			/***************************************************************************/

			parseWeatherMoonData: function(data, message)
			{
				let widget = this;
				if (widget.options.debug)
				{
					console.log(message, data);
				}

				if (widget.options.debug)
				{
					console.info('Updating current data!');
				}

				widget.$element.find('#currentMoonFracillum-' + widget._uId).text(data.fracillum);
				widget.$element.find('#moonRise-' + widget._uId).text(data.moondata[0].time);
				widget.$element.find('#moonSet-' + widget._uId).text(data.moondata[2].time);
				widget.$element.find('#sunRise-' + widget._uId).text(data.sundata[1].time);
				widget.$element.find('#sunSet-' + widget._uId).text(data.sundata[3].time);
			},

			/***************************************************************************/

			parseWeatherSeasonsData: function(data, message)
			{
				let widget = this;
				if (widget.options.debug)
				{
					console.log(message, data);
				}

				if (widget.options.debug)
				{
					console.info('Updating current data!');
				}

				let html = '<table class="table table-striped table-bordered w-100">' +
					'<thead>' +
					'<tr>' +
					'<th scope="col" class="text-left">' +
					getI18n('weatherCube_earthSeasonsDate', widget.options.language) + '</th>' +
					'<th scope="col" class="text-left">' +
					getI18n('weatherCube_earthSeasonsName', widget.options.language) + '</th>' +
					'</tr>' +
					'</thead>' +
					'<tbody>';

				$.each(data.data, function(i, item)
				{
					html += '<tr>' +
						'<th scope="row" class="text-left digital-numbers">' + item.day + '-' + item.month + '-' +
						item.year + '</th>' +
						'<td class="text-left font-weight-bold">' +
						getI18n('weatherCube_earthSeasons' + widget.capitalizeFirstLetter(item.phenom),
							widget.options.language) + '</td>' +
						'</tr>';
				});

				html += '</tbody></table>';
				widget.$element.find('#weatherCube-seasonsTable-' + widget._uId).empty().append(html);
				widget.$element.find('#weatherCube-loaderText-' + widget._uId)
					.text(getI18n('weatherCube_getMoonCreate', widget.options.language));
			},

			/***************************************************************************/

			getWeatherCurrentData: function()
			{
				let widget = this;
				let retryCount = 0;

				// Status
				let current_status = this.statusLocalStorage('weather_current');

				// Has Data
				if (current_status)
				{
					// Get Cache
					let data = localStorage.getItem('weather_current');
					let myArray = JSON.parse(data);
					widget.parseWeatherCurrentData(myArray, 'Current from local storage: ');
					// Expired or Empty Cache
					widget.$element.find('#weatherCube-loaderText-' + widget._uId)
						.text(getI18n('weatherCube_getCurrentCacheFeed', widget.options.language));
				}
				else
				{
					widget.$element.find('#weatherCube-loaderText-' + widget._uId)
						.text(getI18n('weatherCube_getCurrentLiveFeed', widget.options.language));

					$.ajax({
						url: apiUrl,
						cache: false,
						crossDomain: true,
						success: function(result)
						{
							if (result === null)
							{
								return true;
							}

							if (widget.options.debug)
							{
								console.info('Success, getting data for: ' + apiUrl);
							}

							widget.setLocalStorage('weather_current', JSON.stringify(result), widget.options.cache);
							let data = localStorage.getItem('weather_current');
							let dataArray = JSON.parse(data);
							widget.parseWeatherCurrentData(dataArray, 'New Current Feed Data: ');
							widget.$element.find('#weatherCube-loaderText-' + widget._uId)
								.text(getI18n('weatherCube_getCurrentSuccessFeed', widget.options.language));
							retryCount = 0;

							return true;
						},
						error: function(xhr, textStatus, thrownError)
						{
							if (widget.options.debug)
							{
								console.error('Error getting JSON data from: ' + apiUrl);
								console.error(thrownError + '\r' + xhr.statusText + '\r' + xhr.responseText);
							}
							widget.$element.find('#weatherCube-loaderText-' + widget._uId)
								.text(getI18n('weatherCube_getCurrentErrorFeed', widget.options.language));

							retryCount++;

							if (retryCount <= widget.options.retryLimit)
							{
								// Try again
								widget.$element.find('#weatherCube-loaderText-' + widget._uId)
									.text(getI18n('weatherCube_getFeedTryAgain', widget.options.language));
								$.ajax(this);

								return false;
							}

							return false;
						}
					});
				}
			},

			/***************************************************************************/

			parseWeatherCurrentData: function(data, message)
			{
				let widget = this;
				let wId;
				let iconUrl = '';
				let term = '<i class="wi wi-thermometer mr-1 h2"></i>';

				if (widget.options.debug)
				{
					console.log(message, data);
				}

				if (widget.options.debug)
				{
					console.info('Updating current data!');
				}

				const date = new Date();
				const sunrise = new Date(data.sys.sunrise * 1000);
				const sunset = new Date(data.sys.sunset * 1000);

				if (Math.round(data.main.temp) < 0)
				{
					term = '<i class="wi wi-thermometer-exterior mr-1 h2"></i>';
				}

				/* Get suitable default icon for weather */
				if (date.getHours() >= sunrise.getHours() && date.getHours() < sunset.getHours())
				{
					wId = 'wi-owm-day-' + data.weather[0].id;
				}
				else if (date.getHours() >= sunset.getHours() || date.getHours() < sunrise.getHours())
				{
					wId = 'wi-owm-night-' + data.weather[0].id;
				}

				// if iconTarget icon isn't null
				if (data.weather[0].icon)
				{
					if (widget.options.icons === 'tick')
					{
						iconUrl =
							'<img class="weatherCube-currentForecastImage pl-3 img-fluid" src="data:image/png;base64,' +
							imageForecastChooser(data.weather[0].icon, widget.options.icons) + '" alt="' +
							widget.capitalizeFirstLetter(data.weather[0].description) + '" />';
						if (widget.options.debug)
						{
							console.info('Icons are set and are of type .svg named: tick.');
						}
					}
					else if (widget.options.icons === 'weezle')
					{
						//let tt = global_base_url + "assets/weather/" + data.weather[0].icon + ".png";
						iconUrl =
							'<img class="weatherCube-currentForecastImage pl-3 img-fluid" src="data:image/png;base64,' +
							imageForecastChooser(data.weather[0].icon, widget.options.icons) + '" alt="' +
							widget.capitalizeFirstLetter(data.weather[0].description) + '" />';
						if (widget.options.debug)
						{
							console.info('Icons are set and are of type .svg named: weezle.');
						}
					}
					else
					{
						iconUrl = '<i class="wi ' + wId + ' wi-fw weatherCube-currentDefault display-2 p-3" title="' +
							widget.capitalizeFirstLetter(data.weather[0].description) + '"></i>';
						if (widget.options.debug)
						{
							console.info('Icons are set and are of type weather-icons atrr: wi wi-');
						}
					}
				}

				widget.$element.find('#weatherCube-currentForecastImage-' + widget._uId).empty().append(iconUrl);
				widget.$element.find('#weatherCube-currentTemperatureIcon-' + widget._uId).empty().append(term);
				widget.$element.find('#weatherCube-currentTemperature-' + widget._uId).text(Math.round(data.main.temp));
				widget.$element.find('#weatherCube-currentMinTemperature-' + widget._uId)
					.text(Math.round(data.main.temp_min));
				widget.$element.find('#weatherCube-currentMaxTemperature-' + widget._uId)
					.text(Math.round(data.main.temp_max));
				widget.$element.find('#weatherCube-currentDescription-' + widget._uId)
					.text(widget.capitalizeFirstLetter(data.weather[0].description));

				let windBeaufortScale = widget.getWindBeaufort(data.wind.speed);
				let direction = widget.getWindDirection(Math.round(data.wind.deg));

				let html = '<div class="d-flex flex-column mr-4 pt-2">' +
					'<div class="text-left ml-1 p-1">' +
					'<i class="wi wi-thermometer wi-fw"></i>' +
					'<samp class="digital-numbers">' + Math.round(data.main.temp) + '</samp>' +
					'<i class="wi ' + widget.generateUnitIcon(widget.options.units) + ' mr-1"></i>' +
					'</div>' +
					'<div class="text-left ml-1 p-1">' +
					'<i class="wi wi-humidity wi-fw"></i>' +
					'<samp class="digital-numbers">' + Math.round(data.main.humidity) + '</samp>' +
					'<span>%</span>' +
					'</div>' +
					'<div class="text-left ml-1 p-1">' +
					'<i class="wi wi-barometer wi-fw"></i>' +
					'<samp class="digital-numbers">' + Math.round(data.main.pressure) + '</samp>' +
					'<span>mPa</span>' +
					'</div>' +
					'<div class="text-left ml-1 p-1">' +
					'<a class="beaufortScaleModal" href="#" title="' +
					getI18n('weatherCube_beaufortScale_' + windBeaufortScale, widget.options.language) + '">' +
					'<i class="wi wi-wind-beaufort-' + windBeaufortScale + ' wi-fw"></i>' +
					'</a>' +
					'<samp class="digital-numbers">' + Math.round(data.wind.speed) + '</samp>' +
					'<span>m/s</span>' +
					'</div>' +
					'</div>' +
					'<div class="ml-auto">' +
					'<div class="d-flex align-items-center justify-content-center mb-2 mr-2">' +
					'<samp class="digital-numbers">' + Math.round(data.wind.deg) + '</samp>' +
					'<i class="wi wi-degrees mr-1"></i>' +
					'<span class="h4 pt-2">' + direction + '</span>' +
					'</div>' +
					'<img src="data:image/png;base64,' + imageWindChooser(direction) + '" alt="' + direction +
					'" class="img-fluid mr-3" />' +
					'</div>';

				this.$element.find('#weatherCube-currentMore-' + widget._uId).empty().append(html);

				if (widget.options.debug)
				{
					console.info('Current forecast data populated!');
				}

				widget.$element.find('#weatherCube-loaderText-' + widget._uId)
					.text(getI18n('weatherCube_getCurrentParsedFeed', widget.options.language));
				widget.$element.find('#weatherCube-overlay-' + widget._uId).empty().hide();

				setTimeout(function()
				{
					widget.getWeatherUviData();
				}, 1000);
			},

			/***************************************************************************/

			getWeatherForecastData: function()
			{
				let widget = this;
				let retryCount = 0;

				// Status
				let forecast_status = this.statusLocalStorage('weather_forecast');

				// Has Data
				if (forecast_status)
				{
					// Get Cache
					let data = localStorage.getItem('weather_forecast');
					let myArray = JSON.parse(data);
					widget.parseWeatherForecastData(myArray, 'Forecast from local storage: ');
					// Expired or Empty Cache
					widget.$element.find('#weatherCube-loaderText-' + widget._uId)
						.text(getI18n('weatherCube_getForecastCacheFeed', widget.options.language));
				}
				else
				{
					widget.$element.find('#weatherCube-loaderText-' + widget._uId)
						.text(getI18n('weatherCube_getCForecastLiveFeed', widget.options.language));

					$.ajax({
						url: apiForecastUrl,
						cache: false,
						crossDomain: true,
						success: function(result)
						{
							if (result === null)
							{
								return true;
							}

							if (widget.options.debug)
							{
								console.info('Success, getting data for: ' + apiForecastUrl);
							}

							widget.setLocalStorage('weather_forecast', JSON.stringify(result), widget.options.cache);
							let data = localStorage.getItem('weather_forecast');
							let dataArray = JSON.parse(data);
							widget.parseWeatherForecastData(dataArray, 'New Forecast Feed Data: ');
							widget.$element.find('#weatherCube-loaderText-' + widget._uId)
								.text(getI18n('weatherCube_getForecastSuccessFeed', widget.options.language));
							retryCount = 0;

							return true;
						},
						error: function(xhr, textStatus, thrownError)
						{
							if (widget.options.debug)
							{
								console.error('Error getting JSON data from: ' + apiForecastUrl);
								console.error(thrownError + '\r' + xhr.statusText + '\r' + xhr.responseText);
							}
							widget.$element.find('#weatherCube-loaderText-' + widget._uId)
								.text(getI18n('weatherCube_getForecastErrorFeed', widget.options.language));

							retryCount++;

							if (retryCount <= widget.options.retryLimit)
							{
								// Try again
								widget.$element.find('#weatherCube-loaderText-' + widget._uId)
									.text(getI18n('weatherCube_getFeedTryAgain', widget.options.language));
								$.ajax(this);

								return false;
							}

							return false;
						}
					});
				}
			},

			/***************************************************************************/

			parseWeatherForecastData: function(data, message)
			{
				let widget = this;

				if (this.options.debug)
				{
					console.log(message, data);
				}

				let html = '';
				let weather = this.separateForecastByDay(data.list);

				// Today and every next day - 5 day
				$.each(weather, function(i, data)
				{
					let day = widget.consolidateToDailyForecast(weather[i]);
					let wId;
					let iconUrl = '';

					const date = new Date();
					/* Get suitable default icon for weather */
					if (date.getHours() > 6 && date.getHours() < 20)
					{
						wId = 'wi-owm-day-' + day.id;
					}
					else
					{
						wId = 'wi-owm-night-' + day.id;
					}

					// if iconTarget icon isn't null
					if (day.icon)
					{
						if (widget.options.icons === 'tick')
						{
							iconUrl = '<img class="img-fluid p-2" src="data:image/png;base64,' +
								imageForecastChooser(day.icon, widget.options.icons) + '" alt="' +
								widget.capitalizeFirstLetter(day.desc) + '" />';
							if (widget.options.debug)
							{
								console.info('Icons are set and are of type .svg named: tick.');
							}
						}
						else if (widget.options.icons === 'weezle')
						{
							//let tt = global_base_url + "assets/weather/" + data.weather[0].icon + ".png";
							iconUrl = '<img class="img-fluid p-2" src="data:image/png;base64,' +
								imageForecastChooser(day.icon, widget.options.icons) + '" alt="' +
								widget.capitalizeFirstLetter(day.desc) + '" />';
							if (widget.options.debug)
							{
								console.info('Icons are set and are of type .svg named: weezle.');
							}
						}
						else
						{
							iconUrl = '<i class="wi ' + wId +
								' wi-fw weatherCube-currentDefault display-2 p-3" title="' +
								widget.capitalizeFirstLetter(day.desc) + '"></i>';
							if (widget.options.debug)
							{
								console.info('Icons are set and are of type weather-icons atrr: wi wi-');
							}
						}
					}

					let windBeaufortScale = widget.getWindBeaufort(day.windSpeed);
					let direction = widget.getWindDirection(Math.round(day.windDeg));

					html += '<div class="card flex-fill rounded-0 weatherDay">' +
						'<header class="card-header p-1 text-center">' +
						'<samp class="font-weight-bold">' + day.day + '</samp>' +
						'</header>' +
						'<div class="card-body weatherCubeDayBody">' +
						iconUrl +
						'<p class="card-text">' +
						'<span class="digital-numbers h3">' + Math.round(day.low) +
						'<i class="wi ' + widget.generateUnitIcon(widget.options.units) + '"></i>-' +
						Math.round(day.high) + '<i class="wi ' + widget.generateUnitIcon(widget.options.units) +
						'"></i></span></p>' +
						'<div class="card-content d-flex flex-row align-items-center p-2 pt-4">' +
						'<div class="d-flex flex-column align-items-start">' +
						'<div class="text-left ml-1 p-1">' +
						'<i class="wi wi-thermometer wi-fw"></i>' +
						'<samp class="digital-numbers">' + Math.round(day.ave) + '</samp>' +
						'<i class="wi ' + widget.generateUnitIcon(widget.options.units) + ' mr-1"></i>' +
						'</div>' +
						'<div class="text-left ml-1 p-1">' +
						'<i class="wi wi-humidity wi-fw"></i>' +
						'<samp class="digital-numbers">' + Math.round(day.humidity) + '</samp>' +
						'<span>%</span>' +
						'</div>' +
						'<div class="text-left ml-1 p-1">' +
						'<i class="wi wi-barometer wi-fw"></i>' +
						'<samp class="digital-numbers">' + Math.round(day.pressure) + '</samp>' +
						'<span>mPa</span>' +
						'</div>' +
						'<div class="text-left ml-1 p-1">' +
						'<a class="beaufortScaleModal" href="#" title="' +
						getI18n('weatherCube_beaufortScale_' + windBeaufortScale, widget.options.language) + '">' +
						'<i class="wi wi-wind-beaufort-' + windBeaufortScale + ' wi-fw"></i>' +
						'</a>' +
						'<samp class="digital-numbers">' + Math.round(day.windSpeed) + '</samp>' +
						'<span>m/s</span>' +
						'</div>' +
						'</div>' +
						'<div class="flex-fill d-none d-xl-block">' +
						'<div class="d-flex align-items-center justify-content-center mb-2">' +
						'<samp class="digital-numbers">' + Math.round(day.windDeg) + '</samp>' +
						'<i class="wi wi-degrees mr-1"></i>' +
						'<span class="h4 pt-2">' + direction + '</span>' +
						'</div>' +
						'<img src="data:image/png;base64,' + imageWindChooser(direction) + '" alt="' + direction +
						'" class="img-fluid ml-1" />' +
						'</div>' +
						'</div>' +
						'</div>' +
						'<footer class="card-footer p-1">' +
						'<i class="wi ' + wId + ' wi-fw mr-2"></i>' +
						'<small class="small font-weight-bold">' +
						getI18n('weatherCube_main' + widget.capitalizeFirstLetter(day.main), widget.options.language) +
						'</small>' +
						'</footer>' +
						'</div>';
				});

				widget.$element.find('#weatherDaysArea-' + widget._uId).empty().append(html);
				widget.$element.find('#weatherCube-loaderText-' + widget._uId)
					.text(getI18n('weatherCube_getCurrentParsedFeed', widget.options.language));

				setTimeout(function()
				{
					widget.parseWeatherHourForecastData(data, weather);
				}, 1000);

				if (widget.options.debug)
				{
					console.info('Days forecast successfully updated!');
				}
			},

			/***************************************************************************/

			parseWeatherHourForecastData: function(data, weather)
			{
				let html = '';
				let widget = this;

				if (this.options.debug)
				{
					console.info('Updating hour forecast data!');
				}

				// Each day each hour
				$.each(data.list, function(i, item)
				{
					if (i >= 8)
					{
						return false;
					}

					let wId;
					let iconUrl = '';

					/* Get suitable default icon for weather */
					if (item.sys.pod === 'd')
					{
						wId = 'wi-owm-day-' + item.weather[0].id;
					}
					else if (item.sys.pod === 'n')
					{
						wId = 'wi-owm-night-' + item.weather[0].id;
					}
					else
					{
						wId = 'wi-owm-day-' + item.weather[0].id;
					}

					// if iconTarget icon isn't null
					if (item.weather[0].icon !== null)
					{
						if (widget.options.icons === 'tick')
						{
							iconUrl =
								'<img class="weatherCube-hourForecastImage img-fluid" src="data:image/png;base64,' +
								imageForecastChooser(item.weather[0].icon, widget.options.icons) + '" alt="' +
								widget.capitalizeFirstLetter(item.weather[0].description) + '" />';
							if (widget.options.debug)
							{
								console.info('Icons are set and are of type .svg named: tick.');
							}
						}
						else if (widget.options.icons === 'weezle')
						{
							iconUrl =
								'<img class="weatherCube-hourForecastImage img-fluid" src="data:image/png;base64,' +
								imageForecastChooser(item.weather[0].icon, widget.options.icons) + '" alt="' +
								widget.capitalizeFirstLetter(item.weather[0].description) + '" />';
							if (widget.options.debug)
							{
								console.info('Icons are set and are of type .svg named: weezle.');
							}
						}
						else
						{
							iconUrl = '<i class="wi ' + wId +
								' wi-fw weatherCube-currentDefault display-4 p-3" title="' +
								widget.capitalizeFirstLetter(item.weather[0].description) + '"></i>';
							if (widget.options.debug)
							{
								console.info('Icons are set and are of type weather-icons atrr: wi wi-');
							}
						}
					}

					let windBeaufortScale = widget.getWindBeaufort(item.wind.speed);
					let direction = widget.getWindDirection(Math.round(item.wind.deg));

					html += '<div class="card flex-fill rounded-0 weatherHour">' +
						'<header class="card-header d-flex flex-row align-items-center p-1">' +
						'<samp class="small font-weight-bold ml-2">' +
						widget.dayToString(new Date(item.dt * 1000).getDay(), widget.options.language) +
						getI18n('weatherCube_viewAt', widget.options.language) + '</samp>' +
						'<samp class="badge bg-danger small m-0 digital-numbers">' +
						widget.formatTime(item.dt, 3, true) + '</samp>' +
						'</header>' +
						'<div class="card-body p-2 pr-4">' +
						'<div class="d-flex justify-content-between">' +
						'<div class="d-flex align-items-start flex-column justify-content-center">' +
						iconUrl +
						'<div class="mt-3">' +
						'<img src="data:image/png;base64,' + imageWindChooser(direction) + '" alt="' + direction +
						'" class="img-fluid ml-1" />' +
						'</div>' +
						'</div>' +
						'<div class="mt-2">' +
						'<div class="text-left ml-1">' +
						'<i class="wi wi-thermometer wi-fw small"></i>' +
						'<samp class="digital-numbers small">' + Math.round(item.main.temp) + '</samp>' +
						'<i class="wi ' + widget.generateUnitIcon(widget.options.units) + ' ml-1"></i>' +
						'</div>' +
						'<div class="text-left ml-1">' +
						'<i class="wi wi-humidity wi-fw small"></i>' +
						'<samp class="digital-numbers small">' + Math.round(item.main.humidity) + '</samp>' +
						'<small class="ml-1">%</small>' +
						'</div>' +
						'<div class="text-left ml-1">' +
						'<i class="wi wi-barometer wi-fw small"></i>' +
						'<samp class="digital-numbers small">' + Math.round(item.main.pressure) + '</samp>' +
						'<small class="ml-1">mPa</small>' +
						'</div>' +
						'<div class="text-left ml-1">' +
						'<a class="beaufortScaleModal" href="#" title="' +
						getI18n('weatherCube_beaufortScale_' + windBeaufortScale, widget.options.language) + '">' +
						'<i class="wi wi-wind-beaufort-' + windBeaufortScale + ' wi-fw small"></i>' +
						'</a>' +
						'<samp class="digital-numbers small">' + item.wind.speed + '</samp>' +
						'<small class="ml-1">m/s</small>' +
						'</div>' +
						'</div>' +
						'</div>' +
						'</div>' +
						'<footer class="card-footer p-1">' +
						'<i class="wi ' + wId + ' wi-fw mr-2"></i>' +
						'<small class="small font-weight-bold">' +
						getI18n('weatherCube_main' + widget.capitalizeFirstLetter(item.weather[0].main),
							widget.options.language) + '</small>' +
						'</footer>' +
						'</div>';
				});

				widget.$element.find('#weatherHoursArea-' + widget._uId).empty().append(html);

				setTimeout(function()
				{
					widget.updateChartData(weather);
				}, 1000);

				if (widget.options.debug)
				{
					console.info('Days forecast successfully updated!');
				}
			},

			/***************************************************************************/

			updateChartData: function(data)
			{
				let widget = this;
				if (this.options.debug)
				{
					console.info('Updating charts data!');
				}

				widget._tempChart.clear();
				widget._humidityChart.clear();
				widget._pressureChart.clear();
				widget._windChart.clear();

				widget._tempWeekChart.clear();
				widget._humidityWeekChart.clear();
				widget._pressureWeekChart.clear();
				widget._windWeekChart.clear();

				let dayChartNames = [];
				let dayChartTemp = [];
				let dayChartMinTemp = [];
				let dayChartMaxTemp = [];
				let dayChartHumidity = [];
				let dayChartPressure = [];
				let dayChartWindSpeed = [];

				let weekChartNames = [];
				let weekChartTemp = [];
				let weekChartMinTemp = [];
				let weekChartMaxTemp = [];
				let weekChartHumidity = [];
				let weekChartPressure = [];
				let weekChartWindSpeed = [];

				let days = data[0].forecast;
				let unit = this.options.units === 'imperial' ? '°F' : '°C';

				$.each(data, function(i)
				{
					let day = widget.consolidateToDailyForecast(data[i]);

					weekChartNames.push(day.day.slice(0, 3));
					weekChartTemp.push(day.ave);
					weekChartMinTemp.push(day.low);
					weekChartMaxTemp.push(day.high);
					weekChartHumidity.push(day.humidity);
					weekChartPressure.push(day.pressure);
					weekChartWindSpeed.push(day.windSpeed);
				});

				$.each(days, function(i, value)
				{
					dayChartNames.push(widget.formatTime(value.dt, false));
					dayChartTemp.push(value.main.temp);
					dayChartMinTemp.push(value.main.temp_min);
					dayChartMaxTemp.push(value.main.temp_max);
					dayChartHumidity.push(value.main.humidity);
					dayChartPressure.push(value.main.pressure);
					dayChartWindSpeed.push(value.wind.speed);
				});

				widget._tempChart.setOption({
					tooltip: {
						formatter: '{a} <br/>{b}: {c} (' + unit + ')',
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					grid: {
						bottom: '10%'
					},
					legend: {},
					axisPointer: {
						type: 'shadow'
					},
					yAxis: {
						type: 'category',
						boundaryGap: true,
						data: dayChartNames,
						show: true
					},
					xAxis: {
						type: 'value',
						axisLabel: {
							formatter: '{value} °C',
							margin: 15
						}
					},
					axis: {
						y: {
							padding: { top: 200, bottom: 0 }
						},
						y2: {
							padding: { top: 100, bottom: 100 },
							show: true
						}
					},
					color: ['rgb(213,38,22)', 'rgb(30,164,17)', 'rgb(39,122,255)'],
					series: [
						{
							type: 'bar',
							name: getI18n('weatherCube_chartMaxTemperature', this.options.language),
							data: dayChartMaxTemp,
							markPoint: {
								data: [
									{ type: 'max',
										name: getI18n('weatherCube_chartMaxTemperature', this.options.language) },
									{ type: 'min',
										name: getI18n('weatherCube_chartMinTemperature', this.options.language) }
								]
							},
							markLine: {
								data: [
									{ type: 'average',
										name: getI18n('weatherCube_chartMaxAveTemperature', this.options.language) }
								]
							}
						},
						{
							type: 'bar',
							name: getI18n('weatherCube_chartTemperature', this.options.language),
							data: dayChartTemp,
							markPoint: {
								data: [
									{ type: 'max',
										name: getI18n('weatherCube_chartMaxTemperature', this.options.language) },
									{ type: 'min',
										name: getI18n('weatherCube_chartMinTemperature', this.options.language) }
								]
							},
							markLine: {
								data: [
									{ type: 'average',
										name: getI18n('weatherCube_chartAveTemperature', this.options.language) }
								]
							}
						},
						{
							type: 'bar',
							name: getI18n('weatherCube_chartMinTemperature', this.options.language),
							data: dayChartMinTemp,
							markPoint: {
								data: [
									{ type: 'max',
										name: getI18n('weatherCube_chartMaxTemperature', this.options.language) },
									{ type: 'min',
										name: getI18n('weatherCube_chartMinTemperature', this.options.language) }
								]
							}
						}
					]
				});

				widget._humidityChart.setOption({
					tooltip: {
						formatter: '{a} <br/>{b}: {c} (%)'
					},
					grid: {
						bottom: '10%'
					},
					legend: {},
					yAxis: {
						type: 'value',
						axisLabel: {
							formatter: '{value} %'
						}
					},
					xAxis: {
						type: 'category',
						data: dayChartNames
					},
					color: ['rgb(39,122,255)'],
					series: [
						{
							name: getI18n('weatherCube_chartHumidity', this.options.language),
							type: 'line',
							smooth: true,
							data: dayChartHumidity,
							areaStyle: {}
						}
					]
				});

				widget._pressureChart.setOption({
					tooltip: {
						formatter: '{a} <br/>{b}: {c} (hPa)'
					},
					grid: {
						bottom: '10%'
					},
					legend: {},
					yAxis: {},
					xAxis: {
						type: 'category',
						data: dayChartNames
					},
					color: ['rgb(255,162,67)'],
					series: [
						{
							name: getI18n('weatherCube_chartPressure', this.options.language),
							type: 'line',
							smooth: true,
							data: dayChartPressure,
							areaStyle: {}
						}
					]
				});

				widget._windChart.setOption({
					tooltip: {
						formatter: '{a} <br/>{b}: {c} (m/s)'
					},
					grid: {
						bottom: '10%'
					},
					legend: {},
					yAxis: {},
					xAxis: {
						type: 'category',
						data: dayChartNames
					},
					color: ['rgb(200,70,8)'],
					series: [
						{
							name: getI18n('weatherCube_chartWindSpeed', this.options.language),
							data: dayChartWindSpeed,
							type: 'bar',
							markPoint: {
								data: [
									{ type: 'max', name: getI18n('weatherCube_chartMaxWindSpeed', this.options.language)
									},
									{ type: 'min', name: getI18n('weatherCube_chartMinWindSpeed', this.options.language)
									}
								]
							},
							markLine: {
								data: [
									{ type: 'average',
										name: getI18n('weatherCube_chartAveWindSpeed', this.options.language) }
								]
							}
						}
					]
				});

				widget._tempWeekChart.setOption({
					tooltip: {
						formatter: '{a} <br/>{b}: {c} (' + unit + ')',
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					grid: {
						bottom: '10%'
					},
					legend: {},
					axisPointer: {
						type: 'shadow'
					},
					yAxis: {
						type: 'category',
						boundaryGap: true,
						data: weekChartNames,
						show: true
					},
					xAxis: {
						type: 'value',
						axisLabel: {
							formatter: '{value} °C',
							margin: 15
						}
					},
					axis: {
						y: {
							padding: { top: 200, bottom: 0 }
						},
						y2: {
							padding: { top: 100, bottom: 100 },
							show: true
						}
					},
					color: ['rgb(213,38,22)', 'rgb(30,164,17)', 'rgb(39,122,255)'],
					series: [
						{
							type: 'bar',
							name: getI18n('weatherCube_chartMaxTemperature', this.options.language),
							data: weekChartMaxTemp,
							markPoint: {
								data: [
									{ type: 'max',
										name: getI18n('weatherCube_chartMaxTemperature', this.options.language) },
									{ type: 'min',
										name: getI18n('weatherCube_chartMinTemperature', this.options.language) }
								]
							},
							markLine: {
								data: [
									{ type: 'average',
										name: getI18n('weatherCube_chartMaxAveTemperature', this.options.language) }
								]
							}
						},
						{
							type: 'bar',
							name: getI18n('weatherCube_chartTemperature', this.options.language),
							data: weekChartTemp,
							markPoint: {
								data: [
									{ type: 'max',
										name: getI18n('weatherCube_chartMaxTemperature', this.options.language) },
									{ type: 'min',
										name: getI18n('weatherCube_chartMinTemperature', this.options.language) }
								]
							},
							markLine: {
								data: [
									{ type: 'average',
										name: getI18n('weatherCube_chartAveTemperature', this.options.language) }
								]
							}
						},
						{
							type: 'bar',
							name: getI18n('weatherCube_chartMinTemperature', this.options.language),
							data: weekChartMinTemp,
							markPoint: {
								data: [
									{ type: 'max',
										name: getI18n('weatherCube_chartMaxTemperature', this.options.language) },
									{ type: 'min',
										name: getI18n('weatherCube_chartMinTemperature', this.options.language) }
								]
							}
						}
					]
				});

				widget._humidityWeekChart.setOption({
					tooltip: {
						formatter: '{a} <br/>{b}: {c} (%)'
					},
					grid: {
						bottom: '10%'
					},
					legend: {},
					yAxis: {
						type: 'value',
						axisLabel: {
							formatter: '{value} %'
						}
					},
					xAxis: {
						type: 'category',
						data: weekChartNames
					},
					color: ['rgb(39,122,255)'],
					series: [
						{
							name: getI18n('weatherCube_chartHumidity', this.options.language),
							type: 'line',
							smooth: true,
							data: weekChartHumidity,
							areaStyle: {}
						}
					]
				});

				widget._pressureWeekChart.setOption({
					tooltip: {
						formatter: '{a} <br/>{b}: {c} (hPa)'
					},
					grid: {
						bottom: '10%'
					},
					legend: {},
					yAxis: {},
					xAxis: {
						type: 'category',
						data: weekChartNames
					},
					color: ['rgb(255,162,67)'],
					series: [
						{
							name: getI18n('weatherCube_chartPressure', this.options.language),
							type: 'line',
							smooth: true,
							data: weekChartPressure,
							areaStyle: {}
						}
					]
				});

				widget._windWeekChart.setOption({
					tooltip: {
						formatter: '{a} <br/>{b}: {c} (m/s)'
					},
					grid: {
						bottom: '10%'
					},
					legend: {},
					yAxis: {},
					xAxis: {
						type: 'category',
						data: weekChartNames
					},
					color: ['rgb(200,70,8)'],
					series: [
						{
							name: getI18n('weatherCube_chartWindSpeed', this.options.language),
							data: weekChartWindSpeed,
							type: 'bar',
							markPoint: {
								data: [
									{ type: 'max', name: getI18n('weatherCube_chartMaxWindSpeed', this.options.language)
									},
									{ type: 'min', name: getI18n('weatherCube_chartMinWindSpeed', this.options.language)
									}
								]
							},
							markLine: {
								data: [
									{ type: 'average',
										name: getI18n('weatherCube_chartAveWindSpeed', this.options.language) }
								]
							}
						}
					]
				});

				widget._tempChart.hideLoading();
				widget._humidityChart.hideLoading();
				widget._pressureChart.hideLoading();
				widget._windChart.hideLoading();

				widget._tempWeekChart.hideLoading();
				widget._humidityWeekChart.hideLoading();
				widget._pressureWeekChart.hideLoading();
				widget._windWeekChart.hideLoading();
			},

			/***************************************************************************/

			getWeatherUviData: function()
			{
				let widget = this;
				let retryCount = 0;

				// Status
				let uvi_status = this.statusLocalStorage('weather_uvi');

				// Has Data
				if (uvi_status)
				{
					// Get Cache
					let data = localStorage.getItem('weather_uvi');
					let myArray = JSON.parse(data);
					widget.parseWeatherUviData(myArray, 'From Local Storage: ');
					// Expired or Empty Cache
					widget.$element.find('#weatherCube-loaderText-' + widget._uId)
						.text(getI18n('weatherCube_getUviCacheFeed', widget.options.language));
				}
				else
				{
					widget.$element.find('#weatherCube-loaderText-' + widget._uId)
						.text(getI18n('weatherCube_getUviLiveFeed', widget.options.language));

					$.ajax({
						url: apiUviUrl,
						cache: false,
						crossDomain: true,
						success: function(result)
						{
							if (result === null)
							{
								return true;
							}

							if (widget.options.debug)
							{
								console.info('Success, getting data for: ' + apiUviUrl);
							}

							widget.setLocalStorage('weather_uvi', JSON.stringify(result), widget.options.cache);
							let data = localStorage.getItem('weather_uvi');
							let dataArray = JSON.parse(data);
							widget.parseWeatherUviData(dataArray, 'New Uvi Data: ');
							widget.$element.find('#weatherCube-loaderText-' + widget._uId)
								.text(getI18n('weatherCube_getUviSuccessFeed', widget.options.language));
							retryCount = 0;

							return true;
						},
						error: function(xhr, textStatus, thrownError)
						{
							if (widget.options.debug)
							{
								console.error('Error getting JSON data from: ' + apiUviUrl);
								console.error(thrownError + '\r' + xhr.statusText + '\r' + xhr.responseText);
							}
							widget.$element.find('#weatherCube-loaderText-' + widget._uId)
								.text(getI18n('weatherCube_getUviErrorFeed', widget.options.language));

							retryCount++;

							if (retryCount <= widget.options.retryLimit)
							{
								// Try again
								widget.$element.find('#weatherCube-loaderText-' + widget._uId)
									.text(getI18n('weatherCube_getFeedTryAgain', widget.options.language));
								$.ajax(this);

								return false;
							}

							return false;
						}
					});
				}
			},

			/***************************************************************************/

			parseWeatherUviData: function(data, message)
			{
				let widget = this;

				if (this.options.debug)
				{
					console.log(message, data);
				}

				let uviRowWeek = '';
				let uviRowIcon = '';
				let uviRowValue = '';
				let uviRowWarning = '';

				// Each day
				$.each(data, function(i, item)
				{
					let uviWeekIndex = item.value;
					let uviWarning;
					let uviWeekDate = new Date(item.date * 1000).getDay();
					let dayName = widget.dayToString(uviWeekDate);

					if (i < 5)
					{
						if (uviWeekIndex <= 3)
						{
							uviWarning = getI18n('weatherCube_currentIndexLow', widget.options.language);
						}
						else if (uviWeekIndex > 3 && uviWeekIndex <= 6)
						{
							uviWarning = getI18n('weatherCube_currentIndexModerate', widget.options.language);
						}
						else if (uviWeekIndex > 6 && uviWeekIndex <= 8)
						{
							uviWarning = getI18n('weatherCube_currentIndexHigh', widget.options.language);
						}
						else if (uviWeekIndex > 8 && uviWeekIndex <= 10)
						{
							uviWarning = getI18n('weatherCube_currentIndexVeryHigh', widget.options.language);
						}
						else
						{
							uviWarning = getI18n('weatherCube_currentIndexExtreme', widget.options.language);
						}

						uviRowWeek += '<td class="p-2"><span class="h5 font-weight-bold">' + dayName + '</span></td>';
						uviRowIcon += '<td class="p-2"><img src="data:image/png;base64,' +
							getImage('uvi', Math.floor(uviWeekIndex)) + '" class="img-fluid" alt="' + uviWarning +
							'" /></td>';
						uviRowValue += '<td class="p-2"><samp class="digital-numbers h4">' + uviWeekIndex +
							'</samp></td>';
						uviRowWarning += '<td class="p-2"><h4><span class="badge badge-warning p-1">' + uviWarning +
							'</span></h4></td>';

						if (i === 0)
						{
							setTimeout(function()
							{
								widget.$element.find('#weatherCube-uviIndexImage-' + widget._uId).attr('src',
									'data:image/png;base64,' + getImage('uvi', Math.floor(uviWeekIndex)));
							}, 200);
						}
					}
				});

				let html = '<div class="table-responsive">' +
					'<table class="table table-borderless table-striped mb-0 text-center">' +
					'<thead>' +
					'<tr class="uviTableInfo-tr bg-primary">' +
					'<td colspan="6" class="p-2">' +
					'<span class="h5 font-weight-bold">' + getI18n('weatherCube_uviWeek', widget.options.language) +
					'</span>' +
					'</td>' +
					'</tr>' +
					'</thead>' +
					'<tbody>' +
					'<tr>' +
					uviRowWeek +
					'</tr>' +
					'<tr>' +
					uviRowIcon +
					'</tr>' +
					'<tr>' +
					uviRowValue +
					'</tr>' +
					'<tr>' +
					uviRowWarning +
					'</tr>' +
					'</tbody>' +
					'</table>' +
					'</div>';

				widget.$element.find('#tabWeatherUvi-' + widget._uId).empty().append(html);
				widget.$element.find('#weatherCube-loaderText-' + widget._uId)
					.text(getI18n('weatherCube_getUviParsedFeed', widget.options.language));
			},

			/***************************************************************************/

			getWeatherMeteoAlarmData: function()
			{
				let widget = this;
				let retryCount = 0;

				if (widget.options.debug)
				{
					console.info('Updating meteo alarm data!');
				}

				widget.$element.find('#weatherCube-loaderText-' + widget._uId)
					.text(getI18n('weatherCube_getMeteoFeed', widget.options.language));
				let meteo = widget.options.language;
				if (meteo === 'sl')
				{
					meteo = 'si';
				}
				else if (meteo === 'en')
				{
					meteo = 'uk';
				}

				if ($.inArray(meteo.toUpperCase(), europeRegions) < 0)
				{
					if (widget.options.debug)
					{
						console.info('Selected region is invalid: ' + meteo);
					}

					return;
				}

				let url = apiMeteoAlarmUrl.replace('{0}', meteo);

				// Status
				let cache_status = this.statusLocalStorage('meteo_data');

				// Has Data
				if (cache_status)
				{
					// Get Cache
					let data = localStorage.getItem('meteo_data');
					let myArray = JSON.parse(data);
					widget.parseMeteoAlarmData(myArray, 'MeteoAlarm from local storage: ');
					// Expired or Empty Cache
					widget.$element.find('#weatherCube-loaderText-' + widget._uId)
						.text(getI18n('weatherCube_getMeteoCacheFeed', widget.options.language));
				}
				else
				{
					widget.$element.find('#weatherCube-loaderText-' + widget._uId)
						.text(getI18n('weatherCube_getMeteoLiveFeed', widget.options.language));
					$.ajax({
						url: 'https://mcx-systems.net/proxy.php?url=' + encodeURIComponent(url),
						cache: false,
						dataType: 'json',
						crossOrigin: true,
						success: function(result)
						{
							if (result === null)
							{
								return true;
							}

							if (widget.options.debug)
							{
								console.info('Success, getting data for: ' + url);
							}

							widget.setLocalStorage('meteo_data', JSON.stringify(result), widget.options.cache);
							let data = localStorage.getItem('meteo_data');
							let dataArray = JSON.parse(data);
							widget.parseMeteoAlarmData(dataArray, 'New MeteoAlarm Feed Data: ');
							widget.$element.find('#weatherCube-loaderText-' + widget._uId)
								.text(getI18n('weatherCube_getMeteoSuccessFeed', widget.options.language));
							retryCount = 0;
							return true;
						},
						error: function(xhr, textStatus, thrownError)
						{
							if (widget.options.debug)
							{
								console.error('Error getting JSON data from: ' + url);
								console.error(thrownError + '\r' + xhr.statusText + '\r' + xhr.responseText);
							}
							widget.$element.find('#weatherCube-loaderText-' + widget._uId)
								.text(getI18n('weatherCube_getMeteoErrorFeed', widget.options.language));

							retryCount++;

							if (retryCount <= widget.options.retryLimit)
							{
								// Try again
								widget.$element.find('#weatherCube-loaderText-' + widget._uId)
									.text(getI18n('weatherCube_getFeedTryAgain', widget.options.language));
								$.ajax(this);

								return false;
							}

							return false;
						}
					});
				}
			},

			/***************************************************************************/

			parseMeteoAlarmData: function(data, message)
			{
				let widget = this;
				widget._dataResult.length = 0;

				if (this.options.debug)
				{
					console.log(message, data);
				}

				let item = data.items[0].description;
				let html = this.addTableDataToArray(item);

				$.each(data.items, function(i)
				{
					if (i > 0)
					{
						widget._dataResult.push(data.items[i]);
					}
				});

				let forToday = '<div id="alertsToday-' + widget._uId + '" class="carousel-item active">' +
					'<a href="#" class="weatherCube-alertDialog weatherCubeTooltip">' +
					'<span class="mr-2">' + getI18n('weatherCube_' + widget.deCapitalizeFirstLetter(html[0][0]),
						widget.options.language) + '</span>' +
					'</a>' +
					html[1][0] +
					html[1][1] +
					html[1][2] +
					'</div>';

				let forTomorrow = '<div id="#alertsTomorrow-' + widget._uId + '" class="carousel-item">' +
					'<a href="#" class="weatherCube-alertDialog weatherCubeTooltip">' +
					'<span class="mr-2">' + getI18n('weatherCube_' + widget.deCapitalizeFirstLetter(html[0][2]),
						widget.options.language) + '</span>' +
					'</a>' +
					html[1][4] +
					html[1][5] +
					html[1][6] +
					'</div>';

				widget.$element.find('#currentWeatherInterval-' + widget._uId + ' .carousel-inner').empty()
					.append(forToday).append(forTomorrow);
				widget.$element.find('#weatherCube-loaderText-' + widget._uId)
					.text(getI18n('weatherCube_getMeteoParsedFeed', widget.options.language));

				if (widget.options.debug)
				{
					console.info('Successfully updated alerts list!');
				}
			},

			/***************************************************************************/

			locationErrorCallback: function(error)
			{
				switch (error.code)
				{
					case error.PERMISSION_DENIED:
						if (this.options.debug)
						{
							console.info('--------------------------------------------');
							console.error('User denied the request for Geolocation. Location was set to default.');
							console.info('--------------------------------------------');
						}
						break;
					case error.POSITION_UNAVAILABLE:
						if (this.options.debug)
						{
							console.info('--------------------------------------------');
							console.error('Location information is unavailable. Location was set to default.');
							console.info('--------------------------------------------');
						}
						break;
					case error.TIMEOUT:
						if (this.options.debug)
						{
							console.info('--------------------------------------------');
							console.error('The request to get user location timed out. Location was set to default.');
							console.info('--------------------------------------------');
						}
						break;
					default:
						if (this.options.debug)
						{
							console.info('--------------------------------------------');
							console.error('An unknown error occurred. Location was set to default.');
							console.info('--------------------------------------------');
						}
						break;
				}
			},

			/***************************************************************************/

			setClocksTime: function(widget)
			{
				const now = new Date();

				const secondHand = document.querySelector('.wcLocal-seconds-hand');
				const minutesHand = document.querySelector('.wcLocal-minutes-hand');
				const hourHand = document.querySelector('.wcLocal-hours-hand');

				const secondFirstHand = document.querySelector('.wcFirst-seconds-hand');
				const minutesFirstHand = document.querySelector('.wcFirst-minutes-hand');
				const hourFirstHand = document.querySelector('.wcFirst-hours-hand');

				const secondSecondHand = document.querySelector('.wcSecond-seconds-hand');
				const minutesSecondHand = document.querySelector('.wcSecond-minutes-hand');
				const hourSecondHand = document.querySelector('.wcSecond-hours-hand');

				const seconds = now.getSeconds();
				const secondsDegrees = seconds / 60 * 360 + 90;
				secondHand.style.transform = `rotate(${secondsDegrees}deg)`;

				const fSeconds = now.toLocaleString('en-US',
					{ timeZone: widget.options.firstTimezone[1], second: 'numeric' });
				const fSecondsDegrees = fSeconds / 60 * 360 + 90;
				secondFirstHand.style.transform = `rotate(${fSecondsDegrees}deg)`;

				const sSeconds = now.toLocaleString('en-US',
					{ timeZone: widget.options.secondTimezone[1], second: 'numeric' });
				const sSecondsDegrees = sSeconds / 60 * 360 + 90;
				secondSecondHand.style.transform = `rotate(${sSecondsDegrees}deg)`;

				const minutes = now.getMinutes();
				const minutesDegrees = minutes / 60 * 360 + seconds / 60 * 6 + 90;
				minutesHand.style.transform = `rotate(${minutesDegrees}deg)`;

				const fMinutes = now.toLocaleString('en-US',
					{ timeZone: widget.options.firstTimezone[1], minute: 'numeric' });
				const fMinutesDegrees = fMinutes / 60 * 360 + fSeconds / 60 * 6 + 90;
				minutesFirstHand.style.transform = `rotate(${fMinutesDegrees}deg)`;

				const sMinutes = now.toLocaleString('en-US',
					{ timeZone: widget.options.secondTimezone[1], minute: 'numeric' });
				const sMinutesDegrees = sMinutes / 60 * 360 + sSeconds / 60 * 6 + 90;
				minutesSecondHand.style.transform = `rotate(${sMinutesDegrees}deg)`;

				const hour = now.getHours();
				const hourDegrees = hour / 12 * 360 + minutes / 60 * 30 + 90;
				hourHand.style.transform = `rotate(${hourDegrees}deg)`;

				const fHour = now.toLocaleString('en-US',
					{ timeZone: widget.options.firstTimezone[1], hour12: false, hour: 'numeric' });
				const fHourDegrees = fHour / 12 * 360 + fMinutes / 60 * 30 + 90;
				hourFirstHand.style.transform = `rotate(${fHourDegrees}deg)`;

				const sHour = now.toLocaleString('en-US',
					{ timeZone: widget.options.secondTimezone[1], hour12: false, hour: 'numeric' });
				const sHourDegrees = sHour / 12 * 360 + sMinutes / 60 * 30 + 90;
				hourSecondHand.style.transform = `rotate(${sHourDegrees}deg)`;
			},

			/***************************************************************************/

			// Try to find a language we should use. Look for URL parameter or system settings.
			// Restricts to supported languages ('en', 'sl' and some others).
			getUserLanguage: function()
			{
				let lang;

				// 1. try to read URL parameter 'lang'
				let qs = window.location.search;
				if (qs)
				{
					if (qs.substring(0, 1) === '?')
					{
						qs = qs.substring(1);
					}

					let params = qs.split('&');

					for (let i = 0; i < params.length; i ++)
					{
						let keyValue = params[i].split('=');
						if (keyValue[0] === 'lang')
						{
							lang = keyValue[1];
							break;
						}
					}
				}

				// 2. try to get browser or system language
				if (!lang)
				{
					let lan = navigator.language || navigator;
					let part = lan.split('-');
					lang = part[0];
				}

				// Use only supported languages, defaults to 'en'
				if (lang !== 'en' && lang !== 'sl')
				{
					lang = 'en';
				}

				return lang;
			},

			/***************************************************************************/

			generateUnitIcon: function(type)
			{
				if (type === 'imperial')
				{
					return 'wi-fahrenheit';
				}
				else
				{
					return 'wi-celsius';
				}
			},

			/***************************************************************************/

			getMoonPhase: function(year, month, day)
			{
				if (typeof year !== 'number' || year < 0)
				{
					console.error('Year must be a number greater or equal to 0');
				}

				if (typeof month !== 'number' || month < 1 || month > 12)
				{
					console.error('Month must be a number between 1 and 12');
				}

				if (typeof day !== 'number' || day < 1 || day > 31)
				{
					console.error('Month must be a number between 1 and 31');
				}

				let thisJd = this.getJulianDayNumber(year, month, day),
					k0 = Math.floor((year - 1900) * 12.3685),
					t = (year - 1899.5) / 100,
					t2 = Math.pow(t, 2),
					t3 = Math.pow(t, 3),
					j0 = 2415020 + 29 * k0,
					f0 = 0.0001178 * t2 -
						0.000000155 * t3 +
						0.75933 +
						0.53058868 * k0 -
						0.000837 * t +
						0.000335 * t2,
					m0 = 360 * this.getFractionalPart(k0 * 0.08084821133) +
						359.2242 -
						0.0000333 * t2 -
						0.00000347 * t3,
					m1 = 360 * this.getFractionalPart(k0 * 0.07171366128) +
						306.0253 +
						0.0107306 * t2 +
						0.00001236 * t3,
					b1 = 360 * this.getFractionalPart(k0 * 0.08519585128) +
						21.2964 -
						0.0016528 * t2 -
						0.00000239 * t3,
					phase = 0,
					jDay = 0,
					oldJ,
					f,
					m5,
					m6,
					b6;

				while (jDay < thisJd)
				{
					f = f0 + 1.530588 * phase;
					m5 = this.degreesToRadians(m0 + phase * 29.10535608);
					m6 = this.degreesToRadians(m1 + phase * 385.81691806);
					b6 = this.degreesToRadians(b1 + phase * 390.67050646);
					f -= 0.4068 * Math.sin(m6) + (0.1734 - 0.000393 * t * Math.sin(m5));
					f += 0.0161 * Math.sin(2 * m6) + 0.0104 * Math.sin(2 * b6);
					f -= 0.0074 * Math.sin(m5 - m6) - 0.0051 * Math.sin(m5 + m6);
					f += 0.0021 * Math.sin(2 * m5) + 0.0010 * Math.sin(2 * b6 - m6);
					f += 0.5 / 1440;
					oldJ = jDay;
					jDay = j0 + 28 * phase + Math.floor(f);
					phase += 1;
				}

				if (this.options.debug)
				{
					console.info('Moon phase successfully calculated.');
				}

				return (thisJd - oldJ) % 30;
			},

			/***************************************************************************/

			getJulianDayNumber: function(year, month, day)
			{
				let a = Math.floor((14 - month) / 12);
				let y = year + 4800 - a;
				let m = month + 12 * a - 3;

				return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) +
					Math.floor(y / 400) - 32045;
			},

			/***************************************************************************/

			degreesToRadians: function(degrees)
			{
				return degrees * Math.PI / 180;
			},

			/***************************************************************************/

			getFractionalPart: function(floatingPointNumber)
			{
				return Math.abs(floatingPointNumber) - Math.floor(floatingPointNumber);
			},

			/***************************************************************************/

			getZodiacSign: function(month, day, zodiac)
			{
				let zodiacSign = '';

				switch (month)
				{
					case 1:
						zodiacSign = day >= 1 && day <= 19 ? zodiac[9] : zodiac[10];
						break;
					case 2:
						zodiacSign = day >= 1 && day <= 18 ? zodiac[10] : zodiac[11];
						break;
					case 3:
						zodiacSign = day >= 21 ? zodiac[0] : zodiac[11];
						break;
					case 4:
						zodiacSign = day >= 1 && day <= 19 ? zodiac[0] : zodiac[1];
						break;
					case 5:
						zodiacSign = day >= 1 && day <= 20 ? zodiac[1] : zodiac[2];
						break;
					case 6:
						zodiacSign = day >= 1 && day <= 21 ? zodiac[2] : zodiac[3];
						break;
					case 7:
						zodiacSign = day >= 1 && day <= 22 ? zodiac[3] : zodiac[4];
						break;
					case 8:
						zodiacSign = day >= 1 && day <= 22 ? zodiac[4] : zodiac[5];
						break;
					case 9:
						zodiacSign = day >= 1 && day <= 22 ? zodiac[5] : zodiac[6];
						break;
					case 10:
						zodiacSign = day >= 1 && day <= 22 ? zodiac[6] : zodiac[7];
						break;
					case 11:
						zodiacSign = day >= 1 && day <= 21 ? zodiac[7] : zodiac[8];
						break;
					case 12:
						zodiacSign = day >= 1 && day <= 21 ? zodiac[8] : zodiac[9];
						break;
				}

				if (this.options.debug)
				{
					console.info('Zodiac sign match found.');
				}

				return zodiacSign;
			},

			/***************************************************************************/

			dayToString: function(day)
			{
				switch (day)
				{
					case 0:
						return getI18n('weatherCube_sunday', this.options.language);
					case 1:
						return getI18n('weatherCube_monday', this.options.language);
					case 2:
						return getI18n('weatherCube_tuesday', this.options.language);
					case 3:
						return getI18n('weatherCube_wednesday', this.options.language);
					case 4:
						return getI18n('weatherCube_thursday', this.options.language);
					case 5:
						return getI18n('weatherCube_friday', this.options.language);
					case 6:
						return getI18n('weatherCube_saturday', this.options.language);
					default:
						return null;
				}
			},

			/***************************************************************************/

			formatTime: function(unixTimestamp, fullDate, unix = false)
			{
				let formattedDate;
				let timestamp = 0;
				if (unix)
				{
					timestamp = unixTimestamp * 1000;
				}
				else
				{
					timestamp = unixTimestamp;
				}

				let updateDate = new Date(timestamp);
				let day = (updateDate.getDate() < 10 ? '0' : '') + updateDate.getDate();
				let month = (updateDate.getMonth() < 9 ? '0' : '') + (updateDate.getMonth() + 1);
				let year = updateDate.getFullYear();
				let hours = updateDate.getHours();
				let minutes = updateDate.getMinutes();

				if (minutes < 10)
				{
					minutes = '0' + minutes;
				}

				if (hours < 10)
				{
					hours = '0' + hours;
				}

				switch (fullDate)
				{
					case 0:
						formattedDate = hours + ':' + minutes + ' - ' + day + '-' + month + '-' + year;
						break;
					case 1:
						formattedDate = month + '/' + day + '/' + year;
						break;
					default:
						formattedDate = hours + ':' + minutes;
						break;
				}

				return formattedDate;
			},

			/***************************************************************************/

			createUniqId: function(idLength)
			{
				const charsToFormId = '_0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
				if (!idLength)
				{
					idLength = Math.floor(Math.random() * charsToFormId.length);
				}

				let uniqId = '';
				for (let i = 0; i < idLength; i++)
				{
					uniqId += charsToFormId[Math.floor(Math.random() * charsToFormId.length)];
				}

				return uniqId;
			},

			/***************************************************************************/

			// Separate 5 day 3-hourly forecast into daily 3-hourly forecasts
			separateForecastByDay: function(forecast)
			{
				let separatedForecast = new Array(5);

				for (let i = 0; i < separatedForecast.length; i++)
				{
					separatedForecast[i] = { 'date': null, 'forecast': [] };
				}

				let [dayIdx, prevItemDate] = [0];
				const today = new Date();

				for (let j = 0; j < forecast.length; j++)
				{
					let item = forecast[j];

					// .replace(/-/g, '/') added to resolve ES5 vs ISO-8601 specification gaps
					// fixes issue with date showing up as invalid in iOS
					const date = new Date(`${item.dt_txt.replace(/-/g, '/')}`);

					// skip if forecast el matches today's date
					if (date.getDate() === today.getDate())
					{
						continue;
					}

					// increment dayIdx if prev forecast date does not match current forecast date
					if (prevItemDate)
					{
						dayIdx += prevItemDate.getDate() !== date.getDate() ? 1 : 0;
					}

					// break loop if going over 5 days of forecast
					if (dayIdx > 4)
					{
						break;
					}

					// set date attribute if it doesn't exist
					if (!separatedForecast[dayIdx].date)
					{
						separatedForecast[dayIdx].date = date;
					}

					// dayIdx represents the day from which the forecast el comes from
					separatedForecast[dayIdx].forecast.push(item);
					prevItemDate = date;
				}

				// check if last element of separatedForecast has forecast data elements.  If no, remove it.
				// this is likely caused by OpenWeatherMap's API not providing enough data for a 5 day forecast.
				if (separatedForecast.slice(-1)[0].forecast.length === 0)
				{
					separatedForecast.splice(-1);
				}

				return separatedForecast;
			},

			/***************************************************************************/

			// Consolidates a day's 3-hourly forecast into a single consolidated forecast
			consolidateToDailyForecast: function(data)
			{
				let forecast = data.forecast;
				let id = this.getWeatherId(forecast);
				let prefix = this.getWeatherPrefix(forecast);
				let day = this.getWeatherDay(forecast);
				let main = this.getWeatherMain(forecast);
				let icon = this.getWeatherIcon(forecast);
				let desc = this.getWeatherDesc(forecast);
				let humidity = this.getAveHumidity(forecast);
				let pressure = this.getAvePressure(forecast);
				let windSpeed = this.getAveWindSpeed(forecast);
				let windDeg = this.getAveWindDeg(forecast);
				let [low, high] = this.getHighLowTemp(forecast);
				let ave = Math.round(high + low / 2 * 100 / 100);

				return { id: id, prefix: prefix, date: data.date, day: day, main: main, icon: icon, desc: desc,
					humidity: humidity, pressure: pressure, windSpeed: windSpeed, windDeg: windDeg, low: low,
					high: high, ave: ave
				};
			},

			/***************************************************************************/

			getWeatherId: function(forecast)
			{
				let mainTracker = {};

				forecast.forEach(( item ) =>
				{
					let main = item.weather[0].id;
					mainTracker[`${main}`] = mainTracker[`${main}`] ? mainTracker[`${main}`] + 1 : 1;
				});

				return Object.keys.length === 1 ? Object.keys(mainTracker)[0] : Object.keys(mainTracker).reduce(
					( a, b ) =>
					{
						return mainTracker[a] > mainTracker[b] ? a : b;
					});
			},

			/***************************************************************************/

			getWeatherPrefix: function(forecast)
			{
				let mainTracker = {};

				forecast.forEach(( item ) =>
				{
					let main = item.sys.pod;
					mainTracker[`${main}`] = mainTracker[`${main}`] ? mainTracker[`${main}`] + 1 : 1;
				});

				return Object.keys.length === 1 ? Object.keys(mainTracker)[0] : Object.keys(mainTracker).reduce(
					( a, b ) =>
					{
						return mainTracker[a] > mainTracker[b] ? a : b;
					});
			},

			/***************************************************************************/

			getWeatherDay: function(forecast)
			{
				let widget = this;
				let mainTracker = {};

				forecast.forEach(( item ) =>
				{
					let main = widget.dayToString(new Date(item.dt * 1000).getDay(), widget.options.language);
					mainTracker[`${main}`] = mainTracker[`${main}`] ? mainTracker[`${main}`] + 1 : 1;
				});

				return Object.keys.length === 1 ? Object.keys(mainTracker)[0] : Object.keys(mainTracker).reduce(
					( a, b ) =>
					{
						return mainTracker[a] > mainTracker[b] ? a : b;
					});
			},

			/***************************************************************************/

			getWeatherMain: function(forecast)
			{
				let mainTracker = {};

				forecast.forEach(( item ) =>
				{
					let main = item.weather[0].main;
					mainTracker[`${main}`] = mainTracker[`${main}`] ? mainTracker[`${main}`] + 1 : 1;
				});

				return Object.keys.length === 1 ? Object.keys(mainTracker)[0] : Object.keys(mainTracker).reduce(
					( a, b ) =>
					{
						return mainTracker[a] > mainTracker[b] ? a : b;
					});
			},

			/***************************************************************************/

			getWeatherIcon: function(forecast)
			{
				let mainTracker = {};

				forecast.forEach(( item ) =>
				{
					let main = item.weather[0].icon;
					mainTracker[`${main}`] = mainTracker[`${main}`] ? mainTracker[`${main}`] + 1 : 1;
				});

				return Object.keys.length === 1 ? Object.keys(mainTracker)[0] : Object.keys(mainTracker).reduce(
					( a, b ) =>
					{
						return mainTracker[a] > mainTracker[b] ? a : b;
					});
			},

			/***************************************************************************/

			getWeatherDesc: function(forecast)
			{
				let mainTracker = {};

				forecast.forEach((item) =>
				{
					let main = item.weather[0].description;
					mainTracker[`${main}`] = mainTracker[`${main}`] ? mainTracker[`${main}`] + 1 : 1;
				});

				return Object.keys.length === 1 ? Object.keys(mainTracker)[0] : Object.keys(mainTracker).reduce(
					( a, b ) =>
					{
						return mainTracker[a] > mainTracker[b] ? a : b;
					});
			},

			/***************************************************************************/

			getHighLowTemp: function(forecast)
			{
				let minTemp = 0;
				let maxTemp = 0;

				forecast.forEach((item, idx) =>
				{
					let temp = item.main.temp;
					if (idx === 0)
					{
						[minTemp, maxTemp] = [temp, temp];
					}
					else if (temp < minTemp)
					{
						minTemp = temp;
					}
					else if (temp > maxTemp)
					{
						maxTemp = temp;
					}
				});

				return [minTemp, maxTemp];
			},

			/***************************************************************************/

			getAveHumidity: function(forecast)
			{
				return Math.round(forecast.reduce(( acc, current ) => acc + current.main.humidity, 0) /
					forecast.length);
			},

			/***************************************************************************/

			getAvePressure: function(forecast)
			{
				return Math.round(forecast.reduce(( acc, current ) => acc + current.main.pressure, 0) /
					forecast.length);
			},

			/***************************************************************************/

			getAveWindSpeed: function(forecast)
			{
				return Math.round(forecast.reduce(( acc, current ) => acc + current.wind.speed, 0) / forecast.length);
			},

			/***************************************************************************/

			getAveWindDeg: function(forecast)
			{
				return Math.round(forecast.reduce(( acc, current ) => acc + current.wind.deg, 0) / forecast.length);
			},

			/***************************************************************************/

			capitalizeFirstLetter: function(string)
			{
				return string.replace(/^./, string[0].toUpperCase());
			},

			/***************************************************************************/

			deCapitalizeFirstLetter: function(string)
			{
				return string.replace(/^./, string[0].toLowerCase());
			},

			/***************************************************************************/

			statusLocalStorage: function(name)
			{
				let date = new Date();
				let current = Math.round(+ date / 1000);

				// Get Schedule
				let stored_time = localStorage.getItem(name + '_time');

				if (stored_time === undefined || stored_time === null)
				{
					stored_time = 0;
				}

				// Expired
				if (stored_time < current)
				{
					// Remove
					this.removeLocalStorage(name);

					return 0;
				}
				else
				{
					return 1;
				}
			},

			/***************************************************************************/

			setLocalStorage: function(name, value, expires)
			{
				if (expires === undefined || expires === null)
				{
					expires = 3600;
				} // default: 1h

				let date = new Date();
				let schedule = Math.round(date.setSeconds(date.getSeconds() + expires) / 1000);

				localStorage.setItem(name, value);
				localStorage.setItem(name + '_time', schedule.toString());
			},

			/***************************************************************************/

			removeLocalStorage: function(name)
			{
				localStorage.removeItem(name);
				localStorage.removeItem(name + '_time');
			},

			/***************************************************************************/

			loadSatImage: function(opts)
			{
				let loadedImage = new Image();

				if (typeof opts !== 'object' || opts === null)
				{
					console.log('loadSatImage(): Please pass valid options!');
					return;
				}

				typeof opts.beforeLoad === 'function' && opts.beforeLoad({
					imgUrl: opts.imgUrl,
					customData: opts.customData
				});

				$(loadedImage).one('load', function()
				{
					let data = {
						success: true,
						url: opts.imgUrl,
						imageElem: loadedImage,
						customData: opts.customData
					};

					typeof opts.complete === 'function' && opts.complete(data);
					typeof opts.success === 'function' && opts.success(data);
				}).one('error', function()
				{
					let data = {
						success: false,
						url: opts.imgUrl,
						imageElem: loadedImage,
						customData: opts.customData
					};
					typeof opts.complete === 'function' && opts.complete(data);
					typeof opts.error === 'function' && opts.error(data);
				}).attr('src', opts.imgUrl).each(function()
				{
					if (this.complete)
					{
						// Cached image
						$(this).trigger('load');
					}
				});
			},

			/***************************************************************************/

			getIPLocation: function()
			{
				let widget = this;
				let retryCount = 0;
				let apiKey;

				if (widget.options.apiGeoKey || widget.options.apiGeoKey !== '')
				{
					apiKey = widget.options.apiGeoKey + '/';
				}

				$.ajax({
					url: 'https://geoip-db.com/json/' + apiKey,
					dataType: 'json',
					jsonp: false,
					success: function(location)
					{
						if (widget.options.debug)
						{
							console.info('Success, getting data for: https://geoip-db.com/json/');
							console.log(location);
						}

						if (!widget.options.city || widget.options.city === '')
						{
							$(widget.element).find('#weatherCube-city-' + widget._uId).text(location.city);
						}
						else
						{
							$(widget.element).find('#weatherCube-city-' + widget._uId).text(widget.options.city);
						}

						retryCount = 0;

						$(widget.element).find('#weatherCube-state-' + widget._uId).text(location.state);
						$(widget.element).find('#weatherCube-country-' + widget._uId).text(location.country_code);
						$(widget.element).find('#weatherCube-detectedIP-' + widget._uId).text(
							getI18n('weatherCube_detectedIP', widget.options.language) + ' ' + location.IPv4);
					},
					error: function(xhr, textStatus, thrownError)
					{
						retryCount++;

						if (retryCount <= widget.options.retryLimit)
						{
							// Try again
							$(widget.element).find('#weatherCube-loaderText-' + widget._uId)
								.text(getI18n('weatherCube_getFeedTryAgain', widget.options.language));
							$.ajax(this);

							return;
						}

						if (widget.options.debug)
						{
							console.error('Error getting JSON data from: https://geoip-db.com/json/');
							console.error(thrownError + '\r' + xhr.statusText + '\r' + xhr.responseText);
						}
					}
				});
			},

			/***************************************************************************/

			addTableDataToArray: function(table)
			{
				let data = [];
				$(table).find('tr').each(function(rowIndex, r)
				{
					let cols = [];
					$(this).find('th, td').each(function(colIndex, c)
					{
						cols.push(c.innerHTML);
					});

					data.push(cols);
				});

				return data;
			},

			/***************************************************************************/

			getWindBeaufort: function(speed)
			{
				let scales = [0, 2, 6, 12, 20, 29, 39, 50, 62, 75, 89, 103, 118];
				let scale = false;

				// Convert m/s to km/h
				speed = speed * 3.6;

				$.each(scales, function(i, speedScale)
				{
					if (speed > speedScale)
					{
						scale = i;
					}
				});

				return scale;
			},

			/***************************************************************************/

			getWindDirection: function(degree)
			{
				if (degree < 11.25 && degree > 348.75)
				{
					return 'N';
				}
				else if (degree > 11.25 && degree < 33.75)
				{
					return 'NNE';
				}
				else if (degree > 33.75 && degree < 56.25)
				{
					return 'NE';
				}
				else if (degree > 56.25 && degree < 78.75)
				{
					return 'ENE';
				}
				else if (degree > 78.75 && degree < 101.25)
				{
					return 'E';
				}
				else if (degree > 101.25 && degree < 123.75)
				{
					return 'ESE';
				}
				else if (degree > 123.75 && degree < 146.25)
				{
					return 'SE';
				}
				else if (degree > 146.25 && degree < 191.25)
				{
					return 'S';
				}
				else if (degree > 191.25 && degree < 213.75)
				{
					return 'SSW';
				}
				else if (degree > 213.75 && degree < 236.25)
				{
					return 'SW';
				}
				else if (degree > 236.25 && degree < 258.75)
				{
					return 'WSW';
				}
				else if (degree > 258.75 && degree < 281.25)
				{
					return 'W';
				}
				else if (degree > 281.25 && degree < 303.75)
				{
					return 'WNW';
				}
				else if (degree > 303.75 && degree < 326.25)
				{
					return 'NW';
				}
				else
				{
					return 'NNW';
				}
			},

			/***************************************************************************/

			getTimezoneName: function()
			{
				const timeSummer = new Date(Date.UTC(2005, 6, 30, 0, 0, 0, 0));
				const summerOffset = - 1 * timeSummer.getTimezoneOffset();
				const timeWinter = new Date(Date.UTC(2005, 12, 30, 0, 0, 0, 0));
				const winterOffset = - 1 * timeWinter.getTimezoneOffset();
				let timeZone;

				if (- 720 === summerOffset && - 720 === winterOffset)
				{
					timeZone = 'Dateline Standard Time';
				}
				else if (- 660 === summerOffset && - 660 === winterOffset)
				{
					timeZone = 'UTC-11';
				}
				else if (- 660 === summerOffset && - 660 === winterOffset)
				{
					timeZone = 'Samoa Standard Time';
				}
				else if (- 660 === summerOffset && - 600 === winterOffset)
				{
					timeZone = 'Hawaiian Standard Time';
				}
				else if (- 570 === summerOffset && - 570 === winterOffset)
				{
					timeZone = 'Pacific/Marquesas';
				}
				else if (- 480 === summerOffset && - 540 === winterOffset)
				{
					timeZone = 'Alaskan Standard Time';
				}
				else if (- 420 === summerOffset && - 480 === winterOffset)
				{
					timeZone = 'Pacific Standard Time';
				}
				else if (- 420 === summerOffset && - 420 === winterOffset)
				{
					timeZone = 'US Mountain Standard Time';
				}
				else if (- 360 === summerOffset && - 420 === winterOffset)
				{
					timeZone = 'Mountain Standard Time';
				}
				else if (- 360 === summerOffset && - 360 === winterOffset)
				{
					timeZone = 'Central America Standard Time';
				}
				else if (- 300 === summerOffset && - 360 === winterOffset)
				{
					timeZone = 'Central Standard Time';
				}
				else if (- 300 === summerOffset && - 300 === winterOffset)
				{
					timeZone = 'SA Pacific Standard Time';
				}
				else if (- 240 === summerOffset && - 300 === winterOffset)
				{
					timeZone = 'Eastern Standard Time';
				}
				else if (- 270 === summerOffset && - 270 === winterOffset)
				{
					timeZone = 'Venezuela Standard Time';
				}
				else if (- 240 === summerOffset && - 240 === winterOffset)
				{
					timeZone = 'SA Western Standard Time';
				}
				else if (- 240 === summerOffset && - 180 === winterOffset)
				{
					timeZone = 'Central Brazilian Standard Time';
				}
				else if (- 180 === summerOffset && - 240 === winterOffset)
				{
					timeZone = 'Atlantic Standard Time';
				}
				else if (- 180 === summerOffset && - 180 === winterOffset)
				{
					timeZone = 'Montevideo Standard Time';
				}
				else if (- 180 === summerOffset && - 120 === winterOffset)
				{
					timeZone = 'E. South America Standard Time';
				}
				else if (- 150 === summerOffset && - 210 === winterOffset)
				{
					timeZone = 'Mid-Atlantic Standard Time';
				}
				else if (- 120 === summerOffset && - 180 === winterOffset)
				{
					timeZone = 'America/Godthab';
				}
				else if (- 120 === summerOffset && - 120 === winterOffset)
				{
					timeZone = 'SA Eastern Standard Time';
				}
				else if (- 60 === summerOffset && - 60 === winterOffset)
				{
					timeZone = 'Cape Verde Standard Time';
				}
				else if (0 === summerOffset && - 60 === winterOffset)
				{
					timeZone = 'Azores Daylight Time';
				}
				else if (0 === summerOffset && 0 === winterOffset)
				{
					timeZone = 'Morocco Standard Time';
				}
				else if (60 === summerOffset && 0 === winterOffset)
				{
					timeZone = 'GMT Standard Time';
				}
				else if (60 === summerOffset && 60 === winterOffset)
				{
					timeZone = 'Africa/Algiers';
				}
				else if (60 === summerOffset && 120 === winterOffset)
				{
					timeZone = 'Namibia Standard Time';
				}
				else if (120 === summerOffset && 60 === winterOffset)
				{
					timeZone = 'Central European Standard Time';
				}
				else if (120 === summerOffset && 120 === winterOffset)
				{
					timeZone = 'South Africa Standard Time';
				}
				else if (180 === summerOffset && 120 === winterOffset)
				{
					timeZone = 'GTB Standard Time';
				}
				else if (180 === summerOffset && 180 === winterOffset)
				{
					timeZone = 'E. Africa Standard Time';
				}
				else if (240 === summerOffset && 180 === winterOffset)
				{
					timeZone = 'Russian Standard Time';
				}
				else if (240 === summerOffset && 240 === winterOffset)
				{
					timeZone = 'Arabian Standard Time';
				}
				else if (270 === summerOffset && 210 === winterOffset)
				{
					timeZone = 'Iran Standard Time';
				}
				else if (270 === summerOffset && 270 === winterOffset)
				{
					timeZone = 'Afghanistan Standard Time';
				}
				else if (300 === summerOffset && 240 === winterOffset)
				{
					timeZone = 'Pakistan Standard Time';
				}
				else if (300 === summerOffset && 300 === winterOffset)
				{
					timeZone = 'West Asia Standard Time';
				}
				else if (330 === summerOffset && 330 === winterOffset)
				{
					timeZone = 'India Standard Time';
				}
				else if (345 === summerOffset && 345 === winterOffset)
				{
					timeZone = 'Nepal Standard Time';
				}
				else if (360 === summerOffset && 300 === winterOffset)
				{
					timeZone = 'N. Central Asia Standard Time';
				}
				else if (360 === summerOffset && 360 === winterOffset)
				{
					timeZone = 'Central Asia Standard Time';
				}
				else if (390 === summerOffset && 390 === winterOffset)
				{
					timeZone = 'Myanmar Standard Time';
				}
				else if (420 === summerOffset && 360 === winterOffset)
				{
					timeZone = 'North Asia Standard Time';
				}
				else if (420 === summerOffset && 420 === winterOffset)
				{
					timeZone = 'SE Asia Standard Time';
				}
				else if (480 === summerOffset && 420 === winterOffset)
				{
					timeZone = 'North Asia East Standard Time';
				}
				else if (480 === summerOffset && 480 === winterOffset)
				{
					timeZone = 'China Standard Time';
				}
				else if (540 === summerOffset && 480 === winterOffset)
				{
					timeZone = 'Yakutsk Standard Time';
				}
				else if (540 === summerOffset && 540 === winterOffset)
				{
					timeZone = 'Tokyo Standard Time';
				}
				else if (570 === summerOffset && 570 === winterOffset)
				{
					timeZone = 'Cen. Australia Standard Time';
				}
				else if (570 === summerOffset && 630 === winterOffset)
				{
					timeZone = 'Australia/Adelaide';
				}
				else if (600 === summerOffset && 540 === winterOffset)
				{
					timeZone = 'Asia/Yakutsk';
				}
				else if (600 === summerOffset && 600 === winterOffset)
				{
					timeZone = 'E. Australia Standard Time';
				}
				else if (600 === summerOffset && 660 === winterOffset)
				{
					timeZone = 'AUS Eastern Standard Time';
				}
				else if (630 === summerOffset && 660 === winterOffset)
				{
					timeZone = 'Australia/Lord_Howe';
				}
				else if (660 === summerOffset && 600 === winterOffset)
				{
					timeZone = 'Tasmania Standard Time';
				}
				else if (660 === summerOffset && 660 === winterOffset)
				{
					timeZone = 'West Pacific Standard Time';
				}
				else if (690 === summerOffset && 690 === winterOffset)
				{
					timeZone = 'Central Pacific Standard Time';
				}
				else if (720 === summerOffset && 660 === winterOffset)
				{
					timeZone = 'Magadan Standard Time';
				}
				else if (720 === summerOffset && 720 === winterOffset)
				{
					timeZone = 'Fiji Standard Time';
				}
				else if (720 === summerOffset && 780 === winterOffset)
				{
					timeZone = 'New Zealand Standard Time';
				}
				else if (765 === summerOffset && 825 === winterOffset)
				{
					timeZone = 'Pacific/Chatham';
				}
				else if (780 === summerOffset && 780 === winterOffset)
				{
					timeZone = 'Tonga Standard Time';
				}
				else if (840 === summerOffset && 840 === winterOffset)
				{
					timeZone = 'Pacific/Kiritimati';
				}
				else
				{
					timeZone = 'US/Pacific';
				}

				return timeZone;
			}
		});

	/***************************************************************************/

	/*
		Create a lightweight plugin wrapper around the "Plugin" constructor,
		preventing against multiple instantiations.

		More: http://learn.jquery.com/plugins/basic-plugin-creation/
	*/
	$.fn.weatherCube = function(options)
	{
		this.each(function()
		{
			if (!$.data(this, 'plugin_' + pluginName))
			{
				/*
					Use "$.data" to save each instance of the plugin in case
					the user wants to modify it. Using "$.data" in this way
					ensures the data is removed when the DOM element(s) are
					removed via jQuery methods, as well as when the user leaves
					the page. It's a smart way to prevent memory leaks.

					More: http://api.jquery.com/jquery.data/
				*/
				$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			}
		});

		/*
			"return this;" returns the original jQuery object. This allows
			additional jQuery methods to be chained.
		*/
		return this;
	};

	/***************************************************************************/

	/*
		Attach the default plugin options directly to the plugin object. This
		allows users to override default plugin options globally, instead of
		passing the same option(s) every time the plugin is initialized.

		For example, the user could set the "property" value once for all
		instances of the plugin with
		"$.fn.pluginName.defaults.property = 'myValue';". Then, every time
		plugin is initialized, "property" will be set to "myValue".

		More: http://learn.jquery.com/plugins/advanced-plugin-concepts/
	*/
	$.fn.weatherCube.defaults = {
		// Get key at: https://openweathermap.org/
		apiKey: null,
		// Get key at: https://geoip-db.com/
		apiGeoKey: '699283e0-b3ab-11e9-97d7-d7584e8de765',
		city: null,
		latitude: null,
		longitude: null,
		language: null,
		wInterval: 7200000,
		units: 'imperial',
		theme: 'light',
		icons: 'default',
		firstTimezone: ['Tokyo', 'Asia/Tokyo'],
		secondTimezone: ['Los Angeles', 'America/Los_Angeles'],
		alertsInterval: 6000,
		retryLimit: 3,

		// Satellite images
		satImageEnabled: true,
		satImageSize: '2',
		satImageLocations: [],

		// EarthQuakes period week or day
		quakesPeriod: 'week',

		debug: true,
		cache: 60, // 3600 one hour
		async: true,
		property: 'value',
		// Event on complete
		onComplete: null,
		// Event on error
		onError: null
	};
})(jQuery, window, document);

/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

(function(root, factory)
{
	if (typeof window.define === 'function' && window.define.amd)
	{
		// AMD. Register as an anonymous module.
		window.define(['exports', 'echarts'], factory);
	}
	else if (typeof window.exports === 'object' && typeof window.exports.nodeName !== 'string')
	{
		// CommonJS
		factory(window.exports, window.require('echarts'));
	}
	else
	{
		// Browser globals
		factory({}, root.echarts);
	}
}(this, function(exports, echarts)
{
	let log = function(msg)
	{
		if (typeof console !== 'undefined')
		{
			console && console.error && console.error(msg);
		}
	};

	if (!echarts)
	{
		log('ECharts is not Loaded');
		return;
	}

	const colorPalette = [
		'rgb(193,46,52)', 'rgb(230,182,0)', 'rgb(0,152,217)', 'rgb(43,130,29)',
		'rgb(0,94,170)', 'rgb(51,156,168)', 'rgb(205,168,25)', 'rgb(50,164,135)'
	];

	const contrastColor = 'rgb(238,238,238)';
	let axisCommon = function()
	{
		return {
			axisLine: {
				lineStyle: {
					color: contrastColor
				}
			},
			axisTick: {
				lineStyle: {
					color: contrastColor
				}
			},
			axisLabel: {
				textStyle: {
					color: contrastColor
				}
			},
			splitLine: {
				lineStyle: {
					type: 'dashed',
					color: 'rgb(170,170,170)'
				}
			},
			splitArea: {
				areaStyle: {
					color: contrastColor
				}
			}
		};
	};

	let theme = {
		color: colorPalette,

		legend: {
			textStyle: {
				color: contrastColor
			}
		},

		textStyle: {
			color: contrastColor
		},

		title: {
			textStyle: {
				color: contrastColor,
				fontWeight: 'normal'
			}
		},

		toolbox: {
			iconStyle: {
				normal: {
					borderColor: contrastColor
				}
			}
		},

		tooltip: {
			backgroundColor: 'rgba(0,0,0,0.6)'
		},

		dataZoom: {
			dataBackgroundColor: 'rgb(222,222,222)',
			fillerColor: 'rgba(154,217,247,0.2)',
			handleColor: 'rgb(0,94,170)',
			textStyle: {
				color: contrastColor
			}
		},

		visualMap: {
			textStyle: {
				color: contrastColor
			}
		},

		timeline: {
			lineStyle: {
				color: contrastColor
			},
			itemStyle: {
				normal: {
					color: colorPalette[1]
				}
			},
			label: {
				normal: {
					textStyle: {
						color: contrastColor
					}
				}
			},
			controlStyle: {
				normal: {
					color: contrastColor,
					borderColor: contrastColor
				}
			}
		},

		candlestick: {
			itemStyle: {
				normal: {
					color: 'rgb(193,46,52)',
					color0: 'rgb(43,130,29)',
					lineStyle: {
						width: 1,
						color: 'rgb(193,46,52)',
						color0: 'rgb(43,130,29)'
					}
				}
			}
		},

		line: {
			symbol: 'circle'
		},

		graph: {
			color: colorPalette
		},

		map: {
			label: {
				normal: {
					textStyle: {
						color: 'rgb(193,46,52)'
					}
				},
				emphasis: {
					textStyle: {
						color: 'rgb(193,46,52)'
					}
				}
			},
			itemStyle: {
				normal: {
					borderColor: 'rgb(238,238,238)',
					areaColor: 'rgb(221,221,221)'
				},
				emphasis: {
					areaColor: 'rgb(230,182,0)'
				}
			}
		},

		timeAxis: axisCommon(),
		logAxis: axisCommon(),
		valueAxis: axisCommon(),
		categoryAxis: axisCommon()
	};

	theme.categoryAxis.splitLine.show = false;
	echarts.registerTheme('dark', theme);
}));

/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

(function(root, factory)
{
	if (typeof define === 'function' && define.amd)
	{
		// AMD. Register as an anonymous module.
		define(['exports', 'echarts'], factory);
	}
	else if (typeof exports === 'object' && typeof exports.nodeName !== 'string')
	{
		// CommonJS
		factory(exports, require('echarts'));
	}
	else
	{
		// Browser globals
		factory({}, root.echarts);
	}
}(this, function(exports, echarts)
{
	let log = function(msg)
	{
		if (typeof console !== 'undefined')
		{
			console && console.error && console.error(msg);
		}
	};

	if (!echarts)
	{
		log('ECharts is not Loaded');
		return;
	}

	let colorPalette = ['rgb(216,124,124)', 'rgb(145,158,139)', 'rgb(215,171,130)', 'rgb(110,112,116)',
		'rgb(97,160,168)', 'rgb(239,161,141)', 'rgb(120,116,100)', 'rgb(204,126,99)', 'rgb(114,78,88)', 'rgb(75,86,91)'
	];
	echarts.registerTheme('light',
		{
			color: colorPalette,
			graph: {
				color: colorPalette
			}
		});
}));