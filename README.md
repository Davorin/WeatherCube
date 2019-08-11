# WeatherCube

Starting with version V1.2.2019.

This is a full jquery, bootstrap 4 weather widget.

It uses multiple api endpoints for collecting the data used.

Used api endpoints are:
- OpenWeatherMap - forecasts, uvi, and map services  https://openweathermap.org/api
- USGS for earthquake data  https://earthquake.usgs.gov/earthquakes/
- MetoAlarm for live weather warning  https://www.meteoalarm.eu/
- sat24 for satellite images  https://en.sat24.com/en
- Naval Oceanography Portal for astronomy data  https://www.public.navy.mil/
--------------------------------------------------------------

```javascript
$(document).ready(function()
{
    $('#weatherCube').weatherCube({
	// OpenWeatherMap apiKey get it here: https://openweathermap.org/api
	apiKey: '',
	// Selected forecast city
	city: 'Murska Sobota',
	// We are using city so coordinates are set to null
	latitude: '',
	longitude: '',
	// language en, sl
	language: 'en',
	// imperial or metric
	units: "metric",
	// EarthQuakes period week or day
	quakesPeriod: "week",
	// default, tick, weezle
	icons: "weezle",
	// weather update interval 2 hours
	wInterval: 7200000,
	// Widget theme light or dark
	theme: 'light',
	// Satellite images
	satImageLocations: [{
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
});
```

----------------------------------------------------------------------------------
It's full responsive widget build upon bootstrap 4 and jquery also using leaflet maps an Echarts plugins. 

![Screenshot](screen.png)
