// const $ = require ('jquery');
const _ = require('lodash');
const rp = require('request-promise');
const otcsv = require('objects-to-csv');
const cheerio = require('cheerio');



const baseURL = 'https://www.yellowpages.com';
// const searchURL = '/search?search_terms=Medical+Ambulance&geo_location_terms=San+Diego%2C+CA';
const searchURL = '/search?search_terms=Medical%20Ambulance&geo_location_terms=marin%20county&page=2';

// Function
const getCompanies = async () => {
  console.log(' calling getCompanies'); 
  const html = await rp(baseURL + searchURL);

  const $ = cheerio.load(html);

  const businessMap = cheerio('a.business-name', html).map(async (i, e) => {
    const streetAddress = $('div.result').eq(i).find('div.street-address').length == 1 ? $('div.result').eq(i).find('div.street-address').text() : '-';
    const City = $('div.result').eq(i).find('div.locality').length == 1 ? $('div.result').eq(i).find('div.locality').text() : '-';
    
    const link = baseURL + e.attribs.href;
    const innerHtml = await rp(link);

    const CompanyName = cheerio('h1', innerHtml).text();
    const emailAddress = cheerio('a.email-business', innerHtml).prop('href');
    const name = e.children[0].data;
    const Phone = cheerio('p.phone', innerHtml).text();


    return {
      CompanyName,
      emailAddress,
      // link,
      Phone,
      streetAddress,
      City
    }
  })
  .get();
  return Promise.all(businessMap);
};




// COMBINING ONE AFTER ANOTHER CALL 

async function getExample() {
  let output = await getCompanies();
  return output;

}


getExample().then(result => {

    const transformed = new otcsv(result);
    return transformed.toDisk('./testingonly.csv');
  })
  .then(() => console.log('SUCCESSFULLY COMPLETED THE WEB SCRAPING SAMPLE'));

