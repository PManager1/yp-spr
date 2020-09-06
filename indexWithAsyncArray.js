
const _ = require('lodash');
const rp = require('request-promise');
const otcsv = require('objects-to-csv');
const cheerio = require('cheerio');


const baseURL = 'https://www.yellowpages.com';
const searchURL = '/search?search_terms=Medical%20Ambulance&geo_location_terms=Los%20Angeles%2C%20CA&page=2';

// Function
const getCompanies = async () => {
  console.log(' calling getCompanies'); 
  const html = await rp(baseURL + searchURL);
  const businessMap = cheerio('a.business-name', html).map(async (i, e) => {

    const link = baseURL + e.attribs.href;
    const innerHtml = await rp(link);


    const emailAddress = cheerio('a.email-business', innerHtml).prop('href');
    const name = e.children[0].data;
    const phone = cheerio('p.phone', innerHtml).text();


    const name2 = cheerio('h1', innerHtml).text();  //do it the right way 
    // console.log('36- name2 = ', name2); 


    const bizName= link.substr(link.lastIndexOf('/') + 1);
    const companyName= bizName.substring(0, bizName.length - 10);


    // console.log('before returning getCompanies');

    return {
      emailAddress,
      link,
      name,
      phone,
      companyName,
    }
  })
  .get();
  return Promise.all(businessMap);
};


// Function
const getStreetAddress = async () => {
  console.log(' calling getStreetAddress'); 
  const html = await rp(baseURL + searchURL);
  const businessMap = cheerio('div.street-address', html).map(async (i, e) => {

    // console.log('15-stree-address =', e.children[0].parent.children[0].data );
    const streetAddress = e.children[0].parent.children[0].data;

  // console.log('before returning getStreetAddress');
    return {
      streetAddress,
    }

  })
  .get();
  return Promise.all(businessMap);
};


// COMBINING ONE AFTER ANOTHER CALL 

function getExample() {
    var a = getCompanies();
    var b = a.then(function(resultA) {
        // some processing
        return getStreetAddress();
    });
    return Promise.all([a, b]).then(function([resultA, resultB]) {
        // more processing
        console.log(' resultB=', resultB);
        console.log(' resultA=', resultA);


    let output = _.merge(resultA, resultB);
        
        return output;  // change it to first combing both objects. 
   
    });
}


getExample().then(result => {

    const transformed = new otcsv(result);
    return transformed.toDisk('./output5.csv');
  })
  .then(() => console.log('SUCCESSFULLY COMPLETED THE WEB SCRAPING SAMPLE'));




















// sonole.log 