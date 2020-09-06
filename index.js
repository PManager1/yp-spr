
const rp = require('request-promise');
const otcsv = require('objects-to-csv');
const cheerio = require('cheerio');


const baseURL = 'https://www.yellowpages.com';
const searchURL = '/search?search_terms=Medical%20Ambulance&geo_location_terms=Los%20Angeles%2C%20CA&page=2';


const getCompanies = async () => {
  const html = await rp(baseURL + searchURL);
  const businessMap = cheerio('a.business-name', html).map(async (i, e) => {
    const link = baseURL + e.attribs.href;
    const innerHtml = await rp(link);
    const emailAddress = cheerio('a.email-business', innerHtml).prop('href');
    const name = e.children[0].data;
    const phone = cheerio('p.phone', innerHtml).text();

    const bizName= link.substr(link.lastIndexOf('/') + 1);
    const companyName= bizName.substring(0, bizName.length - 10);

    return {
      emailAddress,
      link,
      name,
      phone,
      companyName,
    }
  }).get();
  return Promise.all(businessMap);
};


getCompanies()
  .then(result => {
    const transformed = new otcsv(result);
    return transformed.toDisk('./output.csv');
  })
  .then(() => console.log('SUCCESSFULLY COMPLETED THE WEB SCRAPING SAMPLE'));




