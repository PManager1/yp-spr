// const $ = require ('jquery');
const _ = require('lodash');
const rp = require('request-promise');
const otcsv = require('objects-to-csv');
const cheerio = require('cheerio');


const baseURL = 'https://www.yellowpages.com';
const searchURL = '/search?search_terms=medical%20transport&geo_location_terms=Whittier%2C%20CA&page=5';

// Function
const getCompanies = async () => {
  console.log(' calling getCompanies'); 
  const html = await rp(baseURL + searchURL);

  const $ = cheerio.load(html);

  const businessMap = cheerio('a.business-name', html).map(async (i, e) => {
    const StreetAddress = $('div.result').eq(i).find('div.street-address').length == 1 ? $('div.result').eq(i).find('div.street-address').text() : '-';
    const City = $('div.result').eq(i).find('div.locality').length == 1 ? $('div.result').eq(i).find('div.locality').text() : '-';
    
    const link = baseURL + e.attribs.href;
    const innerHtml = await rp(link);

    const CompanyName = cheerio('h1', innerHtml).text();
    const EmailAddress = cheerio('a.email-business', innerHtml).prop('href');
    const name = e.children[0].data;
    const Phone = cheerio('p.phone', innerHtml).text();


    return {
      CompanyName,
      EmailAddress,
      // link,
      Phone,
      StreetAddress,
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
    return transformed.toDisk('./Whittier_5.csv');
  })
  .then(() => console.log('SUCCESSFULLY COMPLETED THE WEB SCRAPING SAMPLE'));

