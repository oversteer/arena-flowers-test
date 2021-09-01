const https = require('https');
const fs = require('fs')

const REQUIRED_PARAMS = 3;
const COUNTRIES_API_URL = 'https://restcountries.eu/rest/v2/region/europe';

if (process.argv.length !== REQUIRED_PARAMS) {
  console.error('Usage: node countryInfo country name | partial country name');
  process.exit(1);
}

const countryParam = process.argv[2];

https.get(COUNTRIES_API_URL, res => {

  if (res.statusCode < 200 || res.statusCode >= 300) {
    console.error('Error getting data from', COUNTRIES_API_URL, res.statusCode, res.statusMessage);
    process.exit(1);
  }

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    }
    catch (err) {
      console.error('', err);
      process.exit(1);
    }

    const filteredData = parsedData.filter(item => item.name.toLowerCase()
      .includes(countryParam.toLowerCase()))
      .map(item => ({ countryName: item.name, capitalCity: item.capital }));

    const results = { results: filteredData };

    const filename = './' + countryParam + '.json';

    fs.writeFile(filename, JSON.stringify(results), (err) => {
      if (err) {
        console.error('Unable to create file', filename, err);
      }
      console.log('The file', filename, 'has been created');
    });
  });

}).on('error', e => {
  console.error('An HTTP error occurred', e);
});
