const functions = require('firebase-functions');
const http = require('http');

const host = 'api.worldweatheronline.com';
const apiKey = 'f67dfe6d45854fb6a38145731181209';

/**
 * Function to transform the date in format YYY-MM-DD.
 *
 * @param {string} date - date in a string format
 * @return {string}
 */
function formatDate(date) {
  const d = date === '' ? new Date() : new Date(date);

  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  const year = d.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [year, month, day].join('-');
}

/**
 * Function that calls the weather API with a city and a date
 * parameter and returns a text.
 *
 * @param {string} city - Name of the city for the forecast
 * @param {string} date - Date wanted for the forecast
 * @return {string}
 */
function callWeatherApi(city, date) {
  return new Promise((resolve, reject) => {
    const path = '/premium/v1/weather.ashx'
      + '?format=json'
      + `&key=${apiKey}`
      + `&q=${encodeURIComponent(city)}`
      + '&num_of_days=1'
      + `&date=${date}`;

    http.get({ host, path }, (res) => {
      let data = ''; // var to store the response chunks

      res.on('data', (d) => {
        data += d;
      });

      res.on('end', () => {
        const body = JSON.parse(data);
        const forecast = body.data.weather[0];
        const location = body.data.request[0];
        const conditions = body.data.current_condition[0];
        const currentConditions = conditions.weatherDesc[0].value;

        const output = `Current conditions in ${location.query} are`
          + ` ${currentConditions.toLowerCase()} with a projected high of`
          + ` ${forecast.maxtempC}°C or ${forecast.maxtempF}°F and`
          + ` a low of ${forecast.mintempC}°C or ${forecast.mintempF}°F`
          + ` on ${forecast.date}.`;

        resolve(output);
      });

      res.on('error', (error) => {
        console.log(`Error calling the weather API: ${error}`);
        reject(error);
      });
    });
  });
}

/**
 * Firebase HTTP-triggered cloud function to know the weather
 * at a particular location on a particular date.
 *
 * @param {object} req - HTTP request object
 * @param {object} res - HTTP response object
 * @return {void}
 */
exports.getWeather = functions.https.onRequest((req, res) => {
  // Extract query parameters
  const { parameters } = req.body.queryResult;
  const city = parameters['geo-city'];
  const date = formatDate(parameters.date || '');

  // Call the weather API
  callWeatherApi(city, date)
    .then(output => res.json({ fulfillmentText: output }))
    .catch(() => res.json({ fulfillmentText: 'I don\'t know the weather but I hope it\'s good!' }));
});
