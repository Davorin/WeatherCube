/**
 * Internationalization of some texts used by the weatherCube.
 * @return String the localized text item or the id if there's no translation found
 * @param key
 * @param lang
 */
function getI18n(key, lang)
{
	const i18n = {
		en: {
			viewGeoError: 'It seems like Geolocation, which is required for this page, is not enabled in your browser.',
			viewSolar: 'Solar Eclipses:',
			viewAlerts: 'Alerts:',
			viewSearch: 'Search',
			viewSearchPlaceholder: 'Search for City ...',
			viewPowered: 'Powered by ',
			viewForecastFor: 'Forecast for:',
			viewCurrentCountry: 'Current County:',
			viewUpdate: 'Last Update:',
			viewClose: 'Close',
			viewSat: 'View Satellite Images',
			viewCharts: 'View Charts',
			viewMaps: 'View Maps',
			viewEarthquakes: 'View Earthquakes',
			viewMoon: 'View Moon data',
			viewHours: 'View today by hours',
			viewPartners: 'Partners:',
			viewAt: ' at:',
			
			versionJQuery: 'JQuery Version: ',
			versionBootstrap: 'Bootstrap Version: ',
			versionLeafleet: 'Leafleet Version: ',
			versionEChars: 'ECharts Version: ',
			
			satError: 'Weather Satellite Images, are disabled!',
			satNotSet: 'Weather Satellite Images, are not set!',
			
			currentForecastToday: 'Today',
			currentForecastLat: ' at Lat: ',
			currentForecastLon: ' - Lon: ',
			
			earthquakesLatitude: 'Latitude:',
			earthquakesLongitude: 'Longitude:',
			earthquakesTime: 'Time:',
			earthquakesStatus: 'Status:',
			earthquakesTsunami: 'Tsunami:',
			earthquakesTsunamiYes: 'YES',
			earthquakesTsunamiNo: 'NO',
			earthquakesStrength: 'Earthquakes by strength:',
			earthquakesMinStrength: 'Max. Strength',
			earthquakesMaxStrength: 'Min. Strength',
			
			windSpeed: 'Wind Speed',
			maxWindSpeed: 'Max. Wind Speed',
			minWindSpeed: 'Min. Wind Speed',
			aveWindSpeed: 'Average Wind Speed',
			
			pressure: 'Pressure',
			humidity: 'Humidity',
			
			temperature: 'Temperature',
			aveTemperature: 'Average Temperature',
			minTemperature: 'Min. Temperature',
			maxTemperature: 'Max. Temperature',
			maxAveTemperature: 'Max. Average Temperature',
			
			mapClick: 'You clicked on map at: ',
			moonPhases: 'Moon Phases for: ',
			moonPhaseToday: 'Moon Phase for Today: ',
			moonFracillum: 'Fracillum:',
			
			newMoon: 'New Moon',
			waxingCrescent: 'Waxing Crescent',
			firstQuarter: 'First Quarter',
			waxingGibbous: 'Waxing Gibbous',
			fullMoon: 'Full Moon',
			waningGibbous: 'Waning Gibbous',
			lastQuarter: 'Last Quarter',
			waningCrescent: 'Waning Crescent',
			
			january: 'January',
			february: 'February',
			march: 'March',
			april: 'April',
			may: 'May',
			june: 'June',
			july: 'July',
			august: 'August',
			september: 'September',
			october: 'October',
			november: 'November',
			december: 'December',
			
			day: 'Day',
			week: 'Week',
			monday: 'Monday',
			tuesday: 'Tuesday',
			wednesday: 'Wednesday',
			thursday: 'Thursday',
			friday: 'Friday',
			saturday: 'Saturday',
			sunday: 'Sunday'
		},
		sl: {
			viewGeoError: 'Zdi se, da Geolokacija, ki je potrebna za to stran, v vašem brskalniku ni omogočena.',
			viewSolar: 'Sončni Mrki:',
			viewAlerts: 'Opozorila:',
			viewSearch: 'Iskanje',
			viewSearchPlaceholder: 'Iskanje mesta ...',
			viewPowered: 'Powered by ',
			viewForecastFor: 'Napoved za:',
			viewCurrentCountry: 'Trenutno okrožje:',
			viewUpdate: 'Zadnja posodobitev:',
			viewClose: 'Zapri',
			viewSat: 'Ogled satelitskih slik',
			viewCharts: 'Ogled grafikonov',
			viewMaps: 'ogled Map',
			viewEarthquakes: 'Ogled zemeljskih potresov',
			viewMoon: 'Prikaži podatke o Luni',
			viewHours: 'Danes, po urah',
			viewPartners: 'Partnerji:',
			viewAt: ' ob:',
			
			versionJQuery: 'JQuery Verzija: ',
			versionBootstrap: 'Bootstrap Verzija: ',
			versionLeafleet: 'Leafleet Verzija: ',
			versionEChars: 'ECharts Verzija: ',
			
			satError: 'Satelitske slike so onemogočene!',
			satNotSet: 'Satelitske slike niso nastavljene!\'',
			
			currentForecastToday: 'Danes',
			currentForecastLat: ' pri Lat: ',
			currentForecastLon: ' - Lon: ',
			
			earthquakesLatitude: 'Širina:',
			earthquakesLongitude: 'Dolžina:',
			earthquakesTime: 'Čas:',
			earthquakesStatus: 'Status:',
			earthquakesTsunami: 'Cunami:',
			earthquakesTsunamiYes: 'DA',
			earthquakesTsunamiNo: 'NE',
			earthquakesStrength: 'Potresi po jakosti:',
			earthquakesMinStrength: 'Max. Moč',
			earthquakesMaxStrength: 'Min. SMoč',
			
			windSpeed: 'Hitrost Vetra',
			maxWindSpeed: 'Max. Hitrost Vetra',
			minWindSpeed: 'Min. Hitrost Vetra',
			aveWindSpeed: 'Povprečna Hitrost Vetra',
			
			pressure: 'Tlak',
			humidity: 'Vlažnost',
			
			temperature: 'Temperatura',
			aveTemperature: 'Povprečna Temperatura',
			minTemperature: 'Min. Temperatura',
			maxTemperature: 'Max. Temperatura',
			maxAveTemperature: 'Max. Povprečna Temperatura',
			
			mapClick: 'Na zemljevidu ste kliknili na: ',
			moonPhases: 'Faze lune za: ',
			moonPhaseToday: 'Faza lune za danes: ',
			moonFracillum: 'Osvetljenost:',
			
			newMoon: 'Nova Luna',
			waxingCrescent: 'Naraščajoča Luna',
			firstQuarter: 'Prva Četrtina',
			waxingGibbous: 'Naraščajoči Krajec',
			fullMoon: 'Polna Luna',
			waningGibbous: 'Pojemajoči Krajec',
			lastQuarter: 'Zadnja Četrtina',
			waningCrescent: 'Pojemajoča Luna',
			
			january: 'Januar',
			february: 'Februar',
			march: 'Marec',
			april: 'April',
			may: 'Maj',
			june: 'Junij',
			july: 'Julij',
			august: 'Avgust',
			september: 'September',
			october: 'Oktober',
			november: 'November',
			december: 'December',
			
			day: 'Dan',
			week: 'Teden',
			monday: 'Ponedeljek',
			tuesday: 'Torek',
			wednesday: 'Sreda',
			thursday: 'Četrtek',
			friday: 'Petek',
			saturday: 'Sobota',
			sunday: 'Nedelja'
		},
		de: {
			viewGeoError: 'Die für diese Seite erforderliche Geolokalisierung scheint in Ihrem Browser nicht aktiviert zu sein.',
			viewSolar: 'Sonnenfinsternisse:',
			viewAlerts: 'Alerts:',
			viewSearch: 'Suche',
			viewSearchPlaceholder: 'Suche nach Stadt ...',
			viewPowered: 'Powered by ',
			viewForecastFor: 'Vorhersage für:',
			viewCurrentCountry: 'Current County:',
			viewUpdate: 'Letztes Update:',
			viewClose: 'Schließen',
			viewSat: 'Satellitenbilder anzeigen',
			viewCharts: 'Charts anzeigen',
			viewMaps: 'Karten anzeigen',
			viewEarthquakes: 'Erdbeben anzeigen',
			viewMoon: 'Monddaten anzeigen',
			viewHours: 'Stunden anzeigen',
			viewPartners: 'Partner:',
			viewAt: ' ab:',
			
			versionJQuery: 'JQuery Version: ',
			versionBootstrap: 'Bootstrap Version: ',
			versionLeafleet: 'Leafleet Version: ',
			versionEChars: 'ECharts Version: ',
			
			satError: 'Wettersatellitenbilder sind deaktiviert!',
			satNotSet: 'Wettersatellitenbilder sind nicht gesetzt!',
			
			currentForecastToday: 'Today',
			currentForecastLat: ' at Lat: ',
			currentForecastLon: ' - Lon: ',
			
			earthquakesLatitude: 'Latitude:',
			earthquakesLongitude: 'Longitude:',
			earthquakesTime: 'Zeit:',
			earthquakesStatus: 'Status:',
			earthquakesTsunami: 'Tsunami:',
			earthquakesTsunamiYes: 'JA',
			earthquakesTsunamiNo: 'NEIN',
			earthquakesStrength: 'Erdbeben nach Stärke:',
			earthquakesMinStrength: 'Max. Stärke',
			earthquakesMaxStrength: 'Min. Stärke',
			
			windSpeed: 'Wind Speed',
			maxWindSpeed: 'Max. Wind Speed',
			minWindSpeed: 'Min. Wind Speed',
			aveWindSpeed: 'Average Wind Speed',
			
			pressure: 'Druck',
			humidity: 'Luftfeuchtigkeit',
			
			temperature: 'Temperatur',
			aveTemperature: 'Durchschnittliche Temperatur',
			minTemperature: 'Min. Temperatur',
			maxTemperature: 'Max. Temperatur',
			maxAveTemperature: 'Max. Durchschnittliche Temperatur',
			
			mapClick: 'Sie haben auf map at geklickt: ',
			moonPhases: 'Mondphasen für: ',
			moonPhaseToday: 'Mondphase für heute: ',
			moonFracillum: 'Fracillum:',
			
			newMoon: 'New Moon',
			waxingCrescent: 'Waxing Crescent',
			firstQuarter: 'First Quarter',
			waxingGibbous: 'Waxing Gibbous',
			fullMoon: 'Full Moon',
			waningGibbous: 'Waning Gibbous',
			lastQuarter: 'Last Quarter',
			waningCrescent: 'Waning Crescent',
			
			january: 'Januar',
			february: 'Februar',
			march: 'März',
			april: 'April',
			may: 'May',
			june: 'Juni',
			july: 'Juli',
			august: 'August',
			september: 'September',
			october: 'October',
			november: 'November',
			december: 'Dezember',
			
			day: 'Tag',
			week: 'Woche',
			monday: 'Montag',
			tuesday: 'Dienstag',
			wednesday: 'Mittwoch',
			thursday: 'Donnerstag',
			friday: 'Freitag',
			saturday: 'Samstag',
			sunday: 'Sonntag'
		},
		ru: {
			viewGeoError: 'It seems like Geolocation, which is required for this page, is not enabled in your browser.',
			viewSolar: 'Solar Eclipses:',
			viewAlerts: 'Alerts:',
			viewSearch: 'Search',
			viewSearchPlaceholder: 'Search for City ...',
			viewPowered: 'Powered by ',
			viewForecastFor: 'Forecast for:',
			viewCurrentCountry: 'Current County:',
			viewUpdate: 'Last Update:',
			viewClose: 'Close',
			viewSat: 'View Satellite Images',
			viewCharts: 'View Charts',
			viewMaps: 'View Maps',
			viewEarthquakes: 'View Earthquakes',
			viewMoon: 'View Moon data',
			viewHours: 'View today by hours',
			viewPartners: 'Partners:',
			viewAt: ' at:',
			
			versionJQuery: 'JQuery Version: ',
			versionBootstrap: 'Bootstrap Version: ',
			versionLeafleet: 'Leafleet Version: ',
			versionEChars: 'ECharts Version: ',
			
			satError: 'Weather Satellite Images, are disabled!',
			satNotSet: 'Weather Satellite Images, are not set!',
			
			currentForecastToday: 'Today',
			currentForecastLat: ' at Lat: ',
			currentForecastLon: ' - Lon: ',
			
			earthquakesLatitude: 'Latitude:',
			earthquakesLongitude: 'Longitude:',
			earthquakesTime: 'Time:',
			earthquakesStatus: 'Status:',
			earthquakesTsunami: 'Tsunami:',
			earthquakesTsunamiYes: 'YES',
			earthquakesTsunamiNo: 'NO',
			earthquakesStrength: 'Earthquakes by strength:',
			earthquakesMinStrength: 'Max. Strength',
			earthquakesMaxStrength: 'Min. Strength',
			
			windSpeed: 'Wind Speed',
			maxWindSpeed: 'Max. Wind Speed',
			minWindSpeed: 'Min. Wind Speed',
			aveWindSpeed: 'Average Wind Speed',
			
			pressure: 'Pressure',
			humidity: 'Humidity',
			
			temperature: 'Temperature',
			aveTemperature: 'Average Temperature',
			minTemperature: 'Min. Temperature',
			maxTemperature: 'Max. Temperature',
			maxAveTemperature: 'Max. Average Temperature',
			
			mapClick: 'You clicked on map at: ',
			moonPhases: 'Moon Phases for: ',
			moonPhaseToday: 'Moon Phase for Today: ',
			moonFracillum: 'Fracillum:',
			
			newMoon: 'New Moon',
			waxingCrescent: 'Waxing Crescent',
			firstQuarter: 'First Quarter',
			waxingGibbous: 'Waxing Gibbous',
			fullMoon: 'Full Moon',
			waningGibbous: 'Waning Gibbous',
			lastQuarter: 'Last Quarter',
			waningCrescent: 'Waning Crescent',
			
			january: 'January',
			february: 'February',
			march: 'March',
			april: 'April',
			may: 'May',
			june: 'June',
			july: 'July',
			august: 'August',
			september: 'September',
			october: 'October',
			november: 'November',
			december: 'December',
			
			day: 'Day',
			week: 'Week',
			monday: 'Monday',
			tuesday: 'Tuesday',
			wednesday: 'Wednesday',
			thursday: 'Thursday',
			friday: 'Friday',
			saturday: 'Saturday',
			sunday: 'Sunday'
		}
	};

	if (typeof i18n[lang] != "undefined" && typeof i18n[lang][key] != "undefined")
	{
		return i18n[lang][key];
	}

	return key;
}

/**
 * Try to find a language we should use. Look for URL parameter or system settings.
 * Restricts to supported languages ('en', 'sl', 'ru', 'de' and some others).
 * @return String language code like 'en', 'sl', 'ru', 'de' or others
 */
function getLocalLanguage()
{
	let lang = null;

	// 1. try to read URL parameter 'lang'
	let qs = window.location.search;
	if (qs)
	{
		if (qs.substring(0, 1) === "?")
		{
			qs = qs.substring(1);
		}

		let params = qs.split("&");

		for (let i = 0; i < params.length; i ++)
		{
			let keyValue = params[i].split("=");
			if (keyValue[0] === "lang")
			{
				lang = keyValue[1];
				break;
			}
		}
	}

	// 2. try to get browser or system language
	if (!lang)
	{
		let tmp = navigator.language || navigator;
		lang = tmp.split("-")[0];
	}

	// Use only supported languages, defaults to 'en'
	if (lang != "en" && lang != "sl" && lang != "de" && lang != "ru")
	{
		lang = "en";
	}

	return lang;
}