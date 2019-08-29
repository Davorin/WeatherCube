/*
 * Internationalization of some texts used by the weatherCube.
 * @return String the localized text item or the id if there's no translation found
 * @param key
 * @param lang
 */
function getI18n(key, lang)
{
	const i18n = {
		en: {
			weatherCube_title: 'WeatherCube',
			weatherCube_powered: 'Powered by:',
			weatherCube_updated: 'Last Updated:',
			weatherCube_vendors: 'Partners:',
			weatherCube_close: 'Close',
			weatherCube_today: 'Today:',
			weatherCube_tomorrow: 'Tomorrow:',
			weatherCube_local: 'Local',
			weatherCube_uviWeek: 'UltraViolet index for a week.',
			weatherCube_viewAt: ' at:',

			weatherCube_getLocation: 'Getting location, wait!',
			weatherCube_getLocationSuccess: 'Location acquired, wait!',
			weatherCube_getLocationError: 'Error: Failed, setting location to default location. Wait...',
			weatherCube_getDataFeeds: 'Getting weather information, wait!',
			weatherCube_getMeteoFeed: 'I\'m getting weather alerts, wait!',

			weatherCube_getMeteoCacheFeed: 'I\'m getting store alerts, wait!',
			weatherCube_getMeteoLiveFeed: 'Storage is empty, getting alerts, wait!',
			weatherCube_getMeteoErrorFeed: 'Error getting warnings, wait!',
			weatherCube_getMeteoSuccessFeed: 'Alerts have been successfully obtained, wait!',
			weatherCube_getMeteoParsedFeed: 'Continue, wait!',
			weatherCube_getMeteoCurrentFeed: 'Current forecast obtained, wait!',

			weatherCube_getCurrentCacheFeed: 'I\'m getting an instant storage forecast, wait!',
			weatherCube_getCurrentLiveFeed: 'Storage is empty, I\'m getting an announcement, wait!',
			weatherCube_getCurrentErrorFeed: 'Error getting time, wait!',
			weatherCube_getCurrentSuccessFeed: 'Your current forecast has been successfully obtained, please wait!',
			weatherCube_getCurrentParsedFeed: 'The current forecast was successfully updated, please wait!',

			weatherCube_getForecastCacheFeed: 'I\'m getting a weekly storage forecast, wait!',
			weatherCube_getForecastLiveFeed: 'Storage is empty, getting forecast, wait!',
			weatherCube_getForecastErrorFeed: 'Error getting time, wait!',
			weatherCube_getForecastSuccessFeed: 'Weekly forecast obtained, wait!',

			weatherCube_getUviCacheFeed: 'Obtaining uvi from storage, wait!',
			weatherCube_getUviLiveFeed: 'Storage is empty, I\'m getting a wrap, wait!',
			weatherCube_getUviErrorFeed: 'Error retrieving uvi, wait!',
			weatherCube_getUviSuccessFeed: 'Current Uvi data retrieved, wait!',
			weatherCube_getUviParsedFeed: 'Current uvi data updated, please wait!',

			weatherCube_getMoonCacheFeed: 'Getting moon from storage, wait!',
			weatherCube_getMoonLiveFeed: 'Storage is empty, I\'m getting the moon, wait!',
			weatherCube_getMoonErrorFeed: 'Error getting moon, wait!',
			weatherCube_getMoonSuccessFeed: 'Current Moon data retrieved, wait!',
			weatherCube_getMoonParsedFeed: 'Current lunar data updated, please wait!',

			weatherCube_getSeasonsCacheFeed: 'Getting apse from storage, wait!',
			weatherCube_getSeasonsLiveFeed: 'Storage is empty, I\'m getting apse, wait!',
			weatherCube_getSeasonsErrorFeed: 'Error getting apse, wait!',
			weatherCube_getSeasonsSuccessFeed: 'Current abside data retrieved, wait!',
			weatherCube_getSeasonsParsedFeed: 'Current abside data updated, please wait!',

			weatherCube_getEclipseCacheFeed: 'Getting eclipses out of storage, wait!',
			weatherCube_getEclipseLiveFeed: 'Storage is empty, I\'m getting eclipses, wait!',
			weatherCube_getEclipseErrorFeed: 'Error getting eclipses, wait!',
			weatherCube_getEclipseSuccessFeed: 'Current eclipses data retrieved, wait!',
			weatherCube_getEclipseParsedFeed: 'Current eclipses data updated, please wait!',
			weatherCube_getMoonCreate: 'Moon\'s Calendar Created!',

			weatherCube_getQuakesCacheFeed: 'Getting earthquakes from storage, wait!',
			weatherCube_getQuakesLiveFeed: 'Storage is empty, I\'m getting earthquakes, wait!',
			weatherCube_getQuakesErrorFeed: 'Earthquake retrieval error, wait!',
			weatherCube_getQuakesSuccessFeed: 'Current earthquake data obtained, wait!',
			weatherCube_getQuakesParsedFeed: 'Current earthquake data has been updated, please wait!',

			weatherCube_getFeedTryAgain: 'Retrying data, please wait',

			weatherCube_mainClouds: 'Clouds',
			weatherCube_mainClear: 'Clear',
			weatherCube_mainTornado: 'Tornado',
			weatherCube_mainSquall: 'Squall',
			weatherCube_mainAsh: 'Ash',
			weatherCube_mainDust: 'Dust',
			weatherCube_mainSand: 'Sand',
			weatherCube_mainFog: 'Fog',
			weatherCube_mainHaze: 'Haze',
			weatherCube_mainSmoke: 'Smoke',
			weatherCube_mainMist: 'Mist',
			weatherCube_mainSnow: 'Snow',
			weatherCube_mainRain: 'Rain',
			weatherCube_mainDrizzle: 'Drizzle',
			weatherCube_mainThunderstorm: 'Thunderstorm',

			weatherCube_currentForecastToday: 'Current',
			weatherCube_currentForecastMin: 'Min.',
			weatherCube_currentForecastMax: 'Max.',
			weatherCube_currentForecastUvi: 'Uvi Index:',

			weatherCube_chartWindSpeed: 'Wind Speed',
			weatherCube_chartMaxWindSpeed: 'Max. Wind Speed',
			weatherCube_chartMinWindSpeed: 'Min. Wind Speed',
			weatherCube_chartAveWindSpeed: 'Average Wind Speed',

			weatherCube_chartPressure: 'Pressure',
			weatherCube_chartHumidity: 'Humidity',

			weatherCube_chartTemperature: 'Temperature',
			weatherCube_chartAveTemperature: 'Average Temperature',
			weatherCube_chartMinTemperature: 'Min. Temperature',
			weatherCube_chartMaxTemperature: 'Max. Temperature',
			weatherCube_chartMaxAveTemperature: 'Max. Average Temperature',

			weatherCube_beaufortScale_0: 'Calm',
			weatherCube_beaufortScale_1: 'Light Air',
			weatherCube_beaufortScale_2: 'Light Breeze',
			weatherCube_beaufortScale_3: 'Gentle Breeze',
			weatherCube_beaufortScale_4: 'Moderate Breeze',
			weatherCube_beaufortScale_5: 'Fresh Breeze',
			weatherCube_beaufortScale_6: 'Strong Breeze',
			weatherCube_beaufortScale_7: 'High Wind',
			weatherCube_beaufortScale_8: 'Gale',
			weatherCube_beaufortScale_9: 'Strong Gale',
			weatherCube_beaufortScale_10: 'Storm',
			weatherCube_beaufortScale_11: 'Violent Storm',
			weatherCube_beaufortScale_12: 'Hurricane',

			weatherCube_beaufortForce_1: 'Light Winds',
			weatherCube_beaufortForce_2: 'Advisory-Force',
			weatherCube_beaufortForce_3: 'Gale-Force',
			weatherCube_beaufortForce_4: 'Storm-Force',
			weatherCube_beaufortForce_5: 'Hurricane-Force',

			weatherCube_latitude: 'Latitude:',
			weatherCube_longitude: 'Longitude:',
			weatherCube_city: 'City:',
			weatherCube_state: 'State:',
			weatherCube_country: 'Country:',
			weatherCube_detectedIP: 'Your IP Address:',

			weatherCube_viewSat: 'View Satellite Images',
			weatherCube_viewUvi: 'View UVi Index',
			weatherCube_viewCharts: 'View Charts',
			weatherCube_viewMaps: 'View Maps',
			weatherCube_viewQuakes: 'View Earthquakes',
			weatherCube_viewMoon: 'View astronomy data',
			weatherCube_viewHours: 'View today by hours',
			weatherCube_viewDays: 'View week forecast',
			weatherCube_viewCurrent: 'Home',
			weatherCube_viewSun: 'View Sun',
			weatherCube_viewSpace: 'View Sky',
			weatherCube_viewPlanets: 'View Solar System',
			weatherCube_viewWind: 'View wind map',

			weatherCube_planetRightAscension: 'Right<br />Ascension',
			weatherCube_planetDeclination: 'Declination',
			weatherCube_planetDistance: 'Distance<br />(<span title="Astronomical units (149,597,871 km)">AU</span>)',
			weatherCube_planetAltitude: 'Altitude',
			weatherCube_planetAzimuth: 'Azimuth',

			weatherCube_planetSun: 'Sun',
			weatherCube_planetMercury: 'Mercury',
			weatherCube_planetVenus: 'Venus',
			weatherCube_planetMoon: 'Moon',
			weatherCube_planetJupiter: 'Jupiter',
			weatherCube_planetSaturn: 'Saturn',
			weatherCube_planetUranus: 'Uranus',
			weatherCube_planetNeptune: 'Neptune',
			weatherCube_planetPluto: 'Pluto',

			weatherCube_currentIndexLow: 'Low',
			weatherCube_currentIndexModerate: 'Moderate',
			weatherCube_currentIndexHigh: 'High',
			weatherCube_currentIndexVeryHigh: 'Very high',
			weatherCube_currentIndexExtreme: 'Extreme',
			weatherCube_currentIndexUnknown: 'Unknown',

			weatherCube_currentIndexLowDesc:
				'<b>Low danger</b>, from the sun\'s UV rays for the average person. Wear sunglasses on bright days. If you burn easily, cover up and use sunscreen.',
			weatherCube_currentIndexModerateDesc:
				'<b>Moderate risk</b>, of harm from unprotected sun exposure. Take precautions, such as covering up, if you will be outside. Stay in shade near midday when the sun is strongest.',
			weatherCube_currentIndexHighDesc:
				'<b>High risk</b>, of harm from unprotected sun exposure. Wear sunglasses and use SPF30+ sunscreen. Cover the body with sun protective clothing and a wide-brim hat. Reduce time in the sun from two hours before to three hours after solar noon.',
			weatherCube_currentIndexExtremeDesc:
				'<b>Very high</b>, risk of harm from unprotected sun exposure. Take extra precautions. Use SPF30+ sunscreen, a shirt, sunglasses and a hat. Do not stay out in the sun for too long. If you have to be outside avoid the sun from wo hours before to three hours after solar noon.',

			weatherCube_apiError: 'WeatherCube needs API key to continue!.',
			weatherCube_apiKeyError: 'OpenWeatherMap API key is missing!!',
			weatherCube_browserError: 'Upgrade your browser, dude!',
			weatherCube_geoError:
				'It seems like Geolocation, which is required for this page, is not enabled in your browser.',
			weatherCube_satError: 'Satellite images disabled!',
			weatherCube_satNotSet: 'Satellite images not set!',

			weatherCube_getSatImages: 'Getting satellite images, wait.',
			weatherCube_getSatErrors: 'Error getting satellite image.',
			weatherCube_getSatSuccess: 'Satellite image retrieved successfully',
			weatherCube_getSatAll: 'Satellite images retrieved, wait!',
			weatherCube_ready: 'Weather data ready. World Time is: ',

			weatherCube_earthSolar: 'Solar Eclipses:',
			weatherCube_earthSun: 'Sun:',
			weatherCube_earthMoon: 'Moon:',

			weatherCube_earthSeasons: 'This year Earth\'s Seasons and Apsides',
			weatherCube_earthSeasonsWinter: 'Winter',
			weatherCube_earthSeasonsSpring: 'Spring',
			weatherCube_earthSeasonsSummer: 'Summer',
			weatherCube_earthSeasonsFall: 'Fall',
			weatherCube_earthSeasonsDate: 'On Date',
			weatherCube_earthSeasonsName: 'Season',
			weatherCube_earthSeasonsStart: 'Start of ',

			weatherCube_earthSeasonsPerihelion: 'Perihelion',
			weatherCube_earthSeasonsEquinox: 'Equinox',
			weatherCube_earthSeasonsSolstice: 'Solstice',
			weatherCube_earthSeasonsAphelion: 'Aphelion',

			weatherCube_earthAstrology: 'Zodiac Sign',
			weatherCube_earthAstrologyAries: 'Aries',
			weatherCube_earthAstrologyTaurus: 'Taurus',
			weatherCube_earthAstrologyGemini: 'Gemini',
			weatherCube_earthAstrologyCancer: 'Cancer',
			weatherCube_earthAstrologyLeo: 'Leo',
			weatherCube_earthAstrologyVirgo: 'Virgo',
			weatherCube_earthAstrologyLibra: 'Libra',
			weatherCube_earthAstrologyScorpio: 'Scorpio',
			weatherCube_earthAstrologySagittarius: 'Sagittarius',
			weatherCube_earthAstrologyCapricorn: 'Capricorn',
			weatherCube_earthAstrologyAquarius: 'Aquarius',
			weatherCube_earthAstrologyPisces: 'Pisces',

			weatherCube_moonPhase: 'Lunar cycle',
			weatherCube_moonPhases: 'Moon Phases for: ',
			weatherCube_moonPhaseToday: 'Moon Phase for Today: ',
			weatherCube_moonFracillum: 'Fracillum:',

			weatherCube_moonNewMoon: 'New Moon',
			weatherCube_moonWaxingCrescent: 'Waxing Crescent',
			weatherCube_moonFirstQuarter: 'First Quarter',
			weatherCube_moonWaxingGibbous: 'Waxing Gibbous',
			weatherCube_moonFullMoon: 'Full Moon',
			weatherCube_moonWaningGibbous: 'Waning Gibbous',
			weatherCube_moonLastQuarter: 'Last Quarter',
			weatherCube_moonWaningCrescent: 'Waning Crescent',

			weatherCube_sunImages: 'Newest sun images',
			weatherCube_sunLeg:
				'Images: From left to right: EIT 171, EIT 195, EIT 284, EIT 304 EIT (Extreme ultraviolet Imaging Telescope)',
			weatherCube_sunDesc:
				'Images of the solar atmosphere at several wavelengths, and therefore, shows solar material at different temperatures.' +
					'In the images taken at 304 Angstrom the bright material is at 60,000 to 80,000 degrees Kelvin.' +
					'In those taken at 171 Angstrom, at 1 million degrees. 195 Angstrom images correspond to about 1.5 million Kelvin, 284 Angstrom to 2 million degrees.' +
					'The hotter the temperature, the higher you look in the solar atmosphere.',

			weatherCube_earthquakesLatitude: 'Latitude:',
			weatherCube_earthquakesLongitude: 'Longitude:',
			weatherCube_earthquakesTime: 'Time:',
			weatherCube_earthquakesStatus: 'Status:',
			weatherCube_earthquakesTsunami: 'Tsunami:',
			weatherCube_earthquakesTsunamiYes: 'YES',
			weatherCube_earthquakesTsunamiNo: 'NO',
			weatherCube_earthquakesStrength: 'Earthquakes by strength:',
			weatherCube_earthquakesMinStrength: 'Max. Strength',
			weatherCube_earthquakesMaxStrength: 'Min. Strength',

			weatherCube_currentForecastPrecipitation: 'Precipitation',
			weatherCube_currentForecastWind: 'Wind',
			weatherCube_currentForecastClouds: 'Clouds',
			weatherCube_currentForecastPressure: 'Pressure',
			weatherCube_currentForecastRain: 'Rain',
			weatherCube_currentForecastTemperature: 'Temperature',
			weatherCube_currentForecastEarthquakes: 'Earthquakes',
			weatherCube_mapClick: 'You clicked on the map:',

			weatherCube_january: 'January',
			weatherCube_february: 'February',
			weatherCube_march: 'March',
			weatherCube_april: 'April',
			weatherCube_may: 'May',
			weatherCube_june: 'June',
			weatherCube_july: 'July',
			weatherCube_august: 'August',
			weatherCube_september: 'September',
			weatherCube_october: 'October',
			weatherCube_november: 'November',
			weatherCube_december: 'December',

			weatherCube_day: 'Day',
			weatherCube_week: 'Week',
			weatherCube_monday: 'Monday',
			weatherCube_tuesday: 'Tuesday',
			weatherCube_wednesday: 'Wednesday',
			weatherCube_thursday: 'Thursday',
			weatherCube_friday: 'Friday',
			weatherCube_saturday: 'Saturday',
			weatherCube_sunday: 'Sunday'
		},
		sl: {
			weatherCube_title: 'WeatherCube',
			weatherCube_powered: 'Powered by:',
			weatherCube_updated: 'Nazadnje Posodobljeno:',
			weatherCube_vendors: 'Partnerji:',
			weatherCube_close: 'Zapri',
			weatherCube_today: 'Danes:',
			weatherCube_tomorrow: 'Jutri:',
			weatherCube_local: 'Lokalno',
			weatherCube_uviWeek: 'Indeks UltraVioletnih žarkov za ta teden.',
			weatherCube_viewAt: ' ob:',

			weatherCube_getLocation: 'Pridobivam Lokacijo, počakajte!',
			weatherCube_getLocationSuccess: 'Lokacija pridobljena, počakajte!',
			weatherCube_getLocationError: 'Napaka: Neuspešno, nastavljam lokacijo na privzeto lokacijo. Počakajte',
			weatherCube_getDataFeeds: 'Pridobivam podatke o vremenu, počakajte!',
			weatherCube_getMeteoFeed: 'Pridobivam vremenska opozorila, počakajte!',

			weatherCube_getMeteoCacheFeed: 'Pridobivam opozorila iz shrambe, počakajte!',
			weatherCube_getMeteoLiveFeed: 'Shramba je prazna, pridobivam opozorila, počakajte!',
			weatherCube_getMeteoErrorFeed: 'Napaka pridobivanja opozoril, počakajte!',
			weatherCube_getMeteoSuccessFeed: 'Opozorila so uspešno pridobljena, počakajte!',
			weatherCube_getMeteoParsedFeed: 'Nastavljanje, počakajte!',
			weatherCube_getMeteoCurrentFeed: 'Trenutna napoved pridobljena, počakajte!',

			weatherCube_getCurrentCacheFeed: 'Pridobivam trenutno napoved iz shrambe, počakajte!',
			weatherCube_getCurrentLiveFeed: 'Shramba je prazna, pridobivam napoved, počakajte!',
			weatherCube_getCurrentErrorFeed: 'Napaka pridobivanja vremena, počakajte!',
			weatherCube_getCurrentSuccessFeed: 'Trenutna napoved je uspešno pridobljena, počakajte!',
			weatherCube_getCurrentParsedFeed: 'Trenutna napoved je uspešno posodobljena, počakajte!',

			weatherCube_getForecastCacheFeed: 'Pridobivam tedensko napoved iz shrambe, počakajte!',
			weatherCube_getForecastLiveFeed: 'Shramba je prazna, pridobivam napoved, počakajte!',
			weatherCube_getForecastErrorFeed: 'Napaka pridobivanja vremena, počakajte!',
			weatherCube_getForecastSuccessFeed: 'Tedenska napoved je pridobljena, počakajte!',

			weatherCube_getUviCacheFeed: 'Pridobivam uvi iz shrambe, počakajte!',
			weatherCube_getUviLiveFeed: 'Shramba je prazna, pridobivam uvi, počakajte!',
			weatherCube_getUviErrorFeed: 'Napaka pridobivanja uvi-ja, počakajte!',
			weatherCube_getUviSuccessFeed: 'Trenutni uvi podatki pridobljeni, počakajte!',
			weatherCube_getUviParsedFeed: 'Trenutni uvi podatki posodobljeni, počakajte!',

			weatherCube_getMoonCacheFeed: 'Pridobivam luno iz shrambe, počakajte!',
			weatherCube_getMoonLiveFeed: 'Shramba je prazna, pridobivam luno, počakajte!',
			weatherCube_getMoonErrorFeed: 'Napaka pridobivanja lune, počakajte!',
			weatherCube_getMoonSuccessFeed: 'Trenutni lunini podatki pridobljeni, počakajte!',
			weatherCube_getMoonParsedFeed: 'Trenutni lunini podatki posodobljeni, počakajte!',

			weatherCube_getSeasonsCacheFeed: 'Pridobivam apside iz shrambe, počakajte!',
			weatherCube_getSeasonsLiveFeed: 'Shramba je prazna, pridobivam apside, počakajte!',
			weatherCube_getSeasonsErrorFeed: 'Napaka pridobivanja apsidov, počakajte!',
			weatherCube_getSeasonsSuccessFeed: 'Trenutni podatki o absidih pridobljeni, počakajte!',
			weatherCube_getSeasonsParsedFeed: 'Trenutni podatki o absidih posodobljeni, počakajte!',

			weatherCube_getEclipseCacheFeed: 'Pridobivam eclipses iz shrambe, počakajte!',
			weatherCube_getEclipseLiveFeed: 'Shramba je prazna, pridobivam eclipses, počakajte!',
			weatherCube_getEclipseErrorFeed: 'Napaka pridobivanja eclipses, počakajte!',
			weatherCube_getEclipseSuccessFeed: 'Trenutni podatki o eclipses pridobljeni, počakajte!',
			weatherCube_getEclipseParsedFeed: 'Trenutni podatki o eclipses posodobljeni, počakajte!',
			weatherCube_getMoonCreate: 'Kolendar luninih men ustvarjen!',

			weatherCube_getQuakesCacheFeed: 'Pridobivam potrese iz shrambe, počakajte!',
			weatherCube_getQuakesLiveFeed: 'Shramba je prazna, pridobivam potrese, počakajte!',
			weatherCube_getQuakesErrorFeed: 'Napaka pridobivanja potresov, počakajte!',
			weatherCube_getQuakesSuccessFeed: 'Trenutni podatki o potresih pridobljeni, počakajte!',
			weatherCube_getQuakesParsedFeed: 'Trenutni podatki o potresih posodobljeni, počakajte!',

			weatherCube_getSpaceCacheFeed: 'Pridobivam astronomijo iz shrambe, počakajte!',
			weatherCube_getSpaceLiveFeed: 'Shramba je prazna, pridobivam astronomijo, počakajte!',
			weatherCube_getSpaceErrorFeed: 'Napaka pridobivanja astronomije, počakajte!',
			weatherCube_getSpaceSuccessFeed: 'Trenutni podatki o astronomiji pridobljeni, počakajte!',
			weatherCube_getSpaceParsedFeed: 'Trenutni podatki o astronomiji posodobljeni, počakajte!',

			weatherCube_getFeedTryAgain: 'Ponoven poskus pridobitve podatkov, počakajte',

			weatherCube_mainClouds: 'Oblačno',
			weatherCube_mainClear: 'Jasno',
			weatherCube_mainTornado: 'Tornado',
			weatherCube_mainSquall: 'Squall',
			weatherCube_mainAsh: 'Pepel',
			weatherCube_mainDust: 'Prašno',
			weatherCube_mainSand: 'Pesek',
			weatherCube_mainFog: 'Megla',
			weatherCube_mainHaze: 'Meglica',
			weatherCube_mainSmoke: 'Dim',
			weatherCube_mainMist: 'Meglica',
			weatherCube_mainSnow: 'Sneg',
			weatherCube_mainRain: 'Deževno',
			weatherCube_mainDrizzle: 'Poledenelo',
			weatherCube_mainThunderstorm: 'Nevihta',

			weatherCube_currentForecastToday: 'Trenutno',
			weatherCube_currentForecastMin: 'Min.',
			weatherCube_currentForecastMax: 'Max.',
			weatherCube_currentForecastUvi: 'Uvi Index:',

			weatherCube_chartWindSpeed: 'Hitrost Vetra',
			weatherCube_chartMaxWindSpeed: 'Max. Hitrost Vetra',
			weatherCube_chartMinWindSpeed: 'Min. Hitrost Vetra',
			weatherCube_chartAveWindSpeed: 'Povprečna Hitrost Vetra',

			weatherCube_chartPressure: 'Tlak',
			weatherCube_chartHumidity: 'Vlažnost',

			weatherCube_chartTemperature: 'Temperatura',
			weatherCube_chartAveTemperature: 'Povprečna Temperatura',
			weatherCube_chartMinTemperature: 'Min. Temperatura',
			weatherCube_chartMaxTemperature: 'Max. Temperatura',
			weatherCube_chartMaxAveTemperature: 'Max. Povprečna Temperatura',

			weatherCube_beaufortScale_0: 'Mirno',
			weatherCube_beaufortScale_1: 'Lahki Zrak',
			weatherCube_beaufortScale_2: 'Lahki Vetrič',
			weatherCube_beaufortScale_3: 'Nežen Vetrič',
			weatherCube_beaufortScale_4: 'Zmeren Vetrič',
			weatherCube_beaufortScale_5: 'Svež Vetrič',
			weatherCube_beaufortScale_6: 'Močan Vetrič',
			weatherCube_beaufortScale_7: 'Močan Veter',
			weatherCube_beaufortScale_8: 'Gale',
			weatherCube_beaufortScale_9: 'Močan Gale',
			weatherCube_beaufortScale_10: 'Nevihta',
			weatherCube_beaufortScale_11: 'Silovita Nevihta',
			weatherCube_beaufortScale_12: 'Orkan',

			weatherCube_beaufortForce_1: 'Light Winds',
			weatherCube_beaufortForce_2: 'Advisory-Force',
			weatherCube_beaufortForce_3: 'Gale-Force',
			weatherCube_beaufortForce_4: 'Storm-Force',
			weatherCube_beaufortForce_5: 'Hurricane-Force',

			weatherCube_latitude: 'Z.Širina:',
			weatherCube_longitude: 'Z.Dolžina:',
			weatherCube_city: 'Mesto:',
			weatherCube_state: 'Občina:',
			weatherCube_country: 'Država:',
			weatherCube_detectedIP: 'Vaš IP Naslov:',

			weatherCube_viewSat: 'Ogled satelitskih slik',
			weatherCube_viewUvi: 'Ogled UVi Index-a',
			weatherCube_viewCharts: 'Ogled grafikonov',
			weatherCube_viewMaps: 'Ogled Map',
			weatherCube_viewQuakes: 'Ogled zemeljskih potresov',
			weatherCube_viewMoon: 'Ogled Astrologije',
			weatherCube_viewHours: 'Ogled napovedi po urah',
			weatherCube_viewDays: 'Ogled napovedi po dnevih',
			weatherCube_viewCurrent: 'Domov',
			weatherCube_viewSun: 'Ogled podatkov Sonca',
			weatherCube_viewWind: 'Ogled mape Vetrovnosti',
			weatherCube_viewSpace: 'Ogled neba',
			weatherCube_viewPlanets: 'Ogled solarnega sistema',

			weatherCube_planetRightAscension: 'Desni<br />vzpon',
			weatherCube_planetDeclination: 'Deklinacija',
			weatherCube_planetDistance: 'Oddaljenost<br />(<span title="Astronomske enote (149,597,871 km)">AU</span>)',
			weatherCube_planetAltitude: 'Višina',
			weatherCube_planetAzimuth: 'Azimut',

			weatherCube_planetSun: 'Sun',
			weatherCube_planetMercury: 'Mercury',
			weatherCube_planetVenus: 'Venus',
			weatherCube_planetMoon: 'Moon',
			weatherCube_planetJupiter: 'Jupiter',
			weatherCube_planetSaturn: 'Saturn',
			weatherCube_planetUranus: 'Uranus',
			weatherCube_planetNeptune: 'Neptune',
			weatherCube_planetPluto: 'Pluto',

			weatherCube_currentIndexLow: 'Nizko',
			weatherCube_currentIndexModerate: 'Zmerno',
			weatherCube_currentIndexHigh: 'Visoko',
			weatherCube_currentIndexVeryHigh: 'Zelo Visoko',
			weatherCube_currentIndexExtreme: 'Ekstremno',
			weatherCube_currentIndexUnknown: 'Neznano',

			weatherCube_currentIndexLowDesc:
				'<b>Majhna nevarnost,</b> sončnih UV žarkov za povprečno osebo. Nosite sončna očala v svetlih dneh. Če se zlahka opečete, se pokrijete in uporabite kremo za zaščito pred soncem.',
			weatherCube_currentIndexModerateDesc:
				'<b>Zmerno tveganje,</b> zaradi nezaščitenega izpostavljanja soncu. Bodite previdni, na primer pokrijte se, če boste zunaj. Ostanite v senci blizu poldneva, ko je sonce najmočnejše.',
			weatherCube_currentIndexHighDesc:
				'<b>Velika nevarnost,</b> zaradi nezaščitene izpostavljenosti soncu. Nosite sončna očala in uporabljajte zaščitno kremo SPF30 +. Telo pokrijte s zaščitnimi oblačili in klobukom s širokim obodom. Skrajšajte čas na soncu v času opoldanskih ur.',
			weatherCube_currentIndexExtremeDesc:
				'<b>Zelo veliko,</b> tveganje za poškodbe zaradi nezaščitenega izpostavljanja soncu. Upoštevajte dodatne varnostne ukrepe. Uporabite zaščitno kremo SPF30 +, majico, sončna očala in kapo. Ne ostajajte pod soncem predolgo. Če morate biti zunaj, se izogibajte soncu v času opoldanskih ur.',

			weatherCube_apiError: 'Za nadaljevanje potrebujete ključ!',
			weatherCube_apiKeyError: 'OpenWeatherMap API ključ manjka!!',
			weatherCube_browserError: 'Nadgradite svoj brskalnik!',
			weatherCube_geoError:
				'Zdi se, da Geolokacija, ki je potrebna za to stran, v vašem brskalniku ni omogočena.',
			weatherCube_satError: 'Satelitske slike so onemogočene!',
			weatherCube_satNotSet: 'Satelitske slike niso nastavljene!',

			weatherCube_getSatImages: 'Pridobivam satelitske slike, počakajte.',
			weatherCube_getSatErrors: 'Napaka pridobivanja satelitske slike.',
			weatherCube_getSatSuccess: 'Satelitska slika uspešno pridobljena.',
			weatherCube_getSatAll: 'Satelitske slike pridobljene, počakajte!',
			weatherCube_ready: 'Vremenski podatki pripravljeni. Svetovni čas je:',

			weatherCube_earthSolar: 'Sončni Mrki:',
			weatherCube_earthSun: 'Sonce:',
			weatherCube_earthMoon: 'Luna:',

			weatherCube_earthSeasons: 'Letošnji letni časi Zemlje in apsidi',
			weatherCube_earthSeasonsWinter: 'Zime',
			weatherCube_earthSeasonsSpring: 'Pomladi',
			weatherCube_earthSeasonsSummer: 'Poletja',
			weatherCube_earthSeasonsFall: 'Jeseni',
			weatherCube_earthSeasonsDate: 'Na Datum:',
			weatherCube_earthSeasonsName: 'Sezona:',
			weatherCube_earthSeasonsStart: 'Začetek ',

			weatherCube_earthSeasonsPerihelion: 'Perihelion',
			weatherCube_earthSeasonsEquinox: 'Enakonočje',
			weatherCube_earthSeasonsSolstice: 'Solsticij',
			weatherCube_earthSeasonsAphelion: 'Afelija',

			weatherCube_earthAstrology: 'Nebesno Znamenje:',
			weatherCube_earthAstrologyAries: 'Oven',
			weatherCube_earthAstrologyTaurus: 'Bik',
			weatherCube_earthAstrologyGemini: 'Dvojčka',
			weatherCube_earthAstrologyCancer: 'Rak',
			weatherCube_earthAstrologyLeo: 'Lev',
			weatherCube_earthAstrologyVirgo: 'Devica',
			weatherCube_earthAstrologyLibra: 'Tehtnica',
			weatherCube_earthAstrologyScorpio: 'Škorpijon',
			weatherCube_earthAstrologySagittarius: 'Strelec',
			weatherCube_earthAstrologyCapricorn: 'Kozorog',
			weatherCube_earthAstrologyAquarius: 'Vodnar',
			weatherCube_earthAstrologyPisces: 'Ribi',

			weatherCube_moonPhase: 'Lunarni cikel',
			weatherCube_moonPhases: 'Faze lune za: ',
			weatherCube_moonPhaseToday: 'Faza lune za danes: ',
			weatherCube_moonFracillum: 'Osvetljenost:',

			weatherCube_moonNewMoon: 'Nova Luna',
			weatherCube_moonWaxingCrescent: 'Naraščajoča Luna',
			weatherCube_moonFirstQuarter: 'Prva Četrtina',
			weatherCube_moonWaxingGibbous: 'Naraščajoči Krajec',
			weatherCube_moonFullMoon: 'Polna Luna',
			weatherCube_moonWaningGibbous: 'Pojemajoči Krajec',
			weatherCube_moonLastQuarter: 'Zadnja Četrtina',
			weatherCube_moonWaningCrescent: 'Pojemajoča Luna',

			weatherCube_sunImages: 'Najnovejše slike sonca',
			weatherCube_sunLeg:
				'Slike: od leve proti desni: 171 EIT, 195 EIT, 284 EIT, EIT 304 EIT (ekstremni ultravijolični slikovni teleskop)',
			weatherCube_sunDesc:
				'Slike sončnega ozračja na več valovnih dolžinah prikazujejo sončni material pri različnih temperaturah.' +
					'Na slikah, posnetih na 304 Angstrom, je svetel material na 60.000 do 80.000 stopinj Kelvina.' +
					'V tistih, posnetih na 171 Angstromu, na 1 milijon stopinj. 195 slik Angstroma ustreza približno 1,5 milijona Kelvin, 284 Angstromu pa 2 milijona stopinj. ' +
					'Toplejša je temperatura, višje je videti v sončni atmosferi.',

			weatherCube_earthquakesLatitude: 'Širina:',
			weatherCube_earthquakesLongitude: 'Dolžina:',
			weatherCube_earthquakesTime: 'Čas dogodka:',
			weatherCube_earthquakesStatus: 'Status:',
			weatherCube_earthquakesTsunami: 'Cunami:',
			weatherCube_earthquakesTsunamiYes: 'DA',
			weatherCube_earthquakesTsunamiNo: 'NE',
			weatherCube_earthquakesStrength: 'Potresi po jakosti:',
			weatherCube_earthquakesMinStrength: 'Max. Moč',
			weatherCube_earthquakesMaxStrength: 'Min. Moč',

			weatherCube_currentForecastPrecipitation: 'Padavine',
			weatherCube_currentForecastWind: 'Vetrovnost',
			weatherCube_currentForecastClouds: 'Oblačnost',
			weatherCube_currentForecastPressure: 'Pritisk',
			weatherCube_currentForecastRain: 'Deževje',
			weatherCube_currentForecastTemperature: 'Temperatura',
			weatherCube_currentForecastEarthquakes: 'Potresi',
			weatherCube_mapClick: 'Na zemljevidu ste kliknili na: ',

			weatherCube_january: 'Januar',
			weatherCube_february: 'Februar',
			weatherCube_march: 'Marec',
			weatherCube_april: 'April',
			weatherCube_may: 'Maj',
			weatherCube_june: 'Junij',
			weatherCube_july: 'Julij',
			weatherCube_august: 'Avgust',
			weatherCube_september: 'September',
			weatherCube_october: 'Oktober',
			weatherCube_november: 'November',
			weatherCube_december: 'December',

			weatherCube_day: 'Dan',
			weatherCube_week: 'Teden',
			weatherCube_monday: 'Ponedeljek',
			weatherCube_tuesday: 'Torek',
			weatherCube_wednesday: 'Sreda',
			weatherCube_thursday: 'Četrtek',
			weatherCube_friday: 'Petek',
			weatherCube_saturday: 'Sobota',
			weatherCube_sunday: 'Nedelja'
		}
	};

	if (typeof i18n[lang] !== 'undefined' && typeof i18n[lang][key] !== 'undefined')
	{
		return i18n[lang][key];
	}

	return key;
}