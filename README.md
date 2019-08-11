# WeatherCube

Starting with version V1.2.2019.

This is a full jquery, bootstrap 4 weather widget.

It uses multiple api endpoints for collecting the data used.

Used api endpoints are:
- OpenWeatherMap - forecasts, uvi, and map services
- USGS for earthquake data
- MetoAlarm for live weather warning
- sat24 for satellite images
- Naval Oceanography Portal for astronomy data
--------------------------------------------------------------

We can set a few options like:

$('#weatherCube').weatherCube({
			// OpenWeatherMap apiKey get it here: https://openweathermap.org/api
			apiKey: '',
      
			// Selected forecast city
			city: 'Murska Sobota',
      
			// We are using city so coordinates are set to null
			latitude: '',
			longitude: '',
      
			// language en, sl - it's auto set trough browser if you leave it empty.
			language: 'en',
      
			// imperial or metric
			units: "metric",
      
			// EarthQuakes period week or day
			quakesPeriod: "week",
      
			// forecast icons default, tick, weezle
			icons: "weezle",
      
			// weather update interval 2 hours
			wInterval: 7200000,
      
			// Widget theme light or dark its ads a class 
      // .weatherCube-lightTheme or .weatherCube-darkTheme
			theme: 'light',
      
			// Satellite images
			satImageLocations: [
				{
					region: "EU",
					type: "visual",
					animated: true
				},
				{
					region: "GR",
					type: "visual",
					animated: true
				},
				{
					region: "AF",
					type: "visual",
					animated: true
				},
				{
					region: "RU",
					type: "visual",
					animated: true
				}],
			debug: true
		});
